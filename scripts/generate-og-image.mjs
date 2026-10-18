import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOgImage() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const logoFile = path.resolve(__dirname, '../public/logo.png');
  const logoBase64 = fs.readFileSync(logoFile).toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;
  
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=IBM+Plex+Sans+Arabic:wght@600;700&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1200px;
        height: 630px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(120% 90% at 20% 10%, #FFFFFF 0%, #FDFCFA 55%, #F5F2EB 100%);
        font-family: 'Plus Jakarta Sans', sans-serif;
        position: relative;
        overflow: hidden;
      }
      /* Outer luxury green and gold border */
      .frame {
        position: absolute;
        inset: 24px;
        border: 3.5px solid #14351E;
        border-radius: 20px;
        pointer-events: none;
      }
      .frame-inner {
        position: absolute;
        inset: 34px;
        border: 1.5px solid rgba(194, 154, 74, 0.45);
        border-radius: 14px;
        pointer-events: none;
      }
      .content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 32px;
      }
      .logo-img {
        width: 680px;
        height: auto;
        max-height: 340px;
        object-fit: contain;
        filter: drop-shadow(0 14px 28px rgba(20, 53, 30, 0.12));
      }
      .tagline-badge {
        display: inline-flex;
        align-items: center;
        gap: 16px;
        padding: 12px 32px;
        background: #14351E;
        color: #FAF7F0;
        border-radius: 999px;
        border: 1.5px solid rgba(194, 154, 74, 0.7);
        box-shadow: 0 6px 20px rgba(20, 53, 30, 0.22);
      }
      .tagline-text {
        font-size: 21px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #ECC880;
      }
      .tagline-arabic {
        font-family: 'IBM Plex Sans Arabic', sans-serif;
        font-size: 21px;
        font-weight: 700;
        color: #FFFFFF;
      }
      .tagline-dot {
        color: #C29A4A;
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <div class="frame"></div>
    <div class="frame-inner"></div>
    <div class="content">
      <img src="${logoDataUri}" class="logo-img" alt="Mister Pistachio">
      <div class="tagline-badge">
        <span class="tagline-text">Specialist Pistachio Nursery</span>
        <span class="tagline-dot">◆</span>
        <span class="tagline-arabic">مشاتل الفستق الحلبي التخصصية</span>
      </div>
    </div>
  </body>
  </html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  const outputPath = path.resolve(__dirname, '../public/og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log(`✓ Generated luxury social preview image at: ${outputPath}`);
}

generateOgImage().catch(err => {
  console.error(err);
  process.exit(1);
});
