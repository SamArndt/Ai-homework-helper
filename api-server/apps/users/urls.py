from django.urls import path, include
from users.views import SignupAPIView, CustomObtainAuthToken


urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='api_signup'),
    path('login/', CustomObtainAuthToken.as_view(), name='api_login'), 
]