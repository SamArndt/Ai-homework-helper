import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

class ClassroomView(APIView):
    def dispatch(self, request, *args, **kwargs):
        logger.info(
            "Request: %s %s | Data: %s",
            request.method,
            request.path,
            getattr(request, 'data', None)
        )
        return super().dispatch(request, *args, **kwargs)
    
    def http_method_not_allowed(self, request, *args, **kwargs):
        logger.warning(
            "Method not allowed: %s %s | Data: %s",
            request.method,
            request.path,
            getattr(request, 'data', None)
        )
        return super().http_method_not_allowed(request, *args, **kwargs)
