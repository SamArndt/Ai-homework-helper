from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
from django.conf import settings


class User(AbstractUser):
    # Custom user: email as identifier, profile 
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class UserPreferences(models.Model):
    # Model for user preferences
    # TODO
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='settings',
        primary_key=True
    )

    # Should the front end render dark mode?
    # TODO
    dark_mode = models.BooleanField(default=True)

    # Should the user receive notifications from the app?
    # TODO
    notifications_enabled = models.BooleanField(default=True)

    # Should the user receive email reports from students automatically? Not impacted by notifications preference.
    # TODO
    auto_email_reports = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.email} Settings"