from rest_framework import serializers
from apps.donations.serializers import DonationSerializer
from .models import Task, TaskLocationLog

class TaskSerializer(serializers.ModelSerializer):
    donation_detail = DonationSerializer(source='donation', read_only=True)
    ngo_name = serializers.SerializerMethodField()
    ngo_address = serializers.SerializerMethodField()
    ngo_latitude = serializers.SerializerMethodField()
    ngo_longitude = serializers.SerializerMethodField()
    donor_phone = serializers.SerializerMethodField()
    ngo_phone = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = (
            'id', 'donation', 'donation_detail', 'volunteer', 
            'ngo_name', 'ngo_address', 'ngo_latitude', 'ngo_longitude',
            'donor_phone', 'ngo_phone',
            'status', 'pickup_time', 'delivery_time', 
            'proof_image_url', 'otp_code', 'created_at'
        )
        read_only_fields = ('id', 'otp_code', 'created_at')

    def get_ngo_name(self, obj):
        if hasattr(obj.donation, 'claim') and obj.donation.claim:
            return obj.donation.claim.ngo.organization_name
        return "Local Food Bank / Shelter"

    def get_ngo_address(self, obj):
        if hasattr(obj.donation, 'claim') and obj.donation.claim:
            return obj.donation.claim.ngo.address
        return "123 Shelter Street, Downtown"

    def get_ngo_latitude(self, obj):
        if hasattr(obj.donation, 'claim') and obj.donation.claim and obj.donation.claim.ngo.location:
            return obj.donation.claim.ngo.location.y
        return (obj.donation.pickup_location.y + 0.015) if obj.donation.pickup_location else 37.7849

    def get_ngo_longitude(self, obj):
        if hasattr(obj.donation, 'claim') and obj.donation.claim and obj.donation.claim.ngo.location:
            return obj.donation.claim.ngo.location.x
        return (obj.donation.pickup_location.x + 0.020) if obj.donation.pickup_location else -122.4094

    def get_donor_phone(self, obj):
        return getattr(obj.donation.donor.user, 'phone_number', '+1-555-0192')

    def get_ngo_phone(self, obj):
        if hasattr(obj.donation, 'claim') and obj.donation.claim:
            return getattr(obj.donation.claim.ngo.user, 'phone_number', '+1-555-0144')
        return '+1-555-0144'

class ProofUploadSerializer(serializers.ModelSerializer):
    otp_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Task
        fields = ('proof_image_url', 'otp_code')

