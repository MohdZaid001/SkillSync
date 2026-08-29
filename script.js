const resumeInput = document.getElementById("resume-upload");
const resumeDropzone = document.querySelector(".resume-dropzone");
const selectedFile = document.querySelector(".selected-file");
const removeFileButton = document.querySelector(".remove-file");

const jobDescription = document.getElementById("job-description");
const pasteButton = document.querySelector(".paste-jd-button");

const analyzeButton = document.querySelector(".analyze-button");


// Click anywhere on dropzone to open file picker
resumeDropzone.addEventListener("click", (event) => {

    // Don't trigger twice if input itself was clicked
    if (event.target !== resumeInput) {
        resumeInput.click();
    }

});


// When file is selected
resumeInput.addEventListener("change", () => {

    if (resumeInput.files.length === 0) {
        return;
    }

    const file = resumeInput.files[0];

    // Only allow PDF
    if (file.type !== "application/pdf") {

        alert("Please upload a PDF resume.");

        resumeInput.value = "";

        return;
    }

    // Show selected file
    selectedFile.style.display = "flex";

    // Change file name
    const fileName = selectedFile.querySelector("strong");

    if (fileName) {
        fileName.textContent = file.name;
    }

    // Change status
    const fileStatus = selectedFile.querySelector("small");

    if (fileStatus) {
        fileStatus.textContent = "Ready to analyze";
    }

});


// ========================================
// REMOVE RESUME
// ========================================

removeFileButton.addEventListener("click", (event) => {

    // Prevent label from opening file picker
    event.preventDefault();
    event.stopPropagation();

    // Clear input
    resumeInput.value = "";

    // Hide selected file
    selectedFile.style.display = "none";

});


// ========================================
// JOB DESCRIPTION CHARACTER COUNTER
// ========================================

const characterCounter = jobDescription
    .closest(".jd-editor")
    .querySelector(".jd-editor-footer span b");


jobDescription.addEventListener("input", () => {

    const count = jobDescription.value.length;

    characterCounter.textContent = count;

});


// ========================================
// PASTE JOB DESCRIPTION
// ========================================

pasteButton.addEventListener("click", async () => {

    try {

        const text = await navigator.clipboard.readText();

        if (!text) {

            alert("Clipboard is empty.");

            return;
        }

        jobDescription.value = text;

        // Update character count
        characterCounter.textContent = text.length;

        jobDescription.focus();

    }
    catch (error) {

        alert(
            "Clipboard access blocked. Please paste manually using Ctrl + V."
        );

    }

});


// ========================================
// ANALYZE RESUME
// ========================================

