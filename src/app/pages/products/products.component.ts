import { Component, inject } from '@angular/core';
import { TranslationService } from '../../shared/translation.service';
import { APP_CONFIG } from '../../shared/config';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  readonly i18n = inject(TranslationService);

  getUcb1WhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود الاستفسار عن توفر أصل UCB1 وأسعاره وكمياته.'
      : 'Hello, I am interested in UCB1 rootstock.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  getTraditionalWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود الاستفسار عن الأصول التقليدية (كورنيكابرا وأتلانتيكا).'
      : 'Hello, I would like to inquire about traditional rootstocks (Cornicabra and Atlantica).';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  getGraftedWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود الاستفسار عن شتلات الفستق المطعمة (في أوعية وعارية الجذور).'
      : 'Hello, I would like to inquire about grafted pistachio plants (potted and bare-root).';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  getVarietiesWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود الاستفسار عن توفر الأصناف الإنتاجية والملقحات (كيرمان، سيرورا، لارناكا، بيتر).'
      : 'Hello, I would like to inquire about pistachio varieties and pollinators (Kerman, Sirora, Larnaka, Peter).';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}
