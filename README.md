# abone

Aboneliklerini ekle, ayda ve yılda gerçekte ne kadar ödediğini gör.

Canlı: https://abone-ruddy.vercel.app

## Özellikler

- **Hazır katalog**: 30'a yakın popüler servis, planları ve tahmini Türkiye fiyatlarıyla. Plan seç, fiyat otomatik dolsun
  (her fiyat düzenlenebilir). Listede olmayanlar için özel abonelik.
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
