# SFX Memory

Video editörleri için geliştirilmiş, **tag tabanlı kişisel bir ses efekti (SFX) hafıza paneli**.

SFX Memory, edit yaparken kullanılan ses efektlerini tek bir yerde toplamanı, hatırlamanı ve hızlıca önizlemeni sağlar. Kategori zorlaması yerine, editörlerin gerçek düşünme biçimine uygun olarak **etiket (tag)** sistemi kullanır.

---

## 🎯 Amaç

Edit sırasında indirilen ses efektleri zamanla birikir. Dosya isimleri değiştirilse bile bir süre sonra:

* Bu ses neydi?
* Nerede kullanmıştım?
* Hangi hissi veriyordu?

sorularının cevabı kaybolur.

**SFX Memory**, bu problemi çözmek için tasarlanmış kişisel bir workflow aracıdır. Bir ses efektini sadece saklamaz, **neden ve nasıl kullandığını hatırlatır**.

---

## ✨ Özellikler

* 🎧 mp3 / wav dosyalarını içe aktarma
* ▶️ Tek tıkla anında ses oynatma
* 🏷️ Sınırsız tag (etiket) ekleme ve silme
* 📝 Her ses için kullanım notları
* 🔍 İsim, tag ve notlara göre arama
* 🧹 Kategori karmaşası olmadan sade arayüz
* 💾 Tüm veriler tarayıcıda lokal olarak saklanır
* 🚫 Backend, kullanıcı hesabı veya internet gerektirmez

---

## 🏷️ Neden Kategori Yok?

Transition, Impact gibi sabit kategoriler edit sırasında zihinsel yük oluşturur.

SFX Memory şunu sorar:

> “Bu sesi hangi bağlamda kullanmıştım?”

Bu yüzden sistem tamamen **tag tabanlıdır**. Tag’ler özgürdür, kişiseldir ve senin edit stiline göre şekillenir.

---

## 🚀 Kurulum ve Çalıştırma (npm)

### Gereksinimler

* Node.js (LTS önerilir)
* npm

### Bağımlılıkları Yükleme

```bash
npm install
```

### Geliştirme Ortamını Başlatma

```bash
npm run dev
```

Tarayıcıdan aç:

```
http://localhost:3000
```

*(Port yapılandırmaya göre değişebilir.)*

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Veri Saklama

Ses isimleri, tag’ler, notlar ve süre bilgileri tamamen **lokal** olarak saklanır.

Kullanılan yöntem:

* JSON / IndexedDB (uygulama yapısına göre)

Hiçbir veri dışarı gönderilmez.

---

## 🧠 Proje Felsefesi

* Kişisel workflow her şeyden önce gelir
* Basitlik > şişkin özellikler
* Bu bir arşiv değil, **hafıza aracıdır**

---

## 📜 Lisans

MIT License

Özgürce kullanabilir, değiştirebilir ve paylaşabilirsin.
