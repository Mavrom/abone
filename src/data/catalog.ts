import {
  siApplearcade,
  siApplemusic,
  siAppletv,
  siClaude,
  siCrunchyroll,
  siCursor,
  siDeezer,
  siDiscord,
  siDropbox,
  siDuolingo,
  siEa,
  siGithubcopilot,
  siGooglegemini,
  siHbomax,
  siHeadspace,
  siIcloud,
  siMedium,
  siMubi,
  siNetflix,
  siNordvpn,
  siNotion,
  siPerplexity,
  siPlaystation,
  siProton,
  siSpotify,
  siStrava,
  siTidal,
  siUbisoft,
  siVodafone,
  siYoutube,
  siYoutubemusic,
} from 'simple-icons'
import type { Category, Currency, Cycle } from '../lib/types'

export interface Plan {
  name: string
  price: number
  currency: Currency
  cycle: Cycle
}

export interface Service {
  id: string
  name: string
  category: Category
  /** SVG path (24x24 viewBox) from simple-icons, if the brand is available there. */
  iconPath?: string
  /** Fallback letters when there's no icon. */
  monogram?: string
  /** Extra search terms, e.g. parent brand or old names. */
  aliases?: string[]
  plans: Plan[]
}

const TRY = (name: string, price: number, cycle: Cycle = 'monthly'): Plan => ({ name, price, currency: 'TRY', cycle })
const USD = (name: string, price: number, cycle: Cycle = 'monthly'): Plan => ({ name, price, currency: 'USD', cycle })

/** Display order of categories, also used to group the service picker. */
export const CATEGORY_META: Record<Category, { label: string }> = {
  video: { label: 'Dizi & Film' },
  tv: { label: 'TV & Spor' },
  music: { label: 'Müzik' },
  internet: { label: 'Ev İnterneti' },
  mobile: { label: 'Mobil Hat' },
  shopping: { label: 'Alışveriş & Yemek' },
  ai: { label: 'Yapay Zeka' },
  gaming: { label: 'Oyun' },
  cloud: { label: 'Bulut' },
  productivity: { label: 'Üretkenlik' },
  reading: { label: 'Kitap & Haber' },
  fitness: { label: 'Spor & Sağlık' },
  other: { label: 'Diğer' },
}

/** Categories where a contract (taahhüt) is common enough to show that field by default. */
export const COMMITMENT_CATEGORIES: Category[] = ['internet', 'mobile', 'tv']

/**
 * Prices are rough Turkish-market estimates (October 2026) and change often;
 * users can edit every price in the form.
 */
