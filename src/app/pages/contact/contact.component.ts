import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../shared/translation.service';
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
export class ContactComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  readonly social = APP_CONFIG.social;
  private readonly el = inject(ElementRef);
  private gsapCtx?: gsap.Context;

  // Form Model
  name = '';
  phone = '';
  email = '';
  interest = 'General Pistachio Plants Inquiry';
  projectDetails = '';

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    setTimeout(() => {
      this.initAnimations();
    }, 80);
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  private initAnimations(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {
      // 1. HERO ENTRANCE & BOTANICAL AMBIENCE
      const heroLockup = this.el.nativeElement.querySelector('.contact-hero-lockup') as HTMLElement | null;
      const heroAmbientDecor = this.el.nativeElement.querySelector('.contact-hero-ambient') as HTMLElement | null;

      if (prefersReducedMotion) {
        if (heroLockup) gsap.set(heroLockup.children, { opacity: 1, y: 0 });
        return;
      }

      if (heroLockup) {
        gsap.set(heroLockup.children, { opacity: 0, y: 24 });
        gsap.to(heroLockup.children, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power2.out',
          delay: 0.1
        });
      }

      if (heroAmbientDecor) {
        const leafArt = heroAmbientDecor.querySelector('.contact-hero-botanical-svg');
        const watermark = heroAmbientDecor.querySelector('.hero-watermark-monograph');

        if (leafArt) {
          gsap.to(leafArt, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: '#contactHero',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }

        if (watermark) {
          gsap.to(watermark, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
              trigger: '#contactHero',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8
            }
          });
        }
      }

      // 2. SPREAD SECTION ENTRANCE (DOSSIER & INQUIRY SHEET)
      const spreadSection = this.el.nativeElement.querySelector('#contactSpread') as HTMLElement | null;
      if (spreadSection) {
        const dossierPanel = spreadSection.querySelector('.contact-dossier-panel');
        const formPanel = spreadSection.querySelector('.contact-form-panel');

        if (prefersReducedMotion) {
          if (dossierPanel) gsap.set(dossierPanel, { opacity: 1, y: 0 });
          if (formPanel) gsap.set(formPanel, { opacity: 1, y: 0 });
        } else {
          if (dossierPanel) gsap.set(dossierPanel, { opacity: 0, y: 28 });
          if (formPanel) gsap.set(formPanel, { opacity: 0, y: 32 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: spreadSection,
              start: 'top 78%',
              once: true
            }
          });

          if (dossierPanel) tl.to(dossierPanel, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' });
          if (formPanel) tl.to(formPanel, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.55');
        }
      }

      // 3. NURSERY LOCATION MONOGRAPH
      const locationSection = this.el.nativeElement.querySelector('#nurseryLocation') as HTMLElement | null;
      if (locationSection) {
        const locationCard = locationSection.querySelector('.location-editorial-card');
        if (prefersReducedMotion) {
          if (locationCard) gsap.set(locationCard, { opacity: 1, y: 0 });
        } else {
          if (locationCard) gsap.set(locationCard, { opacity: 0, y: 24, scale: 0.99 });
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
    }, this.el);
  }

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
