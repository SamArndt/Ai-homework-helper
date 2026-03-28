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

# ClassesView
# Handles the 'classes' endpoint, which handles requests related to viewing, editing etc. classes
# Classes are groups of students assigned to a teacher
class ClassesView(ClassroomView):
    http_method_names=[]
    pass

# EnrolledView
# Handles the 'enrolled' endpoint, which handles requests relating to assigning students to a class
class EnrolledView(ClassroomView):
    http_method_names=[]
    pass

# StaffView
# Handles the 'staff' endpoint, which handles requests relating to assigning staff to a class
# Staff assigned to a class can pull student reports related to that class
class StaffView(ClassroomView):
    http_method_names=[]
    pass

# ReportView
# Handles te 'report' endpoint
# Report endpoint handles receiving generated reports for a student, requests to pull reports
# by an assigned teacher
class ReportView(ClassroomView):
    http_method_names=[]
    pass