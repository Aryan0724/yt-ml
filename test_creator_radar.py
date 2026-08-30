"""
test_creator_radar.py

Unit and integration test suite for PreYT Creator Radar:
1. Deterministic Opportunity Score calculation & model versioning ('2026-v1')
2. Classification thresholds (BREAKING, RISING, TRENDING, OPPORTUNITY, SATURATING, COOLING, STABLE)
3. Evidence provenance and traceability
4. Honest empty state handling (no source data -> no fabricated scores)
5. Region configuration and normalization
6. RadarService feeds, summaries, and topic deep-dives
"""

import os
import sys
import unittest

# Add backend directory to sys.path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from core.radar_config import (
    RADAR_MODEL_VERSION,
    SUPPORTED_REGIONS,
    SUPPORTED_CATEGORIES,
    CLASSIFICATIONS,
    THRESHOLDS
)
from services.radar.opportunity import OpportunityCalculator
from services.radar.discovery import ConfiguredSeedDiscoveryProvider
from services.radar.service import RadarService, radar_service
from services.radar.schemas import RadarSummary, RadarFeedResponse, RadarTopicItem


class TestCreatorRadar(unittest.TestCase):

    def test_01_configuration_and_taxonomies(self):
        """Validates configuration-driven regions, categories, and versioning."""
        self.assertEqual(RADAR_MODEL_VERSION, "2026-v1")
        
        region_codes = [r["code"] for r in SUPPORTED_REGIONS]
        self.assertIn("IN", region_codes)
        self.assertIn("US", region_codes)
        self.assertIn("GB", region_codes)
        self.assertIn("GLOBAL", region_codes)

        self.assertIn("All", SUPPORTED_CATEGORIES)
        self.assertIn("AI", SUPPORTED_CATEGORIES)
        self.assertIn("Technology", SUPPORTED_CATEGORIES)
        self.assertIn("Gaming", SUPPORTED_CATEGORIES)

        self.assertIn("BREAKING", CLASSIFICATIONS)
        self.assertIn("RISING", CLASSIFICATIONS)
        self.assertIn("OPPORTUNITY", CLASSIFICATIONS)
        self.assertIn("SATURATING", CLASSIFICATIONS)

    def test_02_deterministic_opportunity_score_math(self):
        """Verifies opportunity score calculation is strictly deterministic and repeatable."""
        # Simulated rising curve with recent surge
        series = [
            {"date": "2025-09-01", "value": 20},
            {"date": "2025-10-01", "value": 25},
            {"date": "2025-11-01", "value": 30},
            {"date": "2025-12-01", "value": 35},
            {"date": "2026-01-01", "value": 45},
            {"date": "2026-02-01", "value": 60},
            {"date": "2026-03-01", "value": 75},
            {"date": "2026-04-01", "value": 90},
        ]
        
        metrics, opp, cls, why, action = OpportunityCalculator.calculate_metrics_and_opportunity(series)

        self.assertEqual(opp.model_version, "2026-v1")
        self.assertGreater(opp.score, 60.0)
        self.assertIn(opp.tier, ["HIGH", "MODERATE"])
        
        # Verify evidence provenance
        evidence = opp.evidence
        self.assertIsNotNone(evidence.demand_component)
        self.assertIsNotNone(evidence.momentum_component)
        self.assertIsNotNone(evidence.freshness_component)
        self.assertIsNotNone(evidence.saturation_discount)
        
        # Repeat calculation on identical input must yield bit-exact identical score
        metrics2, opp2, _, _, _ = OpportunityCalculator.calculate_metrics_and_opportunity(series)
        self.assertEqual(opp.score, opp2.score)
        self.assertEqual(metrics.momentum, metrics2.momentum)

    def test_03_classification_breaking(self):
        """Verifies sudden spike is classified as BREAKING."""
        spike_series = [
            {"date": "2026-01-01", "value": 15},
            {"date": "2026-01-08", "value": 15},
            {"date": "2026-01-15", "value": 16},
            {"date": "2026-01-22", "value": 15},
            {"date": "2026-01-29", "value": 18},
            {"date": "2026-02-05", "value": 20},
            {"date": "2026-02-12", "value": 55},
            {"date": "2026-02-19", "value": 85},  # Sudden surge
        ]
        metrics, opp, cls, why, action = OpportunityCalculator.calculate_metrics_and_opportunity(spike_series)
        self.assertEqual(cls, "BREAKING")
        self.assertIn("surge", why.lower())

    def test_04_classification_cooling(self):
        """Verifies decline from peak is classified as COOLING."""
        cooling_series = [
            {"date": "2026-01-01", "value": 80},
            {"date": "2026-01-08", "value": 85},
            {"date": "2026-01-15", "value": 90},
            {"date": "2026-01-22", "value": 88},
            {"date": "2026-01-29", "value": 75},
            {"date": "2026-02-05", "value": 60},
            {"date": "2026-02-12", "value": 45},
            {"date": "2026-02-19", "value": 30},
        ]
        metrics, opp, cls, why, action = OpportunityCalculator.calculate_metrics_and_opportunity(cooling_series)
        self.assertEqual(cls, "COOLING")
        self.assertIn("declined", why.lower())

    def test_05_honest_empty_state_no_data(self):
        """Verifies that empty time series produces an honest 0 score without fabrication."""
        metrics, opp, cls, why, action = OpportunityCalculator.calculate_metrics_and_opportunity([])
        self.assertEqual(opp.score, 0.0)
        self.assertEqual(opp.tier, "EMERGING")
        self.assertEqual(metrics.demand, 0.0)
        self.assertEqual(metrics.current_value, 0)
        self.assertIn("Insufficient", why)

    def test_06_discovery_provider(self):
        """Verifies candidate topic discovery across categories and regions."""
        discovery = ConfiguredSeedDiscoveryProvider()
        candidates_all = discovery.discover_candidate_topics(region="IN", category="All")
        self.assertGreater(len(candidates_all), 15)

        candidates_ai = discovery.discover_candidate_topics(region="IN", category="AI")
        self.assertGreater(len(candidates_ai), 3)
        for c in candidates_ai:
            self.assertEqual(c["category"], "AI")
            self.assertIn("slug", c)
            self.assertIn("canonical_name", c)

    def test_07_radar_service_feed_and_summary(self):
        """Verifies high-level RadarService returns valid typed models and summaries."""
        summary = radar_service.get_summary(region="IN")
        self.assertIsInstance(summary, RadarSummary)
        self.assertEqual(summary.region, "IN")
        self.assertEqual(summary.model_version, "2026-v1")
        self.assertGreaterEqual(summary.total_tracked, 0)

        feed = radar_service.get_topics(region="IN", category="All", classification="ALL", limit=5)
        self.assertIsInstance(feed, RadarFeedResponse)
        self.assertEqual(feed.region, "IN")
        self.assertLessEqual(len(feed.topics), 5)

        if feed.topics:
            first = feed.topics[0]
            self.assertIsInstance(first, RadarTopicItem)
            self.assertIsNotNone(first.slug)
            self.assertIsNotNone(first.canonical_name)
            self.assertIsNotNone(first.opportunity.score)
            self.assertIsNotNone(first.why_this_matters)
            self.assertIsNotNone(first.creator_opportunity)


if __name__ == "__main__":
    unittest.main(verbosity=2)
