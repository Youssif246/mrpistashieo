import { Component, inject, computed, signal, OnInit, OnDestroy, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TranslationService } from '../../shared/translation.service';
import { Article } from '../../shared/models/article.model';
import enArticles from '../../../assets/data/articles/en.json';
import arArticles from '../../../assets/data/articles/ar.json';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.css'
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly currentSlug = signal<string>('');

  private jsonLdScriptEl: HTMLScriptElement | null = null;

  // Active article computed reactively from route slug + current language
  readonly article = computed<Article | null>(() => {
    const slug = this.currentSlug();
    if (!slug) return null;
    const articles = this.i18n.currentLang() === 'ar'
      ? (arArticles as Article[])
      : (enArticles as Article[]);
    return articles.find(a => a.slug === slug || a.id === slug) || null;
  });

  // 3 Related articles excluding current
  readonly relatedArticles = computed<Article[]>(() => {
    const curr = this.article();
    const articles = this.i18n.currentLang() === 'ar'
      ? (arArticles as Article[])
      : (enArticles as Article[]);
    if (!curr) return articles.slice(0, 3);
    return articles.filter(a => a.id !== curr.id).slice(0, 3);
  });

  constructor() {
    // React to route slug change or language switch
    effect(() => {
      const art = this.article();
      if (art) {
        this.updateMetaAndSchema(art);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      this.currentSlug.set(slug);
      if (this.isBrowser) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.jsonLdScriptEl && this.jsonLdScriptEl.parentNode) {
      this.jsonLdScriptEl.parentNode.removeChild(this.jsonLdScriptEl);
      this.jsonLdScriptEl = null;
    }
  }

  private getCurrentPageUrl(): string {
    if (this.isBrowser) {
      return window.location.href;
    }
    return `https://misterpistachio.com/articles/${this.currentSlug()}`;
  }

  private updateMetaAndSchema(article: Article): void {
    const fullTitle = `${article.seo.title}`;
    this.titleService.setTitle(fullTitle);

    this.metaService.updateTag({ name: 'description', content: article.seo.description });
    this.metaService.updateTag({ property: 'og:title', content: article.title });
    this.metaService.updateTag({ property: 'og:description', content: article.excerpt });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });
    this.metaService.updateTag({ property: 'og:url', content: this.getCurrentPageUrl() });

    // OpenGraph image absolute URL
    const imageUrl = `https://misterpistachio.com/${article.coverImage}`;
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: article.title });
    this.metaService.updateTag({ name: 'twitter:description', content: article.excerpt });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });

    // Inject / Update JSON-LD BlogPosting schema
    if (this.isBrowser) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': article.title,
        'description': article.excerpt,
        'image': [imageUrl],
        'datePublished': '2026-10-01T00:00:00+03:00',
        'dateModified': '2026-10-01T00:00:00+03:00',
        'author': {
          '@type': 'Organization',
          'name': 'Mister Pistachio Agronomic Research Team',
          'url': 'https://misterpistachio.com'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Mister Pistachio',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://misterpistachio.com/logo.png'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': this.getCurrentPageUrl()
        }
      };

      if (!this.jsonLdScriptEl) {
        this.jsonLdScriptEl = this.document.createElement('script');
        this.jsonLdScriptEl.type = 'application/ld+json';
        this.document.head.appendChild(this.jsonLdScriptEl);
      }
      this.jsonLdScriptEl.textContent = JSON.stringify(jsonLd);
    }
  }
}
