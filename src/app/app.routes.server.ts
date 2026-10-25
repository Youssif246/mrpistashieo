import { RenderMode, ServerRoute } from '@angular/ssr';
import arArticles from '../assets/data/articles/ar.json';
import enArticles from '../assets/data/articles/en.json';

/**
 * Indexable static pages, prerendered for BOTH languages at build time.
 * Keep in sync with `localizedRoutes` in app.routes.ts and public/sitemap.xml.
 */
const STATIC_PAGES = ['', 'about', 'services', 'varieties', 'ucb1', 'wholesale', 'articles', 'contact'];
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

  // Standalone 404 page prerendered for static hosting error document
  {
    path: '404',
    renderMode: RenderMode.Prerender
  },

  // Fallback for client-side routing on static hosting
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
