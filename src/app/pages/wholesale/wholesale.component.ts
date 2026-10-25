import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
import { APP_CONFIG } from '../../shared/config';

export interface WholesaleProductItem {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  specsAr: string[];
  specsEn: string[];
}

export interface HealthBenefitItem {
  number: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  tagAr: string;
  tagEn: string;
}

export interface PackagingOption {
  weight: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  featuresAr: string[];
  featuresEn: string[];
}

import { InquiryAccordionComponent } from '../../shared/inquiry-accordion/inquiry-accordion.component';

@Component({
  selector: 'app-wholesale',
  standalone: true,
  imports: [RouterLink, InquiryAccordionComponent],
  templateUrl: './wholesale.component.html',
  styleUrl: './wholesale.component.css'
})
export class WholesaleComponent implements OnInit {
  readonly i18n = inject(TranslationService);
  readonly appConfig = APP_CONFIG;
  private readonly seo = inject(SeoService);

  readonly products: WholesaleProductItem[] = [
    {
      id: 'natural-in-shell',
      titleAr: 'فستق حلبي طبيعي بقشره',
      titleEn: 'Natural Pistachio in Shell',
      categoryAr: 'عضوي وتقليدي',
      categoryEn: 'Organic & Conventional',
      descAr: 'فستق حلبي سوري طبيعي مفرز بعناية، مجفف بنسب رطوبة مثالية، مفتوح طبيعياً بنسب عالية وجاهز للتعبئة والتوزيع الفاخر.',
      descEn: 'Carefully sorted natural Syrian in-shell pistachios, dried to ideal moisture levels, with high natural split percentages for premium wholesale distribution.',
      icon: 'fa-solid fa-seedling',
      specsAr: ['مقاسات معتمدة: 18-20، 20-22، 23-25 ثمرة/أونصة', 'رطوبة مضبوطة: أقل من 5%', 'انفتاح طبيعي ممتاز'],
      specsEn: ['Calibers: 18-20, 20-22, 23-25 nuts/oz', 'Moisture: Under 5%', 'High Natural Split Ratio']
    },
    {
      id: 'natural-shelled',
      titleAr: 'لب الفستق الحلبي الطبيعي (مقشر)',
      titleEn: 'Natural Shelled Pistachio Kernels',
      categoryAr: 'لب خام صافٍ مفرز',
      categoryEn: 'Raw Sorted Kernels',
      descAr: 'لب فستق حلبي سوري صافٍ، مفرز حسب درجات اللون الأخضر الزمردي والحجم، مثالي لصناع الشوكولاتة والحلويات الراقية.',
      descEn: 'Pure raw Syrian pistachio kernels, color-sorted for vibrant emerald green intensity, perfectly suited for master chocolatiers and royal patisseries.',
      icon: 'fa-solid fa-gem',
      specsAr: ['درجات اللون: سوبر أخضر زمردي، درجة أ', 'خالٍ من القشور والشوائب', 'مثالي للتصنيع الغذائي'],
      specsEn: ['Color: Super Emerald Green, Grade A', 'Free from shells and debris', 'Ideal for Gourmet Manufacturing']
    },
    {
      id: 'roasted-salted',
      titleAr: 'فستق حلبي محمص ومملح بقشره',
      titleEn: 'Roasted & Salted Pistachio in Shell',
      categoryAr: 'محمص هوائياً بحرفية',
      categoryEn: 'Artisanal Dry-Roasted',
      descAr: 'محمص بدرجات حرارة محسوبة بدقة للحفاظ على الزيوت والروائح العطرية الطبيعية، ومملح بملح بحري نقي لتجربة سناك لا تقاوم.',
      descEn: 'Precision dry-roasted at mild temperatures to preserve volatile aromatic oils, lightly seasoned with pure sea salt for an exquisite snacking experience.',
      icon: 'fa-solid fa-fire-burner',
      specsAr: ['تحميص هوائي متجانس', 'ملح بحري طبيعي متوازن', 'قرمشة استثنائية مستدامة'],
      specsEn: ['Uniform Dry Roasting', 'Balanced Natural Sea Salt', 'Exceptional Crisp Texture']
    },
    {
      id: 'diced-chopped',
      titleAr: 'فستق حلبي مجروش وحبيبات',
      titleEn: 'Chopped & Diced Natural Pistachio',
      categoryAr: 'حبيبات معايرة دقيقة',
      categoryEn: 'Calibrated Granulates',
      descAr: 'حبيبات فستق حلبي سوري مقطعة بقياسات متناسقة، مخصصة لتزيين البقلاوة الملكية، قوالب الشوكولاتة، والآيس كريم والكرواسون.',
      descEn: 'Evenly diced Syrian pistachio nibs with calibrated granulometry, tailored for baklava toppings, chocolate inclusions, gelato, and viennoiserie.',
      icon: 'fa-solid fa-mortar-pestle',
      specsAr: ['مقاسات حبيبية منتظمة: 2-4 مم، 4-6 مم', 'لون أخضر زاهٍ متجانس', 'جاهز للاستخدام الفوري'],
      specsEn: ['Calibrated sizes: 2-4mm, 4-6mm', 'Uniform vivid green color', 'Ready for industrial lines']
    },
    {
      id: 'pistachio-paste',
      titleAr: 'معجون وطحين الفستق الحلبي النقي 100%',
      titleEn: '100% Pure Pistachio Paste & Flour',
      categoryAr: 'نقي 100% بدون إضافات',
      categoryEn: '100% Pure, Zero Additives',
      descAr: 'معجون ناعم مخملي مستخلص من الفستق السوري 100% بدون أي زيوت مضافة أو ملونات، مع طحين فستق ناعم جداً للماكرون والحلويات.',
      descEn: 'Silky smooth 100% pure pistachio paste with zero additives or hydrogenated oils, alongside ultra-fine pistachio flour for macarons and Levant pastries.',
      icon: 'fa-solid fa-jar',
      specsAr: ['نقاء مطلق: فستق حلبي سوري 100%', 'قوام كريمي متجانس وغني', 'خالٍ من الزيوت المهدرجة'],
      specsEn: ['100% Pure Syrian Pistachios', 'Silky homogeneous texture', 'Zero palm oil or preservatives']
    }
  ];

