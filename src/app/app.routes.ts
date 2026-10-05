import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ProductsComponent } from './pages/products/products.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ArticleDetailsComponent } from './pages/article-details/article-details.component';
import { Ucb1Component } from './pages/ucb1/ucb1.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { langGuard } from './shared/lang.guard';

const localizedRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'varieties', component: ProductsComponent },
  { path: 'products', redirectTo: 'varieties', pathMatch: 'full' },
  { path: 'ucb1', component: Ucb1Component },
  { path: 'usb1', redirectTo: 'ucb1', pathMatch: 'full' },
  { path: 'rootstock-ucb1', redirectTo: 'ucb1', pathMatch: 'full' },
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/:slug', component: ArticleDetailsComponent },
  { path: 'contact', component: ContactComponent }
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
  { path: '**', component: NotFoundComponent }
];
