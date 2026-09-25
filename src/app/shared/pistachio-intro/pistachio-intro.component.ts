import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Output,
  EventEmitter,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../translation.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-pistachio-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pistachio-intro.component.html',
  styleUrl: './pistachio-intro.component.css'
})
export class PistachioIntroComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly el = inject(ElementRef);

  @Output() introComplete = new EventEmitter<void>();

  // State signals
  readonly isVisible = signal(true);
  readonly isSkipped = signal(false);
  readonly isFading = signal(false);

  private masterTimeline?: gsap.core.Timeline;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    // Lock page scrolling during intro playback
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = 'hidden';
    }

    this.isVisible.set(true);
    this.isFading.set(false);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !this.isVisible()) return;

    // Slight delay ensures SVG geometry is measured accurately by the browser
    setTimeout(() => {
      this.initContinuousGrowthAnimation();
    }, 60);
  }

  private initContinuousGrowthAnimation(): void {
    const root = this.el.nativeElement as HTMLElement;
    if (!root) return;

    const overlay = root.querySelector('.pistachio-brand-intro') as HTMLElement | null;
    const svg = root.querySelector('.growth-svg') as SVGSVGElement | null;
    if (!svg || !overlay) return;

    const rootGroup = root.querySelector('.growth-root-group');
    const seedNode = root.querySelector('.seed-node');

    const mainStem = root.querySelector<SVGPathElement>('.main-stem-path');

    const rachisLeft = root.querySelector<SVGPathElement>('.rachis-left');
    const leftLeaflets = root.querySelectorAll('.compound-leaf-left .leaflet-node');

    const rachisRight = root.querySelector<SVGPathElement>('.rachis-right');
    const rightLeaflets = root.querySelectorAll('.compound-leaf-right .leaflet-node');

    const rachisApex = root.querySelector<SVGPathElement>('.rachis-apex');
    const apexLeaflets = root.querySelectorAll('.compound-leaf-apex .leaflet-node');

    const clusterLeft = root.querySelector('.cluster-left');
    const clusterRight = root.querySelector('.cluster-right');

    const brandReveal = root.querySelector('.intro-brand-reveal');
    const brandPip = root.querySelector('.brand-eyebrow-pip');
    const brandLogotype = root.querySelector('.brand-logotype');
    const brandTagline = root.querySelector('.brand-tagline');

    // 1. Prepare SVG stroke lengths for smooth organic line growth
    const preparePath = (path: SVGPathElement | null, defaultLen = 400): number => {
      if (!path) return defaultLen;
      try {
        const len = path.getTotalLength() || defaultLen;
        gsap.set(path, {
          strokeDasharray: len + 2,
          strokeDashoffset: len + 2
        });
        return len;
      } catch {
        gsap.set(path, {
          strokeDasharray: defaultLen + 2,
          strokeDashoffset: defaultLen + 2
        });
        return defaultLen;
      }
    };

    preparePath(mainStem, 380);
    preparePath(rachisLeft, 170);
    preparePath(rachisRight, 170);
    preparePath(rachisApex, 120);

    // Initial hidden states via GSAP (so transforms work predictably)
    if (seedNode) {
      gsap.set(seedNode, { scale: 0.7, opacity: 0, transformOrigin: 'center center' });
    }

    gsap.set(leftLeaflets, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    gsap.set(rightLeaflets, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    gsap.set(apexLeaflets, { scale: 0, opacity: 0, transformOrigin: 'center center' });

    if (clusterLeft) {
      gsap.set(clusterLeft, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    }
    if (clusterRight) {
      gsap.set(clusterRight, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    }

    if (brandReveal) {
      gsap.set(brandReveal, { opacity: 0, y: 14 });
    }
    if (brandPip) {
      gsap.set(brandPip, { opacity: 0, scale: 0.4, transformOrigin: 'center center' });
    }
    if (brandLogotype) {
      gsap.set(brandLogotype, { opacity: 0, y: 12 });
    }
    if (brandTagline) {
      gsap.set(brandTagline, { opacity: 0, y: 8 });
    }

    // Now reveal the prepared SVG canvas — 100% elimination of FOUC
    gsap.set(svg, { visibility: 'visible' });

    // 2. Build the Master 5.9s Continuous Growth GSAP Timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.finishIntro(false);
      }
    });
    this.masterTimeline = tl;

    // T = 0.0s – 0.8s: Raw Pistacia vera seed appears gently in the visual center
    if (seedNode) {
      tl.to(seedNode, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.05);
    }

    // T = 0.75s – 2.25s: Stem emerges directly from apex of raw seed and grows upward
    if (mainStem) {
      tl.to(mainStem, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power1.inOut'
      }, 0.75);
    }

    // T = 1.55s – 2.8s: Lower left compound leaf branches smoothly
    if (rachisLeft) {
      tl.to(rachisLeft, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power1.out'
      }, 1.55);
    }
    if (leftLeaflets.length > 0) {
      tl.to(leftLeaflets, {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        stagger: 0.07,
        ease: 'back.out(1.2)'
      }, 1.75);
    }

    // T = 2.25s – 3.45s: Mid right compound leaf branches smoothly
    if (rachisRight) {
      tl.to(rachisRight, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power1.out'
      }, 2.25);
    }
    if (rightLeaflets.length > 0) {
      tl.to(rightLeaflets, {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        stagger: 0.07,
        ease: 'back.out(1.2)'
      }, 2.45);
    }

    // T = 2.85s – 3.85s: Terminal crown foliage unfolds at the growing apex
    if (rachisApex) {
      tl.to(rachisApex, {
        strokeDashoffset: 0,
        duration: 0.75,
        ease: 'power1.out'
      }, 2.85);
    }
    if (apexLeaflets.length > 0) {
      tl.to(apexLeaflets, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: 'back.out(1.2)'
      }, 3.05);
    }

    // T = 3.15s – 4.05s: Subtle pistachio fruit clusters swell naturally in the leaf axils
    if (clusterLeft) {
      tl.to(clusterLeft, {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out'
      }, 3.15);
    }
    if (clusterRight) {
      tl.to(clusterRight, {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out'
      }, 3.3);
    }

    // T = 3.4s – 4.8s: Camera subtly glides closer while centered brand logotype unveils
    if (rootGroup) {
      tl.to(rootGroup, {
        scale: 1.05,
        duration: 1.6,
        ease: 'sine.inOut'
      }, 3.4);
    }

    if (brandReveal) {
      tl.to(brandReveal, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.5);
    }
    if (brandPip) {
      tl.to(brandPip, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.3)' }, 3.6);
    }
    if (brandLogotype) {
      tl.to(brandLogotype, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 3.75);
    }
    if (brandTagline) {
      tl.to(brandTagline, { opacity: 0.85, y: 0, duration: 0.7, ease: 'power2.out' }, 3.9);
    }

    // T = 4.9s – 5.9s: Centered composition smoothly settles as ivory overlay seamlessly reveals Hero
    tl.to('.intro-center-stage', {
      y: -14,
      scale: 0.98,
      duration: 0.95,
      ease: 'power2.inOut'
    }, 4.9);

    tl.to(overlay, {
      opacity: 0,
      duration: 0.85,
      ease: 'power2.inOut'
    }, 5.05);

    // Start playback immediately
    tl.play();
  }

  skipIntro(): void {
    if (this.isSkipped() || !this.isVisible()) return;
    this.isSkipped.set(true);

    if (this.masterTimeline) {
      this.masterTimeline.pause();
    }

    const root = this.el.nativeElement as HTMLElement;
    const overlay = root.querySelector('.pistachio-brand-intro') as HTMLElement | null;

    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          this.finishIntro(true);
        }
      });
    } else {
      this.finishIntro(true);
    }
  }

  private finishIntro(isInstant: boolean): void {
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }
    this.isVisible.set(false);
    this.introComplete.emit();
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
  }
}
