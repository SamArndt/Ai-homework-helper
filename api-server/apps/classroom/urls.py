from django.urls import path, include
from .views import ClassroomView
from rest_framework.routers import DefaultRouter

router = DefaultRouter

urlpatterns = [
    path('', include(router.urls)),
    path('classroom', ClassroomView.as_view(), name='classroom'),
]