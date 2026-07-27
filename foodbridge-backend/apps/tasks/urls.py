from django.urls import path
from .views import (
    AvailableTasksListView,
    ActiveTaskView,
    TaskHistoryListView,
    AcceptTaskView,
    RejectTaskView,
    LogTaskLocationView,
    UpdateTaskStatusView,
    UploadTaskProofView,
)

urlpatterns = [
    path('nearby/', AvailableTasksListView.as_view(), name='task-nearby'),
    path('active/', ActiveTaskView.as_view(), name='task-active'),
    path('history/', TaskHistoryListView.as_view(), name='task-history'),
    path('<uuid:pk>/accept/', AcceptTaskView.as_view(), name='task-accept'),
    path('<uuid:pk>/reject/', RejectTaskView.as_view(), name='task-reject'),
    path('<uuid:pk>/location/', LogTaskLocationView.as_view(), name='task-location'),
    path('<uuid:pk>/status/', UpdateTaskStatusView.as_view(), name='task-status-update'),
    path('<uuid:pk>/proof/', UploadTaskProofView.as_view(), name='task-proof-upload'),
]

