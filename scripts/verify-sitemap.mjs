/**
 * Automated Sitemap Validator for Mister Pistachio (مستر بيستاشيو).
 * 
 * Validates:
 * 1. Strict XML syntax & encoding (parsed via JSDOM XML DOMParser).
 * 2. Proper namespaces (sitemap 0.9 & xhtml).
 * 3. Zero Markdown syntax (no square brackets, parentheses in URLs).
 * 4. All URLs use official HTTPS protocol and domain.
 * 5. All URLs use trailing slash matching 200 OK Apache directory endpoints.
 * 6. Zero redirect routes (no /products or /usb1).
 * 7. Every URL corresponds to an existing prerendered HTML file in dist/project/browser.
 * 8. Zero duplicate URLs.
 * 9. Valid lastmod dates (YYYY-MM-DD) and no dates in the future.
 * 10. Reciprocal hreflang annotations (ar <-> en, x-default).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distBrowserDir = path.join(rootDir, 'dist', 'project', 'browser');
const sitemapPath = path.join(distBrowserDir, 'sitemap.xml');

console.log('='.repeat(70));
console.log('SITEMAP AUTOMATED VALIDATION (Google Search Console Standards)');
console.log('='.repeat(70));

const errors = [];
const warnings = [];

// 1. Check file exists
if (!fs.existsSync(sitemapPath)) {
  console.error(`[FATAL] sitemap.xml not found at: ${sitemapPath}`);
  process.exit(1);
}

const rawXml = fs.readFileSync(sitemapPath, 'utf-8');

// 2. Check XML Declaration
if (!rawXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  errors.push('XML declaration missing or not at offset 0 (must be <?xml version="1.0" encoding="UTF-8"?>)');
}

// 3. Detect any Markdown link syntax in raw file
const markdownMatches = rawXml.match(/\[[^\]]+\]\([^)]+\)/g);
if (markdownMatches) {
  errors.push(`Detected Markdown link syntax in XML: ${JSON.stringify(markdownMatches)}`);
}

const bracketMatches = rawXml.match(/href=["'][^"']*[\[\]\(\)][^"']*["']/g);
if (bracketMatches) {
  errors.push(`Detected brackets or parentheses in href attributes: ${JSON.stringify(bracketMatches)}`);
}

// 4. Parse XML with JSDOM XML DOMParser
let dom;
try {
  dom = new JSDOM(rawXml, { contentType: 'application/xml' });
} catch (e) {
  errors.push(`XML Parsing exception: ${e.message}`);
}

const doc = dom ? dom.window.document : null;
if (doc) {
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    errors.push(`XML Parser Error: ${parserError.textContent.trim()}`);
  }
}

if (errors.length > 0) {
  console.error('\nPre-parse validation failed:');
  errors.forEach(e => console.error('  -> ERROR:', e));
  process.exit(1);
}

// 5. Namespace and root validation
const rootElement = doc.documentElement;
if (rootElement.nodeName.toLowerCase() !== 'urlset') {
  errors.push(`Root element must be <urlset>, found: <${rootElement.nodeName}>`);
}

const expectedNs = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const rootNs = rootElement.getAttribute('xmlns');
if (rootNs !== expectedNs) {
  errors.push(`Invalid root xmlns. Expected "${expectedNs}", found "${rootNs}"`);
}

const xhtmlNs = rootElement.getAttribute('xmlns:xhtml');
if (xhtmlNs !== 'http://www.w3.org/1999/xhtml') {
  errors.push(`Invalid xmlns:xhtml. Expected "http://www.w3.org/1999/xhtml", found "${xhtmlNs}"`);
}

// 6. URL Nodes Analysis
const urlNodes = doc.querySelectorAll('url');
const urlCount = urlNodes.length;
console.log(`Found ${urlCount} <url> entries in sitemap.xml.`);

if (urlCount === 0) {
  errors.push('Sitemap contains 0 <url> entries.');
}

const seenLocs = new Set();
const parsedEntries = [];
const todayIso = new Date().toISOString().slice(0, 10);

urlNodes.forEach((node, idx) => {
  const locElem = node.querySelector('loc');
  if (!locElem) {
    errors.push(`Entry #${idx + 1} is missing <loc> element.`);
    return;
  }

  const loc = locElem.textContent.trim();

  // Validate URL syntax
  let parsedUrl;
  try {
    parsedUrl = new URL(loc);
  } catch (err) {
    errors.push(`Entry #${idx + 1} has invalid URL format: "${loc}"`);
    return;
  }

  // Hostname & Protocol
  if (parsedUrl.protocol !== 'https:') {
    errors.push(`Entry #${idx + 1} ("${loc}") protocol must be https:`);
  }
  if (parsedUrl.hostname !== 'www.misterpistachio.com') {
    errors.push(`Entry #${idx + 1} ("${loc}") hostname must be www.misterpistachio.com, got: ${parsedUrl.hostname}`);
  }

  // Trailing slash requirement for directory routes
  if (!loc.endsWith('/')) {
    errors.push(`Entry #${idx + 1} ("${loc}") missing trailing slash (causes 301 redirect on static hosting).`);
  }

  // Check against known redirect routes
  if (parsedUrl.pathname.includes('/products') || parsedUrl.pathname.includes('/usb1') || parsedUrl.pathname.includes('/rootstock-ucb1')) {
    errors.push(`Entry #${idx + 1} contains legacy redirect route: "${loc}". Only canonical routes allowed.`);
  }

  // Check duplicate
  if (seenLocs.has(loc)) {
    errors.push(`Duplicate URL in sitemap: "${loc}"`);
  }
  seenLocs.add(loc);

  // Check physical file exists in dist/project/browser
  // pathname e.g. /ar/ -> ar/index.html ; /ar/about/ -> ar/about/index.html
  const relPath = parsedUrl.pathname.replace(/^\//, '').replace(/\/$/, '');
  const htmlFile = path.join(distBrowserDir, relPath, 'index.html');
  if (!fs.existsSync(htmlFile)) {
    errors.push(`Sitemap URL "${loc}" has no corresponding generated file: ${htmlFile}`);
  }

  // Check lastmod
  const lastmodElem = node.querySelector('lastmod');
  if (lastmodElem) {
    const lastmod = lastmodElem.textContent.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
      errors.push(`Entry "${loc}" has invalid lastmod date format: "${lastmod}" (must be YYYY-MM-DD).`);
    } else if (lastmod > todayIso) {
      errors.push(`Entry "${loc}" has future lastmod date: "${lastmod}" (today is ${todayIso}).`);
    }
  }

  // Check xhtml:link alternates
  const linkNodes = node.querySelectorAll('xhtml\\:link, link');
  const alternates = [];
  linkNodes.forEach(link => {
    const rel = link.getAttribute('rel');
    const hreflang = link.getAttribute('hreflang');
    const href = link.getAttribute('href');

    if (rel !== 'alternate') {
      errors.push(`Entry "${loc}" xhtml:link rel must be "alternate", got: "${rel}"`);
    }
    if (!['ar', 'en', 'x-default'].includes(hreflang)) {
      errors.push(`Entry "${loc}" invalid hreflang: "${hreflang}"`);
    }
    if (!href) {
      errors.push(`Entry "${loc}" alternate link missing href`);
    } else {
      if (href.includes('[') || href.includes(']') || href.includes('(') || href.includes(')')) {
        errors.push(`Entry "${loc}" alternate href contains Markdown syntax: "${href}"`);
      }
      if (!href.startsWith('https://www.misterpistachio.com/')) {
        errors.push(`Entry "${loc}" alternate href has wrong domain: "${href}"`);
      }
      if (!href.endsWith('/')) {
        errors.push(`Entry "${loc}" alternate href missing trailing slash: "${href}"`);
      }
      alternates.push({ hreflang, href });
    }
  });

  parsedEntries.push({ loc, alternates });
});

// 7. Verify Reciprocal Alternates
for (const entry of parsedEntries) {
  for (const alt of entry.alternates) {
    if (alt.hreflang !== 'x-default') {
      // The alternate target must exist in the sitemap
      if (!seenLocs.has(alt.href)) {
        errors.push(`URL "${entry.loc}" lists alternate "${alt.href}" (${alt.hreflang}), but that URL is not present in sitemap.xml!`);
      }
    }
  }
}

console.log('\n--- VALIDATION SUMMARY ---');
console.log(`Total URLs Checked:     ${seenLocs.size}`);
console.log(`Total Errors Detected:  ${errors.length}`);
console.log(`Total Warnings:         ${warnings.length}`);

if (errors.length > 0) {
  console.error('\nVALIDATION FAILED WITH ERRORS:');
  errors.forEach(e => console.error('  [FAIL]', e));
  process.exit(1);
} else {
  console.log('\nSITEMAP IS 100% VALID & FULLY COMPLIANT WITH GOOGLE SEARCH CONSOLE STANDARDS!');
  console.log('='.repeat(70));
  process.exit(0);
}
