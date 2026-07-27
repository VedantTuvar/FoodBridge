import uuid
import time
import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

logger = logging.getLogger(__name__)

class CustomRequestIDMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
        request.request_id = request_id

    def process_response(self, request, response):
        if hasattr(request, 'request_id'):
            response['X-Request-ID'] = request.request_id
        return response

class APILoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            logger.info(
                "API Request: %s %s | Status: %s | Duration: %.3fs | RequestID: %s",
                request.method,
                request.path,
                response.status_code,
                duration,
                getattr(request, 'request_id', 'N/A')
            )
        return response

class GlobalExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.error(
            "Global Exception intercepted: %s on path %s",
            exception,
            request.path,
            exc_info=True
        )
        return JsonResponse({
            'success': False,
            'status_code': 500,
            'error': {
                'code': 'internal_server_error',
                'detail': 'A server error occurred. Please try again later.'
            }
        }, status=500)
