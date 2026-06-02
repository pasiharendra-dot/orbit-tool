const puppeteer = require('puppeteer');
const path = require('path');

// Array of templates to capture (Replace with your actual URLs/paths)
const templates = [
  { name: 'executive-layout', url: 'http://localhost:3000/preview/executive' },
  // Add your other template URLs here
];

(async () => {
  console.log('🚀 Booting up thumbnail generator...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Set the viewport to ensure the resume renders at a good resolution
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  for (const template of templates) {
    console.log(`\n⏳ Generating Template: ${template.name}...`);

    try {
      // 1. Go to the page and wait for network activity to quiet down
      await page.goto(template.url, { waitUntil: 'networkidle0', timeout: 30000 });

      // 2. The 1-Second Buffer: Give web fonts and builder scripts time to fully paint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Look for your exact resume container
      const targetElement = '#workspace-canvas';
      const resumeBox = await page.$(targetElement);

      // 4. The Bulletproof Check: If it's missing, tell us exactly why!
      if (!resumeBox) {
        console.error(`❌ ERROR: Could not find '${targetElement}' for ${template.name}.`);
        console.error(`   👉 Fix: Check if the ID changed, or if the page failed to render the resume.`);
        continue; // Move on to the next template instead of crashing completely
      }

      // 5. Take a screenshot of ONLY the resume canvas
      const outputPath = path.join(__dirname, `${template.name}-thumb.png`);
      await resumeBox.screenshot({ path: outputPath });

      console.log(`✅ Saved! Thumbnail generated at: ${outputPath}`);

    } catch (err) {
      // Catch page timeouts or navigation errors
      console.error(`❌ CRITICAL FAILURE on ${template.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n🎉 Finished processing all templates!');
})();
