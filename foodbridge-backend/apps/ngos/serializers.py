from rest_framework import serializers
from common.utils import create_geography_point
from .models import NGOProfile, NGOFoodRequest

class NGOProfileSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = NGOProfile
        fields = (
            'id', 'user', 'organization_name', 'registration_number', 
            'verification_status', 'verification_document_url', 'rejection_reason',
            'capacity_per_day', 'address', 'latitude', 'longitude', 'rating_avg',
            'notify_email', 'notify_sms', 'notify_push', 'created_at'
        )
        read_only_fields = ('id', 'user', 'verification_status', 'rejection_reason', 'rating_avg', 'created_at')

    def get_latitude(self, obj):
        return obj.location.y if obj.location else None

    def get_longitude(self, obj):
        return obj.location.x if obj.location else None

class NGOFoodRequestSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField(write_only=True)
    longitude = serializers.FloatField(write_only=True)
    ngo_name = serializers.CharField(source='ngo.organization_name', read_only=True)

    class Meta:
        model = NGOFoodRequest
        fields = (
            'id', 'ngo', 'ngo_name', 'title', 'food_category', 
            'quantity_meals_needed', 'urgency_level', 'address', 
            'latitude', 'longitude', 'is_fulfilled', 'created_at'
        )
        read_only_fields = ('id', 'ngo', 'created_at')

    def create(self, validated_data):
        lat = validated_data.pop('latitude')
        lng = validated_data.pop('longitude')
        validated_data['location'] = create_geography_point(lat, lng)
        return super().create(validated_data)
