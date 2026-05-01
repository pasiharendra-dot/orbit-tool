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

// Serve your HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The exact prompt from your PRD (Added strict formatting rules)
const systemPrompt = `
Role: You are the Lead Resume Strategist at Orbit Careers. Your goal is to analyze a user's uploaded resume and provide a high-impact "Before & After" comparison that demonstrates the value of a professional rewrite.
Instructions:
Parse: Extract the user's name, current job title, and existing professional summary.
Score (Before): Assign an ATS score between 35-55. Identify 3 critical "fail points" (e.g., "Lack of quantifiable metrics", "Passive language", "Poor keyword density").
Rewrite (After):
Generate a Modern Header (Name, LinkedIn Placeholder, Optimized Title).
Create a 90+ Score Summary: Use the "Action-Result" framework. Max 4 lines. Ensure it sounds human but is packed with high-value keywords for their specific industry.
Output Format (Strict JSON):
{
"before": {"score": 42, "fail_points": ["...", "...", "..."], "old_summary": "..."},
"after": {"score": 96, "name": "...", "optimized_title": "...", "improved_summary": "..."}
}
DO NOT wrap the response in markdown blocks. Output ONLY raw JSON.
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // 1. Read the PDF securely as Base64
        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        // 2. Prepare the PDF for Gemini
        const filePart = {
            inlineData: {
                data: pdfBase64,
                mimeType: "application/pdf"
            }
        };

        // 3. Send to Gemini 2.5 Flash
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([systemPrompt, filePart]);
        let aiResponse = result.response.text();

        // THE FIX: Clean up any markdown or weird formatting the AI tries to sneak in
        aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        // Log it just in case we need to see it
        console.log("Raw cleaned AI Response:", aiResponse);

        // 4. Send the JSON back to the frontend
        res.json(JSON.parse(aiResponse));

    } catch (error) {
        console.error("Error analyzing resume:", error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

app.listen(port, () => {
    console.log(`Orbit Careers Engine running at http://localhost:${port}`);
});
