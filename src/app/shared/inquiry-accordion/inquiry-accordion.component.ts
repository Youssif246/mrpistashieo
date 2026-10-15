import { Component, Input, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-inquiry-accordion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inquiry-accordion.component.html',
  styleUrl: './inquiry-accordion.component.css'
})
export class InquiryAccordionComponent implements OnInit {
  readonly i18n = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() defaultInterest: string = 'General Pistachio Plants Inquiry';

  // Form Model
  name = '';
  phone = '';
  email = '';
  interest = 'General Pistachio Plants Inquiry';
  message = '';

  // Form Submission Reactive State (Signals)
  readonly isSubmitting = signal(false);
  readonly submitStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly statusMessage = signal('');

  // Accordion State
  readonly isFormOpen = signal(false);

  ngOnInit(): void {
    if (this.defaultInterest) {
      this.interest = this.defaultInterest;
    }
  }

  toggleForm(): void {
    this.isFormOpen.update(open => !open);
    this.cdr.markForCheck();
  }

  async onSubmit(event?: Event): Promise<void> {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.submitStatus.set('idle');
    this.statusMessage.set('');
    this.cdr.markForCheck();

    const formData = new FormData();
    formData.append('access_key', '496522ba-f583-41dc-a6b3-285e56f27251');
    formData.append('from_name', 'Mister Pistachio Website');
    formData.append('subject', this.i18n.currentLang() === 'ar'
      ? `طلب استفسار جديد: ${this.name || 'عميل'} (${this.interest})`
      : `New Inquiry: ${this.name || 'Client'} (${this.interest})`);
    formData.append('name', this.name);
    formData.append('phone', this.phone);
    formData.append('email', this.email);
    formData.append('interest', this.interest);
    formData.append('message', this.message);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.submitStatus.set('success');
        this.statusMessage.set(this.i18n.currentLang() === 'ar'
          ? 'تم إرسال استفسارك بنجاح! سيتواصل معك فريقنا الزراعي في أقرب وقت.'
          : 'Your inquiry has been submitted successfully! Our agronomic team will contact you shortly.');

        this.name = '';
        this.phone = '';
        this.email = '';
        this.message = '';
      } else {
        throw new Error(result.message || 'Submission error');
      }
    } catch {
      this.submitStatus.set('error');
      this.statusMessage.set(this.i18n.currentLang() === 'ar'
        ? 'تعذر إرسال النموذج حالياً، يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة عبر واتساب.'
        : 'Could not submit the form right now. Please try again or contact us directly via WhatsApp.');
    } finally {
      this.isSubmitting.set(false);
      this.cdr.markForCheck();
    }
  }
}
