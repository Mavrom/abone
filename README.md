# abone

Aboneliklerini ekle, ayda ve yılda gerçekte ne kadar ödediğini gör.

Canlı: https://abone-ruddy.vercel.app

## Özellikler

- **Hazır katalog**: 13 kategoride 66 servis, planları ve tahmini Türkiye fiyatlarıyla: dizi/film, TV & spor (TOD,
  Digiturk, tabii, Tivibu…), ev interneti (Türk Telekom, Superonline, Vodafone, TurkNet, Kablonet…), mobil hat
  (Turkcell, Vodafone, Türk Telekom…), alışveriş & yemek (Trendyol Plus, Hepsiburada Premium…), yapay zeka, oyun ve
  fazlası. Plan seç, fiyat otomatik dolsun (her fiyat düzenlenebilir). Listede olmayanlar için özel abonelik.
- **Taahhüt takibi**: internet, hat ve TV paketleri için taahhüt bitiş tarihi; listede kalan süre görünür.
- **Her periyot, her para birimi**: haftalık / aylık / 3 aylık / yıllık; ₺, $ ve €. Dolarla ödenen aboneliklerin
  (ChatGPT, Claude…) güncel kurla TL karşılığı otomatik hesaplanır ([Frankfurter](https://frankfurter.dev) API).
- **Toplamlar**: aylık, yıllık ve günlük maliyet, abonelik başına ortalama.
- **Yaklaşan ödemeler** ve **kategori dağılımı**.
- Sade arayüz, açık/koyu tema (sistem ayarını izler), mobil uyumlu.
- **Gizlilik**: hesap yok, sunucu yok. Veriler yalnızca tarayıcında (`localStorage`) saklanır.

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest (hesaplama mantığı)
npm run build    # tip kontrolü + production build
```

Stack: Vite, React 19, TypeScript, düz CSS, Geist font.
Marka ikonları [Simple Icons](https://simpleicons.org)'tan.

> Katalogdaki fiyatlar tahminidir ve zamanla değişir; kendi faturana göre düzenlemeyi unutma.
