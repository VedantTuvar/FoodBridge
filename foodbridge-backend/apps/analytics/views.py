from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import AnalyticsService

class GlobalPlatformImpactView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        stats = AnalyticsService.get_global_statistics()
        return Response({
            'success': True,
            'impact': stats
        })

class AnalyticsChartsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        charts = AnalyticsService.get_chart_data()
        return Response({
            'success': True,
            'charts': charts
        })

class ReportGeneratorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        report_type = request.data.get('report_type', 'donation')
        parameters = request.data.get('parameters', {})
        report = AnalyticsService.generate_report(report_type, parameters, request.user)

        return Response({
            'success': True,
            'report': {
                'id': str(report.id),
                'title': report.title,
                'report_type': report.report_type,
                'summary_data': report.summary_data,
                'format': report.format,
                'created_at': report.created_at
            }
        })

class DemandPredictionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        district = request.data.get('district', 'Central District')
        day_of_week = request.data.get('day_of_week', 'Friday')
        prediction = AnalyticsService.predict_demand(district, day_of_week)

        return Response({
            'success': True,
            'prediction': prediction
        })
