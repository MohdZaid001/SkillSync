import os
import json
from promt import create_resume_prompt

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pypdf import PdfReader
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SkillSync API")


# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# GEMINI KA SYSTEM

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found")

client = genai.Client(api_key=GEMINI_API_KEY)


# HOME only for checkup iss running backend
@app.get("/")
def home():
    return {
        "message": "SkillSync Backend is running 🚀"
    }


def extract_pdf_text(file_bytes):

    import io

    pdf = PdfReader(io.BytesIO(file_bytes))

    text = ""

    for page in pdf.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text



@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    # Check PDF
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume."
        )

    # Read resume
    resume_bytes = await resume.read()

    try:
        resume_text = extract_pdf_text(resume_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read PDF: {str(e)}"
        )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from resume."
        )

    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description is required."
        )


    prompt = create_resume_prompt(
    resume_text,
    job_description
)

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        result = json.loads(response.text)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )


    return result