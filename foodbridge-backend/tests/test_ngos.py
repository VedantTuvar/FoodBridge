import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.ngos.models import NGOProfile

class NGOManagementTests(APITestCase):
    def setUp(self):
        self.ngo_user = User.objects.create_user(
            phone_number='+155500011',
            full_name='Hope Shelter NGO',
            role='ngo'
        )
        self.ngo_profile = NGOProfile.objects.create(
            user=self.ngo_user,
            organization_name='Hope Shelter NGO',
            registration_number='REG-10029',
            verification_status='pending',
            capacity_per_day=500
        )

        self.admin_user = User.objects.create_user(
            phone_number='+155500099',
            full_name='System Admin',
            role='admin'
        )

    def test_ngo_profile_creation(self):
        self.assertEqual(self.ngo_profile.verification_status, 'pending')
        self.assertEqual(self.ngo_profile.capacity_per_day, 500)

    def test_admin_approve_ngo(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('admin-approve-ngo', kwargs={'pk': self.ngo_profile.pk})
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ngo_profile.refresh_from_db()
        self.assertEqual(self.ngo_profile.verification_status, 'approved')
        self.assertTrue(self.ngo_profile.user.is_verified)

    def test_admin_reject_ngo(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('admin-reject-ngo', kwargs={'pk': self.ngo_profile.pk})
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ngo_profile.refresh_from_db()
        self.assertEqual(self.ngo_profile.verification_status, 'rejected')
        self.assertFalse(self.ngo_profile.user.is_verified)
