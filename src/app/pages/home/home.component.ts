import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
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
export class HomeComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly el = inject(ElementRef);
  private gsapCtx?: gsap.Context;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    // Slight delay to ensure Angular has fully rendered the DOM
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  private initAnimations(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {
      this.initHeroAnimation(prefersReducedMotion);
      this.initManifestoAnimation(prefersReducedMotion);
      this.initServicesAnimation(prefersReducedMotion);
      this.initMonographAnimation(prefersReducedMotion);
      this.initNurseryAnimation(prefersReducedMotion);
      this.initJourneyAnimation(prefersReducedMotion);
      this.initCtaAnimation(prefersReducedMotion);
      this.initBotanicalParallax(prefersReducedMotion);
    }, this.el);
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. HERO ENTRANCE & BOTANICAL PARALLAX
  // ═══════════════════════════════════════════════════════════════
  private initHeroAnimation(prefersReducedMotion: boolean): void {
    const heroSection = document.querySelector('.hero') as HTMLElement | null;
    if (!heroSection) return;

    const eyebrow = heroSection.querySelector('.hero-eyebrow') as HTMLElement | null;
    const title   = heroSection.querySelector('.hero-title') as HTMLElement | null;
    const desc    = heroSection.querySelector('.hero-description') as HTMLElement | null;
    const ctas    = heroSection.querySelectorAll('.hero-cta-primary, .hero-cta-secondary');
    const heroImg = heroSection.querySelector('.hero-backdrop-img') as HTMLElement | null;

    if (prefersReducedMotion) {
      if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
      if (title)   gsap.set(title,   { opacity: 1, y: 0 });
      if (desc)    gsap.set(desc,    { opacity: 1, y: 0 });
      ctas.forEach(c => gsap.set(c,  { opacity: 1, y: 0 }));
      return;
    }

    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 16 });
    if (title)   gsap.set(title,   { opacity: 0, y: 24 });
    if (desc)    gsap.set(desc,    { opacity: 0, y: 18 });
    ctas.forEach(c => gsap.set(c,  { opacity: 0, y: 14 }));

    const heroTl = gsap.timeline({ delay: 0.15 });
    if (eyebrow) heroTl.to(eyebrow, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' });
    if (title)   heroTl.to(title,   { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, '-=0.4');
    if (desc)    heroTl.to(desc,    { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, '-=0.5');
    if (ctas.length > 0) {
      heroTl.to(ctas, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.45');
    }

    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. BRAND MANIFESTO & CONTINUOUS TRAIL ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initManifestoAnimation(prefersReducedMotion: boolean): void {
    const section = document.getElementById('agricultural-specialization');
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

    if (headlineBlock) gsap.set(headlineBlock, { opacity: 0, y: 26 });
    if (narrative)     gsap.set(narrative,     { opacity: 0, y: 22 });
    if (midDivider)    gsap.set(midDivider,    { opacity: 0, scaleX: 0.8 });
    stations.forEach(s => gsap.set(s,          { opacity: 0, y: 28 }));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true
      }
    });

    if (headlineBlock) tl.to(headlineBlock, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
    if (narrative)     tl.to(narrative,     { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45');
    if (midDivider)    tl.to(midDivider,    { opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.35');
    if (stations.length > 0) {
      tl.to(stations, { opacity: 1, y: 0, duration: 0.7, stagger: 0.16, ease: 'power2.out' }, '-=0.35');
    }

    if (branch) {
      gsap.fromTo(
        branch,
        { opacity: 0, rotate: -4 },
        {
          opacity: 1,
          rotate: 0,
          duration: 1.4,
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
    const section = document.querySelector('.section-service-index') as HTMLElement | null;
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

    if (header) gsap.set(header, { opacity: 0, y: 24 });
    panels.forEach(p => gsap.set(p, { opacity: 0, y: 36 }));
    if (footer) gsap.set(footer, { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true
      }
    });

    if (header) tl.to(header, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
    if (panels.length > 0) {
      tl.to(panels, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out' }, '-=0.45');
    }
    if (footer) {
      tl.to(footer, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.3');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. ARCHITECTURAL BOTANICAL MONOGRAPH ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initMonographAnimation(prefersReducedMotion: boolean): void {
    const section = document.querySelector('.section-botanical-monograph') as HTMLElement | null;
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

    if (header)        gsap.set(header,        { opacity: 0, y: 24 });
    if (specimenFrame) gsap.set(specimenFrame, { opacity: 0, scale: 0.96 });
    cards.forEach(c => gsap.set(c, { opacity: 0, y: 28 }));
    if (footer)        gsap.set(footer,        { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true
      }
    });

    if (header)        tl.to(header,        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
    if (specimenFrame) tl.to(specimenFrame, { opacity: 1, scale: 1, duration: 0.85, ease: 'power2.out' }, '-=0.45');
    if (cards.length > 0) {
      tl.to(cards, { opacity: 1, y: 0, duration: 0.75, stagger: 0.16, ease: 'power2.out' }, '-=0.55');
    }
    if (footer) {
      tl.to(footer, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.3');
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
    const section = document.querySelector('.section-nursery-editorial') as HTMLElement | null;
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

    if (editorialCol) gsap.set(editorialCol, { opacity: 0, y: 26 });
    if (heroFrame)    gsap.set(heroFrame,    { opacity: 0, scale: 0.97 });
    specs.forEach(s => gsap.set(s, { opacity: 0, y: 20 }));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true
      }
    });

    if (editorialCol) tl.to(editorialCol, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (heroFrame)    tl.to(heroFrame,    { opacity: 1, scale: 1, duration: 0.85, ease: 'power2.out' }, '-=0.5');
    if (specs.length > 0) {
      tl.to(specs, { opacity: 1, y: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out' }, '-=0.4');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. CULTIVATION JOURNEY (SVG + Stages + Harvest Image)
  // ═══════════════════════════════════════════════════════════════
  private initJourneyAnimation(prefersReducedMotion: boolean): void {
    const section    = document.getElementById('cultivationJourneySection');
    const svgPath    = document.getElementById('journeySvgPath') as SVGPathElement | null;
    const harvestImg = document.getElementById('harvestClimaxImg') as HTMLElement | null;
    const stages     = gsap.utils.toArray('.journey-stage-step') as HTMLElement[];
    const header     = section?.querySelector('.journey-editorial-header');

    stages.forEach((s, i) => {
      s.classList.toggle('is-active', i === 0);
    });

    if (harvestImg) {
      gsap.set(harvestImg, { opacity: 1, filter: 'none' });
    }

    if (header && !prefersReducedMotion) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    if (prefersReducedMotion || stages.length === 0) {
      if (svgPath) gsap.set(svgPath, { strokeDashoffset: 0 });
      return;
    }

    // Parallax on harvest image
    if (harvestImg) {
      gsap.fromTo(
        harvestImg,
        { y: -16, scale: 1.03 },
        {
          y: 24,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: '#cultivationJourneySection',
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

    const timelineTrack = document.getElementById('journeyTimelineTrack');
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
  // 7. CINEMATIC CTA ENTRANCE
  // ═══════════════════════════════════════════════════════════════
  private initCtaAnimation(prefersReducedMotion: boolean): void {
    const ctaSection = document.getElementById('cinematicCtaSection');
    if (!ctaSection) return;

    const ctaBackdropImg = ctaSection.querySelector('.cta-backdrop-img') as HTMLElement | null;
    const ctaFrame       = ctaSection.querySelector('.cta-editorial-frame') as HTMLElement | null;
    const ctaEyebrow     = document.getElementById('ctaEyebrow');
    const ctaHeading     = document.getElementById('ctaHeading');
    const ctaLead        = document.getElementById('ctaLead');
    const ctaActions     = document.getElementById('ctaActions');

    const ctaEls = [ctaFrame, ctaEyebrow, ctaHeading, ctaLead, ctaActions].filter(Boolean);

    if (prefersReducedMotion) {
      if (ctaBackdropImg) gsap.set(ctaBackdropImg, { scale: 1, opacity: 1 });
      ctaEls.forEach(el => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    if (ctaBackdropImg) gsap.set(ctaBackdropImg, { scale: 1.04 });
    if (ctaFrame)       gsap.set(ctaFrame,       { opacity: 0 });
    if (ctaEyebrow)     gsap.set(ctaEyebrow,     { opacity: 0, y: 12 });
    if (ctaHeading)     gsap.set(ctaHeading,     { opacity: 0, y: 22 });
    if (ctaLead)        gsap.set(ctaLead,        { opacity: 0, y: 16 });
    if (ctaActions)     gsap.set(ctaActions,     { opacity: 0, y: 12 });

    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaSection,
        start: 'top 82%',
        once: true
      }
    });

    if (ctaBackdropImg) ctaTl.to(ctaBackdropImg, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
    if (ctaFrame)       ctaTl.to(ctaFrame,       { opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.15);
    if (ctaEyebrow)     ctaTl.to(ctaEyebrow,     { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.2);
    if (ctaHeading)     ctaTl.to(ctaHeading,     { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, 0.32);
    if (ctaLead)        ctaTl.to(ctaLead,        { opacity: 1, y: 0, duration: 0.6,  ease: 'power2.out' }, 0.46);
    if (ctaActions)     ctaTl.to(ctaActions,     { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.58);
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
