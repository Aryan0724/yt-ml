"""
backend/services/storage/base.py

Abstract base class for isolated object storage providers.
Decouples file storage from database persistence.
"""

from abc import ABC, abstractmethod


class StorageProvider(ABC):
    @abstractmethod
    def save_file(self, file_bytes: bytes, key: str, content_type: str = "image/webp") -> str:
        """Persists file bytes and returns the stored key."""
        pass

    @abstractmethod
    def get_file_path_or_url(self, key: str) -> str:
        """Resolves the physical path or public/signed URL for the given key."""
        pass

    @abstractmethod
    def delete_file(self, key: str) -> bool:
        """Deletes the stored object."""
        pass
