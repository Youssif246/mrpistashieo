import { Component, inject, OnInit, RESPONSE_INIT } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="not-found-section">
      <div class="container-wide not-found-inner">
        <span class="error-badge">404</span>
        <h1 class="error-title">
          {{ isAr ? 'الصفحة غير موجودة' : 'Page Not Found' }}
        </h1>
        <p class="error-desc">
          {{ isAr 
            ? 'عذراً، الصفحة التي تحاول الوصول إليها قد تكون نُقلت أو حُذفت أو أن الرابط غير صحيح.' 
            : 'Sorry, the page you are looking for might have been removed, had its name changed, or is temporarily unavailable.' 
          }}
        </p>
        <div class="error-actions">
          <a [routerLink]="['/' + i18n.currentLang()]" class="btn-return-home">
            <i class="fa-solid fa-arrow-left" *ngIf="!isAr"></i>
            <i class="fa-solid fa-arrow-right" *ngIf="isAr"></i>
            <span>{{ isAr ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home' }}</span>
          </a>
          <a [routerLink]="['/' + i18n.currentLang(), 'articles']" class="btn-browse-articles">
            <span>{{ isAr ? 'تصفح المقالات الزراعية' : 'Browse Agronomic Articles' }}</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .not-found-section {
      min-height: 75vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(6rem, 12vh, 10rem) 1.5rem;
      background-color: var(--c-cream, #FBF9F5);
      text-align: center;
    }
    .not-found-inner {
      max-width: 620px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .error-badge {
      font-family: var(--font-mono, monospace);
      font-size: clamp(3rem, 6vw, 4.5rem);
      font-weight: 800;
      color: var(--c-pistachio, #7E993B);
      letter-spacing: 0.08em;
      line-height: 1;
      margin-bottom: 1rem;
    }
    .error-title {
      font-family: var(--font-display, serif);
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      font-weight: 700;
      color: var(--c-forest-dark, #1B3524);
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }
    .error-desc {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--c-slate, #4A5B50);
      margin: 0 0 2.5rem 0;
    }
    .error-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
    .btn-return-home {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      background: var(--c-forest-dark, #1B3524);
      color: #FFFFFF;
      padding: 0.85rem 1.65rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.92rem;
      text-decoration: none;
      transition: all 0.25s ease;
    }
    .btn-return-home:hover {
      background: var(--c-pistachio, #7E993B);
      transform: translateY(-2px);
    }
    .btn-browse-articles {
      display: inline-flex;
      align-items: center;
      background: #FFFFFF;
      color: var(--c-forest-dark, #1B3524);
      border: 1px solid rgba(126, 153, 59, 0.3);
      padding: 0.85rem 1.65rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.92rem;
      text-decoration: none;
      transition: all 0.25s ease;
    }
    .btn-browse-articles:hover {
      border-color: var(--c-pistachio, #7E993B);
      color: var(--c-pistachio, #7E993B);
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent implements OnInit {
  readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);
  // Only provided on the SSR server (null in the browser / during prerender of known routes)
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  get isAr(): boolean {
    return this.i18n.currentLang() === 'ar';
  }

  ngOnInit(): void {
    if (this.responseInit) {
      this.responseInit.status = 404;
      this.responseInit.statusText = 'Not Found';
    }
    this.seo.setNoIndex(
      this.isAr ? '404 - الصفحة غير موجودة | مستر بستاشيو' : '404 - Page Not Found | Mister Pistachio',
      this.isAr ? 'الصفحة المطلوبة غير موجودة.' : 'The requested page could not be found.'
    );
  }
}
