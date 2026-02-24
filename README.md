# 🏋️‍♂️ FitSync - Akıllı Antrenman ve Kalistenik Asistanı

FitSync, hem geleneksel ağırlık antrenmanı (bodybuilding) yapanlar hem de sokak antrenmanı (kalistenik) sporcuları için tasarlanmış, premium seviyede ve çevrimdışı (offline) çalışan bir React Native fitness uygulamasıdır. Tarihsel antrenman hacminizi takip eder, yapay zeka destekli toparlanma tavsiyeleri sunar ve cebinizdeki en iyi antrenman koçu olur.

## ✨ Temel Özellikler

* **🤸 Çift Antrenman Modu:** Herhangi bir hareket için **Ağırlık** (Set x Tekrar x Kg) ve **Kalistenik / Vücut Ağırlığı** (Set x Saniye x Vücut Ağırlığı) modları arasında tek tuşla sorunsuzca geçiş yapın.
* **🧠 Akıllı Yapay Zeka Koçu:** Aşırı antrenmanı (overtraining) önlemek için dünkü antrenmanlarınızı analiz eder. Bacak gününü atlıyorsanız sizi uyarır ("Tavuk Bacak Uyarısı! 🍗") ve yorgun olduğunuz kas gruplarınıza göre size özel dinlenme tavsiyeleri verir.
* **📈 Tarihsel Hacim Analizi:** Haftalık sıfırlanan basit uygulamaların aksine FitSync, ömür boyu kaldırdığınız toplam hacmi (Set x Tekrar x Ağırlık) takip eder ve kas grubu bazında filtrelenebilen interaktif grafiklerle gelişiminizi (progressive overload) görselleştirir.
* **🏆 Ömür Boyu İstatistikler:** Tüm zamanların favori kas grubunu ve bugüne kadar tamamladığınız toplam egzersiz sayısını hafızasında tutar.
* **📥 CSV Olarak Dışa Aktarma:** Antrenman geçmişinizi tek tuşla bir CSV (Excel) dosyasına dönüştürün ve WhatsApp, Mail veya cihaz dosyalarınız üzerinden dışa aktarın.
* **🌍 Çift Dil Desteği (i18n):** Türkçe ve İngilizce arasında anında geçiş yapabilme imkanı.
* **⏱️ Akıllı Dinlenme Sayacı:** Bir seti tamamladığınızda otomatik başlayan ve süre bitiminde cihaz titreşimi (haptic feedback) ile sizi uyaran yerleşik kronometre.
* **💧 Su Tüketimi Takibi:** Günlük 2 litrelik su içme hedefinizi interaktif bir bar ile takip edin.
* **🌗 Modern ve Kompakt Arayüz:** Göz yormayan Karanlık (Dark) ve Aydınlık (Light) tema seçenekleriyle harmanlanmış şık tasarım.

## 🛠️ Kullanılan Teknolojiler

* **Çerçeve (Framework):** React Native / Expo
* **Dil:** TypeScript
* **Veri Saklama:** AsyncStorage (Çevrimdışı, cihaz içi veri tabanı)
* **Yerelleştirme (Dil):** React-i18next & Expo Localization
* **Dosya Sistemi:** Expo File System & Expo Sharing (CSV dışa aktarma işlemleri için)
* **Tasarım:** StyleSheet (React Native yerleşik stil mimarisi)

## 🚀 Kurulum ve Çalıştırma

1. Projeyi bilgisayarınıza klonlayın:
   ```bash
   git clone [https://github.com/araleren03/FitSync.git](https://github.com/araleren03/FitSync.git)