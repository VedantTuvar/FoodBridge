from rest_framework import serializers
from apps.donations.serializers import DonationSerializer
from .models import Task, TaskLocationLog

class TaskSerializer(serializers.ModelSerializer):
    donation_detail = DonationSerializer(source='donation', read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'donation', 'donation_detail', 'volunteer', 
            'status', 'pickup_time', 'delivery_time', 
            'proof_image_url', 'otp_code', 'created_at'
        )
        read_only_fields = ('id', 'otp_code', 'created_at')

class ProofUploadSerializer(serializers.ModelSerializer):
    otp_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Task
        fields = ('proof_image_url', 'otp_code')
