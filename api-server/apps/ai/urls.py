from django.urls import path, include
from .views import AiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path("ai/", AiView.as_view(), name="ai"),
    path('', include(router.urls)), 
]