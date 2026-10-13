import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distBrowserDir = path.join(rootDir, 'dist', 'project', 'browser');

const testPages = [
  { name: 'AR Homepage', file: 'ar/index.html', expectedLang: 'ar', expectedDir: 'rtl' },
  { name: 'EN Homepage', file: 'en/index.html', expectedLang: 'en', expectedDir: 'ltr' },
  { name: 'AR UCB1', file: 'ar/ucb1/index.html', expectedLang: 'ar', expectedDir: 'rtl' },
  { name: 'EN UCB1', file: 'en/ucb1/index.html', expectedLang: 'en', expectedDir: 'ltr' },
  { name: 'AR Varieties', file: 'ar/varieties/index.html', expectedLang: 'ar', expectedDir: 'rtl' },
  { name: 'EN Varieties', file: 'en/varieties/index.html', expectedLang: 'en', expectedDir: 'ltr' },
  { name: 'AR Article', file: 'ar/articles/pistachio-orchard-guide/index.html', expectedLang: 'ar', expectedDir: 'rtl' },
  { name: 'EN Article', file: 'en/articles/pistachio-orchard-guide/index.html', expectedLang: 'en', expectedDir: 'ltr' },
  { name: '404 Page', file: '404.html', expectedLang: 'ar', expectedDir: 'rtl' }
];

console.log('='.repeat(70));
console.log('VERIFYING PRERENDERED HTML FILES (Angular 21 Static Build)');
console.log('='.repeat(70));

let allPassed = true;

for (const p of testPages) {
  const filePath = path.join(distBrowserDir, p.file);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] File missing: ${p.file}`);
    allPassed = false;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const sizeKb = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);

  // Extract metadata
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'N/A';

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const desc = descMatch ? descMatch[1] : 'N/A';

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : 'N/A';

  const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  const dirMatch = html.match(/<html[^>]*dir=["']([^"']+)["']/i);
  const lang = langMatch ? langMatch[1] : 'N/A';
  const dir = dirMatch ? dirMatch[1] : 'N/A';

  const hreflangMatches = [...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/gi)]
    .map(m => `${m[1]}: ${m[2]}`);

  const ldJsonCount = (html.match(/<script\s+type=["']application\/ld\+json["']/gi) || []).length;
  const hasAppRoot = html.includes('<app-root') && html.includes('</app-root>');
  const bodyTextLength = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                             .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                             .replace(/<[^>]+>/g, ' ')
                             .replace(/\s+/g, ' ').trim().length;

  console.log(`\n--- ${p.name} (${p.file}) [${sizeKb} KB] ---`);
  console.log(`Title:       ${title}`);
  console.log(`Description: ${desc.slice(0, 80)}...`);
  console.log(`Canonical:   ${canonical}`);
  console.log(`HTML Lang:   ${lang} (expected: ${p.expectedLang}) | Dir: ${dir} (expected: ${p.expectedDir})`);
  console.log(`Hreflangs:   ${hreflangMatches.length > 0 ? hreflangMatches.join(' | ') : 'None'}`);
  console.log(`JSON-LD:     ${ldJsonCount} schema block(s) found`);
  console.log(`Body Text:   ${bodyTextLength} characters rendered (prerendered DOM present: ${bodyTextLength > 500})`);

  if (!title || title === 'N/A') {
    console.error(`  -> FAIL: Missing title`);
    allPassed = false;
  }
  if (!canonical || canonical === 'N/A') {
    if (p.file !== '404.html') {
      console.error(`  -> FAIL: Missing canonical`);
      allPassed = false;
    }
  } else if (!canonical.endsWith('/')) {
    console.error(`  -> FAIL: Canonical missing trailing slash: ${canonical}`);
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(70));
if (allPassed) {
  console.log('ALL PRERENDERED PAGES PASSED VERIFICATION CRITERIA!');
} else {
  console.error('SOME PRERENDERED PAGES FAILED VERIFICATION.');
}
console.log('='.repeat(70));
