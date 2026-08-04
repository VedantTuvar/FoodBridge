import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
import django
django.setup()
from apps.accounts.services import UserService
from apps.donations.views import RecurringScheduleListCreateView
from rest_framework.test import APIRequestFactory

user, _ = UserService.get_or_create_user('+12025550179', full_name='Donor Without Profile', role='donor')
factory = APIRequestFactory()
request = factory.get('/api/v1/donations/recurring-schedules/')
request.user = user
view = RecurringScheduleListCreateView()
view.request = request
queryset = view.get_queryset()
print(queryset.count())
