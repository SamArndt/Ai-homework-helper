from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower
from enum import IntEnum
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# Roles a user can be assigned if using a class-specific override.
class RoleOverride(IntEnum):
    OBSERVER = 0
    STUDENT = 1
    TEACHER = 2
    SUPERUSER = 3

class Classroom(models.Model):
    # Unique identifier for a class, used for internal reference and user-friendly reporting. Case-insensitive. 
    # For example: "ser401-fall-2026 A" or "Social Studies 2026 B Alexander"
    identifier = models.CharField(
        max_length=255,
        help_text="Unique identifier for this class, used for internal reference and user-friendly reporting. Case-insensitive. For example: 'ser401-fall-2026 A' or 'Social Studies 2026 B Alexander'. This field must be unique across all classes and must not be blank."
    )

    # The name for a given class, regardless of semester. Can (and probably should) be a subset of identifier. For example: "SER401"
    name = models.CharField(
        max_length=128,
        help_text="The human-readable name of this class, as displayed to users"
    )

    # Optional field for the semester or timeframe of a class. For example: "Fall"
    timeframe = models.CharField(
        max_length=32, 
        blank=True, 
        help_text="Optional timeframe for the class, if more specificity than year is needed e.g. Fall, Spring, etc."
    )

    # Optional field for the year of a class. For example: 2024
    year = models.IntegerField(
        validators=[MinValueValidator(2000), MaxValueValidator(3000)],
        blank=True,
        null=True,
        help_text="Optional year for the class, e.g. 2024"
    )

    # Through table for all users (teachers and students)
    # who are added to a class
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="ClassroomMembership",
        related_name="enrolled_classes"
    )

    # Through table for all assignments associated with this class
    assignments = models.ManyToManyField(
        "Assignment",
        through="ClassroomAssignment",
        related_name="classrooms",
        blank=True,
    )

    @classmethod
    def create_classroom(
        cls,
        identifier: str,
        name: str,
        timeframe: str = "",
        year: int | None = None
    ):
        classroom = cls(
            identifier=identifier,
            name=name,
            timeframe=timeframe,
            year=year
        )
        classroom.save()
        return classroom
    
    @classmethod
    def get_or_create_by_identifier(cls, identifier: str, **defaults):
        identifier = identifier.strip()
        return cls.objects.get_or_create(
            identifier__iexact=identifier,
            defaults={**defaults, "identifier": identifier},
        )

    # Get all enrolled users in a class who are designated
    # teachers. This includes the global teacher group role
    # and others with membership overrides to teacher
    # privileges.
    def get_teachers(self):
        memberships = self.memberships.select_related("user").prefetch_related("user__groups")
        teacher_ids = [
            m.user_id for m in memberships
            if m.acting_role() == RoleOverride.TEACHER
        ]
        return self.members.filter(id__in=teacher_ids)

    # Similar to get_teachers(), get users in a group who
    # are enrolled as students
    def get_students(self):
        memberships = self.memberships.select_related("user").prefetch_related("user__groups")
        student_ids = [
            m.user_id for m in memberships
            if(m.acting_role() == RoleOverride.STUDENT)
        ]
        return self.members.filter(id__in=student_ids)

    # Associate a user with a class instance. By default, 
    # the user will be added with their global role 
    # (teacher, student, etc.) but an 
    # optional override can be provided to assign a 
    # specific role for this class.
    def add_user(self, user, role_override: "RoleOverride | None" = None):
        override_value = role_override.value if role_override is not None else None

        membership, created = ClassroomMembership.objects.get_or_create(
            classroom=self,
            user=user,
            defaults={
                "role_override": override_value
            }
        )

        if not created and role_override is not None:
            membership.role_override = override_value
            membership.save()

        return membership

    # Remove a user from a class, if they were added previously.
    def remove_user(self, user):
        ClassroomMembership.objects.filter(
            classroom=self,
            user=user,
        ).delete()

    def get_assignments(self):
        return self.assignments.all()

    def associate_assignment(self, assignment):
        classroom_assignment, _ = ClassroomAssignment.objects.get_or_create(
            classroom=self,
            assignment=assignment
        )

        return classroom_assignment

    def remove_assignment_association(self, assignment, delete_reports=False):
        if delete_reports:
            StudentReport.objects.filter(
                classroom=self,
                assignment=assignment,
            ).delete()

        ClassroomAssignment.objects.filter(
            classroom=self,
            assignment=assignment,
        ).delete()

    def get_student_reports(self, student=None):
        queryset = StudentReport.objects.filter(classroom=self)

        if student is not None:
            queryset = queryset.filter(student = student)
        
        return queryset.order_by("-created_at")

    # Normalize identifier value on save
    def save(self, *args, **kwargs):
        if self.identifier:
            self.identifier = self.identifier.strip()
        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            UniqueConstraint(
                Lower("identifier"),
                name="unique_classroom_identifier_ci"
            )
        ]
    
    # String representation of a classroom, using its identifier
    def __str__(self):
        return self.identifier

