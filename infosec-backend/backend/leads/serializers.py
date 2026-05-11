from django.utils.html import strip_tags
from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'course_name', 'name', 'email', 'phone', 'country', 'city', 'message', 'status', 'created_at', 'user']
        read_only_fields = ['id', 'status', 'created_at', 'user']

    def _no_html(self, field, value):
        if not value:
            return value
        raw = str(value).strip()
        cleaned = strip_tags(raw).strip()
        if cleaned != raw:
            raise serializers.ValidationError(f"Invalid characters in {field}.")
        return cleaned

    def validate_name(self, value):
        return self._no_html("name", value)

    def validate_course_name(self, value):
        return self._no_html("course_name", value)

    def validate_message(self, value):
        return self._no_html("message", value)

    def validate_country(self, value):
        return self._no_html("country", value)

    def validate_city(self, value):
        return self._no_html("city", value)

    def validate_phone(self, value):
        return self._no_html("phone", value)
