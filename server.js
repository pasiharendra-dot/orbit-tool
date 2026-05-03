require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post('/api/create-order', async (req, res) => {
    try {
        const options = { amount: 99900, currency: "INR", receipt: "orbit_receipt_" + Math.random().toString(36).substring(7) };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) { res.status(500).json({ error: 'Failed to create payment order' }); }
});

const systemPrompt = `
Role: You are an Elite Executive Resume Strategist at Orbit Careers. 
Your goal is to OPTIMIZE the user's resume, integrate any extra user-provided context, and format it for enterprise ATS.

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level. Use their EXACT current/past designations.
2. Context Preservation: Follow actual duties. Do not invent new scopes.
3. Extra Context Integration: The user may provide "Additional Information" (e.g., new jobs, missing dates, awards). You MUST seamlessly integrate this into the correct sections of the rewritten resume.
4. Calculate YoE: Calculate exact Years of Experience based on the oldest job start date vs 2026. State this in Paragraph 1 of the Summary.

Instructions & Layout:
1. Header: Extract Name, Phone, Email, Location, LinkedIn.
2. Resume Title: [Exact Current Role] | [Value Proposition]. Limit to 80 chars.
3. Professional Summary: 2-3 paragraphs (max 7 lines).
4. Achievements & Awards: Extract 3-5 major wins, including ANY awards or recognitions found in the resume or extra info.
5. Core Skills: Extract EXACTLY 8 to 16 keywords.
6. Work Experience: 4-6 bullets using "Categorized Impact Format" ([Focus Area] – [Action Verb + Task + Result]).
7. Education & Certifications: Extract degrees and certificates.
8. Personal Details: Extract any personal info (DOB, Nationality, Address, Languages, etc.) into a strict label/value list.

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
      { "label": "Nationality", "value": "Indian" },
      { "label": "Date of Birth", "value": "01 Jan 1990" }
    ]
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
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
        
        const promptWithJD = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information to Integrate:\n${extraInfo}\n\nAnalyze and optimize this resume:`;
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
