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

// THE UPGRADED BRAIN: Now rewrites the ENTIRE work history
const systemPrompt = `
Role: You are an Enterprise ATS AI and Lead Resume Strategist at Orbit Careers. 
Your goal is to cross-reference the user's resume against the Job Description (JD) and provide a strict "Before" review and a fully rewritten 90+ "After" resume.

Instructions:
1. Parse: Extract their Name, Phone, Email, Location, and LinkedIn. (If missing, use placeholders like "555-555-5555" or "City, State").
2. Score (Before): Calculate an ATS Score (0-100) based strictly on how well the original matches the JD. Identify 3 critical fail points.
3. Rewrite (After): 
   - Generate an Optimized Title based on the JD.
   - Create a 90+ Score Summary (max 4 lines, inject JD keywords).
   - Work Experience: Extract their past jobs (up to 4). For EACH job, rewrite 3-4 bullet points using the "Action-Result" framework. You MUST naturally inject the most critical keywords from the JD into these new bullet points.

Output Format (Strict JSON):
{
  "before": {"score": 42, "fail_points": ["...", "...", "..."], "old_summary": "..."},
  "after": {
    "score": 96,
    "name": "...", "phone": "...", "email": "...", "location": "...", "linkedin": "...",
    "optimized_title": "...",
    "improved_summary": "...",
    "experience": [
      {
        "company": "...",
        "location": "...",
        "title": "...",
        "dates": "...",
        "bullets": ["...", "...", "..."]
      }
    ]
  }
}
DO NOT wrap the response in markdown blocks. Output ONLY raw JSON.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        const jobDescription = req.body.jobDescription;
        if (!jobDescription) return res.status(400).json({ error: 'Job description is required' });

        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path);

        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const promptWithJD = `Here is the target Job Description:\n${jobDescription}\n\nAnalyze the attached resume against this JD.`;
        
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
