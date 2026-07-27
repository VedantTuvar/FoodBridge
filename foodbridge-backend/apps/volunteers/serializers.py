from rest_framework import serializers
from .models import VolunteerProfile

class VolunteerProfileSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = VolunteerProfile
        fields = (
            'id', 'user', 'vehicle_type', 'is_available', 
            'latitude', 'longitude', 'rating_avg', 
            'total_deliveries', 'created_at'
        )
        read_only_fields = ('id', 'user', 'rating_avg', 'total_deliveries', 'created_at')

    def get_latitude(self, obj):
        return obj.current_location.y if obj.current_location else None

    def get_longitude(self, obj):
        return obj.current_location.x if obj.current_location else None

class AvailabilityToggleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerProfile
        fields = ('is_available',)
