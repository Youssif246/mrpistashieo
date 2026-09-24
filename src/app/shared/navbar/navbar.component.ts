import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService, Language } from '../translation.service';
import { APP_CONFIG } from '../config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly i18n = inject(TranslationService);

  readonly isMobileMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  private scrollHandler?: () => void;

  ngOnInit(): void {
    if (this.isBrowser) {
      this.scrollHandler = () => {
        const scrolled = window.scrollY > 25;
        if (this.isScrolled() !== scrolled) {
          this.isScrolled.set(scrolled);
        }
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      this.scrollHandler();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleLanguage(): void {
    this.i18n.toggleLanguage();
    this.closeMobileMenu();
  }

  setLanguage(lang: Language): void {
    if (this.i18n.currentLang() !== lang) {
      this.i18n.setLanguage(lang);
      this.closeMobileMenu();
    }
  }

  getWhatsAppLink(): string {
    const msg = this.i18n.currentLang() === 'ar'
      ? 'مرحباً، أود الاستفسار عن شتلات الفستق والخدمات الزراعية.'
      : 'Hello, I would like to know more about your pistachio plants.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }
}

