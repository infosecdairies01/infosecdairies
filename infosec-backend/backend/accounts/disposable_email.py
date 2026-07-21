import os
import re

_DISPOSABLE_DOMAINS: set[str] | None = None


def _load_disposable_domains() -> set[str]:
    path = os.path.join(os.path.dirname(__file__), "disposable_email_domains.txt")
    domains: set[str] = set()
    try:
        with open(path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and not line.startswith("//"):
                    domains.add(line.lower())
    except FileNotFoundError:
        pass
    return domains


def get_disposable_domains() -> set[str]:
    global _DISPOSABLE_DOMAINS
    if _DISPOSABLE_DOMAINS is None:
        _DISPOSABLE_DOMAINS = _load_disposable_domains()
    return _DISPOSABLE_DOMAINS


def is_disposable_email(email: str) -> bool:
    if "@" not in email:
        return False
    domain = email.split("@", 1)[1].strip().lower()
    domains = get_disposable_domains()
    if domain in domains:
        return True
    if re.search(r"10?0?minut(es?|e)?mail|tempmail|temp[.-]?mail|guerrillamail|mailinator|yopmail|dispostable|throwaway|trashmail", domain):
        return True
    for sub in domain.split("."):
        if sub in ("mailinator", "guerrillamail", "yopmail", "temp-mail", "10minutemail"):
            return True
    return False
