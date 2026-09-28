import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/translation.service';
import { APP_CONFIG } from '../../shared/config';

export interface VarietyItem {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  badge: string;
  origin: string;
  image: string;
  altText: string;
  flowering: string;
  chillingHours: string;
  pollinatorsOrFemales: string;
  description: string;
  characteristics: { label: string; value: string }[];
}

export interface RootstockItem {
  id: string;
  name: string;
  botanicalName: string;
  badge: string;
  image: string;
  altText: string;
  description: string;
  soilSuitability: string;
  waterRegime: string;
  coldResistance: string;
  keyAdvantage: string;
  formats: string;
}

export interface ComparisonRow {
  name: string;
  sex: 'female' | 'male';
  type: string;
  floweringWindow: string;
  chillHours: string;
  partners: string;
  keyTrait: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  readonly i18n = inject(TranslationService);

  readonly femaleVarieties = computed<VarietyItem[]>(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    return [
      {
        id: 'kerman',
        name: isAr ? 'كيرمان' : 'Kerman',
        scientificName: 'Pistacia vera cv. Kerman',
        category: isAr ? 'صنف مؤنث منتج' : 'Female Productive Cultivar',
        badge: isAr ? 'المعيار التجاري العالمي الأول' : 'Global Commercial Benchmark',
        origin: isAr ? 'الولايات المتحدة (شيكو، كاليفورنيا)' : 'USA Selection (Chico, California)',
        image: 'products-images/varieties/kerman.jpg',
        altText: isAr ? 'ثمار فستق صنف كيرمان' : 'Kerman pistachio variety clusters',
        flowering: isAr ? 'أواخر أبريل (متأخر)' : 'Late Bloom (Late April)',
        chillingHours: isAr ? '800 – 1000 ساعة برودة' : '800 – 1,000 Chill Hours',
        pollinatorsOrFemales: isAr ? 'بيتر، إيجينو، غيريرو' : 'Peter, Egino, Guerrero',
        description: isAr
          ? 'الصنف الأكثر شهرة وزراعة في إسبانيا والأسواق العالمية. يتميز بحباته الكروية الكبيرة، وقشرته العاجية الصلبة ذات الإقبال التجاري الفائق. يزهر متأخراً مما يحميه بامتياز من صقيع الربيع المتأخر في المناطق القارية، ويتطلب ساعات برودة شتوية مرتفعة لكسر سكون البراعم.'
          : 'The leading commercial variety in Spain and worldwide. Recognized for large, spherical nuts with crisp ivory shells and high market demand. Due to its late flowering window, Kerman consistently avoids spring frosts in continental interiors. Requires substantial winter chill hours to achieve optimal bud break.',
        characteristics: [
          {
            label: isAr ? 'شكل الثمرة والتفتح' : 'Nut Geometry & Split',
            value: isAr ? 'عيار كبير كروي مع نسبة تفتح طبيعي مرتفعة' : 'Large caliber, rounded shape, high split percentage'
          },
          {
            label: isAr ? 'ساعات البرودة الشتوية' : 'Chilling Requirement',
            value: isAr ? '800 – 1000 ساعة برودة (< 7°م)' : '800 – 1,000 cold hours (< 7°C)'
          },
          {
            label: isAr ? 'طبيعة النمو الخضري' : 'Tree Architecture',
            value: isAr ? 'شجرة قوية النمو ذات هيكل رأسي متين' : 'High vegetative vigor with upright framework'
          },
          {
            label: isAr ? 'الملقحات المتزامنة' : 'Synchronous Pollinators',
            value: isAr ? 'بيتر (أساسي)، إيجينو، غيريرو (للحماية المتأخرة)' : 'Peter (primary), Egino, Guerrero (late safeguard)'
          }
        ]
      },
      {
        id: 'sirora',
        name: isAr ? 'سيرورا' : 'Sirora',
        scientificName: 'Pistacia vera cv. Sirora',
        category: isAr ? 'صنف مؤنث منتج' : 'Female Productive Cultivar',
        badge: isAr ? 'استنباط أسترالي عالي الإنتاجية' : 'High-Yield Australian Selection',
        origin: isAr ? 'أستراليا (معهد CSIRO للبحوث)' : 'Australia (CSIRO Breeding Program)',
        image: 'products-images/varieties/sirora.jpg',
        altText: isAr ? 'ثمار فستق صنف سيرورا ذات نسبة تفتح قياسية' : 'Sirora pistachio variety open nuts',
        flowering: isAr ? 'منتصف أبريل (متوسط)' : 'Intermediate Bloom (Mid-April)',
        chillingHours: isAr ? '600 – 800 ساعة برودة' : '600 – 800 Chill Hours',
        pollinatorsOrFemales: isAr ? 'سي-سبيشال، بيتر، إيجينو' : 'C-Especial, Peter, Egino',
        description: isAr
          ? 'صنف تم استنباطه في أستراليا بهدف رفع الإنتاجية والحد من ظاهرة المعاومة (تبادل الحمل). يتميز بنموه الخضري السريع، وتزهيره المتوسط، وأعلى نسبة تفتح طبيعي للغلاف (Abiertos). يوفر للمزارع إنتاجاً سنوياً منتظماً وثابتاً بأقل قدر من التذبذب بين المواسم.'
          : 'Bred in Australia to enhance productivity and curb biennial alternate bearing. Sirora combines rapid vegetative growth, intermediate flowering, and an exceptionally high natural shell-split rate (abiertos). It delivers dependable annual harvests with minimal crop fluctuation between seasons.',
        characteristics: [
          {
            label: isAr ? 'شكل الثمرة والتفتح' : 'Nut Geometry & Split',
            value: isAr ? 'عيار متوسط مع نسبة تفتح قياسية تتجاوز 85%' : 'Medium caliber with industry-leading split rate (>85%)'
          },
          {
            label: isAr ? 'ساعات البرودة الشتوية' : 'Chilling Requirement',
            value: isAr ? '600 – 800 ساعة برودة شتوية' : '600 – 800 cold hours'
          },
          {
            label: isAr ? 'انتظام المحصول' : 'Bearing Regularity',
            value: isAr ? 'انخفاض ملحوظ في ظاهرة المعاومة (إنتاج سنوي منتظم)' : 'Low alternate bearing; reliable year-on-year yields'
          },
          {
            label: isAr ? 'الملقحات المتزامنة' : 'Synchronous Pollinators',
            value: isAr ? 'سي-سبيشال، بيتر، وإيجينو' : 'C-Especial, Peter, and Egino'
          }
        ]
      },
      {
        id: 'larnaka',
        name: isAr ? 'لارناكا' : 'Larnaka',
        scientificName: 'Pistacia vera cv. Larnaka',
        category: isAr ? 'صنف مؤنث فاخر للحلويات' : 'Female Gourmet Cultivar',
        badge: isAr ? 'المعيار المتوسطي للحلويات الفاخرة' : 'Mediterranean Confectionery Benchmark',
        origin: isAr ? 'قبرص (حوض لارناكا)' : 'Cyprus (Larnaca District)',
        image: 'products-images/varieties/larnaka.jpg',
        altText: isAr ? 'فستق لارناكا بلب زمردي أخضر' : 'Larnaka pistachio variety nuts',
        flowering: isAr ? 'أوائل إلى منتصف أبريل' : 'Early-Mid Bloom (Early April)',
        chillingHours: isAr ? '550 – 650 ساعة برودة' : '550 – 650 Chill Hours',
        pollinatorsOrFemales: isAr ? 'سي-سبيشال، إيجينو' : 'C-Especial, Egino',
        description: isAr
          ? 'الصنف الأثير لدى صانعي الحلويات والجيلاتو الراقي في أوروبا. ينتج ثماراً طولية جذابة بقشرة كريمية ناعمة ولُب أخضر زمردي داكن فائق النكهة وغني بالزيوت العطرية. يتميز بتدني نسبة الحبات الفارغة وبحاجته المعتدلة لساعات البرودة مقارنة بكيرمان.'
          : 'Celebrated across European pastry and artisanal gelato houses. Produces elongated nuts with clean cream shells and an intensely aromatic, deep emerald-green kernel. Larnaka exhibits virtually zero empty (blank) nuts and has moderate chilling requirements well below Kerman.',
        characteristics: [
          {
            label: isAr ? 'شكل الثمرة واللب' : 'Nut Shape & Kernel',
            value: isAr ? 'ثمرة طولية، لُب أخضر زمردي داكن غني بالنكهة' : 'Elongated shape, rich dark emerald aromatic kernel'
          },
          {
            label: isAr ? 'نسبة الفراغ (Blanks)' : 'Blank Nut Rate',
            value: isAr ? 'متدنية جداً (أقل من 4%) مع امتلاء كامل للحبة' : 'Exceptionally low (<4%) with complete kernel fill'
          },
          {
            label: isAr ? 'ساعات البرودة الشتوية' : 'Chilling Requirement',
            value: isAr ? '550 – 650 ساعة برودة شتوية' : '550 – 650 cold hours'
          },
          {
            label: isAr ? 'الملقحات المتزامنة' : 'Synchronous Pollinators',
            value: isAr ? 'سي-سبيشال (C-Especial)، إيجينو' : 'C-Especial, Egino'
          }
        ]
      },
      {
        id: 'avdat',
        name: isAr ? 'أفدات' : 'Avdat',
        scientificName: 'Pistacia vera cv. Avdat',
        category: isAr ? 'صنف مؤنث للمناطق الجافة' : 'Female Arid-Zone Cultivar',
        badge: isAr ? 'صنف الأراضي البعلية والقاحلة' : 'Arid & Secano Specialist',
        origin: isAr ? 'صحراء النقب (أفدات)' : 'Israel (Negev Desert Selection)',
        image: 'products-images/varieties/avdat.jpg',
        altText: isAr ? 'عناقيد فستق صنف أفدات في بيئة شبه جافة' : 'Avdat pistachio variety tree clusters',
        flowering: isAr ? 'أوائل أبريل (مبكر إلى متوسط)' : 'Early-Mid Bloom (Early April)',
        chillingHours: isAr ? '500 – 650 ساعة برودة' : '500 – 650 Chill Hours',
        pollinatorsOrFemales: isAr ? 'سي-سبيشال، إيجينو' : 'C-Especial, Egino',
        description: isAr
          ? 'يحمل اسم مدينة أفدات التاريخية في صحراء النقب. صنف يتمتع بصلابة فسيولوجية فائقة وقدرة استثنائية على تحمل الإجهاد المائي، مما يجعله الخيار الأمثل للزراعة البعلية (Secano) والمناطق الجافة. يشبه لارناكا في استطالة الثمرة، لكنه يزهر أبكر قليلاً مع امتلاء ممتاز للحبة.'
          : 'Named after the historic city in the arid Negev. Avdat is an exceptionally drought-resilient cultivar developed for rainfed (secano) farming and dry terroirs. Closely parallels Larnaka in elongated fruit morphology, but flowers slightly earlier and achieves complete kernel fill under limited water.',
        characteristics: [
          {
            label: isAr ? 'التأقلم المائي' : 'Water Adaptation',
            value: isAr ? 'كفاءة استثنائية في الزراعة البعلية وتحمل الجفاف' : 'Unrivaled performance in dryland (secano) and deficit irrigation'
          },
          {
            label: isAr ? 'شكل الثمرة' : 'Nut Geometry',
            value: isAr ? 'ثمرة طولية ذات امتلاء كامل للحبة وقشرة فاتحة' : 'Elongated kernel with solid fill and light shell'
          },
          {
            label: isAr ? 'ساعات البرودة الشتوية' : 'Chilling Requirement',
            value: isAr ? '500 – 650 ساعة برودة شتوية' : '500 – 650 cold hours'
          },
          {
            label: isAr ? 'الملقحات المتزامنة' : 'Synchronous Pollinators',
            value: isAr ? 'سي-سبيشال (C-Especial)' : 'C-Especial'
          }
        ]
      },
      {
        id: 'kastel',
        name: isAr ? 'كاستل' : 'Kastel',
        scientificName: 'Pistacia vera cv. Kastel',
        category: isAr ? 'صنف مؤنث متأخر التزهير' : 'Female Late-Bloom Cultivar',
        badge: isAr ? 'صنف بيضاوي عالي التفتح' : 'High-Dehiscence Oval Selection',
        origin: isAr ? 'حوض المتوسط الشرقي' : 'Eastern Mediterranean Selection',
        image: 'products-images/varieties/kastel.jpg',
        altText: isAr ? 'فستق كاستل بقشرة بيضاء نقية' : 'Kastel pistachio variety white split nuts',
        flowering: isAr ? 'أواخر أبريل (بعد كيرمان بقليل)' : 'Late Bloom (Slightly after Kerman)',
        chillingHours: isAr ? '750 – 900 ساعة برودة' : '750 – 900 Chill Hours',
        pollinatorsOrFemales: isAr ? 'بيتر، إيجينو' : 'Peter, Egino',
        description: isAr
          ? 'يتميز بقشرته البيضاء الناصعة وشكله البيضاوي الأنيق ونسبة تفتحه الطبيعي المرتفعة جداً. موعد تزهيره يتأخر بضعة أيام عن صنف كيرمان، مما يوفر أماناً إضافياً ضد موجات الصقيع الربيعي المباغتة. شجرة ذات نمو خضري متوازن ومحصول تجاري سنوي موثوق.'
          : 'Distinguished by pristine white oval shells and very high natural split ratios. Flowering occurs slightly after Kerman, providing an additional safeguard against late spring cold spells. Kastel produces medium-to-large nuts with reliable annual productivity and balanced framework development.',
        characteristics: [
          {
            label: isAr ? 'مظهر الثمرة' : 'Shell Appearance',
            value: isAr ? 'قشرة بيضاء ناصعة، شكل بيضاوي، نسبة تفتح ممتازة' : 'Pristine white oval shell, high natural dehiscence'
          },
          {
            label: isAr ? 'مقاومة الصقيع' : 'Frost Avoidance',
            value: isAr ? 'تزهير متأخر جداً يتفادى الصقيع الربيعي القاري' : 'Late bloom cycle escapes critical spring cold events'
          },
          {
            label: isAr ? 'ساعات البرودة الشتوية' : 'Chilling Requirement',
            value: isAr ? '750 – 900 ساعة برودة شتوية' : '750 – 900 cold hours'
          },
          {
            label: isAr ? 'الملقحات المتزامنة' : 'Synchronous Pollinators',
            value: isAr ? 'بيتر (Peter)، إيجينو (Egino)' : 'Peter, Egino'
          }
        ]
      },
      {
        id: 'aegina',
        name: isAr ? 'إيجينا' : 'Aegina',
        scientificName: 'Pistacia vera cv. Aegina',
        category: isAr ? 'صنف مؤنث مبكر النضج' : 'Female Early-Season Cultivar',
        badge: isAr ? 'صنف يوناني عريق مبكر النضج' : 'Early-Bearing Greek Heritage',
        origin: isAr ? 'اليونان (جزيرة إيجينا)' : 'Greece (Island of Aegina)',
        image: 'products-images/varieties/aegina.jpg',
        altText: isAr ? 'فستق إيجينا اليوناني على الأغصان' : 'Aegina Greek pistachio variety on branch',
        flowering: isAr ? 'بواكير الربيع (مارس / أوائل أبريل)' : 'Very Early Bloom (Early March)',
        chillingHours: isAr ? '450 – 550 ساعة برودة' : '450 – 550 Chill Hours',
        pollinatorsOrFemales: isAr ? 'سي-سبيشال، ماطور مذكر' : 'C-Especial, Mateur Macho',
        description: isAr
          ? 'ينحدر من الجزيرة اليونانية العريقة المشهورة بزراعة الفستق. يعتبر من أبكر الأصناف تزهيراً ونضجاً على الإطلاق؛ يزهر في بواكير الربيع وتكفيه ساعات برودة شتوية منخفضة، مما يجعله الخيار الأنسب للمناطق الساحلية والوديان الدافئة. ينتج ثماراً طولية بنسبة امتلاء ولُب ممتازة.'
          : 'Hailing from the renowned pistachio island of Aegina, this cultivar represents one of the earliest bearing pistachio trees available. Flowering in early spring, it has low winter chilling requirements, making it ideal for mild coastal Mediterranean valleys. Yields elongated nuts with an exceptional kernel meat ratio.',
        characteristics: [
          {
            label: isAr ? 'موعد التزهير والنضج' : 'Season Window',
            value: isAr ? 'أبكر الأصناف تزهيراً وحصاداً في الموسم' : 'Earliest flowering and harvest window across all varieties'
          },
          {
            label: isAr ? 'ساعات البرودة الشتوية' : 'Chilling Requirement',
            value: isAr ? '450 – 550 ساعة برودة (مناسب للساحل)' : '450 – 550 cold hours (suited for mild winter zones)'
          },
          {
            label: isAr ? 'هيكل الشجرة' : 'Tree Habit',
            value: isAr ? 'شجرة مدمجة النمو وسريعة الدخول في الإنتاج' : 'Compact canopy, rapid entry into commercial production'
          },
          {
            label: isAr ? 'الملقحات المتزامنة' : 'Synchronous Pollinators',
            value: isAr ? 'سي-سبيشال (C-Especial)، ماطور مذكر' : 'C-Especial, Mateur Macho'
          }
        ]
      },
      {
        id: 'mateur-hembra',
        name: isAr ? 'ماطور (أنثى)' : 'Mateur (Female)',
        scientificName: 'Pistacia vera cv. Mateur (Female)',
        category: isAr ? 'صنف مؤنث متوسطي عريق' : 'Female Mediterranean Cultivar',
        badge: isAr ? 'صنف متوسطي عريق مقاوم للحرارة' : 'Low-Chill Heat-Resilient Selection',
        origin: isAr ? 'تونس (حوض ماطور الزراعي)' : 'Tunisia (Mateur Agricultural Basin)',
        image: 'products-images/varieties/mateur.jpg',
        altText: isAr ? 'فستق صنف ماطور التونسي' : 'Mateur female pistachio cultivar',
        flowering: isAr ? 'أوائل أبريل (مبكر إلى متوسط)' : 'Early Bloom (Early April)',
        chillingHours: isAr ? '400 – 500 ساعة برودة' : '400 – 500 Chill Hours',
        pollinatorsOrFemales: isAr ? 'ماطور مذكر، سي-سبيشال' : 'Mateur Macho, C-Especial',
        description: isAr
          ? 'صنف أصيل متأقلم بامتياز في شمال إفريقيا وجنوب حوض المتوسط. ثماره طولية ذات قشرة كريمية ناعمة، يشتهر بحلاوة مذاقه وزيوته الطبيعية المرغوبة في الحلويات الفاخرة. تنخفض فيه نسبة الثمار الفارغة إلى حدها الأدنى ويتحمل صيف المتوسط الجاف والحرارة العالية دون إجهاد.'
          : 'Widely adapted across North Africa and Southern Mediterranean regions. Mateur produces elongated nuts with pale cream shells, celebrated for their sweetness and oil content in pastry applications. Shows negligible blank nut rates and handles hot, dry summers with minimal stress.',
        characteristics: [
          {
            label: isAr ? 'تحمل الحرارة والجفاف' : 'Heat Resilience',
            value: isAr ? 'تحمل استثنائي لحرارة الصيف المرتفعة والشمس الساطعة' : 'Superior endurance against dry Mediterranean summer heat'
          },
          {
            label: isAr ? 'جودة الثمرة' : 'Kernel Quality',
            value: isAr ? 'قشرة كريمية، لُب حلو المذاق غني بالزيوت الطبيعية' : 'Cream shell, sweet aromatic kernel preferred in confectionery'
          },
          {
            label: isAr ? 'ساعات البرودة الشتوية' : 'Chilling Requirement',
            value: isAr ? '400 – 500 ساعة برودة شتوية فقط' : '400 – 500 cold hours'
          },
          {
            label: isAr ? 'الملقحات المتزامنة' : 'Synchronous Pollinators',
            value: isAr ? 'ماطور مذكر (Mateur Macho)، سي-سبيشال' : 'Mateur Macho, C-Especial'
          }
        ]
      }
    ];
  });

  readonly malePollinators = computed<VarietyItem[]>(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    return [
      {
        id: 'peter',
        name: isAr ? 'بيتر (مذكر)' : 'Peter (Male)',
        scientificName: 'Pistacia vera cv. Peter (Staminate)',
        category: isAr ? 'ملقح مذكر معتمد' : 'Male Pollinator Clone',
        badge: isAr ? 'الملقح القياسي الأول عالمياً' : 'Universal Benchmark Pollinator',
        origin: isAr ? 'الولايات المتحدة (كاليفورنيا)' : 'USA Selection (California)',
        image: 'products-images/varieties/peter.jpg',
        altText: isAr ? 'أزهار ملقح بيتر المذكر' : 'Peter male pistachio blossoms and pollen',
        flowering: isAr ? 'أواخر أبريل (تزهير متأخر)' : 'Late Bloom (Late April)',
        chillingHours: isAr ? '800 – 950 ساعة برودة' : '800 – 950 Chill Hours',
        pollinatorsOrFemales: isAr ? 'كيرمان، كاستل' : 'Kerman, Kastel',
        description: isAr
          ? 'الملقح التجاري الأساسي والمعتمد عالمياً لصنف كيرمان والأصناف المتأخرة. يتميز بنموه المتوازن، وغزارة حبوب اللقاح، واستمرار فترة نثر اللقاح لأيام طويلة لضمان تغطية كامل تفتح الأزهار المؤنثة.'
          : 'The premier universal pollinator for Kerman and late-blooming commercial cultivars worldwide. Exhibits moderate vigor, abundant and prolonged pollen dispersion, and rapid initiation of flowering aligned with peak female receptivity.',
        characteristics: [
          {
            label: isAr ? 'فترة التزهير' : 'Bloom Timing',
            value: isAr ? 'متأخر ومتطابق تماماً مع ذروة أزهار كيرمان' : 'Late bloom perfectly synchronized with peak Kerman anthesis'
          },
          {
            label: isAr ? 'كثافة حبوب اللقاح' : 'Pollen Density',
            value: isAr ? 'غزارة فائقة في إنتاج حبوب اللقاح ونثرها بالرياح' : 'Copious staminate floral clusters with high airborne dispersal'
          },
          {
            label: isAr ? 'الأصناف المتوافقة' : 'Partner Females',
            value: isAr ? 'كيرمان (Kerman)، كاستل (Kastel)' : 'Kerman, Kastel'
          }
        ]
      },
      {
        id: 'c-especial',
        name: isAr ? 'سي-سبيشال (مذكر)' : 'C-Especial (Male)',
        scientificName: 'Pistacia vera cv. C-Especial',
        category: isAr ? 'ملقح مذكر معتمد' : 'Male Pollinator Clone',
        badge: isAr ? 'الملقح اليوناني المبكر الأكثر حيوية' : 'Early Mediterranean Pollen Donor',
        origin: isAr ? 'اليونان' : 'Greece Selection',
        image: 'products-images/varieties/c-especial.jpg',
        altText: isAr ? 'أزهار ملقح سي-سبيشال المذكر' : 'C-Especial male pollinator tree flowers',
        flowering: isAr ? 'أوائل أبريل (تزهير مبكر)' : 'Early Bloom (Early April)',
        chillingHours: isAr ? '500 – 650 ساعة برودة' : '500 – 650 Chill Hours',
        pollinatorsOrFemales: isAr ? 'لارناكا، أفدات، إيجينا، سيرورا، ماطور' : 'Larnaka, Avdat, Aegina, Sirora, Mateur',
        description: isAr
          ? 'صنف مذكر قوي النمو ذو فترة تزهير مبكرة ممتدة. يعد الملقح الحيوي الأساسي الذي لا غنى عنه لأصناف لارناكا، أفدات، إيجينا، وسيرورا المبكرة.'
          : 'Highly vigorous staminate cultivar with an extensive, reliable early flowering window. Essential for early and intermediate Mediterranean female varieties including Larnaka, Avdat, Aegina, and early Sirora blooms.',
        characteristics: [
          {
            label: isAr ? 'فترة التزهير' : 'Bloom Timing',
            value: isAr ? 'مبكر مع نافذة زمنية واسعة لنثر اللقاح' : 'Early anthesis with an extended pollen shedding window'
          },
          {
            label: isAr ? 'قوة الشجرة' : 'Vegetative Vigor',
            value: isAr ? 'نمو خضري قوي وتفرع تاجي وافر' : 'Very high vegetative vigor and robust wood structure'
          },
          {
            label: isAr ? 'الأصناف المتوافقة' : 'Partner Females',
            value: isAr ? 'لارناكا، أفدات، إيجينا، ماطور، سيرورا' : 'Larnaka, Avdat, Aegina, Mateur, Sirora'
          }
        ]
      },
      {
        id: 'egino',
        name: isAr ? 'إيجينو (مذكر)' : 'Egino (Male)',
        scientificName: 'Pistacia vera cv. Egino',
        category: isAr ? 'ملقح مذكر معتمد' : 'Male Pollinator Clone',
        badge: isAr ? 'الملقح المتوازن للتغطية الشاملة' : 'Versatile Intermediate Bridge',
        origin: isAr ? 'انتخاب متوسطي' : 'Mediterranean Selection',
        image: 'products-images/varieties/egino.jpg',
        altText: isAr ? 'أزهار ملقح إيجينو المذكر' : 'Egino male pistachio blossoms',
        flowering: isAr ? 'منتصف أبريل (متوسط التوقيت)' : 'Intermediate Bloom (Mid-April)',
        chillingHours: isAr ? '650 – 800 ساعة برودة' : '650 – 800 Chill Hours',
        pollinatorsOrFemales: isAr ? 'سيرورا، لارناكا، بدايات كيرمان' : 'Sirora, Larnaka, Early Kerman',
        description: isAr
          ? 'يتمتع بقوة نمو عالية وحيوية فائقة لحبوب اللقاح ومعدلات إنبات مرتفعة. يعمل كجسر تلقيح محوري يتداخل بتناغم مع الأصناف متوسطة التزهير ومع الطليعة الأولى لأزهار كيرمان.'
          : 'Known for remarkable vegetative vigor and excellent pollen germination viability. Serves as a versatile bridge pollinator overlapping seamlessly with both mid-season cultivars (Sirora) and early Kerman flower clusters.',
        characteristics: [
          {
            label: isAr ? 'فترة التزهير' : 'Bloom Timing',
            value: isAr ? 'متوسط يتوسط التزهير المبكر والمتأخر' : 'Intermediate timing bridging early scions to late bloom'
          },
          {
            label: isAr ? 'حيوية اللقاح' : 'Pollen Viability',
            value: isAr ? 'نسب إنبات وتخصيب مرتفعة جداً تحت الرياح' : 'High in-vitro germination rates and resilient pollen viability'
          },
          {
            label: isAr ? 'الأصناف المتوافقة' : 'Partner Females',
            value: isAr ? 'سيرورا (Sirora)، لارناكا، وبدايات كيرمان' : 'Sirora, Larnaka, and early Kerman flush'
          }
        ]
      },
      {
        id: 'guerrero',
        name: isAr ? 'غيريرو (مذكر)' : 'Guerrero (Male)',
        scientificName: 'Pistacia vera cv. Guerrero',
        category: isAr ? 'ملقح مذكر معتمد' : 'Male Pollinator Clone',
        badge: isAr ? 'استنباط إسباني متأخر للأمان المناخي' : 'Very Late Spanish Research Selection',
        origin: isAr ? 'مركز El Chaparrillo للبحوث (إسبانيا)' : 'Centro Agrario El Chaparrillo (Spain)',
        image: 'products-images/varieties/guerrero.jpg',
        altText: isAr ? 'أزهار ملقح غيريرو الإسباني' : 'Guerrero male pollinator catkins',
        flowering: isAr ? 'أواخر أبريل / مطلع مايو (متأخر جداً)' : 'Very Late Bloom (Late April / May)',
        chillingHours: isAr ? '850 – 1000 ساعة برودة' : '850 – 1,000 Chill Hours',
        pollinatorsOrFemales: isAr ? 'أواخر أزهار كيرمان، كاستل' : 'Late Kerman, Kastel',
        description: isAr
          ? 'تم استنباطه في مركز البحوث الزراعية الإسباني لحماية المحصول في المناطق القارية التي تتعرض لصقيع ربيعي. يزهر في أواخر الموسم، ليكون صمام الأمان لتلقيح أواخر أزهار كيرمان وكاستل.'
          : 'Selected by Spanish agronomic researchers to address continental spring cold snaps. Flowers exceptionally late in the season, acting as a crucial insurance pollinator for the final flowering flushes of Kerman and Kastel.',
        characteristics: [
          {
            label: isAr ? 'فترة التزهير' : 'Bloom Timing',
            value: isAr ? 'متأخر جداً يضمن تلقيح أواخر الأزهار المؤنثة' : 'Very late anthesis extending into early May'
          },
          {
            label: isAr ? 'الأهمية الزراعية' : 'Agronomic Purpose',
            value: isAr ? 'صمام أمان ضد تقلبات الطقس وتفاوت تفتح الأزهار' : 'Strategic insurance pollinator for late spring cold areas'
          },
          {
            label: isAr ? 'الأصناف المتوافقة' : 'Partner Females',
            value: isAr ? 'كيرمان (Kerman)، كاستل (Kastel)' : 'Kerman, Kastel'
          }
        ]
      },
      {
        id: 'chaparrillo',
        name: isAr ? 'تشاباريو (مذكر)' : 'Chaparrillo (Male)',
        scientificName: 'Pistacia vera cv. Chaparrillo',
        category: isAr ? 'ملقح مذكر معتمد' : 'Male Pollinator Clone',
        badge: isAr ? 'ملقح مرحلي دقيق التوقيت' : 'Strategic Transition Synchronizer',
        origin: isAr ? 'مركز El Chaparrillo (إسبانيا)' : 'Centro Agrario El Chaparrillo (Spain)',
        image: 'products-images/varieties/chaparrillo.jpg',
        altText: isAr ? 'أزهار ملقح تشاباريو الإسباني' : 'Chaparrillo male pistachio flowers',
        flowering: isAr ? 'منتصف إلى أواخر أبريل' : 'Mid-to-Late Bloom (Mid-Late April)',
        chillingHours: isAr ? '750 – 900 ساعة برودة' : '750 – 900 Chill Hours',
        pollinatorsOrFemales: isAr ? 'سيرورا، كيرمان' : 'Sirora, Kerman',
        description: isAr
          ? 'يبدأ تزهيره قبل صنف غيريرو بنحو 10 إلى 12 يوماً. يوفر نثراً غزيراً ومتواصلاً لحبوب اللقاح يربط بين الأصناف متوسطة التزهير والذروة الأساسية لصنف كيرمان.'
          : 'Blooms approximately 10 to 12 days before Guerrero. Provides steady, dense pollen discharge that connects the transition between mid-flowering varieties and the main bloom wave of Kerman.',
        characteristics: [
          {
            label: isAr ? 'فترة التزهير' : 'Bloom Timing',
            value: isAr ? 'متوسط-متأخر يسبق غيريرو بنحو 10 أيام' : 'Mid-to-late anthesis ~10 days prior to Guerrero'
          },
          {
            label: isAr ? 'كثافة النورات' : 'Floral Density',
            value: isAr ? 'عناقيد زهرية مذكرّة كثيفة وكفاءة نثر عالية' : 'Compact floral clusters providing dense pollen drift'
          },
          {
            label: isAr ? 'الأصناف المتوافقة' : 'Partner Females',
            value: isAr ? 'سيرورا (Sirora)، كيرمان (Kerman)' : 'Sirora, Kerman'
          }
        ]
      },
      {
        id: 'mateur-macho',
        name: isAr ? 'ماطور (مذكر)' : 'Mateur (Male)',
        scientificName: 'Pistacia vera cv. Mateur (Staminate)',
        category: isAr ? 'ملقح مذكر معتمد' : 'Male Pollinator Clone',
        badge: isAr ? 'الملقح المخصص للأصناف المبكرة' : 'Dedicated Early Cultivar Partner',
        origin: isAr ? 'تونس' : 'Tunisia',
        image: 'products-images/varieties/mateur.jpg',
        altText: isAr ? 'أزهار ملقح ماطور المذكر' : 'Mateur male pollinator tree',
        flowering: isAr ? 'أوائل أبريل (مبكر)' : 'Early Bloom (Early April)',
        chillingHours: isAr ? '400 – 500 ساعة برودة' : '400 – 500 Chill Hours',
        pollinatorsOrFemales: isAr ? 'ماطور المؤنث، إيجينا' : 'Mateur Hembra, Aegina',
        description: isAr
          ? 'سلالة مذكرة مخصصة تتطابق زمنياً بدقة متناهية مع البزوغ الزهري المبكر لصنف ماطور المؤنث. متأقلم تماماً مع البيئات ذات ساعات البرودة المنخفضة والصيف الحار.'
          : 'Dedicated staminate clone carefully synchronized with the early floral emergence of Mateur Hembra. Highly adapted to low-chill, hot summer environments across Mediterranean zones.',
        characteristics: [
          {
            label: isAr ? 'فترة التزهير' : 'Bloom Timing',
            value: isAr ? 'مبكر ومتزامن حصرياً مع إناث ماطور' : 'Early timing synced with staminate emergence of Mateur'
          },
          {
            label: isAr ? 'متطلبات البرودة' : 'Chill Hours',
            value: isAr ? 'منخفضة (400 – 500 ساعة برودة)' : 'Low chill requirement (400 – 500 cold hours)'
          },
          {
            label: isAr ? 'الأصناف المتوافقة' : 'Partner Females',
            value: isAr ? 'ماطور المؤنث (Mateur Hembra)، إيجينا' : 'Mateur Hembra, Aegina'
          }
        ]
      }
    ];
  });

  readonly rootstocks = computed<RootstockItem[]>(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    return [
      {
        id: 'terebinthus',
        name: isAr ? 'كورنيكابرا (البطم التربنتيني)' : 'Pistacia terebinthus (Cornicabra)',
        botanicalName: 'Pistacia terebinthus L.',
        badge: isAr ? 'الأصل الأيبيري الأصيل للمناطق البعلية' : 'Indigenous Iberian Dryland Rootstock',
        image: 'products-images/cornicabra-pot-1-1l.jpg',
        altText: isAr ? 'أصل كورنيكابرا في وعاء زراعي' : 'Pistacia terebinthus Cornicabra plant in pot',
        description: isAr
          ? 'الأصل المتوسطي الطبيعي الأقوى والأعرق في شبه الجزيرة الأيبيرية، منتخب من سلاسل الجبال البايتيكية بإسبانيا. لا يُضاهى في الأراضي البعلية غير المروية (Secano)، والترب الكلسية والحجرية الضحلة، ويمتلك أعلى مقاومة للتجمد والصقيع الشديد مع حث الشجرة على التزهير المبكر.'
          : 'The native Mediterranean rootstock par excellence, sourced from selected Betic mountain cordilleras in Spain. Unrivaled in rainfed dryland (secano), shallow, poor, and highly calcareous/limestone soils, possessing the highest cold and frost tolerance while inducing earlier flowering.',
        soilSuitability: isAr ? 'الترب الكلسية، الحجرية، الفقيرة والضحلة' : 'Calcareous, stony, shallow, and poor limestone soils',
        waterRegime: isAr ? 'الزراعة البعلية بدون ري (Secano) أو ري شحيح' : 'Rainfed dryland (Secano) / Minimal supplemental irrigation',
        coldResistance: isAr ? 'قصوى (أعلى مقاومة للصقيع والتجمد)' : 'Extreme (Highest frost resilience among all rootstocks)',
        keyAdvantage: isAr ? 'مقاومة الجفاف الفائقة وحث الأصناف على التبكير في التزهير' : 'Supreme drought survival & early flowering induction',
        formats: isAr ? 'صواني غابات (45 عيناً • 220 cc) وأواني بلاستيكية (1.1 لتر)' : 'Forestry trays (45 alveoli • 220 cc) & nursery pots (1.1 L)'
      },
      {
        id: 'atlantica',
        name: isAr ? 'البطم الأطلسي (أتلانتيكا)' : 'Pistacia atlantica (Atlantica)',
        botanicalName: 'Pistacia atlantica Desf.',
        badge: isAr ? 'أصل الأراضي الطينية والعميقة' : 'Heavy & Clay-Loam Soil Rootstock',
        image: 'products-images/atlantica-rootstock.jpg',
        altText: isAr ? 'شتلة أصل البطم الأطلسي في المشتل' : 'Pistacia atlantica rootstock seedling in container',
        description: isAr
          ? 'أصل متوارث ينتشر في شمال إفريقيا وجزر الكناري وسهول المتوسط (سلالات بذور منتخبة). يتميز بقوة نمو خضري وتجذير أعمق من الكورنيكابرا، مع قدرة فريدة على التأقلم في الأراضي الطينية الطميية الثقيلة التي تشهد تجمعاً مؤقتاً لمياه الأمطار.'
          : 'Originating across North Africa, the Canaries, and the Mediterranean basin. Demonstrates higher vegetative vigor and deeper taproot penetration than Cornicabra, with a proven ability to tolerate heavy clay-loam terrain subject to temporary water saturation.',
        soilSuitability: isAr ? 'الترب الطينية الطميية العميقة والثقيلة' : 'Deep clay-loam, compact, and heavier alluvial soils',
        waterRegime: isAr ? 'زراعة بعلية إلى ري مقنن' : 'Secano to deficit irrigation programs',
        coldResistance: isAr ? 'متوسطة إلى عالية' : 'Medium-High frost tolerance',
        keyAdvantage: isAr ? 'تحمل التشبع المائي المؤقت وتجذير عميق قوي' : 'Tolerance to temporary soil waterlogging & deep anchorage',
        formats: isAr ? 'أواني زراعية مخصصة وصواني غابات معتمدة' : 'Calibrated container pots & specialized forestry trays'
      },
      {
        id: 'ucb1',
        name: isAr ? 'هجين UCB-1 المعتمد' : 'UCB-1 Hybrid Rootstock',
        botanicalName: 'Pistacia atlantica × Pistacia integerrima',
        badge: isAr ? 'المعيار العالمي للمزارع المكثفة والمروية' : 'Global Benchmark for Modern Irrigated Orchards',
        image: 'service-images/pistachio-nursery.webp',
        altText: isAr ? 'مشتل إكثار أصل UCB1 الهجين' : 'UCB-1 hybrid rootstock controlled nursery propagation',
        description: isAr
          ? 'الأصل الأول عالمياً لبساتين الفستق الاستثمارية الحديثة ذات الكثافات العالية والري بالتنقيط. تم استنباطه في جامعة كاليفورنيا بتهجين دقيق يجمع بين قوة النمو الخضري الاستثنائية، والمجموع الجذري المتشعب، والمقاومة الموثقة لفطر ذبول الفيرتيسيليوم وملوحة المياه.'
          : 'Bred by the University of California through controlled crossing, UCB-1 is the premier rootstock for modern commercial pistachio farming worldwide. It combines maximum vegetative vigor, expansive root architecture, and verified resistance to Verticillium dahliae wilt and soil salinity, engineered specifically for high-yield irrigated orchards.',
        soilSuitability: isAr ? 'الأراضي العميقة، الخصبة، والمزارع المروية المكثفة' : 'Deep, permeable, fertile soils under intensive irrigation',
        waterRegime: isAr ? 'الري المنتظم والمكثف بالتنقيط (Riego)' : 'Irrigated / Intensive commercial fertigation',
        coldResistance: isAr ? 'عالية (ملائم للمناخ المتوسطي القاري)' : 'High (Resilient to continental winter conditions)',
        keyAdvantage: isAr ? 'مقاومة ذبول الفيرتيسيليوم وتحمل الملوحة وقوة النمو الفائقة' : 'Verticillium wilt defense, salinity tolerance, maximum vigor',
        formats: isAr ? 'أواني 1.1 لتر، صواني فورست، وشتلات عارية الجذور في طور السكون' : '1.1L containers, forest alveoli, and dormant bare-root'
      }
    ];
  });

  readonly comparisonRows = computed<ComparisonRow[]>(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    return [
      {
        name: isAr ? 'كيرمان (Kerman)' : 'Kerman',
        sex: 'female',
        type: isAr ? 'أنثى تجارية' : 'Female Nut Producer',
        floweringWindow: isAr ? 'أواخر أبريل (متأخر)' : 'Late (Late April)',
        chillHours: isAr ? '800 – 1000 ساعة' : '800 – 1,000 hrs',
        partners: isAr ? 'بيتر، إيجينو، غيريرو' : 'Peter, Egino, Guerrero',
        keyTrait: isAr ? 'المعيار العالمي، حبة كروية كبيرة وتفادي صقيع الربيع' : 'World standard; large round nut, escapes spring frost'
      },
      {
        name: isAr ? 'سيرورا (Sirora)' : 'Sirora',
        sex: 'female',
        type: isAr ? 'أنثى تجارية' : 'Female Nut Producer',
        floweringWindow: isAr ? 'منتصف أبريل (متوسط)' : 'Intermediate (Mid-April)',
        chillHours: isAr ? '600 – 800 ساعة' : '600 – 800 hrs',
        partners: isAr ? 'سي-سبيشال، بيتر، إيجينو' : 'C-Especial, Peter, Egino',
        keyTrait: isAr ? 'أعلى نسبة تفتح طبيعي، محصول سنوي وفير بلا معاومة' : 'Highest natural split % (>85%), minimal alternate bearing'
      },
      {
        name: isAr ? 'لارناكا (Larnaka)' : 'Larnaka',
        sex: 'female',
        type: isAr ? 'أنثى فاخرة' : 'Female Gourmet Producer',
        floweringWindow: isAr ? 'أوائل أبريل (مبكر-متوسط)' : 'Early-Mid (Early April)',
        chillHours: isAr ? '550 – 650 ساعة' : '550 – 650 hrs',
        partners: isAr ? 'سي-سبيشال، إيجينو' : 'C-Especial, Egino',
        keyTrait: isAr ? 'لُب أخضر زمردي داكن، معيار الحلويات الإيطالية والجيلاتو' : 'Deep emerald kernel, supreme flavor for pastry and gelato'
      },
      {
        name: isAr ? 'أفدات (Avdat)' : 'Avdat',
        sex: 'female',
        type: isAr ? 'أنثى بعلية' : 'Female Dryland Producer',
        floweringWindow: isAr ? 'أوائل أبريل (مبكر-متوسط)' : 'Early-Mid (Early April)',
        chillHours: isAr ? '500 – 650 ساعة' : '500 – 650 hrs',
        partners: isAr ? 'سي-سبيشال' : 'C-Especial',
        keyTrait: isAr ? 'صلابة فائقة وامتلاء ممتاز للحبة في الزراعة البعلية' : 'Exceptional drought tolerance for non-irrigated secano'
      },
      {
        name: isAr ? 'كاستل (Kastel)' : 'Kastel',
        sex: 'female',
        type: isAr ? 'أنثى تجارية' : 'Female Nut Producer',
        floweringWindow: isAr ? 'أواخر أبريل (متأخر)' : 'Late (Late April)',
        chillHours: isAr ? '750 – 900 ساعة' : '750 – 900 hrs',
        partners: isAr ? 'بيتر، إيجينو' : 'Peter, Egino',
        keyTrait: isAr ? 'قشرة بيضاء ناصعة بيضاوية وتفتح طبيعي مرتفع' : 'Clean white oval shell, high dehiscence, late frost escape'
      },
      {
        name: isAr ? 'إيجينا (Aegina)' : 'Aegina',
        sex: 'female',
        type: isAr ? 'أنثى مبكرة' : 'Female Early Producer',
        floweringWindow: isAr ? 'أوائل مارس (مبكر جداً)' : 'Very Early (Early March)',
        chillHours: isAr ? '450 – 550 ساعة' : '450 – 550 hrs',
        partners: isAr ? 'سي-سبيشال، ماطور مذكر' : 'C-Especial, Mateur Macho',
        keyTrait: isAr ? 'أبكر الأصناف نضجاً، مناسب للسهول والساحل المعتدل' : 'Earliest commercial harvest, low winter chill requirement'
      },
      {
        name: isAr ? 'ماطور (Mateur Hembra)' : 'Mateur (Female)',
        sex: 'female',
        type: isAr ? 'أنثى متوسطية' : 'Female Mediterranean',
        floweringWindow: isAr ? 'أوائل أبريل (مبكر)' : 'Early (Early April)',
        chillHours: isAr ? '400 – 500 ساعة' : '400 – 500 hrs',
        partners: isAr ? 'ماطور مذكر، سي-سبيشال' : 'Mateur Macho, C-Especial',
        keyTrait: isAr ? 'تحمل صيف المتوسط الحار، نسبة فراغ شبه معدومة' : 'Heat resilience, low blanks, sweet confectionery flavor'
      },
      {
        name: isAr ? 'بيتر (Peter)' : 'Peter',
        sex: 'male',
        type: isAr ? 'ملقح مذكر' : 'Male Pollinator',
        floweringWindow: isAr ? 'أواخر أبريل (متأخر)' : 'Late (Late April)',
        chillHours: isAr ? '800 – 950 ساعة' : '800 – 950 hrs',
        partners: isAr ? 'كيرمان، كاستل' : 'Kerman, Kastel',
        keyTrait: isAr ? 'الملقح المعتمد عالمياً لكيرمان، غزارة لقاح ونثر ممتد' : 'Universal Kerman partner; copious staminate dispersion'
      },
      {
        name: isAr ? 'سي-سبيشال (C-Especial)' : 'C-Especial',
        sex: 'male',
        type: isAr ? 'ملقح مذكر' : 'Male Pollinator',
        floweringWindow: isAr ? 'أوائل أبريل (مبكر)' : 'Early (Early April)',
        chillHours: isAr ? '500 – 650 ساعة' : '500 – 650 hrs',
        partners: isAr ? 'لارناكا، أفدات، إيجينا، ماطور' : 'Larnaka, Avdat, Aegina, Mateur',
        keyTrait: isAr ? 'ملقح مبكر قوي النمو وضروري للأصناف المتوسطية' : 'Crucial early pollen donor for Mediterranean varieties'
      },
      {
        name: isAr ? 'إيجينو (Egino)' : 'Egino',
        sex: 'male',
        type: isAr ? 'ملقح مذكر' : 'Male Pollinator',
        floweringWindow: isAr ? 'منتصف أبريل (متوسط)' : 'Intermediate (Mid-April)',
        chillHours: isAr ? '650 – 800 ساعة' : '650 – 800 hrs',
        partners: isAr ? 'سيرورا، لارناكا، كيرمان المبكرة' : 'Sirora, Larnaka, Early Kerman',
        keyTrait: isAr ? 'جسر تلقيح محوري بحيوية لقاح ممتازة ونمو قوي' : 'Vital bridge pollinator with high in-vitro germination'
      },
      {
        name: isAr ? 'غيريرو (Guerrero)' : 'Guerrero',
        sex: 'male',
        type: isAr ? 'ملقح مذكر' : 'Male Pollinator',
        floweringWindow: isAr ? 'أواخر أبريل / مطلع مايو' : 'Very Late (Late April/May)',
        chillHours: isAr ? '850 – 1000 ساعة' : '850 – 1,000 hrs',
        partners: isAr ? 'أواخر أزهار كيرمان، كاستل' : 'Late Kerman, Kastel',
        keyTrait: isAr ? 'صمام أمان ضد صقيع الربيع القاري واستنباط إسباني موثوق' : 'Spanish research selection; late spring insurance donor'
      },
      {
        name: isAr ? 'تشاباريو (Chaparrillo)' : 'Chaparrillo',
        sex: 'male',
        type: isAr ? 'ملقح مذكر' : 'Male Pollinator',
        floweringWindow: isAr ? 'منتصف-أواخر أبريل' : 'Mid-Late (Mid-Late April)',
        chillHours: isAr ? '750 – 900 ساعة' : '750 – 900 hrs',
        partners: isAr ? 'سيرورا، كيرمان' : 'Sirora, Kerman',
        keyTrait: isAr ? 'يربط التزهير المتوسط بالمتأخر بنثر لقاح كثيف ومتواصل' : 'Flowering bridge; dense pollen discharge before Guerrero'
      },
      {
        name: isAr ? 'ماطور مذكر (Mateur Macho)' : 'Mateur Macho',
        sex: 'male',
        type: isAr ? 'ملقح مذكر' : 'Male Pollinator',
        floweringWindow: isAr ? 'أوائل أبريل (مبكر)' : 'Early (Early April)',
        chillHours: isAr ? '400 – 500 ساعة' : '400 – 500 hrs',
        partners: isAr ? 'ماطور المؤنث، إيجينا' : 'Mateur Hembra, Aegina',
        keyTrait: isAr ? 'الملقح المخصص لماطور بمتطلبات برودة شتوية منخفضة' : 'Dedicated staminate match for Mateur in low-chill climates'
      }
    ];
  });

  getVarietyWhatsApp(varietyName: string): string {
    const isAr = this.i18n.currentLang() === 'ar';
    const msg = isAr
      ? `مرحباً، أود الاستفسار عن توفر صنف الفستق (${varietyName}) وأسعاره وأشكاله المتاحة للموسم القادم.`
      : `Hello, I would like to inquire about the availability, pricing, and rootstock options for ${varietyName} pistachio variety.`;
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  getRootstockWhatsApp(rootstockName: string): string {
    const isAr = this.i18n.currentLang() === 'ar';
    const msg = isAr
      ? `مرحباً، أود الاستفسار عن توفر أصل (${rootstockName}) وأحجامه وأسعاره للمشروع الزراعي.`
      : `Hello, I would like to inquire about rootstock availability and container formats for ${rootstockName}.`;
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  getGeneralWhatsApp(): string {
    const isAr = this.i18n.currentLang() === 'ar';
    const msg = isAr
      ? 'مرحباً، أود الحصول على استشارة زراعية لاختيار الأصناف والأصول المناسبة لمزرعتي.'
      : 'Hello, I would like an agronomic consultation to select the optimal pistachio varieties and rootstocks for my orchard.';
    return APP_CONFIG.getWhatsAppUrl(msg);
  }

  scrollToSection(id: string): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
