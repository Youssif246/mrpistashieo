import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { SeoService } from '../../shared/seo.service';
import { APP_CONFIG } from '../../shared/config';

export interface Ucb1FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface Ucb1SpecRow {
  parameter: string;
  ucb1Value: string;
  traditionalValue: string;
  significance: string;
}

@Component({
  selector: 'app-ucb1',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ucb1.component.html',
  styleUrl: './ucb1.component.css'
})
export class Ucb1Component implements OnInit {
  readonly i18n = inject(TranslationService);
  readonly appConfig = APP_CONFIG;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';
    this.seo.updateSeo({
      lang: this.i18n.currentLang(),
      path: '/ucb1',
      title: isAr
        ? 'أصل الفستق الهجين UCB-1 المعتمد | مستر بستاشيو'
        : 'UCB-1 Hybrid Pistachio Rootstock | Mister Pistachio',
      description: isAr
        ? 'دليل شامل حول الأصل الهجين UCB-1: مقاومة الفيتوفثورا والديدان الثعبانية، تحمل الملوحة العالية، وقوة النمو المتسارعة للإنتاج التجاري المبكر.'
        : 'Comprehensive technical guide on certified clonal UCB-1 rootstocks: Phytophthora and nematode resistance, extreme salinity tolerance, and vigorous commercial precocity.',
      image: 'products-images/ucb1/ucb1-orchard.webp'
    });

