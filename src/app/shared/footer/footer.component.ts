import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../translation.service';
import { APP_CONFIG } from '../config';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly i18n = inject(TranslationService);
  readonly currentYear = new Date().getFullYear();
  readonly social = APP_CONFIG.social;

  getWhatsAppLink(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود الاستفسار عن حجز شتلات الفستق والخدمات الحقلية.'
      : 'Hello, I would like to inquire about pistachio plants and field services.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}
