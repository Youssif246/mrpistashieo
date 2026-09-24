import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import enData from '../../assets/i18n/en.json';
import arData from '../../assets/i18n/ar.json';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Simple language state
  readonly currentLang = signal<Language>('en');

  // Active translation dictionary
  readonly t = computed(() => {
    return this.currentLang() === 'ar' ? arData : enData;
  });

  // Flag for RTL layout
  readonly isRtl = computed(() => this.currentLang() === 'ar');

  constructor() {
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('site_lang') as Language;
      if (savedLang === 'ar' || savedLang === 'en') {
        this.setLanguage(savedLang);
      } else {
        this.applyDirection('en');
      }
    }
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    if (this.isBrowser) {
      localStorage.setItem('site_lang', lang);
      this.applyDirection(lang);
    }
  }

  toggleLanguage(): void {
    const nextLang: Language = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
  }

  private applyDirection(lang: Language): void {
    if (!this.isBrowser) return;
    const isArabic = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    if (isArabic) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
}
