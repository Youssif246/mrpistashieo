import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import enData from '../../assets/i18n/en.json';
import arData from '../../assets/i18n/ar.json';
import enArticles from '../../assets/data/articles/en.json';
import arArticles from '../../assets/data/articles/ar.json';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  // Active language signal - URL is source of truth
  readonly currentLang = signal<Language>('ar');

  // Active translation dictionary
  readonly t = computed(() => {
    return this.currentLang() === 'ar' ? arData : enData;
  });

  // Flag for RTL layout
  readonly isRtl = computed(() => this.currentLang() === 'ar');

  constructor() {
    if (this.isBrowser) {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/en') || pathname === '/en') {
        this.setLanguageFromRoute('en');
      } else if (pathname.startsWith('/ar') || pathname === '/ar') {
        this.setLanguageFromRoute('ar');
      } else {
        const savedLang = localStorage.getItem('site_lang') as Language;
        if (savedLang === 'en' || savedLang === 'ar') {
          this.setLanguageFromRoute(savedLang);
        } else {
          this.setLanguageFromRoute('ar');
        }
      }
    }
  }

  /**
   * Sets the language state when synchronized from the route.
   */
  setLanguageFromRoute(lang: Language): void {
    if (this.currentLang() !== lang) {
      this.currentLang.set(lang);
    }
    // Apply <html lang/dir> on BOTH server and browser so SSR HTML is correct
    this.applyDirection(lang);
    if (this.isBrowser) {
      localStorage.setItem('site_lang', lang);
    }
  }

  /**
   * Explicitly sets language and navigates to the equivalent URL in the target language.
   */
  setLanguage(lang: Language): void {
    if (this.currentLang() === lang) return;
    this.switchLanguage(lang);
  }

  /**
   * Toggles language between 'ar' and 'en' and navigates to the equivalent route.
   */
  toggleLanguage(): void {
    const nextLang: Language = this.currentLang() === 'en' ? 'ar' : 'en';
    this.switchLanguage(nextLang);
  }

  /**
   * Navigates to the exact equivalent route in the target language.
   * Handles home, standard subpages, and article detail pages with translated slugs.
   */
  switchLanguage(targetLang: Language): void {
    const currentUrl = this.router.url; // e.g. '/ar/articles/pistachio-orchard-guide#intro'
    const [pathWithoutQuery, queryAndFragment] = currentUrl.split(/[?#]/);
    const suffix = currentUrl.slice(pathWithoutQuery.length);

    // Remove leading /ar or /en from path
    const trimmedPath = pathWithoutQuery.replace(/^\/(ar|en)/, '');

    // Check if on an article detail route: /articles/:slug
    const articleMatch = trimmedPath.match(/^\/articles\/([^/]+)$/);
    if (articleMatch) {
      const currentSlug = decodeURIComponent(articleMatch[1]);
      const currentSourceArticles = this.currentLang() === 'ar' ? arArticles : enArticles;
      const targetArticles = targetLang === 'ar' ? arArticles : enArticles;

      const currentArt = currentSourceArticles.find((a: any) => 
        a.slug === currentSlug || 
        decodeURIComponent(a.slug) === currentSlug || 
        a.id === currentSlug
      );

      if (currentArt) {
        const targetArt = targetArticles.find((a: any) => a.id === currentArt.id);
        if (targetArt) {
          this.router.navigateByUrl(`/${targetLang}/articles/${targetArt.slug}${suffix}`);
          return;
        }
      }
      this.router.navigateByUrl(`/${targetLang}/articles${suffix}`);
      return;
    }

    // Standard page navigation: e.g. /services -> /en/services or /ar/services
    const newPath = `/${targetLang}${trimmedPath || ''}${suffix}`;
    this.router.navigateByUrl(newPath);
  }

  /**
   * Helper for templates to build language-prefixed route paths.
   * Example: link('/services') -> ['/ar', 'services']
   */
  link(path: string): string[] {
    const clean = path.replace(/^\//, '');
    if (!clean) return [`/${this.currentLang()}`];
    return [`/${this.currentLang()}`, ...clean.split('/')];
  }

  private applyDirection(lang: Language): void {
    const isArabic = lang === 'ar';
    const html = this.document.documentElement;
    if (html) {
      html.setAttribute('lang', lang);
      html.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    }
    const body = this.document.body;
    if (body) {
      if (isArabic) {
        body.classList.add('rtl');
      } else {
        body.classList.remove('rtl');
      }
    }
  }
}
