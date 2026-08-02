import pytest
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.analytics.services import AnalyticsService

class AnalyticsAndReportTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            phone_number='+155500033',
            full_name='Corporate CSR Manager',
            role='corporate'
        )

    def test_global_analytics_statistics(self):
        stats = AnalyticsService.get_global_statistics()
        self.assertIn('food_saved_kg', stats)
        self.assertIn('meals_served', stats)
        self.assertIn('carbon_saved_co2_kg', stats)
        self.assertIn('water_saved_liters', stats)

    def test_generate_csr_report(self):
        report = AnalyticsService.generate_report('csr', {'format': 'pdf'}, self.user)
        self.assertIsNotNone(report.id)
        self.assertEqual(report.report_type, 'csr')
        self.assertIn('co2_avoided_tonnes', report.summary_data)

    def test_ai_demand_prediction(self):
        prediction = AnalyticsService.predict_demand('Central District', 'Friday')
        self.assertEqual(prediction['district'], 'Central District')
        self.assertGreater(prediction['predicted_demand_kg'], 0)
        self.assertGreaterEqual(prediction['confidence_score'], 0.8)
