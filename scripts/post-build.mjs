/**
 * Post-build script for Mister Pistachio (مستر بيستاشيو) static production build.
 * 
 * Responsibilities:
 * 1. Generates dist/project/browser/index.html (root redirect to /ar/ with SEO canonical + hreflang).
 * 2. Copies dist/project/browser/404/index.html to dist/project/browser/404.html (Apache/Hostinger ErrorDocument).
 * 3. Builds a fresh, comprehensive, 100% validated sitemap.xml dynamically from src/assets/data/articles/ar.json & en.json
 *    and writes to both public/sitemap.xml and dist/project/browser/sitemap.xml.
 * 4. Ensures .htaccess and robots.txt are present in dist/project/browser/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distBrowserDir = path.join(rootDir, 'dist', 'project', 'browser');
const publicDir = path.join(rootDir, 'public');
const SITE_DOMAIN = process.env.SITE_DOMAIN || 'https://misterpistachio.com';

function log(msg) {
  console.log(`[post-build] ${msg}`);
}

// 1. Verify build directory exists
if (!fs.existsSync(distBrowserDir)) {
  console.error(`[post-build] Error: Output directory not found at ${distBrowserDir}. Did "ng build" run?`);
  process.exit(1);
}

// 2. Generate root index.html with meta refresh & hreflang
const rootIndexHtmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>مستر بيستاشيو | Mister Pistachio – الفستق الحلبي وشتلاته</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="مستر بيستاشيو (Mister Pistachio) – رواد إنتاج شتلات الفستق الحلبي المؤصلة، أصول UCB1 المعتمدة، والتأسيس الهندسي المتكامل للبساتين الحديثة.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE_DOMAIN}/ar/">
  <link rel="alternate" hreflang="ar" href="${SITE_DOMAIN}/ar/">
  <link rel="alternate" hreflang="en" href="${SITE_DOMAIN}/en/">
  <link rel="alternate" hreflang="x-default" href="${SITE_DOMAIN}/ar/">
  <meta http-equiv="refresh" content="0; url=/ar/">
  <script>
    window.location.replace('/ar/');
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fafaf8; color: #202b23; text-align: center; }
    .card { padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-width: 480px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #2d4533; }
    p { margin-bottom: 1.5rem; color: #5e6d62; }
    a { display: inline-block; padding: 0.75rem 1.5rem; background: #2d4533; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0.25rem; }
    a.alt { background: transparent; color: #2d4533; border: 1px solid #2d4533; }
  </style>
</head>
<body>
  <div class="card">
    <h1>مستر بيستاشيو | Mister Pistachio</h1>
    <p>جاري تحويلك إلى الموقع الرسمي... / Redirecting to the official website...</p>
    <a href="/ar/">العربية (الموقع الافتراضي)</a>
    <a class="alt" href="/en/">English</a>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(distBrowserDir, 'index.html'), rootIndexHtmlContent, 'utf-8');
log('Generated root dist/project/browser/index.html with immediate /ar/ redirect and hreflang.');

// 3. Ensure 404.html exists in dist/project/browser
const prerendered404Index = path.join(distBrowserDir, '404', 'index.html');
const dest404Html = path.join(distBrowserDir, '404.html');

if (fs.existsSync(prerendered404Index)) {
  fs.copyFileSync(prerendered404Index, dest404Html);
  log('Copied prerendered 404/index.html to dist/project/browser/404.html for Apache ErrorDocument.');
} else {
  log('Notice: 404/index.html not found; skipping 404.html copy.');
}

// 4. Generate dynamic sitemap.xml
try {
  const arArticlesPath = path.join(rootDir, 'src', 'assets', 'data', 'articles', 'ar.json');
  const enArticlesPath = path.join(rootDir, 'src', 'assets', 'data', 'articles', 'en.json');

  const arArticles = JSON.parse(fs.readFileSync(arArticlesPath, 'utf-8'));
  const enArticles = JSON.parse(fs.readFileSync(enArticlesPath, 'utf-8'));

  // Static routes (MUST use varieties, NOT products which is a 301 redirect!)
  const staticRoutes = [
    { ar: '', en: '' },
    { ar: '/about', en: '/about' },
    { ar: '/services', en: '/services' },
    { ar: '/varieties', en: '/varieties' },
    { ar: '/ucb1', en: '/ucb1' },
    { ar: '/articles', en: '/articles' },
    { ar: '/contact', en: '/contact' }
  ];

  const todayIso = new Date().toISOString().slice(0, 10);

  /**
   * Cleans a URL to ensure:
   * 1. No Markdown syntax e.g. [url](url)
   * 2. No brackets or parentheses
   * 3. Exact trailing slash matching Apache 200 OK directory structure
   * 4. XML-safe character escaping
   */
  function cleanUrl(rawUrl) {
    if (!rawUrl) return '';
    let cleaned = String(rawUrl).trim();
    // Strip markdown link pattern if present
    const mdMatch = cleaned.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (mdMatch) {
      cleaned = mdMatch[2] || mdMatch[1];
    }
    // Remove any leftover brackets or parentheses
    cleaned = cleaned.replace(/[\[\]\(\)]/g, '').trim();
    // Ensure trailing slash for directory routes
    if (!cleaned.endsWith('/')) {
      cleaned = `${cleaned}/`;
    }
    // XML escaping
    return cleaned
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Parse date and ensure it is NEVER in the future.
   */
  function parseArticleDate(dateStr) {
    if (!dateStr) return todayIso;
    const parsed = new Date(`${dateStr} 00:00:00 UTC`);
    if (isNaN(parsed.getTime())) return todayIso;
    const iso = parsed.toISOString().slice(0, 10);
    return iso > todayIso ? todayIso : iso;
  }

  const sitemapEntries = [];

  // Add static routes
  for (const route of staticRoutes) {
    const arUrl = cleanUrl(`${SITE_DOMAIN}/ar${route.ar}`);
    const enUrl = cleanUrl(`${SITE_DOMAIN}/en${route.en}`);

    sitemapEntries.push(`  <url>
    <loc>${arUrl}</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>
  </url>`);

    sitemapEntries.push(`  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>
  </url>`);
  }

  // Add Arabic articles
  for (const arArt of arArticles) {
    const enEquivalent = enArticles.find(e => e.id === arArt.id);
    const arUrl = cleanUrl(`${SITE_DOMAIN}/ar/articles/${arArt.slug}`);
    const enUrl = enEquivalent ? cleanUrl(`${SITE_DOMAIN}/en/articles/${enEquivalent.slug}`) : null;
    const lastmod = parseArticleDate(enEquivalent?.date || arArt.date);

    let linksXml = `    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>\n`;
    if (enUrl) {
      linksXml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n`;
    }
    linksXml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}"/>`;

    sitemapEntries.push(`  <url>
    <loc>${arUrl}</loc>
    <lastmod>${lastmod}</lastmod>
${linksXml}
  </url>`);
  }

  // Add English articles
  for (const enArt of enArticles) {
    const arEquivalent = arArticles.find(a => a.id === enArt.id);
    const enUrl = cleanUrl(`${SITE_DOMAIN}/en/articles/${enArt.slug}`);
    const arUrl = arEquivalent ? cleanUrl(`${SITE_DOMAIN}/ar/articles/${arEquivalent.slug}`) : null;
    const lastmod = parseArticleDate(enArt.date);

    let linksXml = '';
    if (arUrl) {
      linksXml += `    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>\n`;
    }
    linksXml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n`;
    linksXml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl || enUrl}"/>`;

    sitemapEntries.push(`  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
${linksXml}
  </url>`);
  }

  // Strict valid XML declaration with zero preceding whitespace or BOM
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('\n')}
</urlset>
`;

  // Write to public/ and dist/project/browser/
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  fs.writeFileSync(path.join(distBrowserDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  log(`Generated sitemap.xml with ${sitemapEntries.length} URL entries (static pages + all dynamic articles).`);
} catch (err) {
  console.error('[post-build] Error generating sitemap:', err);
  process.exit(1);
}

// 5. Ensure .htaccess and robots.txt in dist/project/browser
const htaccessSource = path.join(publicDir, '.htaccess');
const htaccessDest = path.join(distBrowserDir, '.htaccess');
if (fs.existsSync(htaccessSource)) {
  fs.copyFileSync(htaccessSource, htaccessDest);
  log('Copied .htaccess to dist/project/browser/.');
}

const robotsSource = path.join(publicDir, 'robots.txt');
const robotsDest = path.join(distBrowserDir, 'robots.txt');
if (fs.existsSync(robotsSource)) {
  fs.copyFileSync(robotsSource, robotsDest);
  log('Copied robots.txt to dist/project/browser/.');
}

log('Post-build processing complete.');
