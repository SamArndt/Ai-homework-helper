# Generated migration — seed grade-step ChatMessage
from django.db import migrations


def seed_exam_generator_data(apps, schema_editor):
    ChatMessage = apps.get_model('math_tutor', 'ChatMessage')
    ChatMessage.objects.update_or_create(
        slug="generate_practice_exam",
        defaults={
            "llm_model": "gpt-4o-mini",
            "temperature": 0.2,
            "system_content": (
              "You are a specialized Standardized Exam Designer. Your task is to generate realistic, high-fidelity practice exams for any professional or academic topic. You must adhere strictly to valid JSON output."
            ),
            "user_content": '''Generate a comprehensive practice exam for: "{topic}".
The exam must mimic the structure, tone, and difficulty of a real-world certification or professional board (e.g., Maryland Bar Exam, MCAT, CPA, etc.).

Requirements:
- Length: Mirror real-world exam standards.
- Question Types: Distribute among Multiple Choice (select 1 of 4), Multiple Select (select 2 of 6), True/False, and complex Essay/Short Answer questions.
- High Fidelity: For professional topics like Law or Medicine, use formal "fact patterns" or scenarios that the questions reference.
- Formatting: Do NOT include answers or explanations.

Return ONLY this JSON structure:
{{
  "exam_title": "Official-style practice exam for {topic}",
  "metadata": {{
    "total_questions": number of questions",
    "exam_structure": "Standardized professional format",
    "intended_difficulty": "Advanced/Professional"
  }},
  "exam_body": [
    {{
      "id": 1,
      "type": "multiple_choice",
      "prompt": "Detailed scenario or question text here...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
    }},
    {{
      "id": 2,
      "type": "integrated_set",
      "scenario": "A detailed common fact pattern used for multiple questions...",
      "sub_questions": [
        {{
          "id": "2a",
          "type": "short_answer",
          "prompt": "Specific question based on the scenario above."
        }},
        {{
          "id": "2b",
          "type": "multiple_select",
          "prompt": "Choose the TWO best options...",
          "options": ["1) ...", "2) ...", "3) ...", "4) ...", "5) ...", "6) ..."]
        }}
      ]
    }},
    {{
      "id": 3,
      "type": "true_false",
      "prompt": "Standard statement for validation.",
      "options": ["True", "False"]
    }}
  ]
}}
''',
        }
    )

class Migration(migrations.Migration):
    dependencies = [
        ('ai_evaluator', '0004_seed_check_evaluation_answers'),
    ]

    operations = [
        migrations.RunPython(seed_exam_generator_data),
    ]
