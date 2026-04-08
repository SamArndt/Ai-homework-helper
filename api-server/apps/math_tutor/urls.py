from django.urls import path
from . import views

urlpatterns = [
    path('math_problem/', views.generate_math_problem),
    path('solve_problem/', views.solve_math_problem),
    path('generate_hint/', views.generate_hint),
    path('grade_step/', views.grade_step),
    path('topics/', views.get_topics),
]
