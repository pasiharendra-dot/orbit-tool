require('dotenv').config();
const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Razorpay = require('razorpay');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // <-- SECURITY ADDITION: Required for verifying Razorpay signatures
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase using Environment Variables for Security
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
console.log("Checking Render Env:", process.env.SUPABASE_URL ? "URL EXISTS" : "URL IS MISSING");
const supabase = createClient(supabaseUrl, supabaseKey);
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

// ==========================================
// AI PROMPTS
// ==========================================

// 1. Existing System Prompt (For Mid & Senior Level)
const systemPrompt = `
Role: You are an Elite Executive Resume Strategist at Orbit Careers. 
Your singular goal is to OPTIMIZE the user's resume for ATS systems and executive recruiters.

STRICT GUARDRAILS:
1. Zero Seniority Hallucination: Do NOT elevate the user's job level.
2. YoE Calculation: Calculate exact Years of Experience based on the oldest job vs 2026. State this in the summary.
3. Title Format: The "optimized_title" MUST fit on a single line. You MUST use this exact template structure: "[Target Job Title or Current Role] | [Years of Experience]+ years in [Core Domain 1] & [Core Domain 2] | [Secondary Domain or Skill]" (e.g., "Senior Mechanical Design Engineer | 8+ years in Industrial Automation & Rebar Robotic Cells | Production Engineering").
   - CRITICAL ANTI-REPETITION RULE: You MUST NOT repeat major words (e.g., "Operations", "Management", "Business") across the title. If the Target Role contains a word, use specific, distinct alternative skills for the Domains (e.g., if Role is "Operations Manager", Domains should be "Process Excellence & Strategic Scaling").
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

// 2. Entry Level Prompt (1-3 Years)
const entryLevelPrompt = `
Role: You are an Expert Early-Career Strategist at Orbit Careers. 
Your singular goal is to OPTIMIZE an entry-level professional's resume (1-3 years experience) for ATS systems.

STRICT GUARDRAILS:
1. The Hybrid Approach: Blend their early-career execution with a strong emphasis on their degree and technical skills. 
2. No Hallucinations: Do not invent leadership or strategy roles. Focus on collaboration, execution, process adherence, and fast learning.
3. Title Format: The "optimized_title" MUST fit on a single line. Use this exact structure: "[Target Job Title] | [Degree or Certification] | Focus in [Core Skill 1] & [Core Skill 2]".
   - CRITICAL ANTI-REPETITION RULE: You MUST NOT repeat any words from the Target Title inside the Core Skills section. Ensure a diverse, highly readable vocabulary.
4. Core Skills Format: You MUST output EXACTLY 12 core skills. Blend foundational tools with soft skills. Output ONLY the raw skill name. 
   - ABSOLUTELY NO CATEGORIES OR COLONS.
5. Work Experience Format: Format EVERY bullet point using this exact structure: "[Focus Area]: [Action verb-led sentence explaining daily execution and adherence to goals]". 
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

