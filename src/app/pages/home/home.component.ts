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
    }, 80);
  }

  private initAnimations(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {

      // ═══════════════════════════════════════════════════════════════
      // SECTION A: CULTIVATION JOURNEY (SVG + Stages + Harvest Image)
      // ═══════════════════════════════════════════════════════════════
      this.initJourneyAnimation(prefersReducedMotion);

      // ═══════════════════════════════════════════════════════════════
      // SECTION B: CINEMATIC CTA ENTRANCE
      // ═══════════════════════════════════════════════════════════════
      this.initCtaAnimation(prefersReducedMotion);

    }, this.el);
  }

  private initJourneyAnimation(prefersReducedMotion: boolean): void {
    const svgPath    = document.getElementById('journeySvgPath') as SVGPathElement | null;
    const harvestImg = document.getElementById('harvestClimaxImg') as HTMLElement | null;
    const stages     = gsap.utils.toArray('.journey-stage-step') as HTMLElement[];

    // Ensure all stages are visible by default
    stages.forEach((s, i) => {
      s.classList.toggle('is-active', i === 0);
    });

    if (harvestImg) {
      gsap.set(harvestImg, { opacity: 1, filter: 'none' });
    }

    if (prefersReducedMotion || stages.length === 0) {
      if (svgPath) gsap.set(svgPath, { strokeDashoffset: 0 });
      return;
    }

    // Parallax on harvest image — scroll-linked, subtle 20-35px movement, scale 1.03-1.06
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

    // SVG path length — drawing line as user scrolls
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

    // Also support direct click interaction on stages
    stages.forEach((stage, idx) => {
      stage.addEventListener('click', () => {
        stages.forEach((s, i) => {
          s.classList.toggle('is-active', i === idx);
          s.classList.toggle('is-passed', i < idx);
        });
      });
    });
  }

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

    // Reduced motion — show everything immediately
    if (prefersReducedMotion) {
      if (ctaBackdropImg) gsap.set(ctaBackdropImg, { scale: 1, opacity: 1 });
      ctaEls.forEach(el => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    // Set initial hidden state via GSAP (not CSS) — guarantees fallback visibility
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
