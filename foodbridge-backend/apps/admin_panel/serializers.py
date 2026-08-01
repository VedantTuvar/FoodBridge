from rest_framework import serializers
from apps.accounts.models import User
from apps.ngos.models import NGOProfile
from apps.donors.models import DonorProfile
from apps.volunteers.models import VolunteerProfile
from .models import AuditLog, Dispute, Complaint, PlatformSetting, SystemAlert

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone_number', 'email', 'full_name', 'role', 'is_verified', 'is_active', 'created_at']

class NGOVerificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = NGOProfile
        fields = '__all__'

class DonorVerificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DonorProfile
        fields = '__all__'

class VolunteerAdminSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = VolunteerProfile
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.full_name', read_only=True, default='System')

    class Meta:
        model = AuditLog
        fields = '__all__'

class DisputeSerializer(serializers.ModelSerializer):
    disputer_name = serializers.CharField(source='disputer.full_name', read_only=True)
    respondent_name = serializers.CharField(source='respondent.full_name', read_only=True, default='N/A')

    class Meta:
        model = Dispute
        fields = '__all__'

class ComplaintSerializer(serializers.ModelSerializer):
    complainant_name = serializers.CharField(source='complainant.full_name', read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'

class PlatformSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSetting
        fields = '__all__'

class SystemAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemAlert
        fields = '__all__'
