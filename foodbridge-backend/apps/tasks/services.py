from django.utils import timezone
from .models import Task, TaskLocationLog
from common.utils import create_geography_point

class TaskService:
    @staticmethod
    def accept_task(task_id, volunteer_profile):
        task = Task.objects.get(id=task_id)
        if task.volunteer is not None:
            raise ValueError("Task has already been accepted by another volunteer.")

        task.volunteer = volunteer_profile
        task.status = 'assigned'
        task.save(update_fields=['volunteer', 'status'])
        return task

    @staticmethod
    def update_task_status(task, new_status):
        valid_transitions = {
            'assigned': 'picked_up',
            'picked_up': 'in_transit',
            'in_transit': 'delivered'
        }

        if valid_transitions.get(task.status) != new_status:
            raise ValueError(f"Invalid status transition from {task.status} to {new_status}")

        task.status = new_status
        if new_status == 'picked_up':
            task.pickup_time = timezone.now()
            task.donation.status = 'picked_up'
            task.donation.save(update_fields=['status'])
        elif new_status == 'in_transit':
            task.donation.status = 'in_transit'
            task.donation.save(update_fields=['status'])
        elif new_status == 'delivered':
            task.delivery_time = timezone.now()
            task.donation.status = 'delivered'
            task.donation.save(update_fields=['status'])

        task.save()
        return task

    @staticmethod
    def upload_proof_and_confirm(task, proof_image_url, otp_code=None):
        if task.otp_code and otp_code and task.otp_code != otp_code:
            raise ValueError("Invalid delivery verification OTP code.")

        task.proof_image_url = proof_image_url
        task.status = 'confirmed'
        task.save(update_fields=['proof_image_url', 'status'])

        task.donation.status = 'confirmed'
        task.donation.save(update_fields=['status'])

        if task.volunteer:
            task.volunteer.total_deliveries += 1
            task.volunteer.save(update_fields=['total_deliveries'])

        return task

    @staticmethod
    def log_location(task, latitude, longitude):
        location = create_geography_point(latitude, longitude)
        return TaskLocationLog.objects.create(task=task, location=location)
