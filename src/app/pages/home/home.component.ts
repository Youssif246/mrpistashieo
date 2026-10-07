import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
import { APP_CONFIG } from '../../shared/config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  readonly config = APP_CONFIG;
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private gsapCtx?: gsap.Context;

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';
    this.seo.updateSeo({
      lang: this.i18n.currentLang(),
      path: '/',
      title: isAr
        ? 'مستر بستاشيو | مشاتل متخصصة في زراعة وإنتاج الفستق الحلبي'
        : 'Mister Pistachio | Specialist Pistachio Nursery & Plantation Engineering',
      description: isAr
        ? 'مشتل زراعي رائد متخصص في إكثار أصول الفستق الحلبي المعتمدة (UCB1، البطم)، وتأسيس البساتين النموذجية بأعلى المعايير الإسبانية والعالمية.'
        : 'Certified pistachio nursery specializing in clonal rootstocks (UCB1, Atlantica), grafted saplings, and precision Mediterranean orchard establishment.',
      image: 'home-images/hero.webp'
    });

    this.seo.setStructuredData('org-schema', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': isAr ? 'مستر بستاشيو' : 'Mister Pistachio',
      'legalName': 'Mister Pistachio Trading O P LLC',
      'url': 'https://misterpistachio.com',
      'logo': 'https://misterpistachio.com/logo.png',
      'description': isAr
        ? 'مشاتل متخصصة في إكثار أصول الفستق الحلبي المعتمدة وتأسيس البساتين التجارية.'
        : 'Specialist nursery in pistachio cultivation, certified rootstocks, and commercial orchard establishment.',
      'telephone': '+31 612 55 55 47',
      'sameAs': [
        this.config.social.instagram,
        this.config.social.tiktok,
        this.config.social.facebook,
        this.config.social.youtube,
        this.config.social.x
      ]
    });

    this.seo.setStructuredData('website-schema', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': isAr ? 'مستر بستاشيو' : 'Mister Pistachio',
      'url': 'https://misterpistachio.com',
      'inLanguage': ['ar', 'en']
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.initAnimations();
  }

  private initAnimations(): void {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {
      this.initHeroAnimation(prefersReducedMotion);
      this.initManifestoAnimation(prefersReducedMotion);
      this.initServicesAnimation(prefersReducedMotion);
      this.initMonographAnimation(prefersReducedMotion);
      this.initNurseryAnimation(prefersReducedMotion);
      this.initJourneyAnimation(prefersReducedMotion);
      this.initSocialAnimation(prefersReducedMotion);
      this.initBotanicalParallax(prefersReducedMotion);
    }, this.el);
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. HERO ENTRANCE (CALM & EDITORIAL) & BOTANICAL PARALLAX
  // ═══════════════════════════════════════════════════════════════
  private initHeroAnimation(prefersReducedMotion: boolean): void {
    const heroSection = this.el.nativeElement.querySelector('.hero') as HTMLElement | null;
    if (!heroSection) return;

    const heroImg = heroSection.querySelector('.hero-backdrop-img') as HTMLElement | null;
    const eyebrow = heroSection.querySelector('.hero-eyebrow') as HTMLElement | null;
    const title   = heroSection.querySelector('.hero-title') as HTMLElement | null;
    const desc    = heroSection.querySelector('.hero-description') as HTMLElement | null;
    const cta     = heroSection.querySelector('.hero-cta-row') as HTMLElement | null;

    if (prefersReducedMotion) {
      [eyebrow, title, desc, cta].forEach(el => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    // Hero entrance timeline - calm, subtle and editorial
    const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.1 });

    if (heroImg) {
      heroTl.fromTo(heroImg, { scale: 1.05 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
    }
    if (eyebrow) {
      heroTl.fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65 }, 0.15);
    }
    if (title) {
      heroTl.fromTo(title, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3);
    }
    if (desc) {
      heroTl.fromTo(desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75 }, 0.45);
    }
    if (cta) {
      heroTl.fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65 }, 0.6);
    }

    // Parallax on scroll
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. BRAND MANIFESTO & CONTINUOUS TRAIL ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initManifestoAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('#agricultural-specialization') as HTMLElement | null;
    if (!section) return;

    const headlineBlock = section.querySelector('.manifesto-headline-block');
    const narrative     = section.querySelector('.manifesto-offset-narrative');
    const midDivider    = section.querySelector('.manifesto-mid-divider');
    const stations      = section.querySelectorAll('.trail-station');
    const branch        = section.querySelector('.botanical-ambient-branch');

    if (prefersReducedMotion) {
      const all = [headlineBlock, narrative, midDivider, ...stations].filter(Boolean);
      all.forEach(el => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true
      }
    });

    if (headlineBlock) tl.fromTo(headlineBlock, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (narrative)     tl.fromTo(narrative,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.5');
    if (midDivider)    tl.fromTo(midDivider,    { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.65, ease: 'power2.out' }, '-=0.4');
    if (stations.length > 0) {
      tl.fromTo(stations, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.15, ease: 'power2.out' }, '-=0.35');
    }

    if (branch) {
      gsap.fromTo(branch,
        { opacity: 0, y: 20, rotate: -3 },
        {
          opacity: 0.8,
          y: 0,
          rotate: 0,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true
          }
        }
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. EDITORIAL SERVICE PANELS ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initServicesAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('.section-service-index') as HTMLElement | null;
    if (!section) return;

    const header = section.querySelector('.service-index-header');
    const panels = section.querySelectorAll('.service-panel');
    const footer = section.querySelector('.service-index-footer');

    if (prefersReducedMotion) {
      if (header) gsap.set(header, { opacity: 1, y: 0 });
      panels.forEach(p => gsap.set(p, { opacity: 1, y: 0 }));
      if (footer) gsap.set(footer, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true
      }
    });

    if (header) tl.fromTo(header, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (panels.length > 0) {
      tl.fromTo(panels, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.16, ease: 'power2.out' }, '-=0.45');
    }
    if (footer) {
      tl.fromTo(footer, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. ARCHITECTURAL BOTANICAL MONOGRAPH ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initMonographAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('.section-botanical-monograph') as HTMLElement | null;
    if (!section) return;

    const header        = section.querySelector('.monograph-header-block');
    const specimenFrame = section.querySelector('.specimen-frame');
    const cards         = section.querySelectorAll('.botanical-dossier-card');
    const footer        = section.querySelector('.monograph-action-footer');
    const diagram       = section.querySelector('.monograph-ambient-diagram');

    if (prefersReducedMotion) {
      if (header)        gsap.set(header,        { opacity: 1, y: 0 });
      if (specimenFrame) gsap.set(specimenFrame, { opacity: 1, scale: 1 });
      cards.forEach(c => gsap.set(c, { opacity: 1, y: 0 }));
      if (footer)        gsap.set(footer,        { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true
      }
    });

    if (header)        tl.fromTo(header,        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (specimenFrame) tl.fromTo(specimenFrame, { opacity: 0, scale: 0.96, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.45');
    if (cards.length > 0) {
      tl.fromTo(cards, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.55');
    }
    if (footer) {
      tl.fromTo(footer, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    }

    if (diagram) {
      gsap.to(diagram, {
        rotate: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. NURSERY CULTIVATION ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initNurseryAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('.section-nursery-editorial') as HTMLElement | null;
    if (!section) return;

    const editorialCol = section.querySelector('.nursery-editorial-col');
    const heroFrame    = section.querySelector('.nursery-hero-frame');
    const specs        = section.querySelectorAll('.nursery-spec-item');

    if (prefersReducedMotion) {
      if (editorialCol) gsap.set(editorialCol, { opacity: 1, y: 0 });
      if (heroFrame)    gsap.set(heroFrame,    { opacity: 1, scale: 1 });
      specs.forEach(s => gsap.set(s, { opacity: 1, y: 0 }));
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true
      }
    });

    if (editorialCol) tl.fromTo(editorialCol, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' });
    if (heroFrame)    tl.fromTo(heroFrame,    { opacity: 0, scale: 0.96, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5');
    if (specs.length > 0) {
      tl.fromTo(specs, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.14, ease: 'power2.out' }, '-=0.4');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. CULTIVATION JOURNEY (SVG + Stages + Harvest Image)
  // ═══════════════════════════════════════════════════════════════
  private initJourneyAnimation(prefersReducedMotion: boolean): void {
    const section    = this.el.nativeElement.querySelector('#cultivationJourneySection') as HTMLElement | null;
    if (!section) return;

    const svgPath    = section.querySelector('#journeySvgPath') as SVGPathElement | null;
    const harvestImg = section.querySelector('#harvestClimaxImg') as HTMLElement | null;
    const stages     = gsap.utils.toArray(section.querySelectorAll('.journey-stage-step')) as HTMLElement[];
    const header     = section.querySelector('.journey-editorial-header');
    const plate      = section.querySelector('.harvest-showcase-plate');

    stages.forEach((s, i) => {
      s.classList.toggle('is-active', i === 0);
    });

    if (prefersReducedMotion) {
      if (header) gsap.set(header, { opacity: 1, y: 0 });
      if (plate)  gsap.set(plate,  { opacity: 1, y: 0 });
      if (harvestImg) gsap.set(harvestImg, { opacity: 1, filter: 'none' });
      if (svgPath) gsap.set(svgPath, { strokeDashoffset: 0 });
      return;
    }

    if (header) {
      gsap.fromTo(header,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    if (plate) {
      gsap.fromTo(plate,
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true
          }
        }
      );
    }

    if (harvestImg) {
      gsap.fromTo(
        harvestImg,
        { y: -16, scale: 1.03 },
        {
          y: 24,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
          }
        }
      );
    }

    if (!svgPath) return;

    const pathLength = svgPath.getTotalLength() || 1000;
    gsap.set(svgPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const timelineTrack = section.querySelector('#journeyTimelineTrack');
    if (!timelineTrack) return;

    const lineTl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineTrack,
        start: 'top 75%',
        end: 'bottom 65%',
        scrub: 0.4
      }
    });

    lineTl.to(svgPath, { strokeDashoffset: 0, ease: 'none' });

    lineTl.eventCallback('onUpdate', () => {
      const p = lineTl.progress();
      const activeIdx = p < 0.18 ? 0 : p < 0.38 ? 1 : p < 0.62 ? 2 : p < 0.85 ? 3 : 4;
      stages.forEach((stage, idx) => {
        stage.classList.toggle('is-active', idx === activeIdx);
        stage.classList.toggle('is-passed', idx < activeIdx);
      });
    });

    stages.forEach((stage, idx) => {
      stage.addEventListener('click', () => {
        stages.forEach((s, i) => {
          s.classList.toggle('is-active', i === idx);
          s.classList.toggle('is-passed', i < idx);
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. SOCIAL DEDICATED SECTION ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initSocialAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('#socialSection') as HTMLElement | null;
    if (!section) return;

    const header = section.querySelector('.social-dedicated-header');
    const cards  = section.querySelectorAll('.instagram-profile-dossier, .facebook-profile-dossier');

    if (prefersReducedMotion) {
      if (header) gsap.set(header, { opacity: 1, y: 0 });
      cards.forEach(c => gsap.set(c, { opacity: 1, y: 0 }));
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true
      }
    });

    if (header) tl.fromTo(header, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (cards.length > 0) {
      tl.fromTo(cards, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.18, ease: 'power2.out' }, '-=0.45');
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 8. BOTANICAL ORCHARD PARALLAX
  // ═══════════════════════════════════════════════════════════════
  private initBotanicalParallax(prefersReducedMotion: boolean): void {
    if (prefersReducedMotion) return;

    const cornerShadow = document.querySelector('.botanical-editorial-section .botanical-shadow--top-right');
    if (cornerShadow) {
      gsap.to(cornerShadow, {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.botanical-editorial-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    }

    const orchardRow = document.querySelector('.section-cultivation-journey .botanical-shadow--orchard-row');
    if (orchardRow) {
      gsap.to(orchardRow, {
        yPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.section-cultivation-journey',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    }

    const serviceBranch = document.querySelector('.section-service-index .botanical-shadow--center-cards');
    if (serviceBranch) {
      gsap.to(serviceBranch, {
        yPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.section-service-index',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  getGeneralWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود معرفة المزيد عن شتلات الفستق الحلبي والأصول المتوفرة.'
      : 'Hello, I would like to know more about your pistachio plants and rootstocks.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  getServicesWhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود الاستفسار عن خدماتكم الزراعية والحقلية لبساتين الفستق.'
      : 'Hello, I would like to know more about your agricultural services.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  getUcb1WhatsApp(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أنا مهتم بالحصول على معلومات وتوفر أصل UCB1.'
      : 'Hello, I am interested in UCB1 rootstock.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}