    this.seo.setStructuredData('ucb1-breadcrumb', {
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
          'name': isAr ? 'أصل UCB-1' : 'UCB-1 Rootstock',
          'item': `https://misterpistachio.com/${this.i18n.currentLang()}/ucb1`
        }
      ]
    });
  }

  // State for active accordion item index (-1 means all closed)
  readonly activeFaqIndex = signal<number>(0);

  toggleFaq(index: number): void {
    if (this.activeFaqIndex() === index) {
      this.activeFaqIndex.set(-1);
    } else {
      this.activeFaqIndex.set(index);
    }
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  readonly coreAdvantages = computed(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    return [
      {
        id: 'vigor',
        icon: 'growth',
        title: isAr ? 'قوة نمو وتفرع خضري استثنائي' : 'Exceptional Vegetative Vigor',
        subtitle: isAr ? 'تكوين هيكلي متسارع' : 'Accelerated Canopy Formation',
        description: isAr
          ? 'يمتاز هجين UCB-1 بمعدل نمو أسرع بنسبة 40% مقارنة بالأصول التقليدية، مما يسرّع تكوين الهيكل التاجي للشجرة ويدخل البستان مرحلة الإنتاج الاقتصادي في غضون 4 إلى 5 سنوات فقط.'
          : 'UCB-1 delivers up to 40% faster vegetative growth than wild rootstocks, shortening the canopy architecture establishment phase and bringing orchards into commercial bearing by year 4 to 5.'
      },
      {
        id: 'verticillium',
        icon: 'shield',
        title: isAr ? 'أعلى مقاومة لفطر الفيرتيسيليوم' : 'Supreme Verticillium Resistance',
        subtitle: isAr ? 'أمان حيوي لأراضي المحاصيل السابقة' : 'Total Biosafety in High-Risk Soils',
        description: isAr
          ? 'يوفر هجين UCB-1 مناعة فائقة ومثبتة علمياً ضد فطر ذبول الفيرتيسيليوم (Verticillium dahliae) القاتل، مما يجعله الخيار الآمن والحتمي في الترب التي زُرعت سابقاً بالقطن أو الزيتون أو الباذنجانيات.'
          : 'UCB-1 exhibits scientifically documented superior resistance against deadly Verticillium dahliae wilt, making it the mandatory safeguard when establishing orchards on soils previously cropped with cotton, olives, or solanaceous plants.'
      },
      {
        id: 'early-graft',
        icon: 'graft',
        title: isAr ? 'إمكانية التطعيم في العام الأول' : 'Same-Year Field Grafting',
        subtitle: isAr ? 'نسبة نجاح تتعدى 95%' : '>95% Success Rate',
        description: isAr
          ? 'بفضل قطره الخشبي القوي ونشاطه العصاري الدائم، يُعد الأصل الوحيد الذي يتيح إجراء التطعيم الحقلي المباشر بنجاح باهر في نفس موسم الزراعة مع اختصار عامين كاملين من عمر المشروع.'
          : 'Owing to its robust stem diameter and active sap flow, UCB-1 is the only rootstock that reliably allows direct in-field budding in its first growing season with an industry-leading >95% take rate.'
      },
      {
        id: 'salinity',
        icon: 'mineral',
        title: isAr ? 'تحمل ملوحة التربة ومياه الري' : 'Salinity & Active Lime Tolerance',
        subtitle: isAr ? 'تأقلم حتى 5.0 dS/m' : 'Tolerates up to 5.0 dS/m',
        description: isAr
          ? 'يمتلك هجين UCB-1 قدرة فسيولوجية مميزة على تحمل ملوحة مياه الري والتربة حتى 4.5 – 5.0 ديسي سيمنز/م مع كفاءة في استبعاد أيونات الصوديوم والكلوريد، ومقاومة عالية للنيماتودا.'
          : 'Possesses physiological mechanisms to filter and tolerate irrigation salinity up to 4.5 – 5.0 dS/m, effectively excluding sodium and chloride ions while resisting root-knot nematodes and high limestone.'
      },
      {
        id: 'root-system',
        icon: 'root',
        title: isAr ? 'مجموع جذري عميق ومتشعب' : 'Expansive Dense Root System',
        subtitle: isAr ? 'تثبيت ميكانيكي وامتصاص فائق' : 'Deep Anchoring & Nutrient Uptake',
        description: isAr
          ? 'يجمع بين جذر وتدي عميق وشبكة كثيفة من الجذور الجانبية الماصة، مما يمنحه كفاءة غير مسبوقة في امتصاص العناصر الكبرى والصغرى واستغلال رطوبة التربة في كل من الري بالتنقيط والمناطق البعلية.'
          : 'Combines a strong vertical taproot with a prolific fibrous lateral root system, maximizing macronutrient and micronutrient absorption while optimizing water uptake under drip irrigation and rainfed conditions.'
      },
      {
        id: 'compatibility',
        icon: 'sync',
        title: isAr ? 'توافق جيني تام مع جميع الأصناف' : '100% Cultivar Compatibility',
        subtitle: isAr ? 'كيرمان، سيرورا، لارناكا، والملقحات' : 'Kerman, Sirora, Larnaka & Pollinators',
        description: isAr
          ? 'يلتحم هجين UCB-1 بنسبة 100% دون أي تنافر نسيجي أو انتفاخ مع كافة الأصناف التجارية المنتخبة، سواء الأصناف المؤنثة (كيرمان، سيرورا، لارناكا، أفدات) أو الملقحات المعتمدة (بيتر، سي-سبيشال، إيجينو).'
          : 'Exhibits complete physiological compatibility with zero graft-union rejection or overgrowth across all major female cultivars (Kerman, Sirora, Larnaka, Avdat, Kastel) and male pollinators (Peter, C-Especial, Egino).'
      }
    ];
  });

  readonly specComparison = computed<Ucb1SpecRow[]>(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    return [
      {
        parameter: isAr ? 'التصنيف النباتي والوراثي' : 'Botanical & Genetic Pedigree',
        ucb1Value: 'Pistacia atlantica × Pistacia integerrima (F1 Hybrid)',
        traditionalValue: isAr ? 'أنواع برية أحادية (P. terebinthus / P. atlantica)' : 'Wild individual species (Terebinthus / Atlantica)',
        significance: isAr ? 'هجين معتمد مستنبط في جامعة كاليفورنيا ديفيس (UC Davis)' : 'Certified hybrid developed at UC Davis'
      },
      {
        parameter: isAr ? 'مقاومة فطر الفيرتيسيليوم (Verticillium)' : 'Verticillium Dahliae Resistance',
        ucb1Value: isAr ? 'مناعة ومقاومة استثنائية موثقة' : 'Scientifically verified high immunity',
        traditionalValue: isAr ? 'حساسية متوسطة إلى شديدة' : 'Moderate to high susceptibility',
        significance: isAr ? 'حماية تامة من موت البستان الفجائي في الأراضي الموبوءة' : 'Crucial protection against fatal fungal vascular wilt'
      },
      {
        parameter: isAr ? 'معدل النمو الخضري وتكوين الشجرة' : 'Vegetative Growth Rate & Caliper',
        ucb1Value: isAr ? 'فائق السرعة (أسرع بنسبة 40 – 50%)' : 'Ultra-vigorous (+40% to 50% faster)',
        traditionalValue: isAr ? 'نمو بطيء إلى متوسط' : 'Slow to moderate growth',
        significance: isAr ? 'اختصار 2 إلى 3 سنوات للوصول إلى الحجم التجاري الكامل' : 'Reduces canopy establishment by 2 to 3 full years'
      },
      {
        parameter: isAr ? 'توقيت التطعيم الحقلي' : 'Time to Field Grafting / Budding',
        ucb1Value: isAr ? 'في نفس عام الغرس (العام الأول)' : 'Same year of planting (Year 1)',
        traditionalValue: isAr ? 'العام الثاني أو الثالث بعد الغرس' : 'Year 2 or 3 post-planting',
        significance: isAr ? 'توفير تكاليف الرعاية الحقلي وتسريع دورة الإنتاج' : 'Lowers maintenance costs and advances commercial cycle'
      },
      {
        parameter: isAr ? 'دخول مرحلة الإنتاج التجاري' : 'First Commercial Harvest',
        ucb1Value: isAr ? 'العام الرابع إلى الخامس (Year 4 – 5)' : 'Year 4 to 5 post-grafting',
        traditionalValue: isAr ? 'العام السابع إلى الثامن (Year 7 – 8)' : 'Year 7 to 8 post-grafting',
        significance: isAr ? 'استرداد أسرع لرأس المال الاستثماري للمشروع' : 'Significantly accelerates investment payback (ROI)'
      },
      {
        parameter: isAr ? 'تحمل ملوحة مياه الري والتربة' : 'Salinity Tolerance (EC)',
        ucb1Value: isAr ? 'حتى 4.5 – 5.0 dS/m' : 'Up to 4.5 – 5.0 dS/m',
        traditionalValue: isAr ? 'أقل من 2.5 – 3.0 dS/m' : 'Below 2.5 – 3.0 dS/m',
        significance: isAr ? 'إمكانية استغلال الآبار والمياه التي تحتوي على نسب ملوحة' : 'Enables profitable farming with marginal or brackish water'
      },
      {
        parameter: isAr ? 'تحمل الصقيع وبرودة الشتاء' : 'Winter Cold Hardiness',
        ucb1Value: isAr ? 'يتحمل حتى -12°م إلى -15°م' : 'Hardy down to -12°C to -15°C',
        traditionalValue: isAr ? 'يتحمل حتى -18°م (للكورنيكابرا)' : 'Hardy down to -18°C (Terebinthus)',
        significance: isAr ? 'ملائم تماماً لكافة مناطق حوض المتوسط والشرق الأوسط وإسبانيا' : 'Thrives across Mediterranean and continental interiors'
      },
      {
        parameter: isAr ? 'ملاءمة أنظمة الري' : 'Irrigation & Moisture Adaptability',
        ucb1Value: isAr ? 'استجابة فائقة للري بالتنقيط وتأقلم موثق في البعل' : 'Supreme drip fertigation efficiency + rainfed endurance',
        traditionalValue: isAr ? 'مخصص بالأساس للأراضي البعلية الفقيرة' : 'Exclusively suited for rainfed drylands',
        significance: isAr ? 'أقصى إنتاجية للكيلوغرام تحت الري الحديث والمكثف' : 'Unmatched yield potential under modern fertigation'
      },
      {
        parameter: isAr ? 'التوافق مع الأصناف التجارية' : 'Compatibility with Commercial Scions',
        ucb1Value: isAr ? 'توافق كامل 100% مع كيرمان، سيرورا، لارناكا، إلخ' : '100% compatible with Kerman, Sirora, Larnaka, etc.',
        traditionalValue: isAr ? 'توافق جيد مع بعض التفاوت في القطر' : 'Good compatibility, minor trunk disparity',
        significance: isAr ? 'التحام متين ومنتظم للساق وتدفق عصاري خالٍ من الاختناقات' : 'Seamless trunk union with optimal vascular continuity'
      }
    ];
  });

  readonly faqs = computed<Ucb1FaqItem[]>(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    return [
      {
        question: isAr
          ? 'ما هو أصل الفستق UCB-1 وما مصدره الوراثي؟'
          : 'What is the UCB-1 pistachio rootstock and what is its genetic origin?',
        answer: isAr
          ? 'أصل UCB-1 هو هجين وراثي من الجيل الأول (F1) استنبطه باحثو قسم أمراض النبات في جامعة كاليفورنيا - ديفيس (UC Davis). تم إنتاجه بتهجين منتقى بين شجرة أنثى من البطم الأطلسي (Pistacia atlantica) كشجرة أم، ولقاح مذكر من البطم الصحيح (Pistacia integerrima). يجمع هذا الأصل بين صلابة الأطلسي وتحمل البرودة، وقوة نمو ومقاومة الإنتيجيريما الفائقة لمرض ذبول الفيرتيسيليوم، مما جعله المعيار العالمي الأول لبساتين الفستق الحديثة.'
          : 'UCB-1 is an F1 interspecific hybrid developed by the Department of Plant Pathology at the University of California, Davis (UC Davis). It is produced through controlled pollination between female Pistacia atlantica and male Pistacia integerrima. This hybrid unites the winter cold hardiness and drought adaptation of Atlantica with the explosive vigor and Verticillium immunity of Integerrima, making it the premier global benchmark for modern commercial pistachio orchards.'
      },
      {
        question: isAr
          ? 'هل ينجح أصل UCB-1 في الزراعة البعلية بدون شبكة ري؟'
          : 'Can UCB-1 succeed in rainfed (dryland / secano) farming without irrigation?',
        answer: isAr
          ? 'نعم، أثبتت الدراسات الزراعية والتجارب الميدانية الإسبانية الممتدة منذ تسعينيات القرن الماضي أن بساتين UCB-1 تنجح في الزراعة البعلية شريطة هطول أمطار سنوية معتدلة (لا تقل عن 300-350 ملم) وإعداد حفر الغرس بعمق كافٍ مع استخدام ريات تكميلية خلال الصيفين الأولين لتثبيت الجذور. ورغم أن أصل الكورنيكابرا يبقى الأقوى في الأراضي الصخرية شديدة الجفاف، إلا أن UCB-1 يعطي تفوقاً واضحاً في قوة نمو الشجرة وسرعة دخولها في الإنتاج.'
          : 'Yes. Extensive field observations and agronomic trials in Spain since 1990 confirm that UCB-1 performs reliably in rainfed conditions provided annual rainfall exceeds 300–350 mm and soil preparation is sufficiently deep. Supplemental watering during the first one or two summers helps root establishment. While Pistacia terebinthus remains unsurpassed in hyper-arid rocky limestone, UCB-1 provides superior vigor and earlier bearing whenever water is accessible.'
      },
      {
        question: isAr
          ? 'متى يمكن تطعيم شتلات UCB-1 بعد زراعتها في الأرض الدائمة؟'
          : 'When can UCB-1 rootstocks be grafted after field planting?',
        answer: isAr
          ? 'يتميز هجين UCB-1 بأنه الأصل الوحيد الذي يتيح التطعيم الحقلي في نفس عام الغرس (خلال أشهر الصيف: يوليو إلى سبتمبر) إذا تمت زراعته في أواخر الشتاء أو بواكير الربيع؛ وذلك نظراً لسرعة تدفق عصارته وسماكة ساقه الخشبية. تصل نسبة نجاح التطعيم في العام الأول إلى أكثر من 95%، مما يوفر على المستثمر عامين كاملين مقارنة بالأصول التقليدية.'
          : 'UCB-1 is the only pistachio rootstock capable of reaching grafting caliber within its first growing season (summer T-budding or chip-budding between July and September) when planted in late winter or early spring. Its continuous active cambial growth produces take rates exceeding 95%, saving two full years over slow-growing traditional wild stocks.'
      },
      {
        question: isAr
          ? 'كيف يحمي أصل UCB-1 البستان من مرض ذبول الفيرتيسيليوم الفتاك؟'
          : 'How does UCB-1 protect pistachio orchards against Verticillium wilt?',
        answer: isAr
          ? 'فطر ذبول الفيرتيسيليوم (Verticillium dahliae) هو أحد أخطر الأمراض الفطرية التي تسكن التربة لعقود وتسد الأوعية الناقلة للشجرة مسببة موتها السريع. يتمتع UCB-1 بمقاومة وراثية فسيولوجية تمنع الفطر من اختراق أوعية الخشب الجذرية، مما يجعله خط الدفاع الأول والضروري عند زراعة الفستق في أراضٍ زُرعت سابقاً بمحاصيل مضيفة كالأقطان، الزيتون، أو الخضراوات.'
          : 'Verticillium dahliae is a devastating soil-borne fungus that colonizes vascular xylem tissue, leading to irreversible canopy death. UCB-1 possesses natural genetic resistance mechanisms that block fungal hyphae from invading the root vascular system. It is considered an indispensable safeguard when planting on former cotton, olive, potato, or solanaceous farm lands.'
      },
      {
        question: isAr
          ? 'ما هي الأصناف المتوافقة مع أصل UCB-1؟'
          : 'Which pistachio cultivars are compatible with UCB-1?',
        answer: isAr
          ? 'أصل UCB-1 متوافق حيوياً بنسبة 100% مع كافة الأصناف التجارية المنتشرة عالمياً، بما في ذلك الأصناف المؤنثة: كيرمان (Kerman)، سيرورا (Sirora)، لارناكا (Larnaka)، أفدات (Avdat)، كاستل (Kastel)، إيجينا (Aegina)، وماطور (Mateur)، وكذلك الأصناف الملقحة المذكرة: بيتر (Peter)، سي-سبيشال (C-Especial)، إيجينو (Egino)، وغيريرو (Guerrero).'
          : 'UCB-1 is 100% physiologically compatible with all major commercial cultivars without graft rejection or tissue swelling. Compatible female varieties include Kerman, Sirora, Larnaka, Avdat, Kastel, Aegina, and Mateur, as well as male pollinators like Peter, C-Especial, Egino, and Guerrero.'
      },
      {
        question: isAr
          ? 'ما الفرق بين أصل UCB-1 وأصل الكورنيكابرا (Cornicabra)؟'
          : 'What is the main difference between UCB-1 and Cornicabra (Pistacia terebinthus)?',
        answer: isAr
          ? 'أصل الكورنيكابرا هو أصل متوسطي بري موجه للزراعة البعلية الشاقة، والتربة الحجرية الفقيرة، مع مقاومة قصوى لبرودة الشتاء، لكنه بطيء النمو ولا يبدأ الإنتاج إلا في العام السابع أو الثامن، وهو حساس لفطر الفيرتيسيليوم. بينما هجين UCB-1 مهندس خصيصاً للمزارع الاستثمارية المروية والحديثة ذات الكثافات العالية، ويتميز بمقاومة تامة للفيرتيسيليوم، ومعدل نمو أسرع بكثير، وإنتاج يبدأ في العام الرابع أو الخامس.'
          : 'Cornicabra (Pistacia terebinthus) is an indigenous wild Mediterranean stock ideal for extreme dryland, shallow limestone, and extreme frost down to -18°C, but grows slowly, enters bearing late (years 7-8), and is susceptible to Verticillium. UCB-1 is engineered for intensive irrigated commercial projects, offering documented Verticillium resistance, fast canopy formation, and commercial bearing by year 4 to 5.'
      },
      {
        question: isAr
          ? 'كيف تضمن شركة مستر بستاشيو جودة ونقاء شتلات UCB-1؟'
          : 'How does Mister Pistachio guarantee the genetic purity of UCB-1 rootstocks?',
        answer: isAr
          ? 'نعتمد في مشاتلنا حصرياً على بذور هجينة أصلية معتمدة ومصدرة من أشجار أمهات مراقبة ومعتمدة دولياً ومختبرة جينياً (True-to-Type)، لتفادي الطفرات الوراثية وتجنب متلازمة الشجيرات القزمة أو البكتيريا (مثل Rhodococcus fascians). تخضع شتلاتنا لإشراف زراعي صارم وتحصل على شهادة صحة نباتية رسمية تثبت خلوها التام من النيماتودا والفطريات.'
          : 'Our nurseries propagate exclusively from certified true-to-type hybrid seeds derived from certified parent trees to eliminate genetic variability, off-types, and bacterial complications (such as Rhodococcus fascians). Every batch undergoes strict phytosanitary inspection and carries official health certification confirming freedom from nematodes and soil pathogens.'
      },
      {
        question: isAr
          ? 'كيف يمكن حجز كميات الشتلات وترتيب التوصيل؟'
          : 'How can I reserve UCB-1 saplings and arrange delivery?',
        answer: isAr
          ? 'يتم حجز الشتلات بالتواصل المباشر مع فريقنا الفني عبر نموذج الاتصال أو الاتصال الهاتفي. نقوم بدراسة موقع بستانك وتحديد الاحتياجات الفنية وجدولة مواعيد التوريد والنقل المبرد لضمان وصول الشتلات بأعلى حيوية وطاقة نمو.'
          : 'Reservations are processed directly through our technical team via our contact form or phone call. We evaluate your orchard location and timeline, scheduling conditioned logistics to deliver fresh, vigorous saplings directly to your farm.'
      }
    ];
  });
}