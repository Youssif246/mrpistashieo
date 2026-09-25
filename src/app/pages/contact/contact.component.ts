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

    this.initAnimations();
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  private initAnimations(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {
      // 1. HERO ENTRANCE & PHOTOGRAPHY REVEAL (MATCHING ABOUT HERO)
      const heroContentBlock = this.el.nativeElement.querySelector('.hero-content-block') as HTMLElement | null;
      const heroPhotoFrame = this.el.nativeElement.querySelector('.hero-photo-frame') as HTMLElement | null;
      const panoramaImg = this.el.nativeElement.querySelector('.hero-panorama-img') as HTMLElement | null;

      if (prefersReducedMotion) {
        if (heroContentBlock) gsap.set(heroContentBlock.children, { opacity: 1, y: 0 });
        if (heroPhotoFrame) gsap.set(heroPhotoFrame, { opacity: 1, scale: 1 });
        return;
      }

      if (heroContentBlock) {
        gsap.set(heroContentBlock.children, { opacity: 0, y: 22 });
        gsap.to(heroContentBlock.children, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power2.out',
          delay: 0.12
        });
      }

      if (heroPhotoFrame) {
        gsap.set(heroPhotoFrame, { opacity: 0, y: 32, scale: 0.985 });
        gsap.to(heroPhotoFrame, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.95,
          ease: 'power2.out',
          delay: 0.28
        });
      }

      if (panoramaImg) {
        gsap.to(panoramaImg, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contactHero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
          }
        });
      }

      // 2. SPREAD SECTION ENTRANCE (DOSSIER & INQUIRY FORM)
      const spreadSection = this.el.nativeElement.querySelector('#contactSpread') as HTMLElement | null;
      if (spreadSection) {
        const dossierPanel = spreadSection.querySelector('.contact-dossier-panel');
        const formPanel = spreadSection.querySelector('.contact-form-panel');
        const liaisonCards = spreadSection.querySelectorAll('.liaison-card');

        if (prefersReducedMotion) {
          if (dossierPanel) gsap.set(dossierPanel, { opacity: 1, y: 0 });
          if (formPanel) gsap.set(formPanel, { opacity: 1, y: 0 });
          if (liaisonCards) gsap.set(liaisonCards, { opacity: 1, y: 0 });
        } else {
          if (dossierPanel) gsap.set(dossierPanel, { opacity: 0, y: 26 });
          if (formPanel) gsap.set(formPanel, { opacity: 0, y: 30 });
          if (liaisonCards.length) gsap.set(liaisonCards, { opacity: 0, y: 20 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: spreadSection,
              start: 'top 78%',
              once: true
            }
          });

          if (dossierPanel) tl.to(dossierPanel, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
          if (liaisonCards.length) {
            tl.to(liaisonCards, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out'
            }, '-=0.5');
          }
          if (formPanel) tl.to(formPanel, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, '-=0.6');
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
