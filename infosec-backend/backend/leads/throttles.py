from rest_framework.throttling import SimpleRateThrottle


class LeadCreateIPRateThrottle(SimpleRateThrottle):
    """Throttle lead/contact form submissions per IP address."""

    scope = "leads_create_ip"

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        return self.cache_format % {"scope": self.scope, "ident": ident}
