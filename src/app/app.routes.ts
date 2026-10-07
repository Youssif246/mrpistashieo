import { Routes } from '@angular/router';
import { langGuard } from './shared/lang.guard';

const localizedRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'varieties',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  },
  { path: 'products', redirectTo: 'varieties', pathMatch: 'full' },
  {
    path: 'ucb1',
    loadComponent: () => import('./pages/ucb1/ucb1.component').then(m => m.Ucb1Component)
  },
  { path: 'usb1', redirectTo: 'ucb1', pathMatch: 'full' },
  { path: 'rootstock-ucb1', redirectTo: 'ucb1', pathMatch: 'full' },
  {
    path: 'articles',
    loadComponent: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent)
  },
  {
    path: 'articles/:slug',
    loadComponent: () => import('./pages/article-details/article-details.component').then(m => m.ArticleDetailsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  }
];

export const routes: Routes = [
  // Root entry: Arabic is the default language (also the x-default hreflang target).
  // A plain redirect is rendered by the SSR server as an HTTP redirect.
  { path: '', pathMatch: 'full', redirectTo: 'ar' },

  // Arabic routes: /ar/...
  {
    path: 'ar',
    canActivateChild: [langGuard],
    children: localizedRoutes
  },

  // English routes: /en/...
  {
    path: 'en',
    canActivateChild: [langGuard],
    children: localizedRoutes
  },

  // Legacy route backwards compatibility -> redirect to /ar/...
  { path: 'about', redirectTo: 'ar/about', pathMatch: 'full' },
  { path: 'services', redirectTo: 'ar/services', pathMatch: 'full' },
  { path: 'varieties', redirectTo: 'ar/varieties', pathMatch: 'full' },
  { path: 'products', redirectTo: 'ar/varieties', pathMatch: 'full' },
  { path: 'ucb1', redirectTo: 'ar/ucb1', pathMatch: 'full' },
  { path: 'usb1', redirectTo: 'ar/ucb1', pathMatch: 'full' },
  { path: 'rootstock-ucb1', redirectTo: 'ar/ucb1', pathMatch: 'full' },
  { path: 'articles', redirectTo: 'ar/articles', pathMatch: 'full' },
  { path: 'articles/:slug', redirectTo: 'ar/articles/:slug' },
  { path: 'contact', redirectTo: 'ar/contact', pathMatch: 'full' },

  // 404 Catch-All Page
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
