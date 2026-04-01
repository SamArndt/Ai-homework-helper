from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower
from enum import IntEnum
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

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

    # Get all enrolled users in a class who are designated
    # teachers. This includes the global teacher group role
    # and others with membership overrides to teacher
    # privileges.
    def get_teachers(self):
        pass

    # Similar to get_teachers(), get users in a group who
    # are enrolled as students
    def get_students(self):
        pass

    # Associate a user with a class instance. By default, 
    # the user will be added with their global role 
    # (teacher, student, etc.) but an 
    # optional override can be provided to assign a 
    # specific role for this class.
    def add_user(self, user, role_override: "RoleOverride | None" = None):
        pass

    # Remove a user from a class, if they were added previously.
    def remove_user(self, user):
        pass

    # Updates a user's role override for this class. If role_override given is None, then the user's global role will be used instead.
    def set_user_role_override(self, user, role_override: "RoleOverride | None"):
        pass

    ## Override the save method to ensure that the identifier is stored in a consistent format (e.g., stripped of leading/trailing whitespace) 
    # before saving to the database.
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

# Roles a user can be assigned if using a class-specific override.
class RoleOverride(IntEnum):
    OBSERVER = 0
    STUDENT = 1
    TEACHING_ASSISTANT = 2
    TEACHER = 3
    SUPERUSER = 4

class ClassroomMembership(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
    )

    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE
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
        unique_together = ("user", "classroom")

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

class StudentReport(models.Model):
    pass