  readonly healthBenefits: HealthBenefitItem[] = [
    {
      number: '01',
      titleAr: 'تنظيم مستويات السكر في الدم',
      titleEn: 'Blood Sugar Regulation',
      descAr: 'يساعد الفستق الحلبي، بفضل مؤشره الجلايسيمي المنخفض وغناه بالفوسفور والألياف، على تكسير البروتينات إلى أحماض أمينية والحفاظ على استقرار مستويات الجلوكوز.',
      descEn: 'With its low glycemic index, dietary fiber, and rich phosphorus content, pistachios help regulate glucose metabolism and sustain balanced blood sugar levels.',
      icon: 'fa-solid fa-chart-line',
      tagAr: 'مؤشر جلايسيمي منخفض',
      tagEn: 'Low Glycemic Index'
    },
    {
      number: '02',
      titleAr: 'المساعدة في ضبط الوزن والشعور بالشبع',
      titleEn: 'Weight Management & Satiety',
      descAr: 'يحتوي الفستق على تركيز مرتفع من البروتين النباتي والألياف الغذائية، مما يجعله سناكاً صحياً مشبعاً يدعم التحكم الصحي بالوزن ضمن حصة يومية معتدلة.',
      descEn: 'Rich in plant-based proteins and dietary fibers, pistachios provide long-lasting satiety and nutrient density, making them an ideal wholesome daily snack.',
      icon: 'fa-solid fa-weight-scale',
      tagAr: 'شبع طبيعي وبروتين متوازن',
      tagEn: 'Natural Satiety & Protein'
    },
    {
      number: '03',
      titleAr: 'تعزيز صحة القلب والأوعية الدموية',
      titleEn: 'Cardiovascular & Heart Health',
      descAr: 'مصدر طبيعي غني بالأحماض الدهنية غير المشبعة (أوميغا)، مضادات الأكسدة القوية، والبوتاسيوم، مما يسهم بشكل مثبت في خفض الكوليسترول الضار ودعم مرونة الشرايين.',
      descEn: 'A natural powerhouse of heart-healthy monounsaturated fats, potassium, and antioxidants, proven to support healthy cholesterol profiles and arterial elasticity.',
      icon: 'fa-solid fa-heart-pulse',
      tagAr: 'أوميغا ومضادات أكسدة',
      tagEn: 'Omega & Antioxidants'
    },
    {
      number: '04',
      titleAr: 'حماية صحة العين والوقاية من التدهور المعرفي',
      titleEn: 'Vision & Cognitive Protection',
      descAr: 'الفستق هو المكسرات الوحيدة التي تحتوي على مستويات وازنة من اللوتين والزياكسانثين والزنك لحماية شبكية العين، إلى جانب الفلافونويدات الداعمة للوظائف الإدراكية.',
      descEn: 'The only tree nut providing meaningful levels of lutein and zeaxanthin to protect ocular tissues, alongside zinc and flavonoids associated with cognitive vitality.',
      icon: 'fa-solid fa-eye',
      tagAr: 'لوتين وزياكسانثين وزنك',
      tagEn: 'Lutein & Zeaxanthin'
    },
    {
      number: '05',
      titleAr: 'تحسين صحة الجهاز الهضمي والقولون',
      titleEn: 'Gut Health & Digestive Microbiome',
      descAr: 'يحتوي الفستق الحلبي على ألياف بريبايوتك طبيعية تعزز تكاثر البكتيريا المعوية النافعة، مما يدعم كفاءة الهضم وحماية القناة الهضمية.',
      descEn: 'Packed with natural prebiotic fibers that nourish beneficial gut microflora, promoting smooth digestive transit and robust gastrointestinal wellness.',
      icon: 'fa-solid fa-shield-virus',
      tagAr: 'بريبايوتك وألياف نشطة',
      tagEn: 'Natural Prebiotics'
    }
  ];