// 3. Fresher Prompt (0 Years)
const fresherPrompt = `
Role: You are an Empathetic Entry-Level Career Strategist at Orbit Careers. 
Your singular goal is to OPTIMIZE a student or recent graduate's resume for ATS systems to help them secure internships or entry-level roles.

STRICT GUARDRAILS:
1. Zero Experience is Okay: Do NOT invent work history. Focus heavily on academic projects, relevant coursework, thesis work, and extracurricular leadership. Treat major university projects as "Experience" if work history is missing.
2. Title Format: The "optimized_title" MUST fit on a single line. Use this exact structure: "Aspiring [Target Job Title] | [Degree] | Strong foundation in [Core Skill 1] & [Core Skill 2]".
   - CRITICAL ANTI-REPETITION RULE: You MUST NOT repeat any words from the Target Title inside the Core Skills section. Ensure a diverse, highly readable vocabulary.
3. Core Skills Format: You MUST output EXACTLY 12 core skills. Focus on academic skills, fast learning, and foundational tools. Output ONLY the raw skill name. 
   - ABSOLUTELY NO CATEGORIES OR COLONS.
4. Experience/Projects Format: Format EVERY bullet point using this exact structure: "[Focus Area]: [Action verb-led sentence explaining what they built, researched, or accomplished]". 
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
        const { hasShared, hasReferral, promoCode } = req.body; 
        
        let basePrice = 199; 

        // ==========================================
        // THE PROMO CODE ENGINE
        // ==========================================
        if (promoCode) {
            const cleanCode = promoCode.toUpperCase().trim();
            
            // University / Affiliate Tier (Drops price to ₹99)
            if (cleanCode === "SYMBIOSIS99" || cleanCode === "NMIMS99" || cleanCode === "LAUNCH99") {
                basePrice = 99;
            } 
            // Founder / Testing Tier (Drops price to ₹1)
            else if (cleanCode === "FOUNDER") {
                basePrice = 1;
            }
        }

        // Apply social sharing discounts (if you are still using them)
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
// UPDATED: Now accepts activeSystemPrompt based on user choice
async function generateAIResponseWithRetry(promptWithJD, filePart, activeSystemPrompt) {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash", 
                systemInstruction: activeSystemPrompt,
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
                        systemInstruction: activeSystemPrompt,
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
        
        // Extract the new variables from the frontend
        const experienceLevel = req.body.experienceLevel || "mid";
        const targetRole = req.body.targetRole || "";
        
        // Use req.file.buffer directly from memory storage
        const pdfBase64 = req.file.buffer.toString("base64");
        
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        
        // Determine which AI Brain to use based on the frontend selection
        let activePrompt = systemPrompt; // Defaults to Mid/Senior level
        if (experienceLevel === "fresher") {
            activePrompt = fresherPrompt + `\n\nCRITICAL CONTEXT: The user is a Fresher targeting the exact role of "${targetRole}". You MUST frame their academic projects, certifications, and educational background to prove they are a perfect fit for this specific position. Discard irrelevant hobbies.`;
        } else if (experienceLevel === "entry") {
            activePrompt = entryLevelPrompt + `\n\nCRITICAL CONTEXT: The user is an Entry-Level professional targeting the exact role of "${targetRole}". You MUST blend their early-career execution with their education to prove they are a perfect fit for this specific position.`;
        }

        const promptWithJD = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information:\n${extraInfo}\n\nAnalyze and optimize this resume according to the JSON format:`;
        
        // Pass the dynamically selected brain into the AI function
        let aiResponse = await generateAIResponseWithRetry(promptWithJD, filePart, activePrompt);
        
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

// A. Login / Fetch Profile Endpoint
app.post('/api/auth', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        // Check if user already exists
        let { data: user, error: fetchError } = await supabase
            .from('candidate_profiles')
            .select('*')
            .eq('email', email)
            .single();

        // If user doesn't exist, create a new row with 2 free credits
        if (!user || fetchError) {
            const { data: newUser, error: insertError } = await supabase
                .from('candidate_profiles')
                .insert([{ email: email, credits: 2, master_resume: {} }])
                .select()
                .single();
                
            if (insertError) throw new Error("Failed to create user profile");
            user = newUser;
        }

        res.json({ success: true, profile: user });
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
});

// B. Save / Update Master Profile
app.post('/api/save-profile', async (req, res) => {
    try {
        const { email, resumeData } = req.body;
        if (!email || !resumeData) return res.status(400).json({ error: "Missing data" });

        const { error } = await supabase
            .from('candidate_profiles')
            .update({ master_resume: resumeData })
            .eq('email', email);

        if (error) throw error;
        res.json({ success: true, message: "Profile saved to cloud" });
    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ error: "Failed to save profile" });
    }
});

// C. Spend a Tailor Credit
app.post('/api/use-credit', async (req, res) => {
    try {
        const { email } = req.body;
        
        // 1. Fetch current credits
        const { data: user } = await supabase
            .from('candidate_profiles')
            .select('credits')
            .eq('email', email)
            .single();

        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.credits <= 0) return res.status(403).json({ error: "Out of credits", redirect: "paywall" });

        // 2. Deduct 1 credit
        const newBalance = user.credits - 1;
        const { error: updateError } = await supabase
            .from('candidate_profiles')
            .update({ credits: newBalance })
            .eq('email', email);

        if (updateError) throw updateError;
        res.json({ success: true, remainingCredits: newBalance });
    } catch (error) {
        console.error("Credit Error:", error);
        res.status(500).json({ error: "Failed to process credit" });
    }
});

app.listen(port, () => { console.log(`Engine running at port ${port}`); });
