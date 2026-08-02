import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.admin_panel.models import AuditLog, PlatformSetting

class AdminPanelTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            phone_number='+155500099',
            full_name='Platform Ops Admin',
            role='admin'
        )
        self.client.force_authenticate(user=self.admin_user)

    def test_admin_dashboard_stats_endpoint(self):
        url = reverse('admin-dashboard-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', response.data)
        self.assertIn('system_health', response.data)

    def test_emergency_mode_toggle(self):
        url = reverse('admin-emergency')
        response = self.client.post(url, {'enabled': True, 'message': 'Disaster Alert Test'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['enabled'])

        # Verify audit log recorded
        log_exists = AuditLog.objects.filter(action='EMERGENCY_MODE_TOGGLED').exists()
        self.assertTrue(log_exists)

    def test_platform_monitoring_endpoint(self):
        url = reverse('admin-monitoring')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'HEALTHY')
        self.assertIn('services', response.data)
