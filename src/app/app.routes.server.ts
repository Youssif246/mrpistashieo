import { RenderMode, ServerRoute } from '@angular/ssr';
import articles from '../assets/data/articles/en.json';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'articles/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return articles.map(article => ({ slug: article.slug }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
