import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../shared/translation.service';
import { APP_CONFIG } from '../../shared/config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  readonly i18n = inject(TranslationService);
  readonly social = APP_CONFIG.social;

  // Form Model
  name = '';
  phone = '';
  email = '';
  interest = 'General Pistachio Plants Inquiry';
  projectDetails = '';

  getGeneralWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود التواصل مع فريقكم الزراعي للاستفسار عن شتلات الفستق.'
      : 'Hello, I would like to contact your agricultural team regarding pistachio plants.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  onSubmit(): void {
    const isAr = this.i18n.currentLang() === 'ar';
    const lines = [
      isAr ? '🌱 استفسار جديد عبر الموقع الإلكتروني:' : '🌱 New Inquiry from Corporate Website:',
      `${isAr ? 'الاسم' : 'Name'}: ${this.name || (isAr ? 'غير محدد' : 'Not provided')}`,
      `${isAr ? 'الهاتف' : 'Phone'}: ${this.phone || (isAr ? 'غير محدد' : 'Not provided')}`,
      `${isAr ? 'البريد الإلكتروني' : 'Email'}: ${this.email || (isAr ? 'غير محدد' : 'Not provided')}`,
      `${isAr ? 'الموضوع' : 'Interest'}: ${this.interest}`,
      `${isAr ? 'تفاصيل المشروع' : 'Project Details'}: ${this.projectDetails || (isAr ? 'لا يوجد تفاصيل إضافية' : 'None')}`
    ];

    const fullMessage = lines.join('\n');
    const waUrl = APP_CONFIG.getWhatsAppUrl(fullMessage);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
}
