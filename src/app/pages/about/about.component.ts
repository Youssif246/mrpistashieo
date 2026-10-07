import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
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
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);
  private readonly el = inject(ElementRef);
  private gsapCtx?: gsap.Context;

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';
    this.seo.updateSeo({
      lang: this.i18n.currentLang(),
      path: '/about',
      title: isAr
        ? 'عن الشركة ورؤيتنا الزراعية | مستر بستاشيو'
        : 'About Us & Agronomic Vision | Mister Pistachio',
      description: isAr
        ? 'تعرف على قصة ورؤية مستر بستاشيو، ريادتنا في تقنيات إكثار أصول الفستق الحلبي، وشراكاتنا الإسبانية لتطوير البساتين في الشرق الأوسط.'
        : 'Discover Mister Pistachio, our clonal propagation nursery leadership, Spanish agronomic partnerships, and precision pistachio orchard engineering across the Mediterranean.',
      image: 'about-images/nursery.webp'
    });

    this.seo.setStructuredData('about-breadcrumb', {
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
          'name': isAr ? 'من نحن' : 'About Us',
          'item': `https://misterpistachio.com/${this.i18n.currentLang()}/about`
        }
      ]
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
      this.initStoryAnimation(prefersReducedMotion);
      this.initPhilosophyAnimation(prefersReducedMotion);
      this.initTechnicalAnimation(prefersReducedMotion);
      this.initCtaAnimation(prefersReducedMotion);
      this.initBotanicalParallax(prefersReducedMotion);
    }, this.el);
  }

  // 1. HERO ENTRANCE (PATTERN A & E)
  private initHeroAnimation(prefersReducedMotion: boolean): void {
    const hero = this.el.nativeElement.querySelector('#aboutHero') as HTMLElement | null;
    if (!hero) return;

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
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.05 });
    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.45 });
    if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');
    if (connector) tl.to(connector, { scaleX: 1, opacity: 0.65, duration: 0.35 }, '-=0.35');
    if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
    if (aura) tl.to(aura, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4');
    if (botanical) tl.to(botanical, { opacity: 0.85, scale: 1, duration: 0.6 }, '-=0.45');
  }

  // 2. STORY SECTION ENTRANCE (PATTERN C & E)
  private initStoryAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('#aboutStory') as HTMLElement | null;
    if (!section) return;

    const anchorCol = section.querySelector('.story-anchor-column');
    const proseStream = section.querySelector('.story-prose-stream');
    const branchSvg = section.querySelector('.story-margin-branch');

    if (prefersReducedMotion) {
      if (anchorCol) gsap.set(anchorCol, { opacity: 1, y: 0 });
      if (proseStream) gsap.set(proseStream, { opacity: 1, y: 0 });
      return;
    }

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
      gsap.to(branchSvg, {
        opacity: 0.8,
        rotate: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true
        }
      });
    }
  }

  // 3. PHILOSOPHY 4 CHAPTERS PROGRESSIVE ENTRANCE (PATTERN C & D)
  private initPhilosophyAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('#aboutPhilosophy') as HTMLElement | null;
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

  // 4. TECHNICAL MASTERY SECTION ENTRANCE (PATTERN B & C)
  private initTechnicalAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('#aboutTechnical') as HTMLElement | null;
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

  // 5. FINAL EDITORIAL CTA ENTRANCE (PATTERN C)
  private initCtaAnimation(prefersReducedMotion: boolean): void {
    const section = this.el.nativeElement.querySelector('#aboutCta') as HTMLElement | null;
    if (!section) return;

    const stage = section.querySelector('.cta-editorial-stage');

    if (prefersReducedMotion) {
      if (stage) gsap.set(stage, { opacity: 1, y: 0 });
      return;
    }

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

  // 6. BOTANICAL SPECIMEN & ORCHARD PARALLAX
  private initBotanicalParallax(prefersReducedMotion: boolean): void {
    if (prefersReducedMotion) return;

    const verticalShadow = this.el.nativeElement.querySelector('#aboutHero .botanical-shadow--vertical-left');
    if (verticalShadow) {
      gsap.to(verticalShadow, {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '#aboutHero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        }
      });
    }

    const orchardShadow = this.el.nativeElement.querySelector('#aboutCta .botanical-shadow--orchard-row');
    if (orchardShadow) {
      gsap.to(orchardShadow, {
        yPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#aboutCta',
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

  getWhatsAppLink(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود استشارة فريقكم الزراعي حول مشروع زراعة الفستق.'
      : 'Hello, I would like to consult with your agricultural team regarding our pistachio project.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}
