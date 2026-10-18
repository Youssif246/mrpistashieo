import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateBusinessCardAssets() {
  console.log('--- GENERATING MISTER PISTACHIO BUSINESS CARD ASSETS ---');
  
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const assetsDir = path.resolve(__dirname, '../../business-card-assets');
  const desktopDir = 'C:\\Users\\Elhamd\\Desktop\\Mister-Pistachio-Business-Card';

  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });

  const htmlPath = path.join(assetsDir, 'business-card.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  console.log(`Connecting to Edge at: ${edgePath}`);
  console.log(`Loading HTML from: ${fileUrl}`);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--font-render-hinting=max',
      '--force-color-profile=srgb'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 3 });
    
    // Navigate and wait until network is completely idle
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Ensure all Google Fonts and custom fonts are fully loaded
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 1000));

    // 1. Generate Print-Ready 2-Page Vector PDF (85mm x 55mm)
    const pdfPathAssets = path.join(assetsDir, 'mister-pistachio-business-card.pdf');
    const pdfPathDesktop = path.join(desktopDir, 'mister-pistachio-business-card.pdf');

    console.log('Generating 2-page print-ready vector PDF (85mm x 55mm)...');
    await page.pdf({
      path: pdfPathAssets,
      width: '85mm',
      height: '55mm',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
      preferCSSPageSize: true
    });
    
    fs.copyFileSync(pdfPathAssets, pdfPathDesktop);
    console.log(`✓ PDF saved to: ${pdfPathDesktop}`);

    // 2. Capture Ultra-HD 4K Images for WhatsApp (Front & Back)
    const cards = await page.$$('.business-card');
    if (cards.length >= 2) {
      console.log('Capturing Ultra-HD images for WhatsApp...');
      
      const frontImgAssets = path.join(assetsDir, 'card-front.png');
      const frontImgDesktop = path.join(desktopDir, 'card-front.png');
      await cards[0].screenshot({ path: frontImgAssets, type: 'png' });
      fs.copyFileSync(frontImgAssets, frontImgDesktop);
      console.log(`✓ Front image saved to: ${frontImgDesktop}`);

      const backImgAssets = path.join(assetsDir, 'card-back.png');
      const backImgDesktop = path.join(desktopDir, 'card-back.png');
      await cards[1].screenshot({ path: backImgAssets, type: 'png' });
      fs.copyFileSync(backImgAssets, backImgDesktop);
      console.log(`✓ Back image saved to: ${backImgDesktop}`);
    }

    console.log('=== ALL BUSINESS CARD ASSETS GENERATED & SAVED COMPLETELY OUTSIDE DIST! ===');
  } finally {
    await browser.close();
  }
}

generateBusinessCardAssets().catch(err => {
  console.error('Error generating card assets:', err);
  process.exit(1);
});
