import { serviceCategories } from '@/lib/services-data';

const validCategoryIds = new Set(serviceCategories.map((cat) => cat.id));

const slugToCategoryMap: Record<string, string> = {
  orientation: 'university',
  rag: 'university',
  vocationalTraining: 'vocational',
  realEstatePromotion: 'enpi',
  taxServices: 'tax',
  publicProcurement: 'publicContracts',
  property: 'realEstate',
  arpce: 'arpce',
  investment: 'investment',
  agricultureWater: 'agriculture',
  eVisa: 'foreignAffairs',
  insurance: 'insurance',
  // المقالات التريند والسيئو لعام 2026
  mdn: 'police',
  tawdhif: 'education',
  aadl3: 'aadl',
  chifa: 'socialSecurity',
  startups: 'commerce',
  'anem-minha-2026': 'employment',
  'cnas-chifa-2026': 'socialSecurity',
  'takwin-mihnati-2026': 'vocational',
  'tahwilat-jamiya-progres-2026': 'university',
  'aadl3-2026': 'aadl',
  'epaiement-cib-edahabia-guide': 'bills',
};

export function getCategoryIdForSlug(slug: string): string {
  if (slugToCategoryMap[slug]) {
    return slugToCategoryMap[slug];
  }
  if (validCategoryIds.has(slug)) {
    return slug;
  }

  // Keyword matching for dynamic AI generated articles
  const lower = slug.toLowerCase();
  if (lower.includes('anem') || lower.includes('minha') || lower.includes('employment') || lower.includes('wasit') || lower.includes('job')) return 'employment';
  if (lower.includes('cnas') || lower.includes('chifa') || lower.includes('elhanaa') || lower.includes('casnos') || lower.includes('social')) return 'socialSecurity';
  if (lower.includes('takwin') || lower.includes('mihnati') || lower.includes('vocational')) return 'vocational';
  if (lower.includes('bac') || lower.includes('education') || lower.includes('tawdhif') || lower.includes('school')) return 'education';
  if (lower.includes('aadl') || lower.includes('lpp') || lower.includes('enpi') || lower.includes('housing') || lower.includes('building')) return 'aadl';
  if (lower.includes('cib') || lower.includes('edahabia') || lower.includes('bill') || lower.includes('epaiement') || lower.includes('sonelgaz')) return 'bills';
  if (lower.includes('mesrs') || lower.includes('rag') || lower.includes('university') || lower.includes('progres')) return 'university';
  if (lower.includes('post') || lower.includes('ccp') || lower.includes('barid')) return 'post';
  if (lower.includes('tax')) return 'tax';
  if (lower.includes('justice')) return 'justice';
  if (lower.includes('police') || lower.includes('mdn') || lower.includes('security')) return 'police';
  if (lower.includes('commerce') || lower.includes('startup')) return 'commerce';
  if (lower.includes('health')) return 'health';
  if (lower.includes('transport') || lower.includes('travel')) return 'transport';
  if (lower.includes('vehicle') || lower.includes('car')) return 'vehicles';

  return 'dzds';
}

export interface DetailedService {
  id: string;
  name: { ar: string; en: string };
  url: string;
  phone?: string;
  isApp?: boolean;
  status?: "active" | "slow" | "down";
  customStatusNote?: string;
  isTrending?: boolean;
  icon?: string;
  category: {
    id: string;
    nameKey: string;
    icon: string;
    color: string;
    descriptionAr?: string;
  };
  subCategoryName?: string;
}

export function slugifyService(nameAr: string, url: string): string {
  let domain = "";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "").split(".")[0];
  } catch {
    domain = "";
  }
  // Convert Arabic letters to clean slug or fallback to domain
  const cleanAr = nameAr
    .replace(/[^\u0621-\u064A0-9a-zA-Z]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (domain && domain.length > 2) {
    return `${cleanAr}-${domain}`.toLowerCase();
  }
  return cleanAr.toLowerCase() || `service-${Math.abs(url.length * 31)}`;
}

let cachedServices: DetailedService[] | null = null;
let cachedServicesMap: Map<string, DetailedService> | null = null;

export function getAllDetailedServices(): DetailedService[] {
  if (cachedServices) return cachedServices;

  const result: DetailedService[] = [];
  const map = new Map<string, DetailedService>();
  const idCounts = new Map<string, number>();

  serviceCategories.forEach((cat) => {
    const processService = (s: any, subName?: string) => {
      let baseId = slugifyService(s.name.ar, s.url);
      
      // Ensure absolute uniqueness
      let uniqueId = baseId;
      const count = idCounts.get(baseId) || 0;
      if (count > 0) {
        uniqueId = `${baseId}-${count + 1}`;
      }
      idCounts.set(baseId, count + 1);

      const detailed: DetailedService = {
        ...s,
        id: uniqueId,
        category: {
          id: cat.id,
          nameKey: cat.nameKey,
          icon: cat.icon,
          color: cat.color,
          descriptionAr: cat.descriptionAr,
        },
        subCategoryName: subName,
      };

      result.push(detailed);
      map.set(uniqueId, detailed);
    };

    (cat.services || []).forEach((s) => processService(s));
    (cat.subCategories || []).forEach((sub) => {
      (sub.services || []).forEach((s) => processService(s, sub.nameKey));
    });
  });

  cachedServices = result;
  cachedServicesMap = map;
  return result;
}

export function getDetailedServiceById(id: string): DetailedService | undefined {
  if (!cachedServicesMap) {
    getAllDetailedServices();
  }
  return cachedServicesMap?.get(id);
}


