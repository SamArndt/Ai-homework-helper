from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class ChatMessage(models.Model):
  slug = models.CharField(max_length=255, unique=True)
  llm_model = models.CharField(max_length=50)
  user_content = models.TextField()
  system_content = models.TextField()
  temperature = models.FloatField(default=1.0, validators=[MinValueValidator(0.0), MaxValueValidator(2.0)])

  def __str__(self):
    return self.slug

class Topic(models.Model):
  value = models.CharField(max_length=255)

  def __str__(self):
    return self.value
