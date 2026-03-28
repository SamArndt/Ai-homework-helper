import logging
from apps.ai.openai_handler import OpenAIHandler
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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
    
class GetSolutionsView(AiView):
    http_method_names = ['get']
    def get(self, request):
        # Stubbed out to align with classify endpoint in source project
        # Consider removing if endpoint not required

        # Simulate delay in processing request
        try:
            result = OpenAIHandler.simulate_delay(200, 200, '[]')
            return Response(
                {
                    "message": result,
                    "data": '[]'
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.exception("Get-Solutions failed: %s", e)
            return Response(
                {
                    "error": "Internal Server Error",
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class GetStepsView(AiView):
    http_method_names = ['get']
    def get(self, request):
        # Stubbed out to align with classify endpoint in source project
        # Consider removing if endpoint not required

        # Simulate delay in processing request
        try:
            result = OpenAIHandler.simulate_delay(200, 200, '[]')
            return Response(
                {
                    "message": result,
                    "data": '[]'
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.exception("GetSteps failed: %s", e)
            return Response(
                {
                    "error": "Internal Server Error",
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ClassifyView(AiView):
    http_method_names = ['get']
    def get(self, request):
        # Stubbed out to align with classify endpoint in source project
        # Consider removing if endpoint not required

        # Simulate delay in processing request
        try:
            result = OpenAIHandler.simulate_delay(200, 200, '[]')
            return Response(
                {
                    "message": result,
                    "data": '[]'
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.exception("Classify failed: %s", e)
            return Response(
                {
                    "error": "Internal Server Error",
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
class MathProblemView(AiView):
    http_method_names = ['get']
    def get(self, request):
        # Validate request data
        try:
            query_params = request.query_params
            topics_param = query_params.get("topics", "")
            topic_ids = [t.strip() for t in topics_param.split(",") if t.strip()]

            logger.debug("Received topics: %s", topic_ids)
        except Exception as e:
            logger.exception("Error parsing topics: %s", e)
            return Response(
                {
                    "error": "Bad request",
                    "message": "Invalid 'topics' query parameter. Must be a comma-separated list of topic IDs.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Process request
        try:
            result = OpenAIHandler.generate_math_problem(topic_ids)
            logger.debug("Generated math problem: %s", result)
            return Response(
                {
                    "message": "OK",
                    "problem": result,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.exception("Math problem generation failed: %s", e)
            return Response(
                {
                    "error": "Internal Server Error",
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ExtractEquationView(AiView):
    http_method_names = ['post']
    def post(self, request, *args, **kwargs):
        # Validate request data
        data = request.data
        
        problem_text = data.get("problem")
        if not isinstance(problem_text, str) or not problem_text.strip():
            return Response(
                {
                    "error": "Bad request",
                    "message": "The 'problem' field is required and must be a non-empty string.",
                },
                status = status.HTTP_400_BAD_REQUEST
            )
        
        # Process request
        try:
            result = OpenAIHandler.extract_equation(problem_text)
            logger.debug("Extracted equation: %s", result)
            return Response(
                {
                    "message": "OK",
                    "response": result,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.exception("Extract equation failed: %s", e)
            return Response(
                {
                    "error": "OpenAI request failed",
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
                status = status.HTTP_400_BAD_REQUEST
            )
        
        # Process either image query or text query based on presence of image data
        try:
            if isinstance(image, str) and image.strip():
                output = OpenAIHandler.generate_from_image(
                    prompt=user_prompt.strip(),
                    image=image.strip(),
                )
            else:
                output = OpenAIHandler.generate_text(
                    prompt=user_prompt.strip(),
                )

            return Response(
                {
                    "message": "OK",
                    "response": output,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.exception("Query failed: %s", e)
            return Response(
                {
                    "error": "OpenAI request failed",
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
