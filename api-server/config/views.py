from django.http import JsonResponse


def api_root(request):
    return JsonResponse({"message": "AI Homework Helper API"})
