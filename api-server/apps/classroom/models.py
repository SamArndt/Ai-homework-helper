from django.db import models
from enum import IntEnum
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Classroom(models.Model):
    # The name/label for a given class
    name = models.CharField(max_length=255)
    
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
    # priviledges.
    def get_teachers(self):
        pass

    # Similar to get_teachers(), get users in a group who
    # are enrolled as students
    def get_students(self):
        pass


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
