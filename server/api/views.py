from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, User, UserAvailability, UserSkills, EventDetails
from .serializers import RegisterSerializer, UserProfileSerializer, UserAvailabilitySerializer, UserSkillsSerializer, EventDetailsSerializer
from django.db import transaction

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serialzer = self.get_serializer(data=request.data)
        serialzer.is_valid(raise_exception=True)
        user = serialzer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "is_admin": user.is_admin,
            },
            status=status.HTTP_201_CREATED,
        )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "refresh": str(refresh), 
                "access": str(refresh.access_token),
                "is_admin": user.is_admin,
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return self.request.user.profile
    
    def get(self, request):
        profile = self.get_object()
        serializer = self.serializer_class(profile)
        if profile:
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    
class UserAvailabilityView(generics.ListCreateAPIView):
    serializer_class = UserAvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.availabilities.all()
    
    def get(self, request):
        availabilities = self.get_queryset()
        serializer = self.serializer_class(availabilities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    def post(self, request):
        user_profile = request.user.profile
        availability_data = request.data

        if not isinstance(availability_data, list):
            return Response({"error": "Invalid format, expected a list."}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            for entry in availability_data:
                UserAvailability.objects.update_or_create(
                    user_profile=user_profile,
                    date=entry["date"]
                )
        
        return Response({"message": "Availabilities updated successfully."}, status=status.HTTP_200_OK)
    
class UserSkillsView(generics.ListCreateAPIView):
    serializer_class = UserSkillsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.skills.all()
    
    def get(self, request):
        skills = self.get_queryset()
        serializer = self.serializer_class(skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user_profile = request.user.profile
        skills_data = request.data  # Expecting a list of skill names

        if not isinstance(skills_data, list):
            return Response({"error": "Invalid format, expected a list."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for skill_entry in skills_data:
                UserSkills.objects.update_or_create(
                    user_profile=user_profile,
                    name=skill_entry["name"],
                )

        return Response({"message": "Skills updated successfully."}, status=status.HTTP_200_OK)
    
class EventDetailsView(generics.RetrieveUpdateAPIView):
    serializer_class = EventDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventDetails.objects.all()
    
    def get(self, request, *args, **kwargs):
        events = self.get_queryset()
        serializer = self.serializer_class(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

