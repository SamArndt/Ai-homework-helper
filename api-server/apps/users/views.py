from rest_framework import status, generics, viewsets, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import User
from .serializers import UserSignupSerializer, CustomAuthTokenSerializer, UserSerializer

class SignupAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # Automatically generate a token upon successful signup
        user = User.objects.get(email=response.data['email'])
        token, _ = Token.objects.get_or_create(user=user)
        response.data['token'] = token.key
        return response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
        
class CustomObtainAuthToken(ObtainAuthToken):
    serializer_class = CustomAuthTokenSerializer
