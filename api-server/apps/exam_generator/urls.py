from django.urls import path
from . import views

urlpatterns = [
  path('exam_generator/', views.generate_practice_exam),
  path('check_exam_answers/', views.check_exam_answers),
]
