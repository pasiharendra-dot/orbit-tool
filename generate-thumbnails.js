const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs'); // 👈 1. Add the File System module

// Array of templates to capture
const templates = [
  { name: 'executive-layout', url: 'http://localhost:3000/preview/executive' },
];

(async () => {
  console.log('🚀 Booting up thumbnail generator...');
  
  // 👈 2. Define the new folder path and create it if it's missing
  const imageFolder = path.join(__dirname, 'images');
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
    console.log('📁 Created new "images" folder!');
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  for (const template of templates) {
    console.log(`\n⏳ Generating Template: ${template.name}...`);

    try {
      await page.goto(template.url, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 1000));

      const targetElement = '#workspace-canvas';
      const resumeBox = await page.$(targetElement);

      if (!resumeBox) {
        console.error(`❌ ERROR: Could not find '${targetElement}' for ${template.name}.`);
        continue; 
      }

      // 👈 3. Route the screenshot directly into the new image folder
      const outputPath = path.join(imageFolder, `${template.name}-thumb.png`);
      await resumeBox.screenshot({ path: outputPath });

      console.log(`✅ Saved! Thumbnail generated at: ${outputPath}`);

    } catch (err) {
      console.error(`❌ CRITICAL FAILURE on ${template.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n🎉 Finished processing all templates!');
})();
