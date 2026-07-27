from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            'success': False,
            'status_code': response.status_code,
            'error': {
                'code': getattr(exc, 'default_code', 'error'),
                'detail': response.data
            }
        }
        response.data = custom_data
    else:
        logger.exception("Unhandled server exception occurred: %s", exc)
        response = Response({
            'success': False,
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'error': {
                'code': 'internal_server_error',
                'detail': 'An unexpected error occurred on the server.'
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
