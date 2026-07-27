from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.utils import timezone
from common.permissions import IsVolunteer
from .models import Task
from .serializers import TaskSerializer, ProofUploadSerializer

class AvailableTasksListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_queryset(self):
        return Task.objects.filter(volunteer__isnull=True, status='assigned')

class AcceptTaskView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        if task.volunteer is not None:
            return Response({
                'success': False,
                'message': 'Task has already been accepted by another volunteer.'
            }, status=status.HTTP_400_BAD_REQUEST)

        task.volunteer = request.user.volunteer_profile
        task.status = 'assigned'
        task.save()
        return Response({
            'success': True,
            'message': 'Task accepted successfully.',
            'task': TaskSerializer(task).data
        })

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

        return Response({
            'success': True,
            'message': 'Delivery proof uploaded and task confirmed closed.',
            'task': TaskSerializer(task).data
        })
