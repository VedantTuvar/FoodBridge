from rest_framework import serializers
from .models import DonorProfile

class DonorProfileSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = DonorProfile
        fields = (
            'id', 'user', 'organization_name', 'donor_type', 
            'address', 'latitude', 'longitude', 'rating_avg', 
            'notify_email', 'notify_sms', 'notify_push', 'created_at'
        )
        read_only_fields = ('id', 'user', 'rating_avg', 'created_at')

    def get_latitude(self, obj):
        return obj.location.y if obj.location else None

    def get_longitude(self, obj):
        return obj.location.x if obj.location else None

class DonorSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = ('organization_name', 'donor_type', 'address', 'notify_email', 'notify_sms', 'notify_push')
