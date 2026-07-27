from django.urls import path
from .views import AvailableTasksListView, AcceptTaskView, UpdateTaskStatusView, UploadTaskProofView

urlpatterns = [
    path('nearby/', AvailableTasksListView.as_view(), name='task-nearby'),
    path('<uuid:pk>/accept/', AcceptTaskView.as_view(), name='task-accept'),
    path('<uuid:pk>/status/', UpdateTaskStatusView.as_view(), name='task-status-update'),
    path('<uuid:pk>/proof/', UploadTaskProofView.as_view(), name='task-proof-upload'),
]
