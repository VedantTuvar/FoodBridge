import pytest
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.volunteers.models import VolunteerProfile

class VolunteerTests(APITestCase):
    def setUp(self):
        self.volunteer_user = User.objects.create_user(
            phone_number='+155500022',
            full_name='Alex Johnson',
            role='volunteer'
        )
        self.volunteer_profile = VolunteerProfile.objects.create(
            user=self.volunteer_user,
            vehicle_type='bike',
            is_available=True,
            rating_avg=4.9,
            total_deliveries=14
        )

    def test_volunteer_profile_initial_state(self):
        self.assertTrue(self.volunteer_profile.is_available)
        self.assertEqual(self.volunteer_profile.vehicle_type, 'bike')
        self.assertEqual(self.volunteer_profile.rating_avg, 4.9)

    def test_volunteer_availability_toggle(self):
        self.volunteer_profile.is_available = False
        self.volunteer_profile.save()
        self.volunteer_profile.refresh_from_db()
        self.assertFalse(self.volunteer_profile.is_available)
