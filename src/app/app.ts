import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FloatingWhatsappComponent } from './shared/floating-whatsapp/floating-whatsapp.component';
import { PistachioIntroComponent } from './shared/pistachio-intro/pistachio-intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, FloatingWhatsappComponent, PistachioIntroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  readonly showIntro = signal(true);

  onIntroComplete(): void {
    this.showIntro.set(false);
  }
}
export { App as AppComponent };
