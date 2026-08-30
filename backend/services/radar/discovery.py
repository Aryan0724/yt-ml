"""
backend/services/radar/discovery.py

Topic discovery provider abstraction and implementations.
Separates candidate topic discovery from trend measurement, ensuring that PreYT
can discover market topics without relying on user-entered keywords.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class TopicDiscoveryProvider(ABC):
    """Abstract base class for topic candidate discovery providers."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    def discover_candidate_topics(
        self,
        region: str = "IN",
        category: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Discovers candidate search topics for a given region and category.
        Returns a list of dicts:
          [{"canonical_name": "AI Agents", "category": "AI", "slug": "ai-agents"}, ...]
        """
        pass


class ConfiguredSeedDiscoveryProvider(TopicDiscoveryProvider):
    """
    Discovery provider that seeds legitimate, high-intent creator topic candidates
    across global and regional YouTube categories.
    These candidates are subsequently measured via live TopicDataProvider (DataForSEO).
    """

    # Legitimate cross-category seed topics
    SEEDS: Dict[str, List[Dict[str, str]]] = {
        "AI": [
            {"canonical_name": "AI Agents", "slug": "ai-agents"},
            {"canonical_name": "DeepSeek R1", "slug": "deepseek-r1"},
            {"canonical_name": "Cursor AI", "slug": "cursor-ai"},
            {"canonical_name": "Claude 3.7", "slug": "claude-3-7"},
            {"canonical_name": "Local LLM", "slug": "local-llm"},
            {"canonical_name": "AI Video Generation", "slug": "ai-video-generation"},
        ],
        "Technology": [
            {"canonical_name": "Apple Vision Pro", "slug": "apple-vision-pro"},
            {"canonical_name": "Quantum Computing", "slug": "quantum-computing"},
            {"canonical_name": "Raspberry Pi 5", "slug": "raspberry-pi-5"},
            {"canonical_name": "Cybersecurity Home Lab", "slug": "cybersecurity-home-lab"},
            {"canonical_name": "Foldable Phones", "slug": "foldable-phones"},
        ],
        "Gaming": [
            {"canonical_name": "GTA 6 Trailer", "slug": "gta-6-trailer"},
            {"canonical_name": "Steam Deck OLED", "slug": "steam-deck-oled"},
            {"canonical_name": "Monster Hunter Wilds", "slug": "monster-hunter-wilds"},
            {"canonical_name": "Elden Ring DLC", "slug": "elden-ring-dlc"},
            {"canonical_name": "Nintendo Switch 2", "slug": "nintendo-switch-2"},
        ],
        "Business": [
            {"canonical_name": "Solopreneur Micro SaaS", "slug": "solopreneur-micro-saas"},
            {"canonical_name": "Personal Branding on LinkedIn", "slug": "personal-branding-on-linkedin"},
            {"canonical_name": "Drop Servicing Agency", "slug": "drop-servicing-agency"},
            {"canonical_name": "Newsletter Business Model", "slug": "newsletter-business-model"},
        ],
        "Finance": [
            {"canonical_name": "Index Funds vs ETFs", "slug": "index-funds-vs-etfs"},
            {"canonical_name": "Bitcoin Halving Cycle", "slug": "bitcoin-halving-cycle"},
            {"canonical_name": "High Yield Savings Accounts", "slug": "high-yield-savings-accounts"},
            {"canonical_name": "Credit Card Points Strategy", "slug": "credit-card-points-strategy"},
        ],
        "Entertainment": [
            {"canonical_name": "Anime Spring Season", "slug": "anime-spring-season"},
            {"canonical_name": "Movie Box Office Breakdown", "slug": "movie-box-office-breakdown"},
            {"canonical_name": "Filmmaking Lighting Setup", "slug": "filmmaking-lighting-setup"},
        ],
        "Education": [
            {"canonical_name": "Spaced Repetition Flashcards", "slug": "spaced-repetition-flashcards"},
            {"canonical_name": "How to Read Research Papers", "slug": "how-to-read-research-papers"},
            {"canonical_name": "Python for Data Analysis", "slug": "python-for-data-analysis"},
        ],
        "Sports": [
            {"canonical_name": "Champions League Knockouts", "slug": "champions-league-knockouts"},
            {"canonical_name": "Cricket IPL Auction", "slug": "cricket-ipl-auction"},
            {"canonical_name": "F1 Aerodynamics", "slug": "f1-aerodynamics"},
        ],
        "Health": [
            {"canonical_name": "Zone 2 Cardio Training", "slug": "zone-2-cardio-training"},
            {"canonical_name": "Creatine Monohydrate Timing", "slug": "creatine-monohydrate-timing"},
            {"canonical_name": "Circadian Rhythm Sleep Protocol", "slug": "circadian-rhythm-sleep-protocol"},
        ],
        "Science": [
            {"canonical_name": "James Webb Space Telescope", "slug": "james-webb-space-telescope"},
            {"canonical_name": "Nuclear Fusion Milestone", "slug": "nuclear-fusion-milestone"},
            {"canonical_name": "Solid State Batteries", "slug": "solid-state-batteries"},
        ]
    }

    # Regional candidate modifiers/specialties
    REGIONAL_CANDIDATES: Dict[str, List[Dict[str, str]]] = {
        "IN": [
            {"canonical_name": "UPI International Expansion", "category": "Finance", "slug": "upi-international-expansion"},
            {"canonical_name": "EV Scooters India", "category": "Technology", "slug": "ev-scooters-india"},
            {"canonical_name": "ISRO Gaganyaan Mission", "category": "Science", "slug": "isro-gaganyaan-mission"},
        ],
        "US": [
            {"canonical_name": "Federal Reserve Rate Cut", "category": "Finance", "slug": "federal-reserve-rate-cut"},
            {"canonical_name": "Super Bowl Halftime Production", "category": "Entertainment", "slug": "super-bowl-halftime-production"},
        ],
        "GB": [
            {"canonical_name": "Premier League Title Race", "category": "Sports", "slug": "premier-league-title-race"},
            {"canonical_name": "UK Tech Visa Startup", "category": "Business", "slug": "uk-tech-visa-startup"},
        ]
    }

    @property
    def provider_name(self) -> str:
        return "configured_seed_discovery"

    def discover_candidate_topics(
        self,
        region: str = "IN",
        category: Optional[str] = None
    ) -> List[Dict[str, str]]:
        candidates: List[Dict[str, str]] = []
        eff_cat = category.strip() if category and category != "All" else None

        # Gather from category seeds
        if eff_cat and eff_cat in self.SEEDS:
            for item in self.SEEDS[eff_cat]:
                candidates.append({**item, "category": eff_cat})
        else:
            for cat_name, items in self.SEEDS.items():
                for item in items:
                    candidates.append({**item, "category": cat_name})

        # Add regional candidates
        reg_upper = region.upper()
        if reg_upper in self.REGIONAL_CANDIDATES:
            for item in self.REGIONAL_CANDIDATES[reg_upper]:
                if not eff_cat or item.get("category") == eff_cat:
                    candidates.append(item)

        return candidates
