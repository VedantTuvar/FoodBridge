from django.urls import path
from .views import (
    GlobalPlatformImpactView,
    AnalyticsChartsView,
    ReportGeneratorView,
    DemandPredictionView,
)

urlpatterns = [
    path('impact/', GlobalPlatformImpactView.as_view(), name='analytics-impact'),
    path('charts/', AnalyticsChartsView.as_view(), name='analytics-charts'),
    path('reports/', ReportGeneratorView.as_view(), name='analytics-reports'),
    path('predict-demand/', DemandPredictionView.as_view(), name='analytics-predict-demand'),
]
