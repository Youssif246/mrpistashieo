import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
import { Article } from '../../shared/models/article.model';
import enArticles from '../../../assets/data/articles/en.json';
import arArticles from '../../../assets/data/articles/ar.json';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent implements OnInit {
  readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);

  // Full articles list based on active language
  readonly allArticles = computed<Article[]>(() => {
    return this.i18n.currentLang() === 'ar'
      ? (arArticles as Article[])
      : (enArticles as Article[]);
  });

  // First article is featured
  readonly featuredArticle = computed<Article | null>(() => {
    return this.allArticles().length > 0 ? this.allArticles()[0] : null;
  });

  // Remaining articles for the grid
  readonly gridArticles = computed<Article[]>(() => {
    return this.allArticles().slice(1);
  });

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';
    const title = isAr
      ? 'مقالات ودراسات زراعة الفستق الحلبي | مستر بستاشيو'
      : 'Agricultural Articles & Pistachio Cultivation Insights | Mister Pistachio';
    const description = isAr
      ? 'أبحاث ودراسات زراعية تطبيقية متخصصة في تأسيس بساتين الفستق الحلبي، انتخاب الأصول المقاومة، إدارة الري الذكي، وميكانيكا التربة.'
      : 'Authoritative agronomic research, orchard engineering guides, rootstock selection analysis, and deficit irrigation strategies for commercial pistachio growers.';

    this.seo.updateSeo({
      lang: this.i18n.currentLang(),
      path: '/articles',
      title,
      description,
      image: 'assets/images/articles/pistachio-orchard-guide/pistachio-orchard-guide.webp'
    });

    this.seo.setStructuredData('articles-breadcrumb', {
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
          'name': isAr ? 'المقالات والأبحاث' : 'Articles & Research',
          'item': `https://misterpistachio.com/${this.i18n.currentLang()}/articles`
        }
      ]
    });
  }
}
