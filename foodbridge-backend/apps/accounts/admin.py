from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPCode, PasswordResetToken, EmailVerificationToken

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('phone_number', 'email', 'full_name', 'role', 'is_phone_verified', 'is_email_verified', 'is_verified', 'is_active', 'created_at')
    list_filter = ('role', 'is_phone_verified', 'is_email_verified', 'is_verified', 'is_active')
    search_fields = ('phone_number', 'full_name', 'email')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'email', 'role', 'is_phone_verified', 'is_email_verified', 'is_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'code', 'is_used', 'attempts', 'expires_at', 'created_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('phone_number', 'code')

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'is_used', 'expires_at', 'created_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__email', 'user__phone_number', 'token')

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'is_used', 'expires_at', 'created_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__email', 'token')