  readonly packagingOptions: PackagingOption[] = [
    {
      weight: '25 KG',
      titleAr: 'أكياس خيش وبولي بروبيلين',
      titleEn: 'Bags & Sacks (25 KG)',
      subtitleAr: 'التعبئة القياسية للشحن السائب',
      subtitleEn: 'Standard Bulk Transport Bags',
      descAr: 'أكياس متينة منسوجة تسمح بالتهوية الطبيعية لحفظ القشور، مخصصة لتجارة الجملة والمستودعات وسهولة النقل والمناولة.',
      descEn: 'Durable breathable woven bags engineered for wholesale storage and bulk transport, preserving natural freshness.',
      icon: 'fa-solid fa-boxes-packing',
      featuresAr: ['ألياف طبيعية جيدة التهوية', 'أوزان شحن تجارية معتمدة', 'سهولة التخزين والمناولة'],
      featuresEn: ['Natural breathable weave', 'Standard export weight', 'Easy warehouse handling']
    },
    {
      weight: '1,000 KG',
      titleAr: 'جامبو باج (Big Bags)',
      titleEn: 'Big Bags / Bulk Totes (1000 KG)',
      subtitleAr: 'التوريد الصناعي لخطوط الإنتاج',
      subtitleEn: 'Industrial High-Volume Supply',
      descAr: 'أكياس جامبو صناعية فائقة المتانة مزودة بفتحات تفريغ سفلية محكمة، مخصصة للمصانع الكبرى وخطوط المعالجة والتصنيع الآلي.',
      descEn: 'Heavy-duty industrial bulk totes with discharge spouts, tailored for large confectionery plants and automated processing lines.',
      icon: 'fa-solid fa-pallet',
      featuresAr: ['فتحة تفريغ سفلية مضبوطة', 'أحزمة رفع مصفحة للرافعات', 'توفير التكاليف اللوجستية'],
      featuresEn: ['Controlled bottom discharge', 'Reinforced lifting straps', 'Optimal freight efficiency']
    },
    {
      weight: '10 - 12.5 KG',
      titleAr: 'كراتين مفرغة من الهواء (Vacuum)',
      titleEn: 'Vacuum-Sealed Boxes (10 - 12.5 KG)',
      subtitleAr: 'حفظ النقاء واللون الزمردي',
      subtitleEn: 'Anti-Oxidation Kernel Shield',
      descAr: 'تغليف متقدم مفرغ من الهواء أو مشحون بغاز خامل لحماية لب الفستق المقشر من الأكسدة وحفظ الزيوت العطرية واللون الأخضر طوال الشحن الدولي.',
      descEn: 'Airtight vacuum barrier or inert gas packaging inside heavy-duty cartons, safeguarding raw kernels against oxidation during long-haul transit.',
      icon: 'fa-solid fa-shield-halved',
      featuresAr: ['حاجز أكسجين ورطوبة تام', 'حفظ اللون الأخضر الزمردي', 'شحن بحري وجوي آمن'],
      featuresEn: ['Total barrier against oxidation', 'Preserves emerald color', 'Safe ocean & air freight']
    }
  ];

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';
    const title = isAr
      ? 'توريد الفستق الحلبي السوري بالجملة | مستر بيستاشيو'
      : 'Wholesale Syrian Pistachios Supply | Mister Pistachio';
    const description = isAr
      ? 'متخصصون في توريد الفستق الحلبي السوري الأصيل بالجملة: طبيعي بقشره، لب مقشر، محمص، مجروش، ومعجون 100%. خيارات تعبئة وشحن دولي بمطابقة صحية كاملة.'
      : 'Wholesale authentic Syrian pistachios: In-shell, raw kernels, roasted & salted, diced, and 100% pure paste. Bulk supply, customized packaging, and global export.';

    this.seo.updateSeo({
      lang: this.i18n.currentLang(),
      path: '/wholesale',
      title,
      description,
      image: 'assets/images/wholesale/wholesale-products-forms.jpg'
    });

    this.seo.setStructuredData('wholesale-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': isAr ? 'الرئيسية' : 'Home',
          'item': `https://www.misterpistachio.com/${this.i18n.currentLang()}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': isAr ? 'التوريد بالجملة' : 'Wholesale Pistachios',
          'item': `https://www.misterpistachio.com/${this.i18n.currentLang()}/wholesale/`
        }
      ]
    });
  }

  getWhatsAppQuoteUrl(): string {
    const isAr = this.i18n.currentLang() === 'ar';
    const msg = isAr
      ? 'مرحباً شركة مستر بستاشيو، أود الاستفسار عن تفاصيل وأسعار توريد الفستق الحلبي السوري بالجملة.'
      : 'Hello Mister Pistachio, I would like to inquire about wholesale Syrian pistachio supply and pricing.';
    return this.appConfig.getWhatsAppUrl(msg);
  }
}
