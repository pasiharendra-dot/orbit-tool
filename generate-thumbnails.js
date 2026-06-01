const puppeteer = require('puppeteer');
const sharp = require('sharp');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, '/'))); 
const PORT = 3000;

const layouts = ['sentinel', 'vanguard', 'creative', 'global'];
const themes = ['orbit', 'emerald', 'charcoal', 'ruby', 'slate'];
const fonts = ['modern', 'classic', 'tech', 'elegant'];

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    const imgDir = path.join(__dirname, 'images');
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir);

    console.log('Launching headless browser...');
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1131, deviceScaleFactor: 2 });

    for (let i = 0; i < 50; i++) {
        const layout = layouts[i % layouts.length];
        const theme = themes[i % themes.length];
        const font = fonts[i % fonts.length];

        const url = `http://localhost:${PORT}/dashboard.html?screenshot_mode=true&layout=${layout}&theme=${theme}&font=${font}`;
        console.log(`Generating Template ${i + 1}/50...`);
        
        await page.goto(url, { waitUntil: 'networkidle0' }); 

        const canvasElement = await page.$('#preview-frame');
        
        if (canvasElement) {
            const screenshotBuffer = await canvasElement.screenshot();
            const outputPath = path.join(imgDir, `template-${i + 1}.webp`);
            
            await sharp(screenshotBuffer)
                .resize({ width: 600 }) 
                .webp({ quality: 80 })  
                .toFile(outputPath);
                
            console.log(`Saved template-${i + 1}.webp`);
        }
    }

    await browser.close();
    process.exit(0);
});
