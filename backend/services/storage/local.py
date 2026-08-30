"""
backend/services/storage/local.py

Local volume filesystem storage provider.
Enforces tenant isolation by partitioning files into workspace-namespaced directories.
"""

import os
import uuid
from pathlib import Path
from core.config import settings
from services.storage.base import StorageProvider


class LocalStorageProvider(StorageProvider):
    def __init__(self, base_dir: str = None):
        self.base_dir = os.path.abspath(base_dir or settings.STORAGE_LOCAL_DIR)
        os.makedirs(self.base_dir, exist_ok=True)

    def _resolve_safe_path(self, key: str) -> str:
        """Prevents directory traversal by normalizing path and verifying prefix."""
        safe_path = os.path.abspath(os.path.join(self.base_dir, key))
        if not safe_path.startswith(self.base_dir):
            raise ValueError(f"Path traversal detected: {key}")
        return safe_path

    def save_file(self, file_bytes: bytes, key: str, content_type: str = "image/webp") -> str:
        """Saves file bytes to disk under safe resolved path."""
        target_path = self._resolve_safe_path(key)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, "wb") as f:
            f.write(file_bytes)
        return key

    def get_file_path_or_url(self, key: str) -> str:
        """Returns the absolute disk path for local serving."""
        return self._resolve_safe_path(key)

    def delete_file(self, key: str) -> bool:
        """Removes the file from disk if it exists."""
        try:
            target_path = self._resolve_safe_path(key)
            if os.path.exists(target_path):
                os.remove(target_path)
                return True
            return False
        except Exception:
            return False

    @staticmethod
    def generate_thumbnail_key(workspace_id: str, extension: str = "webp") -> str:
        """Generates a namespaced storage key: workspaces/{ws_id}/thumbnails/{uuid}.{ext}"""
        ext = extension.lstrip(".")
        return f"workspaces/{workspace_id}/thumbnails/{uuid.uuid4().hex}.{ext}"


storage_provider = LocalStorageProvider()
