from django.urls import path
from .views import PendingNGOVerificationsView, ApproveNGOView, RejectNGOView

urlpatterns = [
    path('verifications/pending/', PendingNGOVerificationsView.as_view(), name='admin-pending-verifications'),
    path('verifications/<uuid:pk>/approve/', ApproveNGOView.as_view(), name='admin-approve-ngo'),
    path('verifications/<uuid:pk>/reject/', RejectNGOView.as_view(), name='admin-reject-ngo'),
]
