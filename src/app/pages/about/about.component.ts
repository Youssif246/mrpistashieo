import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { APP_CONFIG } from '../../shared/config';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  readonly i18n = inject(TranslationService);

  getWhatsAppLink(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود استشارة فريقكم الزراعي حول مشروع زراعة الفستق.'
      : 'Hello, I would like to consult with your agricultural team regarding our pistachio project.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}
