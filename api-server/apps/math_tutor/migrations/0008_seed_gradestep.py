# Generated migration — seed grade-step ChatMessage
from django.db import migrations


def seed_grade_step(apps, schema_editor):
    ChatMessage = apps.get_model('math_tutor', 'ChatMessage')
    ChatMessage.objects.update_or_create(
        slug="grade-step",
        defaults={
            "llm_model": "gpt-4o-mini",
            "temperature": 0.1,
            "system_content": (
                "You are a strict but fair algebra tutor grading a single step of a student's work. "
                "Always return valid JSON only — no markdown, no preamble."
            ),
            "user_content": '''You are grading one step of a student's algebra solution.

Problem: "{problem}"

This step's instruction: "{instruction}"
Expected checkpoint (correct answer for this step): "{checkpoint}"
Student's answer for this step: "{student_answer}"

Decide whether the student's answer is correct for this step.
- Be flexible with equivalent forms (e.g. "6y + 4y >= 120" and "10y >= 120" are NOT equivalent — one is unsimplified).
- The student's answer must match the checkpoint's mathematical meaning for this specific step.
- If the student skipped ahead to a later step, mark it incorrect for this step.

Return ONLY this JSON (no markdown, no extra text):
{{"pass": true, "explanation": "One sentence explaining why correct or what is wrong."}}
''',
        }
    )

class Migration(migrations.Migration):

    dependencies = [
        ("math_tutor", "0007_seed_solvemessage"),
    ]

    operations = [
        migrations.RunPython(seed_grade_step),
    ]
