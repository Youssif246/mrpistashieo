import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
import { APP_CONFIG } from '../../shared/config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  readonly social = APP_CONFIG.social;
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private gsapCtx?: gsap.Context;

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';

    this.seo.updateSeo({
      lang: this.i18n.currentLang(),
      path: '/contact',
      title: isAr
        ? 'تواصل معنا | مستر بيستاشيو – استشارات وشتلات الفستق الحلبي'
        : 'Contact Our Agricultural Advisory Team | Mister Pistachio',
      description: isAr
        ? 'تواصل مع فريق مستر بيستاشيو المتخصص للحصول على استشارات زراعية، حجز شتلات UCB1، وتخطيط مشاريع بساتين الفستق الحلبي.'
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
          'item': `https://www.misterpistachio.com/${this.i18n.currentLang()}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': isAr ? 'اتصل بنا' : 'Contact Us',
          'item': `https://www.misterpistachio.com/${this.i18n.currentLang()}/contact/`
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
        if (prefersReducedMotion) {
          if (founderPanel) gsap.set(founderPanel, { opacity: 1, y: 0 });
          if (dossierPanel) gsap.set(dossierPanel, { opacity: 1, y: 0 });
        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: spreadSection,
              start: 'top 78%',
              once: true
            }
          });

          if (founderPanel) tl.fromTo(founderPanel, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
          if (dossierPanel) tl.fromTo(dossierPanel, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.4');
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

  getFounderWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً أستاذ يزن، أود التواصل معك مباشرة بخصوص مشاريع واستشارات مستر بيستاشيو.'
      : 'Hello Mr. Yazan, I would like to connect with you directly regarding Mister Pistachio projects and consultations.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}
