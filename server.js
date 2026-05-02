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

const systemPrompt = `
Role: You are an Elite Executive Resume Strategist at Orbit Careers. 
Your goal is to OPTIMIZE the user's resume, not REINVENT it. 

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level. If they are a "Store Keeper," they must remain a "Store Keeper." Do NOT assume a "Senior Director" role just because of years of experience. Use their EXACT current/past designations.
2. Context Preservation: Strictly follow the actual duties and responsibilities mentioned in the original resume. Our job is to improve the phrasing, impact, and ATS keywords, not to invent new leadership scopes or responsibilities they didn't have.
3. NO Exaggeration: Keep metrics and impact realistic to the specific role level.

Instructions & Layout:
1. Header: Extract Name, Phone, Email, Location, LinkedIn. 
2. Resume Title: [Exact Current Role] | [Value Proposition]. Limit to 80 chars.
3. Professional Summary: 2-3 paragraphs (max 7 lines). Paragraph 1 must reflect their ACTUAL seniority level and industry context.
4. Key Achievements: Extract 3-4 real wins. 
5. Core Skills: Extract 8-16 keywords.
6. Work Experience: 4-6 bullets using "Categorized Impact Format". 
   - Structure: "[Focus Area] – [Action Verb + Task + Result]". Use en-dash (" – ").
7. Education & Certifications: Extract degrees and certificates.

Output Format (Strict JSON):
{
  "before": {"score": 45, "fail_points": ["...", "...", "..."]},
  "after": {
    "score": 94,
    "name": "...", "phone": "...", "email": "...", "location": "...", "linkedin": "...",
    "personal_details": "...",
    "optimized_title": "...",
    "improved_summary": ["..."],
    "key_achievements": ["..."],
    "core_skills": ["..."],
    "experience": [
      { "company": "...", "location": "...", "title": "...", "dates": "...", "bullets": ["..."] }
    ],
    "education": [
      { "degree": "...", "institution": "...", "date": "..." }
    ],
    "certifications": ["..."]
  }
}
DO NOT wrap in markdown. Output ONLY raw JSON.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const jobDescription = req.body.jobDescription || "Optimize for general industry standards.";
        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path);
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
        const promptWithJD = `Target Context:\n${jobDescription}\n\nAnalyze and optimize this resume without elevating the seniority level:`;
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
