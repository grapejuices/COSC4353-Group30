from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import UserProfile, UserAvailability, UserSkills, EventDetails, VolunteerHistory, EventSkills

class UserManagerTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(email='test@example.com', password='testpass123')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        User = get_user_model()
        superuser = User.objects.create_superuser(email='super@example.com', password='superpass123')
        self.assertEqual(superuser.email, 'super@example.com')
        self.assertTrue(superuser.check_password('superpass123'))
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

class UserProfileTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email='test@example.com', password='testpass123')
        self.profile = UserProfile.objects.create(user=self.user, full_name='Test User', address1='123 Main St', city='Test City', state='TX', zip_code='12345')

    def test_user_profile_creation(self):
        self.assertEqual(self.profile.full_name, 'Test User')
        self.assertEqual(self.profile.user.email, 'test@example.com')
        self.assertEqual(self.profile.address1, '123 Main St')
        self.assertEqual(self.profile.city, 'Test City')
        self.assertEqual(self.profile.state, 'TX')
        self.assertEqual(self.profile.zip_code, '12345')

    def test_user_profile_str(self):
        self.assertEqual(str(self.profile), 'Test User')

class UserAvailabilityTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email='test@example.com', password='testpass123')
        self.profile = UserProfile.objects.create(user=self.user, full_name='Test User', address1='123 Main St', city='Test City', state='TX', zip_code='12345')
        self.availability = UserAvailability.objects.create(user_profile=self.profile, date='2023-01-01')

    def test_user_availability_creation(self):
        self.assertEqual(self.availability.date, '2023-01-01')
        self.assertEqual(self.availability.user_profile.full_name, 'Test User')

    def test_user_availability_str(self):
        self.assertEqual(str(self.availability), '2023-01-01')

class UserSkillsTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email='test@example.com', password='testpass123')
        self.profile = UserProfile.objects.create(user=self.user, full_name='Test User', address1='123 Main St', city='Test City', state='TX', zip_code='12345')
        self.skill = UserSkills.objects.create(user_profile=self.profile, name='Python')

    def test_user_skills_creation(self):
        self.assertEqual(self.skill.name, 'Python')
        self.assertEqual(self.skill.user_profile.full_name, 'Test User')

    def test_user_skills_str(self):
        self.assertEqual(str(self.skill), 'Python')

class EventDetailsTests(TestCase):
    def setUp(self):
        self.event = EventDetails.objects.create(event_name='Test Event', description='Test Description', location='Test Location', urgency=3, event_date='2023-01-01T00:00:00Z')

    def test_event_details_creation(self):
        self.assertEqual(self.event.event_name, 'Test Event')
        self.assertEqual(self.event.description, 'Test Description')
        self.assertEqual(self.event.location, 'Test Location')
        self.assertEqual(self.event.urgency, 3)
        self.assertEqual(self.event.event_date, '2023-01-01T00:00:00Z')

    def test_event_details_str(self):
        self.assertEqual(str(self.event), 'Test Event')

class EventSkillsTests(TestCase):
    def setUp(self):
        self.event = EventDetails.objects.create(event_name='Test Event', description='Test Description', location='Test Location', urgency=3, event_date='2023-01-01T00:00:00Z')
        self.skill = EventSkills.objects.create(event=self.event, name='Python')

    def test_event_skills_creation(self):
        self.assertEqual(self.skill.name, 'Python')
        self.assertEqual(self.skill.event.event_name, 'Test Event')

    def test_event_skills_str(self):
        self.assertEqual(str(self.skill), 'Python')

class VolunteerHistoryTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email='test@example.com', password='testpass123')
        self.profile = UserProfile.objects.create(user=self.user, full_name='Test User', address1='123 Main St', city='Test City', state='TX', zip_code='12345')
        self.event = EventDetails.objects.create(event_name='Test Event', description='Test Description', location='Test Location', urgency=3, event_date='2023-01-01T00:00:00Z')
        self.volunteer_history = VolunteerHistory.objects.create(user_profile=self.profile, event=self.event)

    def test_volunteer_history_creation(self):
        self.assertEqual(self.volunteer_history.user_profile.full_name, 'Test User')
        self.assertEqual(self.volunteer_history.event.event_name, 'Test Event')

    def test_volunteer_history_str(self):
        self.assertEqual(str(self.volunteer_history), 'Test User - Test Event')

    def test_volunteer_history_user_profile(self):
        self.assertEqual(self.volunteer_history.user_profile.email, 'test@example.com')

    def test_volunteer_history_event_details(self):
        self.assertEqual(self.volunteer_history.event.description, 'Test Description')
        self.assertEqual(self.volunteer_history.event.location, 'Test Location')
        self.assertEqual(self.volunteer_history.event.urgency, 3)
        self.assertEqual(self.volunteer_history.event.event_date, '2023-01-01T00:00:00Z')

    def test_volunteer_history_status_default(self):
        self.assertEqual(self.volunteer_history.status, 'Pending')

    def test_volunteer_history_status_update(self):
        self.volunteer_history.status = 'Completed'
        self.volunteer_history.save()
        self.assertEqual(self.volunteer_history.status, 'Completed')