analyzeButton.addEventListener("click", async () => {

    if (!resumeInput.files.length) {

        alert("Please upload your resume first.");

        return;
    }


    if (!jobDescription.value.trim()) {

        alert("Please enter the job description.");

        jobDescription.focus();

        return;
    }


    // ----------------------------------------
    // CREATE FORM DATA
    // ----------------------------------------

    const formData = new FormData();

    formData.append(
        "resume",
        resumeInput.files[0]
    );

    formData.append(
        "job_description",
        jobDescription.value
    );


    // ----------------------------------------
    // LOADING STATE
    // ----------------------------------------

    analyzeButton.disabled = true;

    const buttonText =
        analyzeButton.querySelector("span");

    const buttonArrow =
        analyzeButton.querySelector("strong");

    if (buttonText) {
        buttonText.textContent = "ANALYZING...";
    }

    if (buttonArrow) {
        buttonArrow.textContent = "⟳";
    }


    try {

        // ----------------------------------------
        // CALL FASTAPI
        // ----------------------------------------

        const response = await fetch(
            "http://127.0.0.1:8000/analyze",
            {
                method: "POST",
                body: formData
            }
        );


        const data = await response.json();


        // ----------------------------------------
        // BACKEND ERROR
        // ----------------------------------------

        if (!response.ok) {

            throw new Error(
                data.detail || "Analysis failed."
            );

        }


        console.log("AI RESULT:", data);


        // ========================================
        // UPDATE OVERALL SCORE
        // ========================================

        document.getElementById(
            "overall-score"
        ).textContent = data.overall_score;


        // ========================================
        // UPDATE STATUS
        // ========================================

        const scoreStatus =
            document.getElementById("score-status");


        if (data.overall_score >= 80) {

            scoreStatus.textContent =
                "Strong Match";

        }
        else if (data.overall_score >= 60) {

            scoreStatus.textContent =
                "Good Match";

        }
        else {

            scoreStatus.textContent =
                "Needs Improvement";

        }


        // ========================================
        // TECHNICAL SCORE
        // ========================================

        document.getElementById(
            "technical-score"
        ).textContent =
            data.technical_score + "%";


        document.getElementById(
            "technical-bar"
        ).style.width =
            data.technical_score + "%";


        // ========================================
        // EXPERIENCE SCORE
        // ========================================

        document.getElementById(
            "experience-score"
        ).textContent =
            data.experience_score + "%";


        document.getElementById(
            "experience-bar"
        ).style.width =
            data.experience_score + "%";


        // ========================================
        // KEYWORD SCORE
        // ========================================

        document.getElementById(
            "keyword-score"
        ).textContent =
            data.keyword_score + "%";


        document.getElementById(
            "keyword-bar"
        ).style.width =
            data.keyword_score + "%";


        // ========================================
        // MISSING SKILLS
        // ========================================

        const missingSkillsList =
            document.getElementById(
                "missing-skills-list"
            );

        missingSkillsList.innerHTML = "";


        if (
            data.missing_skills &&
            data.missing_skills.length > 0
        ) {

            data.missing_skills.forEach(skill => {

                const span =
                    document.createElement("span");

                span.textContent = skill;

                missingSkillsList.appendChild(span);

            });

        }
        else {

            const span =
                document.createElement("span");

            span.textContent =
                "No major skill gaps found";

            missingSkillsList.appendChild(span);

        }


        // ========================================
        // MISSING SKILLS COUNT
        // ========================================

        const insightCount =
            document.querySelector(".insight-count");


        if (insightCount) {

            const count =
                data.missing_skills
                    ? data.missing_skills.length
                    : 0;

            insightCount.textContent =
                count + (count === 1 ? " gap" : " gaps");

        }


        // ========================================
        // STRENGTHS
        // ========================================

        const strengthsList =
            document.getElementById(
                "strengths-list"
            );

        strengthsList.innerHTML = "";


        if (
            data.strengths &&
            data.strengths.length > 0
        ) {

            data.strengths.forEach(strength => {

                const li =
                    document.createElement("li");

                li.textContent = strength;

                strengthsList.appendChild(li);

            });

        }


        // ========================================
        // AI SUMMARY
        // ========================================

        document.getElementById(
            "ai-summary"
        ).textContent =
            data.ai_summary || "No summary available.";


        // ========================================
        // AI RECOMMENDATION
        // ========================================

        document.getElementById(
            "ai-recommendation"
        ).textContent =
            data.ai_recommendation ||
            "No recommendation available.";


        // ========================================
        // IMPROVEMENTS
        // ========================================

        const improvementsList =
            document.getElementById(
                "improvements-list"
            );

        improvementsList.innerHTML = "";


        if (
            data.improvements &&
            data.improvements.length > 0
        ) {

            data.improvements.forEach(improvement => {

                const li =
                    document.createElement("li");

                li.textContent = improvement;

                improvementsList.appendChild(li);

            });

        }


        // ========================================
        // SHOW RESULTS
        // ========================================

        const resultsSection =
            document.getElementById("ai-results");


        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    }
    catch (error) {

        console.error(
            "Analysis Error:",
            error
        );


        alert(
            "Something went wrong:\n\n" +
            error.message
        );

    }
    finally {

        // ----------------------------------------
        // RESET BUTTON
        // ----------------------------------------

        analyzeButton.disabled = false;


        if (buttonText) {

            buttonText.textContent =
                "ANALYZE MY RESUME";

        }


        if (buttonArrow) {

            buttonArrow.textContent =
                "ᯓ➤";

        }

    }

});