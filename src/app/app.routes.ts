import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProductsComponent } from './pages/products/products.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Specialist Pistachio Nursery & Cultivation' },
  { path: 'about', component: AboutComponent, title: 'About Our Nursery - Pistachio Specialist' },
  { path: 'products', component: ProductsComponent, title: 'Plants & Rootstocks - Pistachio Specialist' },
  { path: 'contact', component: ContactComponent, title: 'Contact Our Agricultural Team - Pistachio Specialist' },
  { path: '**', redirectTo: '' }
];
