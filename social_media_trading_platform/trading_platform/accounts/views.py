from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, logout
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        
        
        if user:
            refresh = RefreshToken.for_user(user)
            # Customize the payload to include the user_id (author)
            refresh.payload['user_id'] = user.id  # Add the user ID to the JWT token payload
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': str(refresh.payload['user_id'])
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)  # This logs out the user and clears the session
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
