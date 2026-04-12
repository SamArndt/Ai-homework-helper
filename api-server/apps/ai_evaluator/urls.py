from django.urls import path
from . import views

urlpatterns = [
  path('evaluation_quiz/', views.generate_evaluation_quiz),
  path('check_evaluation_answer/', views.check_evaluation_answers),
]
