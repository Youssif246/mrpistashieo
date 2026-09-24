import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { APP_CONFIG } from '../../shared/config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly el = inject(ElementRef);
  private gsapCtx?: gsap.Context;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  private initAnimations(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {
      this.initHeroAnimation(prefersReducedMotion);
      this.initStoryAnimation(prefersReducedMotion);
      this.initPhilosophyAnimation(prefersReducedMotion);
      this.initTechnicalAnimation(prefersReducedMotion);
      this.initCtaAnimation(prefersReducedMotion);
    }, this.el);
  }

  // 1. HERO ENTRANCE & BOTANICAL PARALLAX
  private initHeroAnimation(prefersReducedMotion: boolean): void {
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
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#aboutHero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }
  }

  // 2. STORY SECTION ENTRANCE (UNBOXED SPREAD)
  private initStoryAnimation(prefersReducedMotion: boolean): void {
    const section = document.getElementById('aboutStory');
    if (!section) return;

    const anchorCol = section.querySelector('.story-anchor-column');
    const proseStream = section.querySelector('.story-prose-stream');
    const branchSvg = section.querySelector('.story-margin-branch');

    if (prefersReducedMotion) {
      if (anchorCol) gsap.set(anchorCol, { opacity: 1, y: 0 });
      if (proseStream) gsap.set(proseStream, { opacity: 1, y: 0 });
      return;
    }

    if (anchorCol) gsap.set(anchorCol, { opacity: 0, y: 28 });
    if (proseStream) gsap.set(proseStream, { opacity: 0, y: 32 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true
      }
    });

    if (anchorCol) tl.to(anchorCol, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    if (proseStream) tl.to(proseStream, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, '-=0.5');

    if (branchSvg) {
      gsap.fromTo(
        branchSvg,
        { opacity: 0, rotate: -4 },
        {
          opacity: 0.75,
          rotate: 0,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true
          }
        }
      );
    }
  }

  // 3. PHILOSOPHY 4 CHAPTERS PROGRESSIVE ENTRANCE
  private initPhilosophyAnimation(prefersReducedMotion: boolean): void {
    const section = document.getElementById('aboutPhilosophy');
    if (!section) return;

    const header = section.querySelector('.philosophy-section-header');
    const chapters = section.querySelectorAll('.philosophy-chapter');
    const centerNode = section.querySelector('.grid-center-node');

    if (prefersReducedMotion) {
      if (header) gsap.set(header, { opacity: 1, y: 0 });
      chapters.forEach(c => gsap.set(c, { opacity: 1, y: 0 }));
      if (centerNode) gsap.set(centerNode, { opacity: 1, scale: 1 });
      return;
    }

    if (header) gsap.set(header, { opacity: 0, y: 25 });
    chapters.forEach(c => gsap.set(c, { opacity: 0, y: 32 }));
    if (centerNode) gsap.set(centerNode, { opacity: 0, scale: 0.5 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 76%',
        once: true
      }
    });

    if (header) tl.to(header, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
    if (chapters.length > 0) {
      tl.to(chapters, { opacity: 1, y: 0, duration: 0.8, stagger: 0.16, ease: 'power2.out' }, '-=0.45');
    }
    if (centerNode) {
      tl.to(centerNode, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3');
    }
  }

  // 4. TECHNICAL MASTERY SECTION ENTRANCE (OVERFLOWING IMAGE & PROSE)
  private initTechnicalAnimation(prefersReducedMotion: boolean): void {
    const section = document.getElementById('aboutTechnical');
    if (!section) return;

    const photoCanvas = section.querySelector('.technical-photo-canvas');
    const proseCol    = section.querySelector('.technical-prose-column');
    const caliper     = section.querySelector('.technical-caliper-schematic');
    const connectArc  = section.querySelector('.technical-connecting-arc');

    if (prefersReducedMotion) {
      if (photoCanvas) gsap.set(photoCanvas, { opacity: 1, scale: 1 });
      if (proseCol)    gsap.set(proseCol,    { opacity: 1, y: 0 });
      return;
    }

    if (photoCanvas) gsap.set(photoCanvas, { opacity: 0, scale: 0.97 });
    if (proseCol)    gsap.set(proseCol,    { opacity: 0, y: 28 });
    if (connectArc)  gsap.set(connectArc,  { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true
      }
    });

    if (photoCanvas) tl.to(photoCanvas, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' });
    if (proseCol)    tl.to(proseCol,    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.55');
    if (connectArc)  tl.to(connectArc,  { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');

    if (caliper) {
      gsap.to(caliper, {
        rotate: 35,
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

  // 5. FINAL EDITORIAL CTA ENTRANCE
  private initCtaAnimation(prefersReducedMotion: boolean): void {
    const section = document.getElementById('aboutCta');
    if (!section) return;

    const stage = section.querySelector('.cta-editorial-stage');

    if (prefersReducedMotion) {
      if (stage) gsap.set(stage, { opacity: 1, y: 0 });
      return;
    }

    if (stage) gsap.set(stage, { opacity: 0, y: 26 });

    gsap.to(stage, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  getWhatsAppLink(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود استشارة فريقكم الزراعي حول مشروع زراعة الفستق.'
      : 'Hello, I would like to consult with your agricultural team regarding our pistachio project.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}
