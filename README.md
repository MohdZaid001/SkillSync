# SkillSync 🚀

**AI Resume Checker To Get Dream Jon**

SkillSync is a small hackathon project that helps users check how well
their resume matches a particular job description.

This project is still **in development**. It was built during a
**Dev Storm hackathon**, so some features and UI parts are not fully
completed yet.

## 💡 What SkillSync Does

The basic idea is simple:

1.  Upload your resume (PDF,png,jpeg,jpg)
2.  Paste the job description
3.  Let AI compare them
4.  Get a resume score
5.  See missing skills
6.  Get suggestions to improve the resume

## 🎥 Demo

<video src="./DEMO.mp4" controls width="800"></video>


## ✨ Current Features

-   📄 PDF resume upload
-   💼 Job description input
-   🤖 AI-based resume analysis
-   📊 Resume/job match score
-   🔍 Missing skills and keywords
-   💡 AI improvement suggestions
-   🎨 Custom frontend UI
-   🧊 3D visual element using Spline

### Frontend

-   HTML
-   CSS
-   JavaScript
-   AOS animations
-   Spline 3D

### Backend

-   Python
-   FastAPI
-   PyPDF
-   Google Gemini API
-   python-dotenv

## 📁 Basic Project Structure

``` text
SkillSync/
│
├── backend/
│   ├── .env
│   ├── main.py
│   ├── prompt.py
│   └── requirements.txt
│
├── gradient.png
├── icon.png
├── index.html
├── README.md
├── script.js
├── style.css
└── DEMO.mp4
```

## ▶️ How to Run

### 1. Install Python dependencies

``` bash
pip install fastapi uvicorn pypdf google-genai python-dotenv
```

### 2. Add your Gemini API key

Create a `.env` file:

``` env
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the backend

``` bash
uvicorn main:app --reload
```

### 4. Open the frontend

Open `index.html` in your browser.

Make sure the backend is running before using the **Analyze Resume**
button.

## 🎯 Hackathon Goal

The main goal was to quickly build a working prototype that shows how AI
can help students/job seekers understand:

> **"How well does my resume actually fit this job?"**

There is still a lot that can be improved, but this is the current
working prototype built during the hackathon till now. 🚀


## 👨‍💻 Developer

**TeamX**

Dev Storm Hackathon

