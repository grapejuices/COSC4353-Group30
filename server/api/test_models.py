from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.authtoken.models import Token
from .models import UserProfile, EventDetails, VolunteerHistory, EventSkills

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

class E_PDFReportViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.superuser = User.objects.create_superuser(
            email="superuser@example.com",
            password="superpass123",
            is_admin=True
        )
        cls.user1 = User.objects.create_user(
            email="testuser1@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.user2 = User.objects.create_user(
            email="testuser2@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.event = EventDetails.objects.create(
            event_name="Test Event",
            description="This is a test event.",
            location="Test Location",
            urgency="High",
            event_date="2023-12-31 23:59:59"
        )
        cls.event_skills = EventSkills.objects.create(
            event=cls.event,
            name="Test Skill"
        )
        cls.user_profile1 = UserProfile.objects.create(
            user=cls.user1,
            full_name="Test User 1",
            address1="123 Test St",
            city="Test City",
            state="TX",
            zip_code="12345"
        )
        cls.user_profile2 = UserProfile.objects.create(
            user=cls.user2,
            full_name="Test User 2",
            address1="456 Test Ave",
            city="Test City",
            state="TX",
            zip_code="67890"
        )
        cls.volunteer_history1 = VolunteerHistory.objects.create(
            user_profile=cls.user_profile1,
            event=cls.event,
            status="Pending"
        )

    def setUp(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response.data}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")
        user = User.objects.get(email='superuser@example.com')
        self.assertIsNotNone(user, "User not found in database")
        self.assertTrue(user.is_authenticated, "User is not authenticated")

    def test_pdf_report_view_authenticated(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")

        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}
        response = self.client.get(reverse("event-pdf-report"), **headers)
        self.assertEqual(response.status_code, 200, f"PDF report view failed: {response}")
        self.assertEqual(response["Content-Type"], "application/pdf")

    def test_pdf_report_view_unauthenticated(self):
        response = self.client.get(reverse("event-pdf-report"))
        self.assertEqual(response.status_code, 401)

class E_CSVReportViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.superuser = User.objects.create_superuser(
            email="superuser@example.com",
            password="superpass123",
            is_admin=True
        )
        cls.user1 = User.objects.create_user(
            email="testuser1@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.user2 = User.objects.create_user(
            email="testuser2@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.event = EventDetails.objects.create(
            event_name="Test Event",
            description="This is a test event.",
            location="Test Location",
            urgency="High",
            event_date="2023-12-31 23:59:59"
        )
        cls.event_skills = EventSkills.objects.create(
            event=cls.event,
            name="Test Skill"
        )
        cls.user_profile1 = UserProfile.objects.create(
            user=cls.user1,
            full_name="Test User 1",
            address1="123 Test St",
            city="Test City",
            state="TX",
            zip_code="12345"
        )
        cls.user_profile2 = UserProfile.objects.create(
            user=cls.user2,
            full_name="Test User 2",
            address1="456 Test Ave",
            city="Test City",
            state="TX",
            zip_code="67890"
        )
        cls.volunteer_history1 = VolunteerHistory.objects.create(
            user_profile=cls.user_profile1,
            event=cls.event,
            status="Pending"
        )

    def setUp(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response.data}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")
        user = User.objects.get(email='superuser@example.com')
        self.assertIsNotNone(user, "User not found in database")
        self.assertTrue(user.is_authenticated, "User is not authenticated")

    def test_pdf_report_view_authenticated(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")

        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}
        response = self.client.get(reverse("event-csv-report"), **headers)
        self.assertEqual(response.status_code, 200, f"CSV report view failed: {response}")
        self.assertEqual(response["Content-Type"], "text/csv")

    def test_csv_report_view_unauthenticated(self):
        response = self.client.get(reverse("event-csv-report"))
        self.assertEqual(response.status_code, 401)

