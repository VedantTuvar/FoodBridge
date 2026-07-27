from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class OTPSendSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    otp_code = serializers.CharField(max_length=6)

class EmailPasswordLoginSerializer(serializers.Serializer):
    identity = serializers.CharField(max_length=255, help_text="Email or Phone Number")
    password = serializers.CharField(max_length=128, write_only=True)

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=('donor', 'ngo', 'volunteer', 'corporate'))

    class Meta:
        model = User
        fields = ('id', 'phone_number', 'email', 'full_name', 'password', 'role', 'created_at')

class ForgotPasswordSerializer(serializers.Serializer):
    identity = serializers.CharField(max_length=255, help_text="Email or Phone Number")

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=100)
    new_password = serializers.CharField(max_length=128, min_length=8)

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=100)

class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'phone_number', 'email', 'full_name', 'role', 
            'is_phone_verified', 'is_email_verified', 'is_verified', 
            'created_at'
        )
        read_only_fields = ('id', 'phone_number', 'role', 'is_phone_verified', 'is_email_verified', 'is_verified', 'created_at')
