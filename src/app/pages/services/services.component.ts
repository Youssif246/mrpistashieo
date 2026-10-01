import { Component, inject, AfterViewInit, OnDestroy, ElementRef, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { APP_CONFIG } from '../../shared/config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly el = inject(ElementRef);
  private gsapCtx?: gsap.Context;

  readonly activeChapter = signal<'establish' | 'cultivate' | 'harvest'>('establish');

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.initAnimations();
    this.initChapterScrollSpy();
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  scrollToChapter(id: string): void {
    const target = document.getElementById(id);
    if (!target) return;
    const navOffset = 90;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - navOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  private initChapterScrollSpy(): void {
    const chapters = ['chapter-establish', 'chapter-cultivate', 'chapter-harvest'];
    const idMap: Record<string, 'establish' | 'cultivate' | 'harvest'> = {
      'chapter-establish': 'establish',
      'chapter-cultivate': 'cultivate',
      'chapter-harvest': 'harvest'
    };

    chapters.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => this.activeChapter.set(idMap[id]),
        onEnterBack: () => this.activeChapter.set(idMap[id])
      });
    });
  }

  private initAnimations(): void {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.gsapCtx = gsap.context(() => {
      // 1. HERO ENTRANCE (PATTERN A & E)
      const hero = this.el.nativeElement.querySelector('#servicesHero') as HTMLElement | null;
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
          const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.05 });
          if (eyebrow) heroTl.to(eyebrow, { opacity: 1, y: 0, duration: 0.45 });
          if (heading) heroTl.to(heading, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');
          if (connector) heroTl.to(connector, { scaleX: 1, opacity: 0.65, duration: 0.35 }, '-=0.35');
          if (desc) heroTl.to(desc, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
          if (aura) heroTl.to(aura, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4');
          if (botanical) heroTl.to(botanical, { opacity: 0.85, scale: 1, duration: 0.6 }, '-=0.45');
        }
      }

      // 2. CHAPTER HEADERS PROGRESSIVE RULES (PATTERN C)
      const chapterHeaders = this.el.nativeElement.querySelectorAll('.chapter-monograph-header');
      chapterHeaders.forEach((ch: HTMLElement) => {
        const eyebrow = ch.querySelector('.chapter-eyebrow-lockup');
        const title = ch.querySelector('.chapter-title');
        const desc = ch.querySelector('.chapter-lead');
        const rule = ch.querySelector('.chapter-hairline-progress');

        if (prefersReducedMotion) {
          [eyebrow, title, desc, rule].forEach(el => {
            if (el) gsap.set(el, { opacity: 1, y: 0, scaleX: 1 });
          });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ch,
            start: 'top 82%',
            once: true
          }
        });

        if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.35');
        if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45');
        if (rule) tl.to(rule, { scaleX: 1, duration: 0.9, ease: 'power2.out' }, '-=0.4');
      });

      // 3. SECTION 01 — ASYMMETRIC CINEMATIC SPREAD (PATTERN B & D)
      const sec1 = this.el.nativeElement.querySelector('#chapter-establish');
      if (sec1 && !prefersReducedMotion) {
        const visual = sec1.querySelector('.establish-cinematic-visual');
        const items = sec1.querySelectorAll('.establish-service-entry');

        if (visual) {
          gsap.to(visual, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec1,
              start: 'top 75%',
              once: true
            }
          });
        }

        if (items.length) {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec1,
              start: 'top 70%',
              once: true
            }
          });
        }
      }

      // 4. SECTION 02 — ALTERNATING VERTICAL ENTRIES (PATTERN B, C, D)
      const entries = this.el.nativeElement.querySelectorAll('.cultivate-field-entry');
      entries.forEach((entry: HTMLElement) => {
        if (prefersReducedMotion) {
          gsap.set(entry, { opacity: 1, y: 0 });
          return;
        }

        const photo = entry.querySelector('.field-entry-photo');
        const prose = entry.querySelector('.field-entry-prose');
        const bullets = entry.querySelectorAll('.entry-bullet-item');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: 'top 78%',
            once: true
          }
        });

        if (photo) {
          tl.to(photo, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power2.out' }, 0);
        }

        if (prose) {
          tl.to(prose, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.15);
        }

        if (bullets.length) {
          tl.to(bullets, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 0.35);
        }
      });

      // 5. SECTION 03 — EXPANSIVE CLOSING SHOWCASE
      const sec3 = this.el.nativeElement.querySelector('#chapter-harvest');
      if (sec3 && !prefersReducedMotion) {
        const panoramicFrame = sec3.querySelector('.harvest-panoramic-frame');
        const showcaseProse = sec3.querySelector('.harvest-showcase-prose');

        const tl3 = gsap.timeline({
          scrollTrigger: {
            trigger: sec3,
            start: 'top 75%',
            once: true
          }
        });

        if (panoramicFrame) {
          tl3.to(panoramicFrame, { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: 'power2.out' }, 0);
        }

        if (showcaseProse) {
          tl3.to(showcaseProse, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, 0.2);
        }
      }

      // 6. BOTANICAL PARALLAX
      if (!prefersReducedMotion) {
        const ambientBranches = this.el.nativeElement.querySelectorAll('.botanical-shadow-wrapper');
        ambientBranches.forEach((b: HTMLElement) => {
          gsap.to(b, {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: b.parentElement || b,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2
            }
          });
        });
      }
    }, this.el);
  }
}
