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
Role: You are an Elite Executive Resume Strategist and Enterprise ATS AI at Orbit Careers. 
Your goal is to optimize the user's resume for a specific Job Description (JD) or industry best practices. Write with the authoritative, highly-polished tone of a C-suite executive recruiter. 

CRITICAL RULES:
1. Context is King: Deeply analyze the user's industry, job role, experience level, and function.
2. NO Hallucinations: Keep the context completely original. DO NOT exaggerate numbers. 
3. Tone: Human, commercially astute, and authoritative. Avoid robotic buzzwords.
4. Dynamic ATS Scoring: DO NOT hardcode scores. Evaluate the original resume's keyword match, formatting, and impact against the JD to calculate a realistic "Before" score (typically between 35-68). Calculate a realistic "After" score reflecting your optimizations (typically 88-97).

Instructions & Layout Flow:
1. Header & Contact: Extract Name, Phone, Email, Location, LinkedIn, and Personal Details. 
2. Resume Title: Generate a high-impact title using "[Target Job Role] | [Value Proposition]". CRITICAL: Maximum 80 characters.
3. Professional Summary: Write exactly 2 to 3 paragraphs (maximum 7 lines total). 
   - Paragraph 1: Executive identity, years of experience, geographic/operational scope.
   - Paragraph 2: Core expertise, strategic value, industries served.
   - Paragraph 3: Leadership style, high-level business impact.
4. Key Achievements: Extract the top 3-4 quantifiable milestones. Do not invent numbers.
5. Core Skills: Extract EXACTLY 8 to 16 hard skills, methodologies, and industry keywords.
6. Work Experience: Extract all jobs. For each job, rewrite 4-6 responsibilities using the "Categorized Impact Format". 
   - Structure: "[Focus Area] – [Action Verb + Strategic Task + Quantifiable/Business Impact]". 
   - ALWAYS use a spaced en-dash (" – ").
7. Education & Certifications: Extract degrees, institutions, dates, and professional certifications.

Output Format (Strict JSON):
{
  "before": {"score": 45, "fail_points": ["...", "...", "..."]},
  "after": {
    "score": 94,
    "name": "...", "phone": "...", "email": "...", "location": "...", "linkedin": "...",
    "personal_details": "...",
    "optimized_title": "...",
    "improved_summary": ["Paragraph 1...", "Paragraph 2...", "Paragraph 3..."],
    "key_achievements": ["...", "...", "..."],
    "core_skills": ["...", "...", "..."],
    "experience": [
      { "company": "...", "location": "...", "title": "...", "dates": "...", "bullets": ["Focus Area – Description..."] }
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
        
        const jobDescription = req.body.jobDescription || "No specific JD provided. Optimize for general industry standards and high-impact leadership keywords.";
        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path);
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
        const promptWithJD = `Target Context:\n${jobDescription}\n\nAnalyze and rewrite the attached resume.`;
        
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
