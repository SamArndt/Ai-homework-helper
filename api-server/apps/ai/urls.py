from django.urls import path, include
from .views import AiView, GetSolutionView, GetStepsView, ClassifyView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)), 
    path("ai/", AiView.as_view(), name="ai"),
    path("ai/get-solution/", GetSolutionView.as_view(), name="get_solution"),
    path("ai/get-steps/", GetStepsView.as_view(), name="get_steps"),
    path("ai/classify/", ClassifyView.as_view(), name="classify"),
    
]