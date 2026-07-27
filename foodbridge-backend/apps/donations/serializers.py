from rest_framework import serializers
from common.utils import calculate_estimated_meals, create_geography_point
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField(write_only=True)
    longitude = serializers.FloatField(write_only=True)
    pickup_latitude = serializers.SerializerMethodField(read_only=True)
    pickup_longitude = serializers.SerializerMethodField(read_only=True)
    donor_name = serializers.CharField(source='donor.organization_name', read_only=True)

    class Meta:
        model = Donation
        fields = (
            'id', 'donor', 'donor_name', 'food_type', 'quantity_kg', 
            'estimated_meals', 'perishability_window', 'pickup_address', 
            'latitude', 'longitude', 'pickup_latitude', 'pickup_longitude', 
            'status', 'images', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'donor', 'estimated_meals', 'status', 'created_at', 'updated_at')

    def get_pickup_latitude(self, obj):
        return obj.pickup_location.y if obj.pickup_location else None

    def get_pickup_longitude(self, obj):
        return obj.pickup_location.x if obj.pickup_location else None

    def create(self, validated_data):
        lat = validated_data.pop('latitude')
        lng = validated_data.pop('longitude')
        validated_data['pickup_location'] = create_geography_point(lat, lng)
        validated_data['estimated_meals'] = calculate_estimated_meals(validated_data['quantity_kg'])
        return super().create(validated_data)
