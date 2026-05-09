require('dotenv').config();
const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Razorpay = require('razorpay');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // <-- SECURITY ADDITION: Required for verifying Razorpay signatures

const app = express();
const port = process.env.PORT || 3000;

// ==========================================
// SECURITY CONFIGURATIONS
// ==========================================

// 1. Rate Limiter (Wallet Drain Protection)
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, 
    legacyHeaders: false, 
    message: { error: "Too many resumes uploaded from this device. Please wait 15 minutes and try again." }
});

// 2. Secure Multer Configuration (Server Crash Protection)
const upload = multer({ 
    storage: multer.memoryStorage(), // Keeps file in RAM, prevents hard drive filling up
    limits: { 
        fileSize: 5 * 1024 * 1024 // Hard limit: 5MB maximum file size
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDFs are allowed.'));
        }
    }
});

// ==========================================
// MIDDLEWARE & SETUP
// ==========================================

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
3. Title Format: The "optimized_title" MUST fit on a single line. You MUST use this exact template structure: "[Target Job Title or Current Role] | [Years of Experience]+ years in [Core Domain 1] & [Core Domain 2] | [Secondary Domain or Skill]" (e.g., "Senior Mechanical Design Engineer | 8+ years in Industrial Automation & Rebar Robotic Cells | Production Engineering").
4. Core Skills Format: You MUST output EXACTLY 12 core skills. Output ONLY the raw skill name (e.g., "End-to-End Recruitment", "Candidate Sourcing", "Offer Negotiation"). 
   - ABSOLUTELY NO CATEGORIES OR COLONS. Do not write "Talent Acquisition: Recruitment". Just write "Recruitment".
5. Work Experience Format: Format EVERY bullet point using this exact structure: "[Focus Area]: [Action verb-led sentence with impact and quantification]". 
   - DO NOT include bullet point characters (like • or ·) in the JSON string itself.

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

app.post('/api/create-order', async (req, res) => {
    try {
        const { hasShared, hasReferral } = req.body; 
        
        let basePrice = 199; 

        if (hasShared) { basePrice = basePrice * 0.90; }
        if (hasReferral) { basePrice = basePrice * 0.90; }

        const finalPricePaise = Math.round(basePrice) * 100; 

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

// ==========================================
// SECURITY ADDITION: Razorpay Payment Verification
// ==========================================
app.post('/api/payment/verify', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        // Use the exact Razorpay secret from your environment variables
        const secret = process.env.RAZORPAY_KEY_SECRET; 

        // Generate the expected cryptographic signature
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        // Compare what we generated with what Razorpay sent us
        if (generated_signature === razorpay_signature) {
            res.status(200).json({ status: "success", message: "Payment is authentic." });
        } else {
            res.status(400).json({ error: "Invalid payment signature. Potential fraud attempt." });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ error: "Server error during payment verification" });
    }
});
// ==========================================

// Smart AI Generator with Automatic Retries and Model Fallback
async function generateAIResponseWithRetry(promptWithJD, filePart) {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash", 
                systemInstruction: systemPrompt,
                generationConfig: { responseMimeType: "application/json", temperature: 0.0 } 
            });
            
            console.log(`AI Attempt ${attempt} (2.5-flash)...`);
            const result = await model.generateContent([promptWithJD, filePart]);
            return result.response.text();

        } catch (error) {
            console.warn(`Attempt ${attempt} failed:`, error.message);
            
            if (error.status === 503 && attempt < maxRetries) {
                console.log(`Traffic jam detected. Waiting ${baseDelay}ms to retry...`);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
                continue;
            }
            
            if (attempt === maxRetries) {
                console.log("Triggering Emergency Fallback to 1.5-flash model...");
                try {
                    const fallbackModel = genAI.getGenerativeModel({ 
                        model: "gemini-1.5-flash", 
                        systemInstruction: systemPrompt,
                        generationConfig: { responseMimeType: "application/json", temperature: 0.0 } 
                    });
                    const fallbackResult = await fallbackModel.generateContent([promptWithJD, filePart]);
                    return fallbackResult.response.text();
                } catch (fallbackError) {
                    throw new Error(`Both models failed. Last error: ${fallbackError.message}`);
                }
            }
            throw error;
        }
    }
}

app.post('/api/analyze', uploadLimiter, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) throw new Error("No file received by the server.");
        
        const jobDescription = req.body.jobDescription || "Optimize for general industry standards.";
        const extraInfo = req.body.extraInfo || "No extra information provided.";
        
        // Use req.file.buffer directly from memory storage
        const pdfBase64 = req.file.buffer.toString("base64");
        
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        const promptWithJD = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information:\n${extraInfo}\n\nAnalyze and optimize this resume according to the JSON format:`;
        
        let aiResponse = await generateAIResponseWithRetry(promptWithJD, filePart);
        
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
        
        // Handle multer file size error cleanly
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File Too Large', details: 'The uploaded PDF exceeds the 5MB limit.' });
        }
        
        res.status(500).json({ error: 'Server Crash', details: error.message });
    }
});

// Clean URL for Blog Index
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

// Clean URL for Blog Posts
app.get('/blog/:postName', (req, res) => {
    const postName = req.params.postName;
    res.sendFile(path.join(__dirname, 'public', 'blog', `${postName}.html`));
});

app.listen(port, () => { console.log(`Engine running at port ${port}`); });
