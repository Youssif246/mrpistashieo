import { RenderMode, ServerRoute } from '@angular/ssr';
import arArticles from '../assets/data/articles/ar.json';
import enArticles from '../assets/data/articles/en.json';

/**
 * Indexable static pages, prerendered for BOTH languages at build time.
 * Keep in sync with `localizedRoutes` in app.routes.ts and public/sitemap.xml.
 */
const STATIC_PAGES = ['', 'about', 'services', 'varieties', 'usb1', 'articles', 'contact'];
const LANGS = ['ar', 'en'] as const;

const staticPrerenderRoutes: ServerRoute[] = LANGS.flatMap(lang =>
  STATIC_PAGES.map(page => ({
    path: page ? `${lang}/${page}` : lang,
    renderMode: RenderMode.Prerender
  }) as ServerRoute)
);

export const serverRoutes: ServerRoute[] = [
  ...staticPrerenderRoutes,

  // Arabic article pages — slugs come from the Arabic data file
  {
    path: 'ar/articles/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return arArticles.map((article: { slug: string }) => ({ slug: article.slug }));
    }
  },

  // English article pages — slugs come from the English data file
  {
    path: 'en/articles/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return enArticles.map((article: { slug: string }) => ({ slug: article.slug }));
    }
  },

  // Everything else (legacy redirects, root redirect, unknown URLs) is rendered
  // on demand by the Node SSR server, so redirects become real HTTP redirects
  // and unknown URLs return HTTP 404 (set in NotFoundComponent via RESPONSE_INIT).
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
