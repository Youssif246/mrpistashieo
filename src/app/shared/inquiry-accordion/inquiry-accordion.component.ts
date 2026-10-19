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

  // Validation & Touch State
  readonly submitted = signal(false);
  touched = {
    name: false,
    phone: false,
    email: false,
    message: false
  };

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

  onBlur(field: 'name' | 'phone' | 'email' | 'message'): void {
    this.touched[field] = true;
    this.cdr.markForCheck();
  }

  onInput(field: 'name' | 'phone' | 'email' | 'message'): void {
    if (this.submitStatus() === 'error') {
      this.submitStatus.set('idle');
      this.statusMessage.set('');
    }
    this.cdr.markForCheck();
  }

  getNameError(): string {
    const val = (this.name || '').trim();
    if (!val || val.length < 2) {
      return this.i18n.t().contact.form.errors.nameRequired;
    }
    return '';
  }

  getPhoneError(): string {
    const val = (this.phone || '').trim();
    if (!val) {
      return this.i18n.t().contact.form.errors.phoneRequired;
    }
    const digitsOnly = val.replace(/\D/g, '');
    const isValidFormat = /^[+]?[\d\s\-()]{7,25}$/.test(val) && digitsOnly.length >= 7;
    if (!isValidFormat) {
      return this.i18n.t().contact.form.errors.phoneInvalid;
    }
    return '';
  }

  getEmailError(): string {
    const val = (this.email || '').trim();
    if (!val) {
      return this.i18n.t().contact.form.errors.emailRequired;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(val)) {
      return this.i18n.t().contact.form.errors.emailInvalid;
    }
    return '';
  }

  getMessageError(): string {
    const val = (this.message || '').trim();
    if (!val) {
      return this.i18n.t().contact.form.errors.messageRequired;
    }
    if (val.length < 10) {
      return this.i18n.t().contact.form.errors.messageTooShort;
    }
    return '';
  }

  isFieldInvalid(field: 'name' | 'phone' | 'email' | 'message'): boolean {
    const isTouched = this.touched[field] || this.submitted();
    if (!isTouched) return false;

    switch (field) {
      case 'name':
        return !!this.getNameError();
      case 'phone':
        return !!this.getPhoneError();
      case 'email':
        return !!this.getEmailError();
      case 'message':
        return !!this.getMessageError();
      default:
        return false;
    }
  }

  isFormValid(): boolean {
    return !this.getNameError() && !this.getPhoneError() && !this.getEmailError() && !this.getMessageError();
  }

  async onSubmit(event?: Event): Promise<void> {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    if (this.isSubmitting()) return;

    // Mark all as touched on submit attempt
    this.submitted.set(true);
    this.touched.name = true;
    this.touched.phone = true;
    this.touched.email = true;
    this.touched.message = true;

    // Validate form before any network call
    if (!this.isFormValid()) {
      this.submitStatus.set('error');
      this.statusMessage.set(this.i18n.t().contact.form.errors.formInvalid);
      this.cdr.markForCheck();

      // Focus first invalid input element
      const firstInvalidId = this.getNameError()
        ? 'inquiry-name'
        : this.getPhoneError()
        ? 'inquiry-phone'
        : this.getEmailError()
        ? 'inquiry-email'
        : 'inquiry-details';

      if (typeof document !== 'undefined') {
        const el = document.getElementById(firstInvalidId);
        if (el) {
          el.focus();
        }
      }
      return;
    }

    this.isSubmitting.set(true);
    this.submitStatus.set('idle');
    this.statusMessage.set('');
    this.cdr.markForCheck();

    const trimmedName = this.name.trim();
    const trimmedPhone = this.phone.trim();
    const trimmedEmail = this.email.trim();
    const trimmedMessage = this.message.trim();

    const formData = new FormData();
    formData.append('access_key', '496522ba-f583-41dc-a6b3-285e56f27251');
    formData.append('from_name', 'Mister Pistachio Website');
    formData.append('subject', this.i18n.currentLang() === 'ar'
      ? `طلب استفسار جديد: ${trimmedName} (${this.interest})`
      : `New Inquiry: ${trimmedName} (${this.interest})`);
    formData.append('name', trimmedName);
    formData.append('phone', trimmedPhone);
    formData.append('email', trimmedEmail);
    formData.append('interest', this.interest);
    formData.append('message', trimmedMessage);

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
        this.submitted.set(false);
        this.touched = {
          name: false,
          phone: false,
          email: false,
          message: false
        };
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
