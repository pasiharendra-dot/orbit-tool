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
// DYNAMIC AI PROMPT GENERATOR
// ==========================================
function getAIPrompt(experienceLevel, targetRole, industry, roleCategory) {
    let rolePrompt = "";
    let roleSchema = "";

    if (roleCategory === 'tech_role') {
        rolePrompt = "The user is in a Technical/Engineering role. You MUST categorize their skills into a 'technical_skills' array of objects (e.g., Languages, Frameworks, Tools) instead of a flat list.";
        roleSchema = `
    "technical_skills": [
      { "category": "Languages", "skills": ["JavaScript", "Python"] },
      { "category": "Frameworks", "skills": ["React", "Node.js"] },
      { "category": "Tools", "skills": ["Git", "Docker"] }
    ],`;
    } else if (roleCategory === 'clinical_role') {
        rolePrompt = "The user is in a Clinical/Healthcare role. Extract or infer any hands-on clinical experience and list it in 'clinical_rotations'.";
        roleSchema = `\n    "clinical_rotations": ["ICU - 400 hrs", "Pediatrics - 200 hrs"],`;
    } else if (roleCategory === 'academic_role') {
        rolePrompt = "The user is in an Academic/Research role. Extract or generate highly professional 'publications' or research focus areas.";
        roleSchema = `\n    "publications": ["Research Paper Title, Journal of X, 2023", "Conference Presentation on Y"],`;
    } else if (roleCategory === 'creative_role') {
        rolePrompt = "The user is in a Creative/Design role. Include a 'portfolio_links' array for digital work samples or repositories.";
        roleSchema = `\n    "portfolio_links": ["Portfolio: www.design.com", "Behance: behance.net/user"],`;
    } else if (roleCategory === 'legal') { 
        rolePrompt = "The user is in a Legal role. Include a 'bar_admissions' array.";
        roleSchema = `\n    "bar_admissions": ["Admitted to New York State Bar, 2022"],`;
    }

    const baseOutputFormat = `{
    "before": {"score": 45, "fail_points": ["Point 1", "Point 2", "Point 3"]},
    "after": {
      "score": 94,
      "name": "...", "phone": "...", "email": "...", "location": "...", "linkedin": "...",
      "optimized_title": "...",
      "improved_summary": ["..."],
      "achievements_and_awards": ["..."],
      ${roleSchema}
      "core_skills": ["..."],
      "experience": [
        { "company": "...", "location": "...", "title": "...", "dates": "...", "bullets": ["..."] }
      ],
      "internships": ["..."],
      "projects": ["..."],
      "volunteer": ["..."],
      "extracurriculars": ["..."],
      "education": [
        { "degree": "...", "institution": "...", "date": "..." }
      ],
      "certifications": ["..."],
      "personal_details": [
        { "label": "Date of Birth", "value": "..." }
      ]
    }
  }`;

    let roleContext = "";
    let specificRules = "";

if (experienceLevel === "fresher") {
        roleContext = `Role: You are an Empathetic Entry-Level Career Strategist at Orbit Careers.\nYour singular goal is to OPTIMIZE a student or recent graduate's resume for ATS systems to help them secure internships or entry-level roles.`;
        specificRules = `1. Zero Experience is Okay: Do NOT invent work history. Focus heavily on academic projects, relevant coursework, thesis work, and extracurricular leadership. Treat major university projects as "Experience" if work history is missing.
2. Title Format: The "optimized_title" MUST fit on a single line. Use this exact structure: "Aspiring [Target Job Title] | [Degree] | Strong foundation in [Core Skill 1] & [Core Skill 2]".
3. Core Skills Format: You MUST output EXACTLY 12 core skills. Focus on academic skills, fast learning, and foundational tools. Output ONLY the raw skill name. 
4. Professional Summary Format: You MUST write exactly 3 short paragraphs following this strict "Hook -> Proof -> Value" framework:
   - Paragraph 1 (Identity): "Highly motivated [Degree/Title] with a strong foundation in [Core Domain], poised to drive [impact] in the [Industry]."
   - Paragraph 2 (Proof): "Delivered impact through [Major Academic Project/Internship], achieving [Metric/Result]." (Use placeholders like [X]% if metrics are missing).
   - Paragraph 3 (Value): "Proven expertise in [Skill 1], [Skill 2], and [Skill 3]. Known for [key academic strength/fast learning], ensuring readiness to deliver immediate value."
   STRICTLY NO first-person pronouns ("I", "Me", "My").
5. Work Experience & Project Format: Rewrite using the XYZ framework (Accomplished [X] as measured by [Y], by doing [Z]). Replace passive phrases ('helped with', 'responsible for') with strong, direct action verbs. If metrics are missing, use placeholders (e.g., 'achieving a grade of [X]%' or 'saving [X] hours') to make it measurable. Format as a single cohesive sentence starting with an action verb. DO NOT include bullet characters (like •). ABSOLUTELY NO MARKDOWN BOLDING (**).
6. Extra Sections: Optimize the provided internships, projects, volunteer work, and extracurriculars. Format each entry as a distinct string in its array.
CRITICAL CONTEXT: The user is a Fresher targeting the exact role of "${targetRole}". You MUST frame their academic projects, certifications, and educational background to prove they are a perfect fit.`;
    } else if (experienceLevel === "entry") {
        roleContext = `Role: You are an Expert Early-Career Strategist at Orbit Careers.\nYour singular goal is to OPTIMIZE an entry-level professional's resume (1-3 years experience) for ATS systems.`;
        specificRules = `1. The Hybrid Approach: Blend their early-career execution with a strong emphasis on their degree and technical skills. 
2. No Hallucinations: Do not invent leadership or strategy roles. Focus on collaboration, execution, process adherence, and fast learning.
3. Title Format: The "optimized_title" MUST fit on a single line. Use this exact structure: "[Target Job Title] | [Degree or Certification] | Focus in [Core Skill 1] & [Core Skill 2]".
4. Core Skills Format: You MUST output EXACTLY 12 core skills. Blend foundational tools with soft skills. Output ONLY the raw skill name. 
5. Professional Summary Format: You MUST write exactly 3 short paragraphs following this strict "Hook -> Proof -> Value" framework:
   - Paragraph 1 (Identity): "Results-driven [Title] with [X] years of experience, driving [early-career impact] in the [Industry]."
   - Paragraph 2 (Proof): "Delivered impact at scale through [Specific Project/Execution], achieving [Metric 1] and [Metric 2]. Currently [doing X] as [Current Title], driving [Specific Result]." (Use placeholders like [X]% if metrics are missing).
   - Paragraph 3 (Value): "Proven expertise in [Skill 1], [Skill 2], and [Skill 3]. Known for [key strength/process improvement], ensuring [business outcome/efficiency]."
   STRICTLY NO first-person pronouns ("I", "Me", "My").
6. Work Experience Format: Rewrite using the Problem → Action → Result (XYZ) framework. Focus on execution and process improvement rather than basic tasks. Replace passive phrases with strong action verbs. You MUST inject metric placeholders (e.g., 'improving efficiency by [X]%', 'managing [X] client accounts') if exact numbers aren't provided. Format as a single cohesive sentence starting with an action verb. DO NOT include bullet characters (like •). ABSOLUTELY NO MARKDOWN BOLDING (**).
7. Extra Sections: Optimize the provided internships, projects, volunteer work, and extracurriculars. Format each entry as a distinct string in its array.
CRITICAL CONTEXT: The user is an Entry-Level professional targeting the exact role of "${targetRole}". You MUST blend their early-career execution with their education to prove they are a perfect fit.`;
    } else {
        roleContext = `Role: You are an Elite Executive Resume Strategist at Orbit Careers.\nYour singular goal is to OPTIMIZE the user's resume for ATS systems and executive recruiters.`;
        specificRules = `1. Zero Seniority Hallucination: Do NOT elevate the user's job level.
2. YoE Calculation: Calculate exact Years of Experience based on the oldest job vs 2026. State this in the summary.
3. Title Format: The "optimized_title" MUST fit on a single line. Use this exact template structure: "[Target Job Title or Current Role] | [Years of Experience]+ years in [Core Domain 1] & [Core Domain 2] | [Secondary Domain or Skill]". CRITICAL ANTI-REPETITION RULE: You MUST NOT repeat major words across the title.
4. Core Skills Format: You MUST output EXACTLY 12 core skills. Output ONLY the raw skill name. ABSOLUTELY NO CATEGORIES OR COLONS.
5. Professional Summary Format: You MUST write exactly 3 short paragraphs following this strict "Hook -> Proof -> Value" framework:
   - Paragraph 1 (Identity): "[Adjective] leader with [X]+ years of progressive leadership across [Geographies/Markets], driving [high-level impact] and organizational transformation in the [Industry]."
   - Paragraph 2 (Proof): "Delivered impact at scale with [Metric 1/Revenue], [Metric 2], and [Metric 3]. Currently leading [Key Project/Responsibility] as [Current Title] at [Company], driving [Specific Result]." (Inject placeholders like $[X]M if metrics are missing).
   - Paragraph 3 (Value): "Proven expertise in [Skill 1], [Skill 2], and [Skill 3]. Known for building high-performance teams and [Government/CXO/Client] relationships, ensuring sustained revenue growth and profitability."
   STRICTLY NO first-person pronouns ("I", "Me", "My").
6. Work Experience Format: Rewrite using the Problem → Action → Result (XYZ) framework. Focus heavily on strategic ownership, business impact, and leadership rather than basic, daily tasks. Replace passive phrases with strong executive action verbs (e.g., Spearheaded, Architected, Directed). You MUST inject high-level metric placeholders (e.g., 'generating $[X]M in revenue', 'scaling team by [X]%', 'reducing costs by $[X]') if exact numbers are missing to force measurable achievements. Format as a single cohesive sentence starting with an action verb. DO NOT include bullet characters (like •). ABSOLUTELY NO MARKDOWN BOLDING (**).`;
    }
    
    return `${roleContext}
  
User's Target Role: ${targetRole}
User's Macro Industry: ${industry || 'General Professional'}
${rolePrompt}

STRICT GUARDRAILS:
${specificRules}

Output Format: You MUST return a JSON object with this exact structure:
${baseOutputFormat}
DO NOT wrap in markdown. Output ONLY raw JSON starting with { and ending with }.`;
}

