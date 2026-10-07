import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  lang: 'ar' | 'en';
  path: string; // e.g. '/about' or '/articles/pistachio-orchard-guide'
  equivalentPath?: string; // equivalent path in other language if slugs differ
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly siteUrl = 'https://misterpistachio.com';
  private readonly defaultImage = 'https://misterpistachio.com/home-images/hero.webp';

  updateSeo(config: SeoConfig): void {
    const isAr = config.lang === 'ar';
    const cleanPath = config.path.startsWith('/') ? config.path : `/${config.path}`;
    const equivalentPath = config.equivalentPath 
      ? (config.equivalentPath.startsWith('/') ? config.equivalentPath : `/${config.equivalentPath}`)
      : cleanPath;

    // 0. Remove JSON-LD left over from the previous page (client-side navigation)
    this.clearStructuredData();

    // 1. Title
    this.titleService.setTitle(config.title);

    // 2. Standard Meta Description
    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    // 3. Open Graph Metadata
    const currentUrl = `${this.siteUrl}/${config.lang}${cleanPath === '/' ? '' : cleanPath}`;
    const imageUrl = config.image 
      ? (config.image.startsWith('http') ? config.image : `${this.siteUrl}/${config.image.replace(/^\//, '')}`)
      : this.defaultImage;

    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:url', content: currentUrl });
    this.metaService.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: isAr ? 'مستر بستاشيو' : 'Mister Pistachio' });
    this.metaService.updateTag({ property: 'og:locale', content: isAr ? 'ar_AR' : 'en_US' });
    this.metaService.updateTag({ property: 'og:locale:alternate', content: isAr ? 'en_US' : 'ar_AR' });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:image:alt', content: config.title });

    // 4. Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    this.metaService.updateTag({ name: 'twitter:image:alt', content: config.title });

    // Article-only tags: remove them on non-article pages so they don't leak
    this.metaService.removeTag("property='article:published_time'");
    this.metaService.removeTag("property='article:modified_time'");
    this.metaService.removeTag("property='article:author'");
    if (config.type === 'article' && config.publishedTime) {
      this.metaService.updateTag({ property: 'article:published_time', content: config.publishedTime });
      if (config.modifiedTime) {
        this.metaService.updateTag({ property: 'article:modified_time', content: config.modifiedTime });
      }
      if (config.author) {
        this.metaService.updateTag({ property: 'article:author', content: config.author });
      }
    }

    // 5. Canonical & Hreflang Link Tags in <head>
    this.updateCanonicalAndHreflang(config.lang, cleanPath, equivalentPath);
  }

  private updateCanonicalAndHreflang(currentLang: 'ar' | 'en', currentPath: string, equivalentPath: string): void {
    const head = this.document.head;
    if (!head) return;

    const canonicalPath = currentPath === '/' ? '' : currentPath;
    const arPath = currentLang === 'ar' ? canonicalPath : (equivalentPath === '/' ? '' : equivalentPath);
    const enPath = currentLang === 'en' ? canonicalPath : (equivalentPath === '/' ? '' : equivalentPath);

    const canonicalUrl = `${this.siteUrl}/${currentLang}${canonicalPath}`;
    const arUrl = `${this.siteUrl}/ar${arPath}`;
    const enUrl = `${this.siteUrl}/en${enPath}`;
    const xDefaultUrl = `${this.siteUrl}/ar${arPath}`;

    // Canonical tag
    this.setOrCreateLinkTag('canonical', canonicalUrl);

    // Hreflang tags
    this.setOrCreateLinkTag('alternate', arUrl, 'ar');
    this.setOrCreateLinkTag('alternate', enUrl, 'en');
    this.setOrCreateLinkTag('alternate', xDefaultUrl, 'x-default');
  }

  private setOrCreateLinkTag(rel: string, href: string, hreflang?: string): void {
    const head = this.document.head;
    if (!head) return;

    let selector = `link[rel="${rel}"]`;
    if (hreflang) {
      selector += `[hreflang="${hreflang}"]`;
    }

    let link: HTMLLinkElement | null = head.querySelector(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) {
        link.setAttribute('hreflang', hreflang);
      }
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  /** For non-indexable pages (e.g. 404): noindex + remove canonical/hreflang. */
  setNoIndex(title: string, description: string): void {
    this.clearStructuredData();
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'robots', content: 'noindex, follow' });
    const head = this.document.head;
    if (!head) return;
    head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(el => el.remove());
  }

  private clearStructuredData(): void {
    const head = this.document.head;
    if (!head) return;
    head.querySelectorAll('script[type="application/ld+json"][data-schema-id]').forEach(el => el.remove());
  }

  setStructuredData(schemaId: string, schemaData: object): void {
    const head = this.document.head;
    if (!head) return;

    let script: HTMLScriptElement | null = head.querySelector(`script[type="application/ld+json"][data-schema-id="${schemaId}"]`);
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema-id', schemaId);
      head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData, null, 2);
  }
}
