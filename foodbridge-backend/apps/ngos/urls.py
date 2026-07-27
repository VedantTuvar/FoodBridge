from django.urls import path
from .views import NGOProfileView, UploadNGOVerificationDocsView

urlpatterns = [
    path('profile/', NGOProfileView.as_view(), name='ngo-profile'),
    path('verification-docs/', UploadNGOVerificationDocsView.as_view(), name='ngo-verification-docs'),
]
