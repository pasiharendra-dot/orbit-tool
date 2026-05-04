require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Ensure the uploads directory exists for Render
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
Role: You are an Elite Executive Resume Strategist at Orbit Careers. 
Your singular goal is to OPTIMIZE the user's resume for ATS systems and executive recruiters.

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level.
2. YoE Calculation: Calculate exact Years of Experience based on the oldest job vs 2026. State this in the summary.
3. Format: Rewrite bullet points to be action-driven and results-oriented.

Output Format: You MUST return a JSON object with this exact structure:
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
    ]
  }
}
DO NOT wrap in markdown. Output ONLY raw JSON starting with { and ending with }.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) throw new Error("No file received by the server.");
        
        const jobDescription = req.body.jobDescription || "Optimize for general industry standards.";
        const extraInfo = req.body.extraInfo || "No extra information provided.";
        
        // Let Gemini read the PDF natively
        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path);
        
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        
        // Configured for your flawless 2.5 model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt,
            generationConfig: { 
                responseMimeType: "application/json", 
                temperature: 0.0 
            } 
        });
        
        const promptWithJD = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information:\n${extraInfo}\n\nAnalyze and optimize this resume according to the JSON format:`;
        
        const result = await model.generateContent([promptWithJD, filePart]);
        let aiResponse = result.response.text();
        
        // Unbreakable JSON extraction logic
        const startIndex = aiResponse.indexOf('{');
        const endIndex = aiResponse.lastIndexOf('}');
        
        if (startIndex !== -1 && endIndex !== -1) {
            aiResponse = aiResponse.substring(startIndex, endIndex + 1);
        } else {
            throw new Error("AI did not return valid JSON format.");
        }

        const parsedData = JSON.parse(aiResponse);
        res.json(parsedData);
        
    } catch (error) {
        console.error("CRITICAL BACKEND ERROR:", error);
        res.status(500).json({ error: 'Server Crash', details: error.message });
    }
});

app.listen(port, () => { console.log(`Engine running at port ${port}`); });
