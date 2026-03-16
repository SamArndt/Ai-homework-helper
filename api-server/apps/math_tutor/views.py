import os
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from openai import OpenAI
from .models import Topic, ChatMessage

# Create your views here.
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@api_view()
@permission_classes([permissions.IsAuthenticated])
def generate_math_problem(request):
    topic = Topic.objects.order_by('?').first()
    chat_message = ChatMessage.objects.get(slug="generate-math-problem")

    response = client.chat.completions.create(
        model=chat_message.llm_model,
        temperature=chat_message.temperature,
        messages=[
            {"role": "system", "content": chat_message.system_content},
            {"role": "user", "content": chat_message.user_content.format(topic=topic.value)},
        ]
    )


    return Response({"topic": topic.value, "problem": response.choices[0].message.content})
