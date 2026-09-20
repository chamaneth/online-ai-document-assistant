import os
import json
import hashlib
from typing import Dict, Any, Optional
from core.config import settings

LICENSE_SECRET = "AIDA_OFFLINE_COMMERCIAL_SECRET_2026_V98Z"
LICENSE_FILE_PATH = os.path.join(settings.DATA_DIR, "license.json")

def generate_checksum(tier: str, seed: str) -> str:
    """Generate deterministic HMAC-like checksum for license verification."""
    raw = f"{tier}:{seed}:{LICENSE_SECRET}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()[:6].upper()

def verify_license_key(key: str) -> Dict[str, Any]:
    """
    Validates an offline license key format:
    Format: AIDA-[TIER]-[SEED]-[CHECKSUM]
    Example: AIDA-STD-9F3B2A1C-7E4A19
    """
    if not key or not isinstance(key, str):
        return {"valid": False, "tier": None, "message": "License key required."}
    
    clean_key = key.strip().upper().replace(" ", "")
    parts = clean_key.split("-")
    
    if len(parts) != 4 or parts[0] != "AIDA":
        return {"valid": False, "tier": None, "message": "Invalid license key format (Expected AIDA-XXXX-XXXX-XXXX)."}
    
    tier, seed, checksum = parts[1], parts[2], parts[3]
    
    if tier not in ["STD", "PRO", "ENT"]:
        return {"valid": False, "tier": None, "message": "Unrecognized license tier."}
    
    expected_checksum = generate_checksum(tier, seed)
    if checksum != expected_checksum:
        return {"valid": False, "tier": None, "message": "License signature mismatch or corrupted key."}
    
    tier_names = {
        "STD": "Standard Edition (Lifetime)",
        "PRO": "Professional Edition (Lifetime)",
        "ENT": "Enterprise Commercial License"
    }
    
    return {
        "valid": True,
        "tier": tier,
        "tier_name": tier_names.get(tier, "Commercial"),
        "key": clean_key,
        "message": f"Successfully activated {tier_names.get(tier)}!"
    }

def _atomic_json_dump(file_path: str, data: Any):
    """Safely persist JSON to disk using atomic rename to prevent corruption."""
    try:
        dir_name = os.path.dirname(file_path)
        os.makedirs(dir_name, exist_ok=True)
        temp_path = f"{file_path}.tmp"
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_path, file_path)
    except Exception as e:
        print(f"[Licensing Error] Failed atomic write to {file_path}: {e}")

TRIAL_USAGE_FILE_PATH = os.path.join(settings.DATA_DIR, "trial_usage.json")
MAX_TRIAL_DOCS = 1
MAX_TRIAL_QUERIES = 3

def get_trial_usage() -> Dict[str, int]:
    """Retrieve number of queries used during trial evaluation."""
    if os.path.exists(TRIAL_USAGE_FILE_PATH):
        try:
            with open(TRIAL_USAGE_FILE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return {"queries_used": int(data.get("queries_used", 0))}
        except Exception:
            pass
    return {"queries_used": 0}

def record_trial_query() -> bool:
    """Record query usage - unlimited in online cloud mode."""
    usage = get_trial_usage()
    usage["queries_used"] = usage.get("queries_used", 0) + 1
    _atomic_json_dump(TRIAL_USAGE_FILE_PATH, usage)
    return True

def can_upload_doc(current_doc_count: int) -> bool:
    """Allow unlimited uploads in online cloud mode."""
    return True

def get_current_license() -> Dict[str, Any]:
    """Retrieve activation state - fully unlocked for cloud evaluation."""
    usage = get_trial_usage()
    queries_used = usage.get("queries_used", 0)

    return {
        "is_licensed": True,
        "tier": "CLOUD_PRO",
        "tier_name": "Cloud Enterprise Edition",
        "license_key": "AIDA-CLOUD-UNLIMITED",
        "registered_to": "Developer / Recruiter Evaluation",
        "trial_queries_used": queries_used,
        "trial_queries_max": 99999,
        "trial_queries_remaining": 99999,
        "trial_docs_max": 9999,
        "is_trial_locked": False
    }

def save_license(key: str, registered_to: str = "Verified Customer") -> Dict[str, Any]:
    """Validates and persists a license key."""
    verification = verify_license_key(key)
    if not verification["valid"]:
        return verification
        
    _atomic_json_dump(LICENSE_FILE_PATH, {
        "license_key": verification["key"],
        "tier": verification["tier"],
        "registered_to": registered_to
    })
        
    return verification
