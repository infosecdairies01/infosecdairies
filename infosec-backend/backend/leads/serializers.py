from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'course_name', 'name', 'email', 'phone', 'country', 'city', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']
