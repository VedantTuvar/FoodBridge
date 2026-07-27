import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

app = Celery('foodbridge')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check-expired-donations-every-minute': {
        'task': 'apps.donations.tasks.check_expired_donations',
        'schedule': 60.0,
    },
    'reassign-stale-tasks-every-5-minutes': {
        'task': 'apps.tasks.tasks.reassign_stale_tasks',
        'schedule': 300.0,
    },
    'aggregate-daily-impact-at-midnight': {
        'task': 'apps.analytics.tasks.aggregate_daily_impact',
        'schedule': crontab(hour=0, minute=0),
    },
}