# Assignment object associating a user (student, teacher, etc) with a classroom and, optionally, a role override
class ClassroomMembership(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
    )

    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    # Optional membership override
    # Used for teachers who are students in a given class etc.
    role_override = models.IntegerField(
        choices = [(role.value, role.name) for role in RoleOverride],
        null=True,
        blank=True,
        help_text="Overrides a user's global role for this class"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "classroom"],
                name="unique_user_classroom_membership"
            )
        ]

    def acting_role(self):
        if self.role_override is not None:
            return RoleOverride(self.role_override)

        if self.user.groups.filter(name="Teacher").exists():
            return RoleOverride.TEACHER
        
        if self.user.groups.filter(name="Student").exists():
            return RoleOverride.STUDENT
        
        # If not otherwise specified for this class, catch if the user is a superuser admin
        # Superuser role only valid if the user is not a student or teacher in this class
        if self.user.is_superuser:
            return RoleOverride.SUPERUSER
        
        # Fallback to observer role if no group specified, no suitable overrides and not an admin
        return RoleOverride.OBSERVER
    
    # Updates a user's role override for this class. If role_override given is None, then the user's global role will be used instead.
    def set_user_role_override(self, role_override: "RoleOverride | None"):
        self.role_override = None if role_override is None else role_override.value
        self.save(update_fields=["role_override"])
    
# Object associating assignments with classrooms, allowing for additional metadata on the association
class ClassroomAssignment(models.Model):
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE,
        related_name="classroom_assignments"
    )

    assignment = models.ForeignKey(
        "Assignment",
        on_delete=models.CASCADE,
        related_name="assignment_classrooms"
    )

    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["classroom", "assignment"],
                name="unique_assignment_per_classroom"
            )
        ]

# Record of student work, including practice problems or assignments. May or may not be associated with a classroom
class StudentReport(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_reports",
    )

    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_reports",
    )

    assignment = models.ForeignKey(
        "Assignment",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_reports",
    )

    created_at = models.DateTimeField(auto_now_add=True);
    last_modified = models.DateTimeField(auto_now=True);

    problems = models.ManyToManyField(
        "Problem",
        through="StudentReportProblem",
        related_name="student_reports",
        blank=True,
    )

    def create_or_append_student_report(self, student, id, data):
        pass

# An object describing a student's work on a problem. Each record is for one attempt at solving the problem.
# For example, if a student works a problem as part of practice problems, then later the same problem is in an
# assignment, then the practice problem attempt and the assignment attempt would be unique StudentReportProblem
# instances.
class StudentReportProblem(models.Model):
    student_report = models.ForeignKey(
        "StudentReport",
        on_delete=models.CASCADE,
        related_name="report_problems"
    )

    problem = models.ForeignKey(
        "Problem",
        on_delete=models.CASCADE,
        related_name="problem_reports"
    )

    attempted_at = models.DateTimeField(auto_now_add=True)
    hints_used = models.PositiveIntegerField(default=0)     # Placeholder based on previous work
    response_data = models.JSONField(null=True, blank=True) # Placeholder based on previous work
    is_correct = models.BooleanField(null=True, blank=True)
    attempt_number = models.PositiveIntegerField(default = 1)

# An object defining a group of problems for students to work on. Can be reused in different classroom instances
class Assignment(models.Model):
    identifier=models.CharField(max_length=255, unique=True)
    title=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def create_assignment(self, id, data):
        pass

    def get_reports_for_assignment(self, assignment, student: any | None, teacher: any | None, classroom: Classroom | None):
        pass

class AssignmentVersion(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    major_version = models.PositiveIntegerField(default=1)
    minor_version = models.PositiveIntegerField(default=0)

    @property
    def version(self):
        return f"{self.major_version}.{self.minor_version}"
    

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE
    )

    problems =models.ManyToManyField(
        "Problem",
        related_name="assignment_versions",
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["assignment", "major_version", "minor_version"],
                name="unique_assignment_version"
            )
        ]
    
    def __str__(self):
        return f"{self.assignment.identifier} v{self.version}"

# An object representing a single problem a student can work
# TODO: may be redundant definition, check with team to see if similar model already used elsewhere and integrate 
class Problem(models.Model):
    pass
