import {
  siApplemusic,
  siAppletv,
  siClaude,
  siCursor,
  siDiscord,
  siDropbox,
  siDuolingo,
  siGithubcopilot,
  siGooglegemini,
  siHbomax,
  siIcloud,
  siMubi,
  siNetflix,
  siNordvpn,
  siNotion,
  siPerplexity,
  siPlaystation,
  siSpotify,
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
  color: string
  /** SVG path (24x24 viewBox) from simple-icons, if the brand is available there. */
  iconPath?: string
  /** Fallback letters when there's no icon. */
  monogram?: string
  plans: Plan[]
}

const TRY = (name: string, price: number, cycle: Cycle = 'monthly'): Plan => ({
  name,
  price,
  currency: 'TRY',
  cycle,
})
const USD = (name: string, price: number, cycle: Cycle = 'monthly'): Plan => ({
  name,
  price,
  currency: 'USD',
  cycle,
})

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  video: { label: 'Dizi & Film', color: '#FF6B4A' },
  music: { label: 'Müzik', color: '#C8F560' },
  ai: { label: 'Yapay Zeka', color: '#B69CFF' },
  gaming: { label: 'Oyun', color: '#5CC8FF' },
  cloud: { label: 'Bulut', color: '#FFD15C' },
  productivity: { label: 'Üretkenlik', color: '#FF8FCF' },
  other: { label: 'Diğer', color: '#9A97A3' },
}

