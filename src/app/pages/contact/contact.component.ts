import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
import { APP_CONFIG } from '../../shared/config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  readonly social = APP_CONFIG.social;
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private gsapCtx?: gsap.Context;

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

  // Accordion FAQ Card State for Contact Form
  readonly isFormOpen = signal(false);

  toggleForm(): void {
    this.isFormOpen.update(open => !open);
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';

    if (typeof window !== 'undefined' && (window.location.hash === '#inquiry' || window.location.hash === '#form')) {
      this.isFormOpen.set(true);
    }

    this.seo.updateSeo({
      lang: this.i18n.currentLang(),
      path: '/contact',
      title: isAr
        ? 'تواصل معنا واستشر خبراءنا الزراعيين | مستر بستاشيو'
        : 'Contact Us & Consult Our Agronomic Engineers | Mister Pistachio',
      description: isAr
        ? 'تواصل مع فريق مستر بستاشيو المتخصص للحصول على استشارات زراعية، حجز شتلات UCB1، وتخطيط مشاريع بساتين الفستق الحلبي.'
        : 'Get in touch with Mister Pistachio agricultural specialists for technical consultations, certified UCB1 rootstock reservations, and orchard development planning.',
      image: 'contact-images/contact-hero.webp'
    });

    this.seo.setStructuredData('contact-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': isAr ? 'الرئيسية' : 'Home',
          'item': `https://misterpistachio.com/${this.i18n.currentLang()}`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': isAr ? 'اتصل بنا' : 'Contact Us',
          'item': `https://misterpistachio.com/${this.i18n.currentLang()}/contact`
        }
      ]
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.initAnimations();
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  private initAnimations(): void {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {
      // 1. HERO ENTRANCE (PATTERN A & E)
      const hero = this.el.nativeElement.querySelector('#contactHero') as HTMLElement | null;
      if (hero) {
        const eyebrow = hero.querySelector('.inner-hero-eyebrow');
        const heading = hero.querySelector('.inner-hero-heading');
        const connector = hero.querySelector('.inner-hero-connector');
        const desc = hero.querySelector('.inner-hero-desc');
        const aura = hero.querySelector('.inner-hero-aura');
        const botanical = hero.querySelector('.inner-hero-botanical');

        if (prefersReducedMotion) {
          if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
          if (heading) gsap.set(heading, { opacity: 1, y: 0 });
          if (desc) gsap.set(desc, { opacity: 1, y: 0 });
          if (botanical) gsap.set(botanical, { opacity: 0.85, scale: 1 });
        } else {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.05 });
          if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.45 });
          if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');
          if (connector) tl.to(connector, { scaleX: 1, opacity: 0.65, duration: 0.35 }, '-=0.35');
          if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
          if (aura) tl.to(aura, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4');
          if (botanical) tl.to(botanical, { opacity: 0.85, scale: 1, duration: 0.6 }, '-=0.45');
        }
      }

      // 2. SPREAD SECTION ENTRANCE (FOUNDER QUOTE, DOSSIER & FAQ CARD)
      const spreadSection = this.el.nativeElement.querySelector('#contactSpread') as HTMLElement | null;
      if (spreadSection) {
        const founderPanel = spreadSection.querySelector('.founder-editorial-panel');
        const dossierPanel = spreadSection.querySelector('.contact-dossier-panel');
        const cardShowcase = spreadSection.querySelector('.luxury-card-showcase-wrapper');
        const faqCard = spreadSection.querySelector('.contact-faq-inquiry-container');

        if (cardShowcase) gsap.set(cardShowcase, { opacity: 1, y: 0 });

        if (prefersReducedMotion) {
          if (founderPanel) gsap.set(founderPanel, { opacity: 1, y: 0 });
          if (dossierPanel) gsap.set(dossierPanel, { opacity: 1, y: 0 });
          if (faqCard) gsap.set(faqCard, { opacity: 1, y: 0 });
        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: spreadSection,
              start: 'top 78%',
              once: true
            }
          });

          if (faqCard) tl.fromTo(faqCard, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
          if (founderPanel) tl.fromTo(founderPanel, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.4');
          if (dossierPanel) tl.fromTo(dossierPanel, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.5');
        }
      }

      // 3. NURSERY LOCATION MONOGRAPH (PATTERN B/C)
      const locationSection = this.el.nativeElement.querySelector('#nurseryLocation') as HTMLElement | null;
      if (locationSection) {
        const locationCard = locationSection.querySelector('.location-editorial-card');
        if (prefersReducedMotion) {
          if (locationCard) gsap.set(locationCard, { opacity: 1, y: 0 });
        } else if (locationCard) {
          gsap.to(locationCard, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: locationSection,
              start: 'top 82%',
              once: true
            }
          });
        }
      }

      // 4. BOTANICAL SLENDER BRANCH PARALLAX
      if (!prefersReducedMotion) {
        const slenderBranch = this.el.nativeElement.querySelector('#contactSpread .botanical-shadow--bottom-left');
        if (slenderBranch) {
          gsap.to(slenderBranch, {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: '#contactSpread',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2
            }
          });
        }
      }
    }, this.el);
  }

  getGeneralWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود التواصل مع فريقكم الزراعي للاستفسار عن شتلات الفستق.'
      : 'Hello, I would like to contact your agricultural team regarding pistachio plants.';
    return APP_CONFIG.getWhatsAppUrl(msg);
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
