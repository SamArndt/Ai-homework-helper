from django.urls import path, include
from .views import AiView, GetSolutionsView, GetStepsView, ClassifyView, MathProblemView, ExtractEquationView, QueryView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)), 
    path("ai/", AiView.as_view(), name="ai"),
    path("ai/get-solution/", GetSolutionsView.as_view(), name="get_solution"),
    path("ai/get-steps/", GetStepsView.as_view(), name="get_steps"),
    path("ai/classify/", ClassifyView.as_view(), name="classify"),
    
    path("ai/math-problem/", MathProblemView.as_view(), name="math-problem"),
    path("ai/extract-equation/", ExtractEquationView.as_view(), name="extract-equation"),
    path("ai/query/", QueryView.as_view(), name="query"),
]