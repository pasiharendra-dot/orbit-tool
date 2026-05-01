require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Setup file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// THE NEW AI BRAIN: Strictly focused on JD matching
const systemPrompt = `
Role: You are an Enterprise ATS (Applicant Tracking System) AI used by Fortune 500 companies (like Taleo or Workday), and the Lead Strategist at Orbit Careers. 
Your goal is to cross-reference the user's uploaded resume against the provided Job Description (JD) and provide a harsh but fair "Before & After" comparison.

Instructions:
1. Parse: Extract the user's name, current job title, and existing professional summary.
2. Score (Before): Calculate a strict ATS Match Score (0-100) based strictly on how well the original resume matches the target JD. Identify 3 critical "fail points" specifically related to missing keywords from the JD, poor formatting, or lack of quantifiable metrics.
3. Rewrite (After): 
   - Generate a Modern Header.
   - Create a 90+ Score Summary optimized EXACTLY for the provided JD. Embed the most critical keywords from the JD naturally using the "Action-Result" framework. Max 4 lines.

Output Format (Strict JSON):
{
"before": {"score": 42, "fail_points": ["Missing JD keyword: 'Cross-functional leadership'", "Passive language", "Poor keyword density"], "old_summary": "..."},
"after": {"score": 96, "name": "...", "optimized_title": "...", "improved_summary": "..."}
}
DO NOT wrap the response in markdown blocks. Output ONLY raw JSON.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        // Grab the JD from the frontend
        const jobDescription = req.body.jobDescription;
        if (!jobDescription) return res.status(400).json({ error: 'Job description is required' });

        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path);

        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Feed the JD and the PDF to the AI
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