/** Prices are rough Turkish-market estimates; users can edit every price in the form. */
export const CATALOG: Service[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'video',
    color: '#E50914',
    iconPath: siNetflix.path,
    plans: [TRY('Temel', 249.99), TRY('Standart', 379.99), TRY('Özel', 499.99)],
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'video',
    color: '#FF0000',
    iconPath: siYoutube.path,
    plans: [TRY('Bireysel', 109.99), TRY('Aile', 219.99), TRY('Öğrenci', 69.99)],
  },
  {
    id: 'disney',
    name: 'Disney+',
    category: 'video',
    color: '#113CCF',
    monogram: 'D+',
    plans: [TRY('Standart', 349.99), TRY('Standart Yıllık', 3499.9, 'yearly')],
  },
  {
    id: 'prime',
    name: 'Amazon Prime',
    category: 'video',
    color: '#00A8E1',
    monogram: 'P',
    plans: [TRY('Prime', 99.9)],
  },
  {
    id: 'hbomax',
    name: 'HBO Max',
    category: 'video',
    color: '#5822B4',
    iconPath: siHbomax.path,
    plans: [TRY('Temel', 179.9), TRY('Standart', 249.9), TRY('Premium', 329.9)],
  },
  {
    id: 'exxen',
    name: 'Exxen',
    category: 'video',
    color: '#F2B705',
    monogram: 'EX',
    plans: [TRY('Exxen', 249), TRY('ExxenSpor', 549)],
  },
  {
    id: 'gain',
    name: 'Gain',
    category: 'video',
    color: '#7B2FF7',
    monogram: 'G',
    plans: [TRY('Aylık', 149), TRY('Yıllık', 1490, 'yearly')],
  },
  {
    id: 'appletv',
    name: 'Apple TV+',
    category: 'video',
    color: '#2A2A31',
    iconPath: siAppletv.path,
    plans: [TRY('Aylık', 159.99)],
  },
  {
    id: 'mubi',
    name: 'MUBI',
    category: 'video',
    color: '#1F1F7A',
    iconPath: siMubi.path,
    plans: [TRY('Aylık', 129), TRY('Yıllık', 1099, 'yearly')],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'music',
    color: '#1DB954',
    iconPath: siSpotify.path,
    plans: [TRY('Bireysel', 129), TRY('Öğrenci', 69), TRY('Duo', 179), TRY('Aile', 219)],
  },
  {
    id: 'applemusic',
    name: 'Apple Music',
    category: 'music',
    color: '#FA243C',
    iconPath: siApplemusic.path,
    plans: [TRY('Bireysel', 59.99), TRY('Öğrenci', 34.99), TRY('Aile', 89.99)],
  },
  {
    id: 'ytmusic',
    name: 'YouTube Music',
    category: 'music',
    color: '#E62117',
    iconPath: siYoutubemusic.path,
    plans: [TRY('Bireysel', 89.99), TRY('Aile', 179.99)],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'ai',
    color: '#10A37F',
    monogram: 'AI',
    plans: [USD('Plus', 20), USD('Pro', 200)],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'ai',
    color: '#D97757',
    iconPath: siClaude.path,
    plans: [USD('Pro', 20), USD('Max 5x', 100), USD('Max 20x', 200)],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'ai',
    color: '#4F6BED',
    iconPath: siGooglegemini.path,
    plans: [USD('AI Pro', 19.99), USD('AI Ultra', 249.99)],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    category: 'ai',
    color: '#1A8A99',
    iconPath: siPerplexity.path,
    plans: [USD('Pro', 20), USD('Pro Yıllık', 200, 'yearly')],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'ai',
    color: '#2A2A31',
    iconPath: siCursor.path,
    plans: [USD('Pro', 20), USD('Ultra', 200)],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: 'ai',
    color: '#6E40C9',
    iconPath: siGithubcopilot.path,
    plans: [USD('Pro', 10), USD('Pro+', 39)],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'ai',
    color: '#2A2A31',
    monogram: 'MJ',
    plans: [USD('Basic', 10), USD('Standard', 30), USD('Pro', 60)],
  },
  {
    id: 'gamepass',
    name: 'Xbox Game Pass',
    category: 'gaming',
    color: '#107C10',
    monogram: 'X',
    plans: [TRY('Essential', 299), TRY('Premium', 449), TRY('Ultimate', 849)],
  },
  {
    id: 'psplus',
    name: 'PlayStation Plus',
    category: 'gaming',
    color: '#0070D1',
    iconPath: siPlaystation.path,
    plans: [TRY('Essential', 249), TRY('Extra', 389), TRY('Deluxe', 449)],
  },
  {
    id: 'discord',
    name: 'Discord Nitro',
    category: 'gaming',
    color: '#5865F2',
    iconPath: siDiscord.path,
    plans: [USD('Nitro Basic', 2.99), USD('Nitro', 9.99)],
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    category: 'cloud',
    color: '#3693F3',
    iconPath: siIcloud.path,
    plans: [TRY('50 GB', 19.99), TRY('200 GB', 59.99), TRY('2 TB', 199.99)],
  },
  {
    id: 'googleone',
    name: 'Google One',
    category: 'cloud',
    color: '#1A73E8',
    monogram: 'G1',
    plans: [TRY('100 GB', 49.99), TRY('2 TB', 249.99)],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'cloud',
    color: '#0061FF',
    iconPath: siDropbox.path,
    plans: [USD('Plus', 11.99), USD('Essentials', 19.99)],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    color: '#2A2A31',
    iconPath: siNotion.path,
    plans: [USD('Plus', 10), USD('Business', 20)],
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    category: 'productivity',
    color: '#DA1F26',
    monogram: 'Ad',
    plans: [TRY('Fotoğrafçılık', 349.99), TRY('Tek Uygulama', 699.99), TRY('Tüm Uygulamalar', 1499.99)],
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    category: 'productivity',
    color: '#00B5BF',
    monogram: 'C',
    plans: [TRY('Aylık', 179.99), TRY('Yıllık', 1499.99, 'yearly')],
  },
  {
    id: 'duolingo',
    name: 'Duolingo Super',
    category: 'productivity',
    color: '#58CC02',
    iconPath: siDuolingo.path,
    plans: [TRY('Yıllık', 1999.99, 'yearly'), TRY('Aile Yıllık', 2999.99, 'yearly')],
  },
  {
    id: 'nordvpn',
    name: 'NordVPN',
    category: 'other',
    color: '#4687FF',
    iconPath: siNordvpn.path,
    plans: [USD('Basic Yıllık', 59.88, 'yearly'), USD('Aylık', 12.99)],
  },
]

export const SERVICE_BY_ID = new Map(CATALOG.map((s) => [s.id, s]))

export const CUSTOM_COLORS = ['#C8F560', '#FF6B4A', '#B69CFF', '#5CC8FF', '#FFD15C', '#FF8FCF', '#9A97A3']

export const EQUIVALENT_ITEMS = [
  { id: 'cay', label: 'bardak çay', emoji: '🍵', priceTRY: 30 },
  { id: 'simit', label: 'simit', emoji: '🥯', priceTRY: 25 },
  { id: 'lahmacun', label: 'lahmacun', emoji: '🫓', priceTRY: 180 },
  { id: 'kahve', label: 'latte', emoji: '☕', priceTRY: 160 },
  { id: 'sinema', label: 'sinema bileti', emoji: '🎬', priceTRY: 350 },
  { id: 'ucak', label: 'yurt içi uçuş', emoji: '✈️', priceTRY: 2500 },
]
