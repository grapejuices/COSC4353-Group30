from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, User, UserAvailability, UserSkills, EventDetails, EventSkills, VolunteerHistory, Notifications
from .serializers import RegisterSerializer, UserProfileSerializer, UserAvailabilitySerializer, UserSkillsSerializer, EventDetailsSerializer, EventSkillsSerializer, VolunteerHistorySerializer, NotificationSerializer
from django.db import transaction
from django.http import HttpResponse
import csv
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter

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

class UsersListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.all()
    
    def get(self, request):
        profiles = self.get_queryset()
        serializer = self.serializer_class(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.all()
    
    def get(self, request, pk):
        profile = self.get_queryset().filter(id=pk).first()
        if profile:
            serializer = self.serializer_class(profile)
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

class UserHistoryDetailView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.all()
    
    def get(self, request, pk):
        profile = self.get_queryset().filter(user_id=pk).first()
        if profile:
            serializer = self.serializer_class(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    
class VolunteerHistoryView(generics.RetrieveAPIView):
    serializer_class = VolunteerHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.volunteer_history.all()
    
    def get(self, request):
        events = self.get_queryset()
        serializer = self.serializer_class(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class VolunteerHistoryBulkCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        event_id = request.data.get("event")
        user_profiles = request.data.get("user_profiles", [])

        if not event_id or not isinstance(user_profiles, list):
            return Response({"error": "Invalid payload. Must include event and user_profiles (array)."}, status=status.HTTP_400_BAD_REQUEST)

        
        try:
            event = EventDetails.objects.get(id=event_id)
        except EventDetails.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        created_histories = []
        with transaction.atomic():
            for profile_id in user_profiles:
                try:
                    profile = UserProfile.objects.get(id=profile_id)
                except UserProfile.DoesNotExist:
                    continue

                Notifications.objects.create(
                    user_profile=profile,
                    message=f"You have been assigned to Event '{event.event_name}' Please check the details."
                )

                history, created = VolunteerHistory.objects.update_or_create(
                    user_profile=profile,
                    event=event,
                    defaults={"status": "Pending"}
                )
                created_histories.append(history)
        
        serializer = VolunteerHistorySerializer(created_histories, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EventDetailsView(generics.RetrieveUpdateAPIView):
    serializer_class = EventDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventDetails.objects.all()
    
    def get(self, request, *args, **kwargs):
        events = self.get_queryset()
        serializer = self.serializer_class(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        if not request.user.is_admin:
            return Response({"error": "Only admins can create events"}, status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data.copy()
        skills_data = data.pop('skills', [])
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            event = serializer.save()

            for skill in skills_data:
                EventSkills.objects.create(name=skill, event=event)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventDetailedView(generics.RetrieveUpdateAPIView):
    serializer_class = EventDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventDetails.objects.all()
    
    def get(self, request, pk):
        event = self.get_queryset().filter(pk=pk).first()
        if event:
            serializer = self.serializer_class(event)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        if not request.user.is_admin:
            return Response({"error": "Only admins can update events"}, status=status.HTTP_401_UNAUTHORIZED)
        
        event = self.get_queryset().filter(pk=pk).first()
        if event:
            data = request.data.copy()
            skills_data = data.pop('skills', [])
            serializer = self.serializer_class(event, data=data)

            if serializer.is_valid():
                event = serializer.save()

                EventSkills.objects.filter(event=event).exclude(name__in=skills_data).delete()
                for skill in skills_data:
                    EventSkills.objects.update_or_create(name=skill, event=event)

                for volunteer in VolunteerHistory.objects.filter(event=event).all():
                    Notifications.objects.create(
                        user_profile=volunteer.user_profile,
                        message=f"Event '{event.event_name}' has been updated. Please check the details."
                    )

                return Response(serializer.data, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        if not request.user.is_admin:
            return Response({"error": "Only admins can delete events"}, status=status.HTTP_401_UNAUTHORIZED)
        
        event = self.get_queryset().filter(pk=pk).first()
        if event:
            event.delete()
            return Response({"message": "Event deleted successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

class EventSkillsView(generics.ListCreateAPIView):
    serializer_class = EventSkillsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventSkills.objects.all()
    
    def get(self, request, *args, **kwargs):
        event_skills = self.get_queryset()
        serializer = self.serializer_class(event_skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class NotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notifications.objects.filter(user_profile=self.request.user.profile)
    
    def get(self, request):
        notifications = self.get_queryset()
        serializer = self.serializer_class(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request):
        pk = request.data.get("id")
        if not pk:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        notification = self.get_queryset().filter(pk=pk).first()
        if notification:
            notification.delete()
            return Response({"message": "Notification deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
    
class EventCSVReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Only admins can access this report"}, status=status.HTTP_401_UNAUTHORIZED)
        
        events = EventDetails.objects.all().prefetch_related('volunteers__user_profile', 'required_skills')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = "attachment; filename=events_report.csv"

        writer = csv.writer(response)
        writer.writerow(["Event Name", "Description", "Location", "Urgency", "Event Date", "Required Skills", "Assigned Volunteers"])

        for event in events:
            required_skills = ", ".join(skill.name for skill in event.required_skills.all())
            assigned_volunteers = ", ".join(v.user_profile.full_name for v in event.volunteers.all())
            writer.writerow([
                event.event_name,
                event.description,
                event.location,
                event.urgency,
                event.event_date.strftime("%Y-%m-%d"),
                required_skills,
                assigned_volunteers,
            ])
        return response
    
class EventPDFReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Only admins can access this report"}, status=status.HTTP_401_UNAUTHORIZED)
        
        events = EventDetails.objects.all().prefetch_related('volunteers__user_profile', 'required_skills')

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=events_report.pdf'

        p = canvas.Canvas(response, pagesize=letter)
        width, height = letter
        y = height - 40
        p.setFont("Helvetica-Bold", 14)
        p.drawString(200, y, "Events Report")
        y -= 30
        p.setFont("Helvetica", 10)

        for event in events:
            required_skills = ", ".join(skill.name for skill in event.required_skills.all())
            assigned_volunteers = ", ".join(v.user_profile.full_name for v in event.volunteers.all())
            p.drawString(40, y, f"Event Name: {event.event_name}")
            y -= 15
            p.drawString(40, y, f"Description: {event.description}")
            y -= 15
            p.drawString(40, y, f"Location: {event.location} | Urgency: {event.urgency} | Event Date: {event.event_date.strftime('%Y-%m-%d')}")
            y -= 15
            p.drawString(40, y, f"Required Skills: {required_skills}")
            y -= 15
            p.drawString(40, y, f"Assigned Volunteers: {assigned_volunteers}")
            y -= 30
            if y < 60:
                p.showPage()
                y = height - 40
                p.setFont("Helvetica", 10)
            
        p.save()
        return response
    
class VolunteerReportCSV(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Only admins can access this report"}, status=status.HTTP_401_UNAUTHORIZED)
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = "attachment; filename=volunteer_report.csv"

        writer = csv.writer(response)
        writer.writerow(['Volunteer Name', 'Event Name', 'Status', 'Event Date'])

        histories = VolunteerHistory.objects.select_related('user_profile', 'event').all()
        for history in histories:
            writer.writerow([
                history.user_profile.full_name,
                history.event.event_name,
                history.status,
                history.event.event_date.strftime("%Y-%m-%d"),
            ])
        
        return response
    
class VolunteerReportPDF(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Only admins can access this report"}, status=status.HTTP_401_UNAUTHORIZED)
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=volunteer_report.pdf'

        p = canvas.Canvas(response, pagesize=letter)
        width, height = letter
        y = height - 40
        p.setFont("Helvetica-Bold", 14)
        p.drawString(200, y, "Volunteer Report")
        y -= 30
        p.setFont("Helvetica", 10)

        histories = VolunteerHistory.objects.select_related('user_profile', 'event').all()
        for history in histories:
            p.drawString(40, y, f"Volunteer Name: {history.user_profile.full_name}")
            y -= 15
            p.drawString(40, y, f"Event Name: {history.event.event_name} | Status: {history.status} | Event Date: {history.event.event_date.strftime('%Y-%m-%d')}")
            y -= 30
            if y < 60:
                p.showPage()
                y = height - 40
                p.setFont("Helvetica", 10)

        p.save()
        return response