export const CATALOG: Service[] = [
  // ── Dizi & Film
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'video',
    iconPath: siNetflix.path,
    plans: [TRY('Temel', 259.99), TRY('Standart', 389.99), TRY('Özel', 499.99)],
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'video',
    iconPath: siYoutube.path,
    plans: [TRY('Bireysel', 109.99), TRY('Aile', 219.99), TRY('Öğrenci', 69.99)],
  },
  {
    id: 'disney',
    name: 'Disney+',
    category: 'video',
    monogram: 'D+',
    aliases: ['disney plus'],
    plans: [TRY('Aylık', 249.99), TRY('Yıllık', 2499.99, 'yearly')],
  },
  {
    id: 'hbomax',
    name: 'HBO Max',
    category: 'video',
    iconPath: siHbomax.path,
    aliases: ['blutv', 'max'],
    plans: [TRY('Temel', 179.9), TRY('Standart', 249.9), TRY('Premium', 329.9)],
  },
  {
    id: 'exxen',
    name: 'Exxen',
    category: 'video',
    monogram: 'EX',
    aliases: ['exxenspor'],
    plans: [TRY('Exxen', 249), TRY('ExxenSpor', 549)],
  },
  {
    id: 'gain',
    name: 'Gain',
    category: 'video',
    monogram: 'G',
    plans: [TRY('Aylık', 149), TRY('Yıllık', 1490, 'yearly')],
  },
  {
    id: 'appletv',
    name: 'Apple TV+',
    category: 'video',
    iconPath: siAppletv.path,
    plans: [TRY('Aylık', 159.99)],
  },
  {
    id: 'mubi',
    name: 'MUBI',
    category: 'video',
    iconPath: siMubi.path,
    plans: [TRY('Aylık', 129), TRY('Yıllık', 1099, 'yearly')],
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    category: 'video',
    iconPath: siCrunchyroll.path,
    aliases: ['anime'],
    plans: [TRY('Fan', 89.99), TRY('Mega Fan', 119.99)],
  },

  // ── TV & Spor
  {
    id: 'tod',
    name: 'TOD',
    category: 'tv',
    monogram: 'TOD',
    aliases: ['bein', 'bein connect', 'süper lig', 'futbol'],
    plans: [TRY('Eğlence', 129), TRY('Spor Extra', 499), TRY('Süper Lig', 999)],
  },
  {
    id: 'digiturk',
    name: 'Digiturk',
    category: 'tv',
    monogram: 'DT',
    aliases: ['uydu', 'bein', 'süper lig'],
    plans: [TRY('Eğlence', 449), TRY('Süper Lig', 1299)],
  },
  {
    id: 'tabii',
    name: 'tabii',
    category: 'tv',
    monogram: 'tb',
    aliases: ['trt', 'şampiyonlar ligi'],
    plans: [TRY('Premium', 99)],
  },
  {
    id: 'tivibu',
    name: 'Tivibu',
    category: 'tv',
    monogram: 'Tv',
    aliases: ['türk telekom tv', 'tt'],
    plans: [TRY('Tivibu GO', 149), TRY('Eğlence', 299), TRY('Süper Lig', 899)],
  },
  {
    id: 'tvplus',
    name: 'TV+',
    category: 'tv',
    monogram: 'TV+',
    aliases: ['turkcell tv', 'turkcell'],
    plans: [TRY('Aylık', 169.99), TRY('Spor', 649)],
  },
  {
    id: 'dsmart',
    name: 'D-Smart',
    category: 'tv',
    monogram: 'DS',
    aliases: ['dsmart go'],
    plans: [TRY('D-Smart GO', 199), TRY('Spor', 749)],
  },

  // ── Müzik
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'music',
    iconPath: siSpotify.path,
    plans: [TRY('Bireysel', 129), TRY('Öğrenci', 69), TRY('Duo', 179), TRY('Aile', 219)],
  },
  {
    id: 'applemusic',
    name: 'Apple Music',
    category: 'music',
    iconPath: siApplemusic.path,
    plans: [TRY('Bireysel', 59.99), TRY('Öğrenci', 34.99), TRY('Aile', 89.99)],
  },
  {
    id: 'ytmusic',
    name: 'YouTube Music',
    category: 'music',
    iconPath: siYoutubemusic.path,
    plans: [TRY('Bireysel', 89.99), TRY('Aile', 179.99)],
  },
  {
    id: 'fizy',
    name: 'fizy',
    category: 'music',
    monogram: 'fz',
    aliases: ['turkcell'],
    plans: [TRY('Premium', 69.99)],
  },
  {
    id: 'deezer',
    name: 'Deezer',
    category: 'music',
    iconPath: siDeezer.path,
    plans: [TRY('Premium', 79.99), TRY('Aile', 129.99)],
  },
  {
    id: 'tidal',
    name: 'TIDAL',
    category: 'music',
    iconPath: siTidal.path,
    plans: [USD('Individual', 10.99), USD('Family', 16.99)],
  },

  // ── Ev İnterneti
  {
    id: 'tt-internet',
    name: 'Türk Telekom İnternet',
    category: 'internet',
    monogram: 'TT',
    aliases: ['ttnet', 'tt', 'fiber', 'adsl', 'vdsl'],
    plans: [TRY('50 Mbps', 1199), TRY('100 Mbps', 1449), TRY('200 Mbps', 1649), TRY('1000 Mbps', 2299)],
  },
  {
    id: 'superonline',
    name: 'Turkcell Superonline',
    category: 'internet',
    monogram: 'SOL',
    aliases: ['turkcell', 'fiber'],
    plans: [TRY('100 Mbps', 950), TRY('200 Mbps', 1150), TRY('1000 Mbps', 1650)],
  },
  {
    id: 'vodafone-net',
    name: 'Vodafone Ev İnterneti',
    category: 'internet',
    iconPath: siVodafone.path,
    aliases: ['vodafone net', 'fiber'],
    plans: [TRY('100 Mbps', 899), TRY('200 Mbps', 1049), TRY('1000 Mbps', 1599)],
  },
  {
    id: 'turknet',
    name: 'TurkNet',
    category: 'internet',
    monogram: 'TN',
    aliases: ['gigafiber', 'fiber', 'taahhütsüz'],
    plans: [TRY('VDSL', 799.9), TRY('GigaFiber', 949.9)],
  },
  {
    id: 'kablonet',
    name: 'Türksat Kablonet',
    category: 'internet',
    monogram: 'KN',
    aliases: ['kablo', 'türksat'],
    plans: [TRY('100 Mbps', 949), TRY('200 Mbps', 1099), TRY('1000 Mbps', 1499)],
  },
  {
    id: 'millenicom',
    name: 'Millenicom',
    category: 'internet',
    monogram: 'MC',
    plans: [TRY('100 Mbps', 849), TRY('1000 Mbps', 1199)],
  },
  {
    id: 'netspeed',
    name: 'Netspeed',
    category: 'internet',
    monogram: 'NS',
    plans: [TRY('100 Mbps', 899.9)],
  },

  // ── Mobil Hat
  {
    id: 'turkcell',
    name: 'Turkcell',
    category: 'mobile',
    monogram: 'TC',
    aliases: ['faturalı', 'hat', 'gsm'],
    plans: [TRY('10 GB', 749), TRY('20 GB', 999), TRY('40 GB', 1299)],
  },
  {
    id: 'vodafone',
    name: 'Vodafone',
    category: 'mobile',
    iconPath: siVodafone.path,
    aliases: ['faturalı', 'hat', 'gsm'],
    plans: [TRY('10 GB', 399), TRY('20 GB', 465), TRY('40 GB', 649)],
  },
  {
    id: 'tt-mobil',
    name: 'Türk Telekom Mobil',
    category: 'mobile',
    monogram: 'TT',
    aliases: ['tt', 'avea', 'faturalı', 'hat', 'gsm'],
    plans: [TRY('10 GB', 399), TRY('20 GB', 465), TRY('40 GB', 649)],
  },
  {
    id: 'pttcell',
    name: 'Pttcell',
    category: 'mobile',
    monogram: 'PC',
    aliases: ['ptt', 'hat'],
    plans: [TRY('10 GB', 249), TRY('20 GB', 329)],
  },

  // ── Alışveriş & Yemek
  {
    id: 'trendyol',
    name: 'Trendyol Plus',
    category: 'shopping',
    monogram: 'ty',
    aliases: ['trendyol', 'trendyol go', 'kargo'],
    plans: [TRY('Aylık', 75)],
  },
  {
    id: 'hepsiburada',
    name: 'Hepsiburada Premium',
    category: 'shopping',
    monogram: 'hb',
    aliases: ['hepsiburada', 'kargo'],
    plans: [TRY('Aylık', 69.9), TRY('Yıllık', 539, 'yearly')],
  },
  {
    id: 'prime',
    name: 'Amazon Prime',
    category: 'shopping',
    monogram: 'a',
    aliases: ['amazon', 'prime video'],
    plans: [TRY('Aylık', 69.9)],
  },
  {
    id: 'yemeksepeti',
    name: 'Yemeksepeti Ypro',
    category: 'shopping',
    monogram: 'ys',
    aliases: ['yemeksepeti', 'yemek'],
    plans: [TRY('Aylık', 149.99)],
  },

  // ── Yapay Zeka
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'ai',
    monogram: 'AI',
    aliases: ['openai', 'gpt'],
    plans: [USD('Plus', 20), USD('Pro', 200)],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'ai',
    iconPath: siClaude.path,
    aliases: ['anthropic'],
    plans: [USD('Pro', 20), USD('Max 5x', 100), USD('Max 20x', 200)],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'ai',
    iconPath: siGooglegemini.path,
    aliases: ['google ai'],
    plans: [USD('AI Pro', 19.99), USD('AI Ultra', 249.99)],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    category: 'ai',
    iconPath: siPerplexity.path,
    plans: [USD('Pro', 20), USD('Pro Yıllık', 200, 'yearly')],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'ai',
    iconPath: siCursor.path,
    plans: [USD('Pro', 20), USD('Ultra', 200)],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: 'ai',
    iconPath: siGithubcopilot.path,
    plans: [USD('Pro', 10), USD('Pro+', 39)],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'ai',
    monogram: 'MJ',
    plans: [USD('Basic', 10), USD('Standard', 30), USD('Pro', 60)],
  },

  // ── Oyun
  {
    id: 'gamepass',
    name: 'Xbox Game Pass',
    category: 'gaming',
    monogram: 'X',
    aliases: ['xbox', 'microsoft'],
    plans: [TRY('Essential', 299), TRY('Premium', 449), TRY('Ultimate', 849)],
  },
  {
    id: 'psplus',
    name: 'PlayStation Plus',
    category: 'gaming',
    iconPath: siPlaystation.path,
    aliases: ['ps plus', 'sony'],
    plans: [TRY('Essential', 249), TRY('Extra', 389), TRY('Deluxe', 449)],
  },
  {
    id: 'eaplay',
    name: 'EA Play',
    category: 'gaming',
    iconPath: siEa.path,
    plans: [TRY('Aylık', 119), TRY('Yıllık', 799, 'yearly')],
  },
  {
    id: 'ubisoft',
    name: 'Ubisoft+',
    category: 'gaming',
    iconPath: siUbisoft.path,
    plans: [USD('Classics', 7.99), USD('Premium', 17.99)],
  },
  {
    id: 'applearcade',
    name: 'Apple Arcade',
    category: 'gaming',
    iconPath: siApplearcade.path,
    plans: [TRY('Aylık', 59.99)],
  },
  {
    id: 'discord',
    name: 'Discord Nitro',
    category: 'gaming',
    iconPath: siDiscord.path,
    plans: [USD('Nitro Basic', 2.99), USD('Nitro', 9.99)],
  },

  // ── Bulut
  {
    id: 'icloud',
    name: 'iCloud+',
    category: 'cloud',
    iconPath: siIcloud.path,
    aliases: ['apple'],
    plans: [TRY('50 GB', 19.99), TRY('200 GB', 59.99), TRY('2 TB', 199.99)],
  },
  {
    id: 'googleone',
    name: 'Google One',
    category: 'cloud',
    monogram: 'G1',
    aliases: ['google drive'],
    plans: [TRY('100 GB', 49.99), TRY('2 TB', 249.99)],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'cloud',
    iconPath: siDropbox.path,
    plans: [USD('Plus', 11.99), USD('Essentials', 19.99)],
  },

  // ── Üretkenlik
  {
    id: 'microsoft365',
    name: 'Microsoft 365',
    category: 'productivity',
    monogram: 'M',
    aliases: ['office', 'word', 'excel', 'onedrive'],
    plans: [
      TRY('Bireysel', 329.99),
      TRY('Bireysel Yıllık', 3299.99, 'yearly'),
      TRY('Aile Yıllık', 4299.99, 'yearly'),
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    iconPath: siNotion.path,
    plans: [USD('Plus', 10), USD('Business', 20)],
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    category: 'productivity',
    monogram: 'Ad',
    aliases: ['photoshop', 'lightroom'],
    plans: [TRY('Fotoğrafçılık', 349.99), TRY('Tek Uygulama', 699.99), TRY('Tüm Uygulamalar', 1499.99)],
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    category: 'productivity',
    monogram: 'C',
    plans: [TRY('Aylık', 179.99), TRY('Yıllık', 1499.99, 'yearly')],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Premium',
    category: 'productivity',
    monogram: 'in',
    plans: [USD('Career', 39.99), USD('Business', 69.99)],
  },
  {
    id: 'duolingo',
    name: 'Duolingo Super',
    category: 'productivity',
    iconPath: siDuolingo.path,
    aliases: ['ingilizce', 'dil'],
    plans: [TRY('Yıllık', 1999.99, 'yearly'), TRY('Aile Yıllık', 2999.99, 'yearly')],
  },

  // ── Kitap & Haber
  {
    id: 'storytel',
    name: 'Storytel',
    category: 'reading',
    monogram: 'St',
    aliases: ['sesli kitap'],
    plans: [TRY('Aylık', 149.9)],
  },
  {
    id: 'dergilik',
    name: 'Dergilik',
    category: 'reading',
    monogram: 'dg',
    aliases: ['dergi', 'gazete', 'turkcell'],
    plans: [TRY('Aylık', 49.99)],
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'reading',
    iconPath: siMedium.path,
    plans: [USD('Aylık', 5), USD('Yıllık', 50, 'yearly')],
  },

  // ── Spor & Sağlık
  {
    id: 'macfit',
    name: 'MACFit',
    category: 'fitness',
    monogram: 'MF',
    aliases: ['spor salonu', 'gym'],
    plans: [TRY('Aylık', 2499)],
  },
  {
    id: 'strava',
    name: 'Strava',
    category: 'fitness',
    iconPath: siStrava.path,
    aliases: ['koşu', 'bisiklet'],
    plans: [USD('Aylık', 11.99), USD('Yıllık', 79.99, 'yearly')],
  },
  {
    id: 'headspace',
    name: 'Headspace',
    category: 'fitness',
    iconPath: siHeadspace.path,
    aliases: ['meditasyon'],
    plans: [USD('Aylık', 12.99), USD('Yıllık', 69.99, 'yearly')],
  },

  // ── Diğer
  {
    id: 'nordvpn',
    name: 'NordVPN',
    category: 'other',
    iconPath: siNordvpn.path,
    aliases: ['vpn'],
    plans: [USD('Basic Yıllık', 59.88, 'yearly'), USD('Aylık', 12.99)],
  },
  {
    id: 'proton',
    name: 'Proton',
    category: 'other',
    iconPath: siProton.path,
    aliases: ['vpn', 'mail'],
    plans: [USD('Mail Plus', 4.99), USD('Unlimited', 12.99)],
  },
]

export const SERVICE_BY_ID = new Map(CATALOG.map((s) => [s.id, s]))

const normalize = (text: string) => text.toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim()

/** Matches the query against the service name and its aliases (case- and İ/ı-aware). */
export function matchesService(service: Service, query: string): boolean {
  const q = normalize(query)
  if (!q) return true
  return [service.name, ...(service.aliases ?? [])].some((term) => normalize(term).includes(q))
}

export const EQUIVALENT_ITEMS = [
  { id: 'cay', label: 'bardak çay', emoji: '🍵', priceTRY: 30 },
  { id: 'simit', label: 'simit', emoji: '🥯', priceTRY: 25 },
  { id: 'lahmacun', label: 'lahmacun', emoji: '🫓', priceTRY: 180 },
  { id: 'kahve', label: 'latte', emoji: '☕', priceTRY: 160 },
  { id: 'sinema', label: 'sinema bileti', emoji: '🎬', priceTRY: 350 },
  { id: 'ucak', label: 'yurt içi uçuş', emoji: '✈️', priceTRY: 2500 },
]
