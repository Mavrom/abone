# abone.

> Küçük ödemeler, **büyük** toplamlar.

Aboneliklerini ekle, ayda ve yılda gerçekte ne kadar ödediğini gör. Netflix, Spotify, ChatGPT, Claude, Exxen,
Game Pass… Tek tek masum görünürler; hepsi bir arada başka bir hikâye anlatır.

## Özellikler

- **Hazır katalog**: 30'a yakın popüler servis, planları ve tahmini Türkiye fiyatlarıyla. Plan seç, fiyat otomatik dolsun
  (her fiyat düzenlenebilir). Listede olmayanlar için özel abonelik.
- **Her periyot, her para birimi**: haftalık / aylık / 3 aylık / yıllık; ₺, $ ve €. Dolarla ödenen aboneliklerin
  (ChatGPT, Claude…) güncel kurla TL karşılığı otomatik hesaplanır ([Frankfurter](https://frankfurter.dev) API).
- **Toplamlar**: aylık, yıllık, haftalık, günlük ve 5 yıllık maliyet.
- **Yörünge**: aboneliklerin, maliyetleriyle orantılı gezegenler olarak yıllık toplamın etrafında döner.
- **Kategori dağılımı**, **yaklaşan ödemeler** ve "bu parayla bir yılda kaç lahmacun" karşılaştırmaları.
- **Gizlilik**: hesap yok, sunucu yok. Veriler yalnızca tarayıcında (`localStorage`) saklanır.

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest (hesaplama mantığı)
npm run build    # tip kontrolü + production build
```

Stack: Vite, React 19, TypeScript, düz CSS. Fontlar: Instrument Serif, Bricolage Grotesque, JetBrains Mono.
Marka ikonları [Simple Icons](https://simpleicons.org)'tan.

> Katalogdaki fiyatlar tahminidir ve zamanla değişir; kendi faturana göre düzenlemeyi unutma.