class V_PDFReportViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.superuser = User.objects.create_superuser(
            email="superuser@example.com",
            password="superpass123",
            is_admin=True
        )
        cls.user1 = User.objects.create_user(
            email="testuser1@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.user2 = User.objects.create_user(
            email="testuser2@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.event = EventDetails.objects.create(
            event_name="Test Event",
            description="This is a test event.",
            location="Test Location",
            urgency="High",
            event_date="2023-12-31 23:59:59"
        )
        cls.event_skills = EventSkills.objects.create(
            event=cls.event,
            name="Test Skill"
        )
        cls.user_profile1 = UserProfile.objects.create(
            user=cls.user1,
            full_name="Test User 1",
            address1="123 Test St",
            city="Test City",
            state="TX",
            zip_code="12345"
        )
        cls.user_profile2 = UserProfile.objects.create(
            user=cls.user2,
            full_name="Test User 2",
            address1="456 Test Ave",
            city="Test City",
            state="TX",
            zip_code="67890"
        )
        cls.volunteer_history1 = VolunteerHistory.objects.create(
            user_profile=cls.user_profile1,
            event=cls.event,
            status="Pending"
        )

    def setUp(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response.data}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")
        user = User.objects.get(email='superuser@example.com')
        self.assertIsNotNone(user, "User not found in database")
        self.assertTrue(user.is_authenticated, "User is not authenticated")

    def test_pdf_report_view_authenticated(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")

        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}
        response = self.client.get(reverse("volunteer-history-pdf-report"), **headers)
        self.assertEqual(response.status_code, 200, f"PDF report view failed: {response}")
        self.assertEqual(response["Content-Type"], "application/pdf")

    def test_csv_report_view_unauthenticated(self):
        response = self.client.get(reverse("volunteer-history-pdf-report"))
        self.assertEqual(response.status_code, 401)

class V_CSVReportViewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.superuser = User.objects.create_superuser(
            email="superuser@example.com",
            password="superpass123",
            is_admin=True
        )
        cls.user1 = User.objects.create_user(
            email="testuser1@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.user2 = User.objects.create_user(
            email="testuser2@example.com",
            password="testpass123",
            is_admin=False
        )
        cls.event = EventDetails.objects.create(
            event_name="Test Event",
            description="This is a test event.",
            location="Test Location",
            urgency="High",
            event_date="2023-12-31 23:59:59"
        )
        cls.event_skills = EventSkills.objects.create(
            event=cls.event,
            name="Test Skill"
        )
        cls.user_profile1 = UserProfile.objects.create(
            user=cls.user1,
            full_name="Test User 1",
            address1="123 Test St",
            city="Test City",
            state="TX",
            zip_code="12345"
        )
        cls.user_profile2 = UserProfile.objects.create(
            user=cls.user2,
            full_name="Test User 2",
            address1="456 Test Ave",
            city="Test City",
            state="TX",
            zip_code="67890"
        )
        cls.volunteer_history1 = VolunteerHistory.objects.create(
            user_profile=cls.user_profile1,
            event=cls.event,
            status="Pending"
        )

    def setUp(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response.data}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")
        user = User.objects.get(email='superuser@example.com')
        self.assertIsNotNone(user, "User not found in database")
        self.assertTrue(user.is_authenticated, "User is not authenticated")

    def test_pdf_report_view_authenticated(self):
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'superuser@example.com',
            'password': 'superpass123'
        })
        self.assertEqual(response.status_code, 200, f"Login failed: {response}")
        self.token = response.data.get('access')
        self.assertIsNotNone(self.token, "Access token not returned in login response")

        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}
        response = self.client.get(reverse("volunteer-history-csv-report"), **headers)
        self.assertEqual(response.status_code, 200, f"CSV report view failed: {response}")
        self.assertEqual(response["Content-Type"], "text/csv")

        

    def test_csv_report_view_unauthenticated(self):
        response = self.client.get(reverse("volunteer-history-csv-report"))
        self.assertEqual(response.status_code, 401)