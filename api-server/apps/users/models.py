from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager

class User(AbstractUser):
    username = None # Remove the username field
    email = models.EmailField(unique=True) # Make email unique

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [] # Email and Password are required by default

    objects = CustomUserManager() # Point to our custom user manager

    def __str__(self):
        return self.email