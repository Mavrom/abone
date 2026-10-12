# Abonelik Hesaplayıcı — Design

## Amaç
İnsanların aboneliklerini (servis + plan) ekleyip aylık / yıllık / günlük toplam maliyetini gördüğü,
sıradan görünmeyen, premium hissettiren tek sayfalık bir web uygulaması. Public GitHub repo, Vercel deploy.

## Kararlar
- **Stack:** Vite + React 19 + TypeScript, düz CSS (design token'ları `:root` üzerinde). Backend yok.
- **Kalıcılık:** `localStorage` (`subs.v1` anahtarı). Hesap / giriş yok.
- **Para birimi:** Her abonelik kendi para biriminde (TRY / USD / EUR). Gösterim para birimi seçilebilir.
  Kurlar `api.frankfurter.dev` üzerinden çekilir, 12 saat cache'lenir, hata olursa sabit fallback kullanılır.
- **Periyotlar:** haftalık, aylık, 3 aylık, yıllık. Hepsi aylık karşılığa normalize edilir
  (haftalık × 52/12, 3 aylık ÷ 3, yıllık ÷ 12).
- **Sonraki ödeme:** Abonelik bir "ödeme tarihi" (ISO) tutar; sonraki ödeme, bu tarih periyot kadar
  ileri sarılarak bugüne ≥ ilk tarih olarak bulunur (ay sonu gününe clamp).
- **Katalog:** TR'de popüler servisler + planları + tahmini fiyatları. Fiyat form'da düzenlenebilir.
  Katalog dışı "özel abonelik" eklenebilir. Logolar `simple-icons`, olmayanlar için monogram.
- **Dil:** Arayüz Türkçe, sayı formatı `tr-TR`.

## Görsel konsept — "Orbit"
- Koyu mürekkep zemin (#0C0B10) + film grain, sıcak krem metin, tek vurgu: asit lime (#C8F560).
- Rakamlar: Instrument Serif (italik, büyük). UI: Bricolage Grotesque. Etiketler: JetBrains Mono.
- Bento grid: Hero toplam (Aylık/Yıllık/Günlük sekmeli, count-up animasyon), Yörünge görselleştirmesi
  (abonelikler maliyetle orantılı gezegenler), Kategori dağılımı, Yaklaşan ödemeler,
  "Bu parayla…" karşılaştırmaları, Abonelik listesi.
- Ekleme akışı: alttan açılan sheet → servis seç (arama + logo grid) → plan çipleri → fiyat/periyot/tarih.
- `prefers-reduced-motion` desteklenir. Mobilde tek kolon.

## Birimler
- `src/lib/calc.ts` — saf hesaplama fonksiyonları (Vitest ile test edilir).
- `src/lib/format.ts` — para / tarih formatlama.
- `src/data/catalog.ts` — servis kataloğu.
- `src/hooks/useSubscriptions.ts`, `src/hooks/useRates.ts` — state + kalıcılık.
- `src/components/*` — her kart kendi dosyasında.

## Kapsam dışı
Hesap sistemi, bildirim/hatırlatma, bulut senkronizasyonu, otomatik fiyat güncelleme.
