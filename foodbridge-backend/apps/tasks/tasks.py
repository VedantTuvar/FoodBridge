from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Task
import logging

logger = logging.getLogger(__name__)

@shared_task
def reassign_stale_tasks():
    # Detect tasks assigned to a volunteer > 20 mins ago without pickup
    cutoff = timezone.now() - timedelta(minutes=20)
    stale_tasks = Task.objects.filter(
        status='assigned',
        volunteer__isnull=False,
        created_at__lt=cutoff
    )
    
    reassigned_count = 0
    for task in stale_tasks:
        task.volunteer = None
        task.save()
        reassigned_count += 1

    if reassigned_count > 0:
        logger.info(f"Re-opened {reassigned_count} stale volunteer tasks.")
    return reassigned_count
