from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.utils import timezone
from common.permissions import IsVolunteer
from common.utils import create_geography_point
from .models import Task, TaskLocationLog
from .serializers import TaskSerializer, ProofUploadSerializer

class AvailableTasksListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_queryset(self):
        return Task.objects.filter(volunteer__isnull=True, status='assigned')

class ActiveTaskView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get(self, request):
        profile = getattr(request.user, 'volunteer_profile', None)
        if not profile:
            return Response({'active_task': None})

        task = Task.objects.filter(
            volunteer=profile,
            status__in=['assigned', 'picked_up', 'in_transit']
        ).first()

        if not task:
            return Response({'active_task': None})

        return Response({'active_task': TaskSerializer(task).data})

class TaskHistoryListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_queryset(self):
        profile = getattr(self.request.user, 'volunteer_profile', None)
        if not profile:
            return Task.objects.none()
        return Task.objects.filter(
            volunteer=profile,
            status__in=['delivered', 'confirmed']
        ).order_by('-created_at')

class AcceptTaskView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        volunteer_profile = getattr(request.user, 'volunteer_profile', None)
        if volunteer_profile is None:
            return Response({'success': False, 'message': 'Volunteer profile not found.'}, status=status.HTTP_400_BAD_REQUEST)

        if task.volunteer is not None and task.volunteer != volunteer_profile:
            return Response({
                'success': False,
                'message': 'Task has already been accepted by another volunteer.'
            }, status=status.HTTP_400_BAD_REQUEST)

        task.volunteer = volunteer_profile
        task.status = 'assigned'
        task.save()
        return Response({
            'success': True,
            'message': 'Task accepted successfully.',
            'task': TaskSerializer(task).data
        })

class RejectTaskView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            reason = request.data.get('reason', 'Volunteer declined task')
            # Clear assignment if was assigned to this volunteer
            if task.volunteer == getattr(request.user, 'volunteer_profile', None):
                task.volunteer = None
                task.save()
            return Response({
                'success': True,
                'message': f'Task declined ({reason}). Re-queued for available dispatch.'
            })
        except Task.DoesNotExist:
            return Response({'success': False, 'message': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

class LogTaskLocationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            lat = float(request.data.get('latitude', 0))
            lng = float(request.data.get('longitude', 0))
            
            point = create_geography_point(lat, lng)
            TaskLocationLog.objects.create(task=task, location=point)

            # Update volunteer profile current location
            profile = getattr(request.user, 'volunteer_profile', None)
            if profile:
                profile.current_location = point
                profile.save(update_fields=['current_location'])

            return Response({'success': True, 'message': 'GPS ping recorded successfully.'})
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateTaskStatusView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        new_status = request.data.get('status')

        valid_transitions = {
            'assigned': 'picked_up',
            'picked_up': 'in_transit',
            'in_transit': 'delivered'
        }

        if valid_transitions.get(task.status) != new_status:
            return Response({
                'success': False,
                'message': f'Invalid status transition from {task.status} to {new_status}'
            }, status=status.HTTP_400_BAD_REQUEST)

        task.status = new_status
        if new_status == 'picked_up':
            task.pickup_time = timezone.now()
            task.donation.status = 'picked_up'
            task.donation.save()
        elif new_status == 'in_transit':
            task.donation.status = 'in_transit'
            task.donation.save()
        elif new_status == 'delivered':
            task.delivery_time = timezone.now()
            task.donation.status = 'delivered'
            task.donation.save()
            # Update volunteer profile stats
            if task.volunteer:
                task.volunteer.total_deliveries += 1
                task.volunteer.save(update_fields=['total_deliveries'])

        task.save()
        return Response({'success': True, 'task': TaskSerializer(task).data})

class UploadTaskProofView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = ProofUploadSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        serializer = self.get_serializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(status='confirmed')

        task.donation.status = 'confirmed'
        task.donation.save()

        # Update volunteer deliveries count if not updated
        if task.volunteer:
            task.volunteer.total_deliveries = max(task.volunteer.total_deliveries, 1)
            task.volunteer.save(update_fields=['total_deliveries'])

        return Response({
            'success': True,
            'message': 'Delivery proof uploaded and task confirmed closed.',
            'task': TaskSerializer(task).data
        })

