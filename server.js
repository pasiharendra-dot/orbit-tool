require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Razorpay = require('razorpay');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const systemPrompt = `
Role: You are an Elite Executive Resume Strategist at Orbit Careers. 
Your singular goal is to OPTIMIZE the user's resume for ATS systems and executive recruiters.

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level.
2. YoE Calculation: Calculate exact Years of Experience based on the oldest job vs 2026. State this in the summary.
3. Title Format: You MUST generate the "optimized_title" field using this exact template structure: "[Target Job Title or Current Role] | [Years of Experience]+ years in [Core Domain 1] & [Core Domain 2] | [Secondary Domain or Skill]". 
   - Example: "Senior Mechanical Design Engineer | 8+ years in Industrial Automation & Rebar Robotic Cells | Production Engineering".
4. Work Experience Format: You MUST format EVERY bullet point using this exact structure: "[Focus Area]: [Action verb-led sentence with impact and quantification]". 
   - Example 1: "Subcontracting Strategy & Execution: Managed subcontracting activities for 4 large EPC projects (~₹10,000 Cr), covering planning, evaluations, and negotiations."
   - DO NOT include bullet point characters (like • or ·) in the JSON string itself. The frontend UI will add the bullets.

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

// Create Razorpay Order with Dynamic Discounts
app.post('/api/create-order', async (req, res) => {
    try {
        const { hasShared, hasReferral } = req.body; 
        
        let basePrice = 199; // Base Launch Price

        if (hasShared) {
            basePrice = basePrice * 0.90; 
        }
        
        if (hasReferral) {
            basePrice = basePrice * 0.90; 
        }

        const finalPricePaise = 100; 

        const options = {
            amount: finalPricePaise, 
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7)
        };
        const order = await razorpay.orders.create(options);
        res.json({ id: order.id, amount: order.amount, calculatedPrice: Math.round(basePrice) });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: "Could not create Razorpay order" });
    }
});

// AI Analysis
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) throw new Error("No file received by the server.");
        
        const jobDescription = req.body.jobDescription || "Optimize for general industry standards.";
        const extraInfo = req.body.extraInfo || "No extra information provided.";
        
        const pdfBase64 = fs.readFileSync(req.file.path).toString("base64");
        fs.unlinkSync(req.file.path); // Auto-delete file
        
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        
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
