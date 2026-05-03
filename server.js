require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
Role: You are an Elite Executive Resume Strategist at Orbit Careers. 
Your goal is to OPTIMIZE the user's resume, write a targeted Cover Letter, and create a LinkedIn profile document.

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level.
2. YoE Calculation: Calculate exact Years of Experience based on the oldest job vs 2026.
3. Cover Letter: Write 4 paragraphs targeting the job description. Do NOT include placeholder addresses.
4. LinkedIn: Write a 1st-person About section, select 3-4 top experience highlights, and extract 10-15 core skills.

Output Format (Strict JSON):
{
  "before": {"score": 45, "fail_points": ["Point 1", "Point 2", "Point 3"]},
  "after": {
    "score": 94,
    "name": "...", "phone": "...", "email": "...", "location": "...", "linkedin": "...",
    "optimized_title": "...",
    "improved_summary": ["..."],
    "achievements_and_awards": ["..."],
    "core_skills": ["..."],
    "experience": [
      { "company": "...", "location": "...", "title": "...", "dates": "...", "bullets": ["..."] }
    ],
    "education": [
      { "degree": "...", "institution": "...", "date": "..." }
    ],
    "certifications": ["..."],
    "personal_details": [
      { "label": "Date of Birth", "value": "..." }
    ],
    "cover_letter": {
      "target_company": "...",
      "target_role": "...",
      "paragraphs": ["..."]
    },
    "linkedin": {
      "headline": "...",
      "about_paragraphs": ["..."],
      "experience_highlights": [
        { "company": "...", "location": "...", "dates": "...", "title": "...", "bullets": ["..."] }
      ],
      "skills": ["..."]
    }
  }
}
DO NOT wrap in markdown. Output ONLY raw JSON starting with { and ending with }.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const jobDescription = req.body.jobDescription || "Optimize for general industry standards.";
        const extraInfo = req.body.extraInfo || "No extra information provided.";
        
        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        // Always clean up the uploaded file to save server space
        fs.unlinkSync(req.file.path);
        
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            generationConfig: { 
                responseMimeType: "application/json", 
                temperature: 0.0 
            } 
        });
        
        const promptWithJD = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information:\n${extraInfo}\n\nAnalyze and optimize this resume, cover letter, and LinkedIn profile. Ensure strict JSON output:`;
        
        const result = await model.generateContent([systemPrompt, promptWithJD, filePart]);
        let aiResponse = result.response.text();
        
        // AGGRESSIVE JSON CLEANUP (This prevents the 500 crash)
        aiResponse = aiResponse.trim();
        // Remove markdown formatting if the AI ignores instructions
        if (aiResponse.startsWith("```json")) {
            aiResponse = aiResponse.replace(/^```json/, "");
        }
        if (aiResponse.startsWith("```")) {
            aiResponse = aiResponse.replace(/^```/, "");
        }
        if (aiResponse.endsWith("```")) {
            aiResponse = aiResponse.replace(/
```$/, "");
        }
        aiResponse = aiResponse.trim();

        const parsedData = JSON.parse(aiResponse);
        res.json(parsedData);
        
    } catch (error) {
        console.error("CRITICAL BACKEND ERROR:", error);
        // We now return a 500 with the actual error message so you can see it if it fails again
        res.status(500).json({ error: 'Failed to analyze resume', details: error.message });
    }
});

app.listen(port, () => { console.log(`Engine running at http://localhost:${port}`); });
