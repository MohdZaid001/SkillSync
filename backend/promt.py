def create_resume_prompt(resume_text, job_description):

    return f"""
You are an AI resume analyzer.

Compare the resume with the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY valid JSON in this exact structure:

{{
    "overall_score": 0,
    "technical_score": 0,
    "experience_score": 0,
    "keyword_score": 0,

    "missing_skills": [
        "skill 1",
        "skill 2",
        "skill 3"
    ],

    "strengths": [
        "strength 1",
        "strength 2",
        "strength 3"
    ],

    "ai_summary": "Short explanation of the match.",

    "ai_recommendation": "What the candidate should improve.",

    "improvements": [
        "improvement 1",
        "improvement 2",
        "improvement 3"
    ]
}}

Rules:
- Scores must be between 0 and 100.
- Missing skills should come from important requirements in the JD.
- Keep responses concise.
- Do not invent experience that is not present in the resume.
"""