from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import (
    OTPSendSerializer, OTPVerifySerializer, EmailPasswordLoginSerializer,
    RegisterUserSerializer, ForgotPasswordSerializer, ResetPasswordSerializer,
    EmailVerificationSerializer, LogoutSerializer, UserProfileSerializer
)
from .services import (
    OTPService, UserService, AuthService, PasswordResetService, EmailVerificationService
)

class OTPSendView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone_number']

        otp_record = OTPService.generate_and_send_otp(phone)

        return Response({
            'success': True,
            'message': f'OTP code sent successfully to {phone}.',
            'dev_otp': otp_record.code
        }, status=status.HTTP_200_OK)

class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone_number']
        code = serializer.validated_data['otp_code']

        is_valid, message = OTPService.verify_otp(phone, code)

        if not is_valid:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)

        user, created = UserService.get_or_create_user(phone)
        user.is_phone_verified = True
        user.is_verified = True
        user.save(update_fields=['is_phone_verified', 'is_verified'])

        tokens = AuthService.issue_tokens(user)

        return Response({
            'success': True,
            'user': UserProfileSerializer(user).data,
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token'],
            'is_new_user': created
        }, status=status.HTTP_200_OK)

class EmailPasswordLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailPasswordLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identity = serializer.validated_data['identity']
        password = serializer.validated_data['password']

        user, message = AuthService.authenticate_email_or_phone(identity, password)

        if not user:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_401_UNAUTHORIZED)

        tokens = AuthService.issue_tokens(user)

        return Response({
            'success': True,
            'user': UserProfileSerializer(user).data,
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token']
        }, status=status.HTTP_200_OK)

class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            user = UserService.register_user(
                full_name=data['full_name'],
                phone_number=data['phone_number'],
                email=data.get('email'),
                password=data['password'],
                role=data.get('role', 'donor')
            )
            tokens = AuthService.issue_tokens(user)

            return Response({
                'success': True,
                'message': 'Account registered successfully.',
                'user': UserProfileSerializer(user).data,
                'access_token': tokens['access_token'],
                'refresh_token': tokens['refresh_token']
            }, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({
                'success': False,
                'message': str(exc)
            }, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identity = serializer.validated_data['identity']

        success, result_or_token = PasswordResetService.request_password_reset(identity)

        return Response({
            'success': True,
            'message': 'If an account exists, a password reset token has been issued.',
            'dev_reset_token': result_or_token if success else None
        }, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        success, message = PasswordResetService.reset_password(token, new_password)

        if not success:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'success': True,
            'message': message
        }, status=status.HTTP_200_OK)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']

        success, message = EmailVerificationService.verify_email(token)

        if not success:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'success': True,
            'message': message
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh_token = serializer.validated_data['refresh_token']

        success, message = AuthService.logout_token(refresh_token)

        return Response({
            'success': success,
            'message': message
        }, status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response({'success': True, 'user': serializer.data})
