from django.contrib import admin
from .models import Topic, ChatMessage

# Register your models here.
admin.site.register(ChatMessage)
admin.site.register(Topic)
