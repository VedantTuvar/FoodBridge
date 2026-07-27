from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    OTPSendView, OTPVerifyView, EmailPasswordLoginView, RegisterUserView,
    ForgotPasswordView, ResetPasswordView, VerifyEmailView, LogoutView,
    CurrentUserView
)

urlpatterns = [
    path('otp/send/', OTPSendView.as_view(), name='auth-otp-send'),
    path('otp/verify/', OTPVerifyView.as_view(), name='auth-otp-verify'),
    path('login/', EmailPasswordLoginView.as_view(), name='auth-login-email'),
    path('register/', RegisterUserView.as_view(), name='auth-register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='auth-forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='auth-reset-password'),
    path('verify-email/', VerifyEmailView.as_view(), name='auth-verify-email'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', CurrentUserView.as_view(), name='auth-current-user'),
]
