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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// UPGRADED AI BRAIN: Now handles optional JDs and grabs Education/Certifications
const systemPrompt = `
Role: You are an Enterprise ATS AI and Lead Resume Strategist at Orbit Careers. 
Your goal is to optimize the user's resume. If a Job Description (JD) is provided, strictly tailor the resume to it. If no JD is provided, optimize it for general industry best practices to score highly in any ATS.

Instructions:
1. Parse: Extract Name, Phone, Email, Location, LinkedIn. If missing, use placeholders.
2. Score (Before): Calculate an ATS Score (0-100). Identify 3 critical fail points in the original resume.
3. Rewrite (After): 
   - Generate an Optimized Title.
   - Create a 90+ Score Summary (max 4 lines, use the Action-Result framework).
   - Work Experience: Extract past jobs. Rewrite 3-4 bullet points per job using strong action verbs and metrics. 
   - Education: Extract degrees, institutions, and graduation years.
   - Certifications: Extract key certifications or core skills.

Output Format (Strict JSON):
{
  "before": {"score": 42, "fail_points": ["...", "...", "..."], "old_summary": "..."},
  "after": {
    "score": 96,
    "name": "...", "phone": "...", "email": "...", "location": "...", "linkedin": "...",
    "optimized_title": "...",
    "improved_summary": "...",
    "experience": [
      { "company": "...", "location": "...", "title": "...", "dates": "...", "bullets": ["...", "...", "..."] }
    ],
    "education": [
      { "degree": "...", "institution": "...", "date": "..." }
    ],
    "certifications": ["...", "...", "..."]
  }
}
DO NOT wrap the response in markdown blocks. Output ONLY raw JSON.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        // Make JD optional. Provide a fallback instruction if empty.
        const jobDescription = req.body.jobDescription || "No specific JD provided. Optimize for general industry standards and high-impact leadership keywords.";

        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path);

        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const promptWithJD = `Target Job Description Context:\n${jobDescription}\n\nAnalyze and rewrite the attached resume.`;
        
        const result = await model.generateContent([systemPrompt, promptWithJD, filePart]);
        let aiResponse = result.response.text();

        aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        res.json(JSON.parse(aiResponse));

    } catch (error) {
        console.error("Error analyzing resume:", error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

app.listen(port, () => {
    console.log(`Orbit Careers Engine running at http://localhost:${port}`);
});
