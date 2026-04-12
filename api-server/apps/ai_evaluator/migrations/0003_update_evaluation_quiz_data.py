# Generated migration — seed grade-step ChatMessage
from django.db import migrations


def seed_evaluation_quiz(apps, schema_editor):
    ChatMessage = apps.get_model('math_tutor', 'ChatMessage')
    ChatMessage.objects.update_or_create(
        slug="generate-evaluation-quiz",
        defaults={
            "llm_model": "gpt-4o-mini",
            "temperature": 0.7,
            "system_content": (
              "You are a knowledgeable algebra tutor generating a short quiz to assess a student's understanding of a given topic. "
              "Always return valid JSON only — no markdown, no preamble."
            ),
            "user_content": '''You are evaluating a student's algebra skills based on a given topic.
Topic: "{topic}"

Before generating the quiz, provide key learning context about the topic. Then generate a 6-question quiz to gauge the student's understanding.

Requirements for the quiz:
- Generate exactly 6 questions that progress in difficulty: 2 easy, 2 medium, 2 hard
- Mix question types to test TRUE understanding:
  * Conceptual/definitional questions (e.g., "What is a variable?", "What does it mean to solve an equation?")
  * Procedural questions that require showing steps
  * Application questions set in real-world or abstract contexts
  * "Why" or "explain" questions that test reasoning, not just calculation
- Avoid questions that are purely computational with one obvious method
- Questions should feel like a teacher probing whether a student truly understands — not just memorized steps
- Include the correct answer and a brief explanation for each question

Return ONLY this JSON (no markdown, no extra text):
{{
  "facts": "A brief summary of the key facts about this topic",
  "strategies": "The key strategies or methods used to solve problems related to this topic",
  "rationale": "Why this topic is important and how it connects to broader algebra concepts",
  "quiz": [
    {{
      "question_number": 1,
      "difficulty": "easy",
      "type": "conceptual",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }},
    {{
      "question_number": 2,
      "difficulty": "easy",
      "type": "procedural",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }},
    {{
      "question_number": 3,
      "difficulty": "medium",
      "type": "conceptual",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }},
    {{
      "question_number": 4,
      "difficulty": "medium",
      "type": "application",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }},
    {{
      "question_number": 5,
      "difficulty": "hard",
      "type": "reasoning",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }},
    {{
      "question_number": 6,
      "difficulty": "hard",
      "type": "application",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }}
  ]
}}
''',
        }
    )

class Migration(migrations.Migration):
    dependencies = [
        ('ai_evaluator', '0002_update_evaluation_quiz_data'),
    ]

    operations = [
        migrations.RunPython(seed_evaluation_quiz),
    ]
