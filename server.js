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
Your goal is to OPTIMIZE the user's resume, write a highly targeted Cover Letter, and create a LinkedIn profile makeover.

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level. 
2. Context Preservation: Strictly follow actual duties. 
3. Dynamic ATS Scoring: Calculate a realistic "Before" (35-68) and "After" (88-97) score.
4. YoE Calculation: Calculate exact Years of Experience based on the oldest job vs 2026.
5. Cover Letter: Write a 3-paragraph executive cover letter based on their target job and top achievements.
6. LinkedIn: Write a high-impact LinkedIn Headline (under 120 chars) and an engaging, 1st-person "About" section.

Output Format (Strict JSON):
{
  "before": {"score": 45, "fail_points": ["...", "...", "..."]},
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
    "cover_letter": "...",
    "linkedin_headline": "...",
    "linkedin_about": "..."
  }
}
DO NOT wrap in markdown. Output ONLY raw JSON.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const jobDescription = req.body.jobDescription || "Optimize for general industry standards.";
        const extraInfo = req.body.extraInfo || "No extra information provided.";
        
        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path);
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            generationConfig: { responseMimeType: "application/json", temperature: 0.0 } 
        });
        
        const promptWithJD = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information:\n${extraInfo}\n\nAnalyze and optimize this resume, and generate the cover letter and LinkedIn copy:`;
        const result = await model.generateContent([systemPrompt, promptWithJD, filePart]);
        
        let aiResponse = result.response.text();
        aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        res.json(JSON.parse(aiResponse));
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

app.listen(port, () => { console.log(`Engine running at http://localhost:${port}`); });
