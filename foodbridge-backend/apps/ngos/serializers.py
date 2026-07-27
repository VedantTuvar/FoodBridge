from rest_framework import serializers
from .models import NGOProfile

class NGOProfileSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = NGOProfile
        fields = (
            'id', 'user', 'organization_name', 'registration_number', 
            'verification_status', 'verification_document_url', 
            'capacity_per_day', 'address', 'latitude', 'longitude', 
            'rating_avg', 'created_at'
        )
        read_only_fields = ('id', 'user', 'verification_status', 'rating_avg', 'created_at')

    def get_latitude(self, obj):
        return obj.location.y if obj.location else None

    def get_longitude(self, obj):
        return obj.location.x if obj.location else None

class NGOVerificationDocUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGOProfile
        fields = ('verification_document_url', 'registration_number')
