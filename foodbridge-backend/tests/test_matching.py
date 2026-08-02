import pytest
from rest_framework.test import APITestCase
from apps.matching.services import SmartMatchingEngine

class SmartMatchingTests(APITestCase):
    def test_smart_matching_recommendations(self):
        candidates = SmartMatchingEngine.rank_ngo_candidates(
            donation_quantity_kg=50.0,
            perishability_hours=2.5,
            latitude=28.6139,
            longitude=77.2090
        )

        self.assertIsInstance(candidates, list)
        self.assertGreater(len(candidates), 0)
        
        # Verify candidate attributes
        top_candidate = candidates[0]
        self.assertIn('ngo_id', top_candidate)
        self.assertIn('organization_name', top_candidate)
        self.assertIn('match_score_percentage', top_candidate)
        self.assertIn('recommendation_reason', top_candidate)
        
        # Verify scores are sorted descending
        scores = [c['match_score_percentage'] for c in candidates]
        self.assertEqual(scores, sorted(scores, reverse=True))
