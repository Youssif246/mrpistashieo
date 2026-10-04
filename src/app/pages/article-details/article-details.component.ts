import { Component, inject, computed, signal, OnInit, effect, PLATFORM_ID, RESPONSE_INIT } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
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
export class ArticleDetailsComponent implements OnInit {
  readonly i18n = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  readonly currentSlug = signal<string>('');

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
      } else if (this.currentSlug()) {
        // Unknown slug: real 404 on the SSR server + noindex (avoid soft-404)
        if (this.responseInit) {
          this.responseInit.status = 404;
          this.responseInit.statusText = 'Not Found';
        }
        const isAr = this.i18n.currentLang() === 'ar';
        this.seo.setNoIndex(
          isAr ? 'المقال غير موجود | مستر بستاشيو' : 'Article Not Found | Mister Pistachio',
          isAr ? 'المقال المطلوب غير موجود.' : 'The requested article could not be found.'
        );
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

  /**
   * ISO publication date derived from the article's actual `date` field.
   * The English file uses a parseable format ("October 1, 2026"), so we look up
   * the English record by shared `id` for both languages.
   */
  private getIsoPublishedDate(articleId: string): string | undefined {
    const en = (enArticles as Article[]).find(a => a.id === articleId);
    if (!en?.date) return undefined;
    const parsed = new Date(`${en.date} 00:00:00 UTC`);
    if (isNaN(parsed.getTime())) return undefined;
    return parsed.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  private updateMetaAndSchema(article: Article): void {
    const currentLang = this.i18n.currentLang();
    const otherLang = currentLang === 'ar' ? 'en' : 'ar';
    const otherArticles = otherLang === 'ar' ? (arArticles as Article[]) : (enArticles as Article[]);
    const otherArticle = otherArticles.find(a => a.id === article.id);
    const equivalentPath = otherArticle ? `/articles/${otherArticle.slug}` : `/articles/${article.slug}`;

    const imageUrl = `https://misterpistachio.com/${article.coverImage}`;
    const currentUrl = `https://misterpistachio.com/${currentLang}/articles/${article.slug}`;

    const publishedIso = this.getIsoPublishedDate(article.id);

    this.seo.updateSeo({
      lang: currentLang,
      path: `/articles/${article.slug}`,
      equivalentPath,
      title: article.seo.title,
      description: article.seo.description,
      image: article.coverImage,
      type: 'article',
      publishedTime: publishedIso
    });

    // Inject / Update JSON-LD BlogPosting schema (only real data; no invented modified date/author person)
    const articleSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': article.title,
      'description': article.seo.description,
      'image': [imageUrl],
      'inLanguage': currentLang,
      'url': currentUrl,
      'author': {
        '@type': 'Organization',
        'name': 'Mister Pistachio',
        'url': 'https://misterpistachio.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': currentLang === 'ar' ? 'مستر بستاشيو' : 'Mister Pistachio',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://misterpistachio.com/logo.png'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': currentUrl
      }
    };
    if (publishedIso) {
      articleSchema['datePublished'] = publishedIso;
    }
    this.seo.setStructuredData('article-schema', articleSchema);

    // Inject / Update JSON-LD Breadcrumbs schema
    this.seo.setStructuredData('article-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': currentLang === 'ar' ? 'الرئيسية' : 'Home',
          'item': `https://misterpistachio.com/${currentLang}`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': currentLang === 'ar' ? 'المقالات والأبحاث' : 'Articles & Research',
          'item': `https://misterpistachio.com/${currentLang}/articles`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': article.title,
          'item': currentUrl
        }
      ]
    });
  }
}