app.post('/api/create-order', async (req, res) => {
    try {
        const { hasShared, hasReferral, promoCode, plan } = req.body; 
        
        // DYNAMIC BASE PRICE FOR 3 TIERS
        let basePrice = 199; // Default 'single'
        if (plan === 'annual') basePrice = 499;
        if (plan === 'expert') basePrice = 2499; 
        
        // ==========================================
        // THE PROMO CODE ENGINE
        // ==========================================
        if (promoCode) {
            const cleanCode = promoCode.toUpperCase().trim();
            
            // Affiliate Tier (Only applies to 'single' plan for safety)
            if (cleanCode === "SYMBIOSIS99" || cleanCode === "NMIMS99" || cleanCode === "LAUNCH99") {
                if (plan === 'single') basePrice = 99;
            } 
            // Founder Tier
            else if (cleanCode === "FOUNDER") {
                basePrice = 1;
            }
        }

        const finalPricePaise = Math.round(basePrice) * 100; 

        const options = {
            amount: finalPricePaise, 
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7)
        };
        const order = await razorpay.orders.create(options);
        
        res.json({ id: order.id, amount: order.amount, calculatedPrice: Math.round(basePrice), plan: plan });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: "Could not create Razorpay order" });
    }
});

// ==========================================
// SECURITY ADDITION: Razorpay Payment Verification & Tracking
// ==========================================
app.post('/api/payment/verify', async (req, res) => {
    try {
        // ADDED: promoCode extracted from the frontend request
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, email, promoCode } = req.body;
        
        if (!email) return res.status(400).json({ error: "Missing candidate email context." });

        const secret = process.env.RAZORPAY_KEY_SECRET; 
        const generated_signature = crypto.createHmac('sha256', secret).update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

        if (generated_signature === razorpay_signature) {
            
            // 1. Fetch user's current credits
            const { data: userRecord } = await supabase
                .from('candidate_profiles')
                .select('credits, master_resume')
                .eq('email', email)
                .single();
                
            const currentCredits = userRecord ? (userRecord.credits || 0) : 0;
            // Attempt to get the user's name if saved in the database
            const userName = userRecord && userRecord.master_resume ? userRecord.master_resume.name : "Unknown User";

            // 2. Provision Plan & Credits
            let updateData = { plan_type: plan || 'single' };
            let creditsToAdd = 50;
            let expiryDate = new Date();

            if (plan === 'annual' || plan === 'expert') {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                updateData.plan_expiry = expiryDate.toISOString();
                creditsToAdd = 300; 
            } else {
                expiryDate.setDate(expiryDate.getDate() + 7);
                updateData.plan_expiry = expiryDate.toISOString();
                creditsToAdd = 50;
            }
            
            updateData.download_used = false; 
            updateData.credits = currentCredits + creditsToAdd;
            
            const { error: dbError } = await supabase.from('candidate_profiles').update(updateData).eq('email', email);
            if (dbError) throw new Error("Payment verified but failed to provision your plan features.");

            // 3. BACKGROUND TRACKING: Push to Google Sheets
            // We do this asynchronously (without 'await') so it doesn't slow down the user's success screen
            try {
                const GOOGLE_TRACKER_URL = "https://script.google.com/macros/s/AKfycbxq5u9yJhF1j0Sg_Nws0awK3VrvwQGcoumZphjb752GSYUS_4OWeo23tNyhqLAd2rZO/exec";
                const trackerPayload = {
                    name: userName,
                    email: email,
                    action: `PURCHASE - ${plan.toUpperCase()}`,
                    promoCode: promoCode ? promoCode.toUpperCase() : "NONE",
                    paymentId: razorpay_payment_id
                };
                
                fetch(GOOGLE_TRACKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trackerPayload)
                }).catch(err => console.error("Non-fatal Google Sheet Tracker Error:", err));
            } catch (trackerErr) {
                console.error("Failed to fire Google Sheet Tracker:", trackerErr);
            }

            res.status(200).json({ status: "success", message: "Payment verified and plan activated." });
        } else {
            res.status(400).json({ error: "Invalid payment signature." });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ error: error.message || "Server error during payment verification" });
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
                console.log("Triggering Emergency Fallback to 2.5-flash model...");
                try {
                    const fallbackModel = genAI.getGenerativeModel({ 
                        model: "gemini-2.5-flash", 
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
        
        // Extract variables from the frontend
        const experienceLevel = req.body.experienceLevel || "mid";
        const targetRole = req.body.targetRole || "";
        const industry = req.body.industry || "General";
        const roleCategory = req.body.roleCategory || "standard_role";
        
        // Extract Fresher Fields
        const internships = req.body.internships || "";
        const projects = req.body.projects || "";
        const volunteer = req.body.volunteer || "";
        const extracurriculars = req.body.extracurriculars || "";
        
        // Use req.file.buffer directly from memory storage
        const pdfBase64 = req.file.buffer.toString("base64");
        const filePart = { inlineData: { data: pdfBase64, mimeType: "application/pdf" } };
        
        // Pass the dynamically selected brain into the AI function
        let activePrompt = getAIPrompt(experienceLevel, targetRole, industry, roleCategory);

        // Build the additional context string for freshers
        let additionalFresherContext = "";
        if (internships) additionalFresherContext += `\nCandidate's Internships:\n${internships}\n`;
        if (projects) additionalFresherContext += `\nCandidate's Projects:\n${projects}\n`;
        if (volunteer) additionalFresherContext += `\nCandidate's Volunteer Work:\n${volunteer}\n`;
        if (extracurriculars) additionalFresherContext += `\nCandidate's Extracurriculars:\n${extracurriculars}\n`;

        const promptWithJD = `Target JD Context:\n${jobDescription}\n\nUser's Additional Information:\n${extraInfo}${additionalFresherContext}\n\nAnalyze and optimize this resume according to the JSON format:`;
        
        // Fire the AI call
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
// ==========================================
// NEW: AI OPTIMIZATION ENDPOINT
// ==========================================
app.post('/api/optimize-resume', async (req, res) => {
    const { email, section, currentContent, jobDescription } = req.body;

    try {
        // 1. Verify User & Credits
        const { data: user, error: userError } = await supabase
            .from('candidate_profiles')
            .select('credits')
            .eq('email', email)
            .single();

        if (userError || !user) throw new Error("User not found");
        if (user.credits <= 0) return res.status(403).json({ message: "Out of credits. Please purchase more." });

        // 2. Select AI Prompt based on section
        let promptInstruction = `You are a resume expert. Rewrite the following resume section: ${section}.`;
        if (section === 'title') promptInstruction = "Act as a professional resume writer. Rewrite this resume title to be more impactful and ATS-friendly, focusing on leadership and results.";
        if (section === 'summary') promptInstruction = "Act as a professional resume writer. Rewrite this professional summary to be concise, results-oriented, and impactful, keeping it under 3 sentences.";
        if (section === 'bullets') promptInstruction = "Act as a professional resume writer. Rewrite these bullet points to be action-oriented, quantifiable, and use high-impact power verbs. Focus on results achieved.";

        const fullPrompt = `${promptInstruction}\n\nContext:\nTarget Job Description: ${jobDescription}\n\nCurrent Content: ${currentContent}\n\nReturn ONLY the optimized text.`;

        // 3. Generate AI Response
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(fullPrompt);
        const optimizedText = result.response.text().trim();

        // 4. Deduct Credit
        await supabase
            .from('candidate_profiles')
            .update({ credits: user.credits - 1 })
            .eq('email', email);

        // 5. Send back to Dashboard
        res.status(200).json({
            success: true,
            optimizedText: optimizedText,
            remainingCredits: user.credits - 1
        });

    } catch (error) {
        console.error("AI Route Error:", error);
        res.status(500).json({ message: "AI processing failed. Please try again." });
    }
});
app.listen(port, () => { console.log(`Engine running at port ${port}`); });

// ==========================================
// NEW: COVER LETTER AI ENDPOINT
// ==========================================
app.post('/api/generate-cover-letter', async (req, res) => {
    const { email, role, company, tone, resumeData } = req.body;

    try {
        // 1. Verify User & Credits
        const { data: user, error: userError } = await supabase
            .from('candidate_profiles')
            .select('credits')
            .eq('email', email)
            .single();

        if (userError || !user) throw new Error("User not found");
        if (user.credits <= 0) return res.status(403).json({ message: "Out of credits. Please purchase more." });

// 2. Build the Expert Prompt
        let toneInstruction = "Traditional, highly professional, and respectful, focusing on reliability and proven execution.";
        if (tone === 'confident') toneInstruction = "Confident, executive, authoritative, and results-driven. Frame the applicant as a high-ROI strategic asset.";
        if (tone === 'direct') toneInstruction = "Direct, punchy, startup-ready, modern, and highly actionable. Cut straight to the business impact.";

const systemPrompt = `Role: You are an Elite Career Strategist at Orbit Careers.
Your singular goal is to take a user's raw job responsibilities and rewrite them into powerful, ATS-optimized bullet points using the Problem -> Action -> Result (XYZ) framework.

Strict Guidelines:
1. Impact & Execution: Replace passive phrases with strong action verbs. Focus on strategic ownership and business impact.
2. Metrics: You MUST inject metric placeholders (e.g., '[X]%', '$[X]M', '[Number]') if exact numbers are missing to force measurable achievements.
3. CRITICAL FORMATTING RULE: You must output pure, plain text only for each point. You are strictly forbidden from using asterisks (*), markdown bolding (**), or bullet symbols (•, -, ·).
   - CORRECT EXAMPLE: Directed end-to-end campaign data lifecycle, achieving 100% compliance with program guidelines.
   - INCORRECT EXAMPLE: * **Directed** end-to-end campaign...

Output each rewritten responsibility as a single, plain-text sentence. If returning multiple points, separate them by a newline character only. Do not add any conversational filler.`;        
        
        const userPrompt = `Target Role: ${role}\nTarget Company: ${company}\n\nCandidate Resume Data:\n${JSON.stringify(resumeData)}\n\nWrite the cover letter body now.`;

        // 3. Generate AI Response
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemPrompt });
        const result = await model.generateContent(userPrompt);
        const coverLetterBody = result.response.text().trim();

        // 4. Deduct 1 Credit
        await supabase
            .from('candidate_profiles')
            .update({ credits: user.credits - 1 })
            .eq('email', email);

        // 5. Send back to Dashboard
        res.status(200).json({
            success: true,
            coverLetter: coverLetterBody,
            remainingCredits: user.credits - 1
        });

    } catch (error) {
        console.error("Cover Letter AI Error:", error);
        res.status(500).json({ message: "Cover letter generation failed." });
    }
});
