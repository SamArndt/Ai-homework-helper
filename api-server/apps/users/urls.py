from django.urls import path, include
from users.views import SignupAPIView, CustomObtainAuthToken
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='api_signup'),
    path('login/', CustomObtainAuthToken.as_view(), name='api_login'),
    path('', include(router.urls)), 
]
