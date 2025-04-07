from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import UserProfile, UserAvailability, UserSkills, EventDetails, VolunteerHistory, EventSkills

User = get_user_model()

class UserManagerTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(email="testuser@example.com", password="testpass123")
        self.assertEqual(user.email, "testuser@example.com")
        self.assertTrue(user.check_password("testpass123"))

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(email="superuser@example.com", password="superpass123")
        self.assertEqual(superuser.email, "superuser@example.com")
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

class UserProfileTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="testuser@example.com", password="testpass123")
        self.profile = UserProfile.objects.create(
            user=self.user,
            full_name="Test User",
            address1="123 Test St",
            city="Test City",
            state="TX",
            zip_code="12345"
        )

    def test_user_profile_creation(self):
        self.assertEqual(self.profile.full_name, "Test User")
        self.assertEqual(self.profile.user.email, "testuser@example.com")

class EventDetailsTests(TestCase):
    def setUp(self):
        self.event = EventDetails.objects.create(
            event_name="Test Event",
            description="This is a test event.",
            location="Test Location",
            urgency="High",
            event_date="2023-12-31 23:59:59"
        )

    def test_event_creation(self):
        self.assertEqual(self.event.event_name, "Test Event")
        self.assertEqual(self.event.description, "This is a test event.")

class VolunteerHistoryTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="testuser@example.com", password="testpass123")
        self.profile = UserProfile.objects.create(
            user=self.user,
            full_name="Test User",
            address1="123 Test St",
            city="Test City",
            state="TX",
            zip_code="12345"
        )
        self.event = EventDetails.objects.create(
            event_name="Test Event",
            description="This is a test event.",
            location="Test Location",
            urgency="High",
            event_date="2023-12-31 23:59:59"
        )
        self.volunteer_history = VolunteerHistory.objects.create(
            user_profile=self.profile,
            event=self.event,
            status="Confirmed"
        )

    def test_volunteer_history_creation(self):
        self.assertEqual(self.volunteer_history.user_profile.full_name, "Test User")
        self.assertEqual(self.volunteer_history.event.event_name, "Test Event")
        self.assertEqual(self.volunteer_history.status, "Confirmed")