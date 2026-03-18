import logging
from rest_framework.views import APIView
from rest_framework.response import Response

logger = logging.getLogger(__name__)

class AiView(APIView):
    def dispatch(self, request, *args, **kwargs):
        logger.info(
            "Request: %s %s | Data: %s",
            request.method,
            request.path,
            getattr(request, "data", None)
        )
        return super().dispatch(request, *args, **kwargs)

    def http_method_not_allowed(self, request, *args, **kwargs):
        logger.warning(
            "Method Not Allowed: %s %s | Data: %s",
            request.method,
            request.path,
            getattr(request, "data", None)
        )
        return super().http_method_not_allowed(request, *args, **kwargs)
    
# class GetSolutionsView(AiView):
#     def get(self, request):
#         return Response({"message": "Hello from the Get Steps view!"})

# class GetStepsView(AiView):
#     def get(self, request):
#         return Response({"message": "Hello from the Get Steps view!"})

# class ClassifyView(AiView):
#     def get(self, request):
#         return Response({"message": "Hello from the Classify view!"})
    
# class MathProblemView(AiView):
#     def get(self, request):
#         return Response({"message": "Hello from the Get Steps view!"})

# class ExtractEquationView(AiView):
#     def get(self, request):
#         return Response({"message": "Hello from the Get Steps view!"})

class QueryView(AiView):
    http_method_names = ['post']
    def post(self, request, *args, **kwargs):
        # Validate request data
        data = request.data
        user_prompt = data.get("prompt")
        image = data.get("image")

        if not isinstance(user_prompt, str) or not user_prompt.strip():
            return Response(
                {
                    "error": "Bad request",
                    "message": "The 'prompt' field is required and must be a non-empty string.",
                },
                status = 400
            )
        
        # Process either image query or text query based on presence of image data
        if isinstance(image, str) and image.strip():
           # image flow
           pass
        else:
            # text flow
            pass

        return Response({"message": "Data received", "data": data})
