require('dotenv').config();
const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const pdf = require('pdf-parse');
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

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
Role: You are an Elite Executive Resume Strategist at Orbit Careers. 
Your goal is to OPTIMIZE the user's resume, write a targeted Cover Letter, and create a LinkedIn profile document.

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level.
2. YoE Calculation: Calculate exact Years of Experience based on the oldest job vs 2026.
3. Cover Letter: Write 4 paragraphs targeting the job description. Do NOT include placeholder addresses.
4. LinkedIn: Write a 1st-person About section, select 3-4 top experience highlights, and extract 10-15 core skills.

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
`;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) throw new Error("No file received by the server.");
        
        const jobDescription = req.body.jobDescription || "Optimize for general industry standards.";
        const extraInfo = req.body.extraInfo || "No extra information provided.";
        
        // Read the uploaded PDF file
        const dataBuffer = fs.readFileSync(req.file.path);
        
        // Extract the raw text from the PDF
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;
        
        // Clean up the temp file
        fs.unlinkSync(req.file.path);
        
        const userPrompt = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information:\n${extraInfo}\n\nOriginal Resume Text to Optimize:\n${resumeText}\n\nAnalyze and optimize this resume, cover letter, and LinkedIn profile according to the JSON format.`;

        // OpenAI API Call
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }, // FORCES perfect JSON output
            temperature: 0.0,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        });
        
        const aiResponse = response.choices[0].message.content;
        const parsedData = JSON.parse(aiResponse);
        
        res.json(parsedData);
        
    } catch (error) {
        console.error("CRITICAL BACKEND ERROR:", error);
        res.status(500).json({ error: 'Server Crash', details: error.message });
    }
});

app.listen(port, () => { console.log(`Engine running at port ${port}`); });
