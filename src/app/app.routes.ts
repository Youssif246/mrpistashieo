import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ProductsComponent } from './pages/products/products.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Specialist Pistachio Nursery & Cultivation' },
  { path: 'about', component: AboutComponent, title: 'About Our Nursery - Pistachio Specialist' },
  { path: 'services', component: ServicesComponent, title: 'Agricultural Services & Orchard Engineering - Mister Pistachio' },
  { path: 'products', component: ProductsComponent, title: 'Pistachio Varieties & Certified Rootstocks - Mister Pistachio' },
  { path: 'contact', component: ContactComponent, title: 'Contact Our Agricultural Team - Pistachio Specialist' },
  { path: '**', redirectTo: '' }
];
