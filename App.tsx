import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList, TextInput, ScrollView, Alert, Modal, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tumIsinmaRutinleri = [
  { id: 'i_gen1', isim: 'Hafif Tempo Yerinde Koşu', sure: '2 Dakika', bolge: 'Genel' },
  { id: 'i_gen2', isim: 'Jumping Jack', sure: '30 Saniye', bolge: 'Genel' },
  { id: 'i_gogus', isim: 'Dinamik Göğüs Açış (Kollar Yanda)', sure: '30 Saniye', bolge: 'Göğüs' },
  { id: 'i_sirt', isim: 'Kedi-İnek Esnemesi (Dinamik)', sure: '30 Saniye', bolge: 'Sırt' },
  { id: 'i_bacak', isim: 'Dinamik Lunge (Vücut Ağırlığıyla)', sure: '10 Tekrar', bolge: 'Bacak' },
  { id: 'i_bacak2', isim: 'Bacak Savurma (Leg Swings)', sure: 'Her Bacak 10 Tekrar', bolge: 'Bacak' },
  { id: 'i_kol', isim: 'Kol Çevirme (Arm Circles)', sure: '30 Saniye', bolge: 'Kol' },
  { id: 'i_omuz', isim: 'Omuz Rotasyonları', sure: '30 Saniye', bolge: 'Omuz' },
  { id: 'i_core', isim: 'Gövde Çevirme (Torso Twist)', sure: '30 Saniye', bolge: 'Core' },
];

const tumSogumaRutinleri = [
  { id: 's_gen1', isim: 'Derin Nefes ve Yavaş Yürüyüş', sure: '1 Dakika', bolge: 'Genel' },
  { id: 's_gogus', isim: 'Kapı Eşiği Göğüs Esnetme', sure: '30 Saniye', bolge: 'Göğüs' },
  { id: 's_sirt', isim: 'Çocuk Pozu (Childs Pose)', sure: '1 Dakika', bolge: 'Sırt' },
  { id: 's_bacak', isim: 'Oturarak Öne Eğilme (Hamstring)', sure: '1 Dakika', bolge: 'Bacak' },
  { id: 's_bacak2', isim: 'Ayakta Quad Esnetme', sure: 'Her Bacak 30 Saniye', bolge: 'Bacak' },
  { id: 's_kol', isim: 'Triceps ve Biceps Statik Esnetme', sure: '30 Saniye', bolge: 'Kol' },
  { id: 's_omuz', isim: 'Çapraz Kol Omuz Esnetme', sure: 'Her Kol 30 Saniye', bolge: 'Omuz' },
  { id: 's_core', isim: 'Kobra Pozu (Karın Esnetme)', sure: '30 Saniye', bolge: 'Core' },
];

const baslangicKutuphanesi = [
  { id: 'g1', isim: 'Şınav (Push-up)', bolge: 'Göğüs', tip: 'Zorlu' },
  { id: 'g2', isim: 'Bench Press', bolge: 'Göğüs', tip: 'Zorlu' },
  { id: 'g3', isim: 'Incline Dumbbell Press', bolge: 'Göğüs', tip: 'Zorlu' },
  { id: 'g4', isim: 'Dumbbell Fly', bolge: 'Göğüs', tip: 'Zorlu' },
  { id: 's1', isim: 'Barfiks (Pull-up)', bolge: 'Sırt', tip: 'Zorlu' },
  { id: 's2', isim: 'Lat Pulldown', bolge: 'Sırt', tip: 'Zorlu' },
  { id: 's4', isim: 'Barbell Row', bolge: 'Sırt', tip: 'Zorlu' },
  { id: 's5', isim: 'Deadlift', bolge: 'Sırt', tip: 'Zorlu' },
  { id: 'b1', isim: 'Squat', bolge: 'Bacak', tip: 'Zorlu' },
  { id: 'b2', isim: 'Leg Press', bolge: 'Bacak', tip: 'Zorlu' },
  { id: 'b3', isim: 'Lunge', bolge: 'Bacak', tip: 'Zorlu' },
  { id: 'k1', isim: 'Bicep Curl', bolge: 'Kol', tip: 'Zorlu' },
  { id: 'k3', isim: 'Tricep Pushdown', bolge: 'Kol', tip: 'Zorlu' },
  { id: 'o1', isim: 'Overhead Press', bolge: 'Omuz', tip: 'Zorlu' },
  { id: 'o2', isim: 'Lateral Raise', bolge: 'Omuz', tip: 'Güvenli' },
  { id: 'c1', isim: 'Plank', bolge: 'Core', tip: 'Güvenli' },
  { id: 'c2', isim: 'Mekik (Crunch)', bolge: 'Core', tip: 'Güvenli' },
  { id: 'v1', isim: 'Koşu Bandı (Hafif Tempo)', bolge: 'Kardiyo', tip: 'Güvenli' },
  { id: 'v6', isim: 'Tam Vücut Esneme (Stretching)', bolge: 'Tüm Vücut', tip: 'Güvenli' },
];

const kategoriler = ['Tümü', 'Göğüs', 'Sırt', 'Bacak', 'Kol', 'Omuz', 'Core', 'Kardiyo', 'Tüm Vücut'];
const gercekBolgeler = ['Göğüs', 'Sırt', 'Bacak', 'Kol', 'Omuz', 'Core', 'Kardiyo', 'Tüm Vücut']; 
const gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const baslangicProgrami: any = {
  'Pazartesi': [], 'Salı': [], 'Çarşamba': [], 'Perşembe': [], 'Cuma': [], 'Cumartesi': [], 'Pazar': []
};

const baslangicSu: any = {
  'Pazartesi': 0, 'Salı': 0, 'Çarşamba': 0, 'Perşembe': 0, 'Cuma': 0, 'Cumartesi': 0, 'Pazar': 0
};

const bugununIndeksi = new Date().getDay(); 
const pazarGunuDuzenlemesi = bugununIndeksi === 0 ? 6 : bugununIndeksi - 1;
const gercekZamanliBugun = gunler[pazarGunuDuzenlemesi]; 

export default function App() {
  const [aktifSayfa, setAktifSayfa] = useState('AnaSayfa'); 
  const [durum, setDurum] = useState('Harika 💪');
  const [sikintiliBolge, setSikintiliBolge] = useState(''); 
  
  const [program, setProgram] = useState(baslangicProgrami);
  const [kutuphane, setKutuphane] = useState(baslangicKutuphanesi);
  const [suGecmisi, setSuGecmisi] = useState(baslangicSu);
  
  const [seciliGun, setSeciliGun] = useState(gercekZamanliBugun);
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  const [aramaMetni, setAramaMetni] = useState('');

  const [ozelEkleAcik, setOzelEkleAcik] = useState(false);
  const [ozelIsim, setOzelIsim] = useState('');
  const [ozelBolge, setOzelBolge] = useState('Göğüs'); 

  const [hedefHareket, setHedefHareket] = useState<any>(null); 
  const [setSayisi, setSetSayisi] = useState('3'); 
  const [tekrarSayisi, setTekrarSayisi] = useState('12'); 
  const [agirlik, setAgirlik] = useState(''); 

  const [isinmaModalAcik, setIsinmaModalAcik] = useState(false);
  const [sogumaModalAcik, setSogumaModalAcik] = useState(false);

  // YENİ: KRONOMETRE VE TİTREŞİM MOTORU
  const [dinlenmeSuresi, setDinlenmeSuresi] = useState(0);
  const [sayacAktifMi, setSayacAktifMi] = useState(false); // Sayacın bilerek çalıştırıldığını doğrulayan kilit

// 1. KRONOMETRE MOTORUNU BU ŞEKİLDE GÜNCELLE
useEffect(() => {
  let interval: any;
  
  if (sayacAktifMi && dinlenmeSuresi > 0) {
    interval = setInterval(() => {
      setDinlenmeSuresi((prev) => prev - 1);
    }, 1000);
  } 
  else if (sayacAktifMi && dinlenmeSuresi === 0) {
    // BURAYI GÜNCELLEDİK: Daha uzun ve fark edilebilir bir titreşim dizisi
    Vibration.vibrate([100, 500, 100, 500, 100, 500]); 
    setSayacAktifMi(false);
    // Ekstra güvenlik: Süre bittiğinde bir uyarı mesajı çıkar (Titreşim çalışmazsa bile anlarsın)
    Alert.alert("Süre Bitti!", "Dinlenme tamamlandı, yeni sete başla! 💪");
  }
  
  return () => clearInterval(interval);
}, [dinlenmeSuresi, sayacAktifMi]);

  useEffect(() => { verileriYukle(); }, []);

  const verileriYukle = async () => {
    try {
      const kayitliVeri = await AsyncStorage.getItem('kayitliProgram');
      if (kayitliVeri !== null) setProgram(JSON.parse(kayitliVeri));

      const kayitliKutuphane = await AsyncStorage.getItem('kayitliKutuphane');
      if (kayitliKutuphane !== null) {
        setKutuphane(JSON.parse(kayitliKutuphane));
      } else {
        kutuphaneyiKaydet(baslangicKutuphanesi);
      }

      const kayitliSu = await AsyncStorage.getItem('suGecmisi');
      if (kayitliSu !== null) setSuGecmisi(JSON.parse(kayitliSu));

    } catch (error) { console.log(error); }
  };

  const verileriKaydet = async (yeniProgram: any) => {
    try { await AsyncStorage.setItem('kayitliProgram', JSON.stringify(yeniProgram)); } 
    catch (error) { console.log(error); }
  };

  const kutuphaneyiKaydet = async (yeniKutuphane: any) => {
    try { await AsyncStorage.setItem('kayitliKutuphane', JSON.stringify(yeniKutuphane)); } 
    catch (error) { console.log(error); }
  };

  const suGuncelle = (miktar: number) => {
    const guncelSu = { ...suGecmisi };
    guncelSu[bugununAdi] = Math.max(0, guncelSu[bugununAdi] + miktar);
    setSuGecmisi(guncelSu);
    AsyncStorage.setItem('suGecmisi', JSON.stringify(guncelSu));
  };

  const ozelHareketKaydet = () => {
    if (ozelIsim === '') {
      Alert.alert('Hata', 'Lütfen bir hareket adı yazın!');
      return;
    }
    const yeniHareket = { id: Math.random().toString(), isim: ozelIsim, bolge: ozelBolge, tip: 'Zorlu', tamamlandi: false };
    const guncelKutuphane = [...kutuphane, yeniHareket];
    setKutuphane(guncelKutuphane);
    kutuphaneyiKaydet(guncelKutuphane); 
    setOzelIsim(''); setOzelBolge('Göğüs'); setOzelEkleAcik(false);
    Alert.alert('Harika!', `${ozelIsim} kütüphanene eklendi. 🚀`);
  };

  const kutuphanedenSil = (hareketId: string) => {
    Alert.alert(
      'Hareketi Sil',
      'Kendi eklediğin bu hareketi kütüphaneden kalıcı olarak silmek istediğine emin misin?',
      [{ text: 'İptal', style: 'cancel' }, { text: 'Sil', style: 'destructive', onPress: () => {
            const guncelKutuphane = kutuphane.filter((h: any) => h.id !== hareketId);
            setKutuphane(guncelKutuphane); kutuphaneyiKaydet(guncelKutuphane);
          }
        }]
    );
  };

  const kütüphanedenEkle = (secilenHareket: any) => {
    setHedefHareket(secilenHareket);
    let sonSet = '3'; let sonTekrar = '12'; let sonAgirlik = '';

    gunler.forEach(gun => {
      const gecmisHareket = program[gun].find((h: any) => h.isim === secilenHareket.isim);
      if (gecmisHareket && gecmisHareket.set) {
        sonSet = gecmisHareket.set;
        sonTekrar = gecmisHareket.tekrar;
        sonAgirlik = gecmisHareket.agirlik || ''; 
      }
    });
    setSetSayisi(sonSet); setTekrarSayisi(sonTekrar); setAgirlik(sonAgirlik);
  };

  const hareketProgramKayıt = () => {
    if (!hedefHareket) return;
    const yeniHareket = { 
      id: Math.random().toString(), isim: hedefHareket.isim, bolge: hedefHareket.bolge, tip: hedefHareket.tip, 
      tamamlandi: false, set: setSayisi, tekrar: tekrarSayisi, agirlik: agirlik 
    };
    const guncelProgram = { ...program };
    guncelProgram[seciliGun] = [...guncelProgram[seciliGun], yeniHareket];
    setProgram(guncelProgram); verileriKaydet(guncelProgram); 
    Alert.alert('Eklendi!', `${hedefHareket.isim} programa başarıyla eklendi. 💪`);
    setHedefHareket(null); 
  };

  const programdanSil = (gun: string, hareketId: string) => {
    Alert.alert('Hareketi Sil', 'Bu hareketi programdan çıkarmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' }, 
      { text: 'Sil', style: 'destructive', onPress: () => {
          const guncelProgram = { ...program };
          guncelProgram[gun] = guncelProgram[gun].filter((h: any) => h.id !== hareketId);
          setProgram(guncelProgram); verileriKaydet(guncelProgram);
        }
      }
    ]);
  };

const hareketTamamla = (gun: string, hareketId: string) => {
  let tikAatildiMi: boolean = false; 
  const guncelProgram = { ...program };
  
  guncelProgram[gun] = guncelProgram[gun].map((h: any) => {
    if (h.id === hareketId) {
      tikAatildiMi = !h.tamamlandi; 
      return { ...h, tamamlandi: tikAatildiMi };
    }
    return h;
  });

  setProgram(guncelProgram);
  verileriKaydet(guncelProgram); 

  if (tikAatildiMi) {
    // TEST İÇİN: Tike bastığın an telefon titriyor mu? 
    // Eğer burada titrerse kronometre sonunda da titreyecek demektir.
    Vibration.vibrate(100); 
    setDinlenmeSuresi(5); 
    setSayacAktifMi(true);
  } else {
    setDinlenmeSuresi(0);
    setSayacAktifMi(false);
  }
};

  const filtrelenmisKutuphane = kutuphane.filter((hareket) => {
    const kategoriUyuyorMu = seciliKategori === 'Tümü' || hareket.bolge === seciliKategori;
    const aramaUyuyorMu = hareket.isim.toLowerCase().includes(aramaMetni.toLowerCase());
    return kategoriUyuyorMu && aramaUyuyorMu;
  });

  const bugununAdi = gercekZamanliBugun; 
  const bugununProgrami = program[bugununAdi] || [];
  
  const filtrelenmisGunlukListe = bugununProgrami.filter((hareket: any) => {
    if ((durum === 'Ağrılı 🤕' || durum === 'Yorgun 🔋') && sikintiliBolge !== '') {
      return hareket.bolge !== sikintiliBolge;
    }
    return true; 
  });

  const gununAktifKasGruplari = Array.from(new Set(filtrelenmisGunlukListe.map((h: any) => h.bolge)));
  const gunlukOzelIsinma = tumIsinmaRutinleri.filter((rutin) => rutin.bolge === 'Genel' || gununAktifKasGruplari.includes(rutin.bolge));
  const gunlukOzelSoguma = tumSogumaRutinleri.filter((rutin) => rutin.bolge === 'Genel' || gununAktifKasGruplari.includes(rutin.bolge));
  const hepsiTamamlandi = filtrelenmisGunlukListe.length > 0 && filtrelenmisGunlukListe.every((h: any) => h.tamamlandi);

  let toplamTamamlanan = 0;
  let bolgeSayaclari: any = {};
  let aktifGunler: string[] = [];

  gunler.forEach(gun => {
    let oGunAntrenmanVarMi = false;
    program[gun].forEach((h: any) => {
      if (h.tamamlandi) {
        toplamTamamlanan++;
        bolgeSayaclari[h.bolge] = (bolgeSayaclari[h.bolge] || 0) + 1;
        oGunAntrenmanVarMi = true;
      }
    });
    if (oGunAntrenmanVarMi) aktifGunler.push(gun);
  });

  const enCokCalisilanBolge = Object.keys(bolgeSayaclari).length > 0 
    ? Object.keys(bolgeSayaclari).reduce((a, b) => bolgeSayaclari[a] > bolgeSayaclari[b] ? a : b) 
    : 'Henüz Veri Yok';

  return (
    <SafeAreaView style={styles.container}>
      
      {dinlenmeSuresi > 0 && (
        <View style={styles.kronometreBar}>
          <Text style={styles.kronometreYazi}>
            ⏳ Dinlenme: {Math.floor(dinlenmeSuresi / 60)}:{dinlenmeSuresi % 60 < 10 ? '0' : ''}{dinlenmeSuresi % 60}
          </Text>
        </View>
      )}

      <Modal visible={hedefHareket !== null} transparent={true} animationType="fade">
        <View style={styles.modalArkaPlan}>
          <View style={styles.modalKutu}>
            <Text style={styles.modalBaslik}>{hedefHareket?.isim}</Text>
            <Text style={styles.modalAltBaslik}>Hedefini belirle veya eski rekorunu geç!</Text>
            
            <View style={styles.modalGirdiSatiri}>
              <View style={styles.modalGirdiKutusu}>
                <Text style={styles.formBaslik}>Set</Text>
                <TextInput style={styles.input} value={setSayisi} onChangeText={setSetSayisi} keyboardType="numeric" />
              </View>
              <View style={styles.modalGirdiKutusu}>
                <Text style={styles.formBaslik}>Tekrar</Text>
                <TextInput style={styles.input} value={tekrarSayisi} onChangeText={setTekrarSayisi} keyboardType="numeric" />
              </View>
              <View style={styles.modalGirdiKutusu}>
                <Text style={styles.formBaslik}>Kg (Opsiyonel)</Text>
                <TextInput style={styles.input} value={agirlik} onChangeText={setAgirlik} keyboardType="numeric" placeholder="Örn: 60" />
              </View>
            </View>

            <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
              <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#10B981', paddingVertical: 12}]} onPress={hareketProgramKayıt}>
                <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>Programa Ekle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#EF4444', paddingVertical: 12}]} onPress={() => setHedefHareket(null)}>
                <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isinmaModalAcik} transparent={true} animationType="slide">
        <View style={styles.modalArkaPlan}>
          <View style={styles.rutinModalKutu}>
            <Text style={styles.modalBaslik}>🔥 Bölgesel Isınma</Text>
            <Text style={styles.modalAltBaslik}>Bugünkü programa özel vücut hazırlığı.</Text>
            <ScrollView style={{maxHeight: 300, width: '100%', marginBottom: 15}}>
              {gunlukOzelIsinma.map((item) => (
                <View key={item.id} style={styles.rutinSatiri}>
                  <Text style={styles.rutinIsim}>• {item.isim}</Text>
                  <Text style={styles.rutinSure}>{item.sure}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.rutinKapatButonu} onPress={() => setIsinmaModalAcik(false)}>
              <Text style={styles.rutinKapatYazi}>Hazırım, Antrenmana Başla! 💪</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={sogumaModalAcik} transparent={true} animationType="slide">
        <View style={styles.modalArkaPlan}>
          <View style={styles.rutinModalKutu}>
            <Text style={styles.modalBaslik}>🧊 Bölgesel Esneme</Text>
            <Text style={styles.modalAltBaslik}>Bugün çalıştırdığın kasları özel olarak rahatlat.</Text>
            <ScrollView style={{maxHeight: 300, width: '100%', marginBottom: 15}}>
              {gunlukOzelSoguma.map((item) => (
                <View key={item.id} style={styles.rutinSatiri}>
                  <Text style={styles.rutinIsim}>• {item.isim}</Text>
                  <Text style={styles.rutinSure}>{item.sure}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.rutinKapatButonu} onPress={() => setSogumaModalAcik(false)}>
              <Text style={styles.rutinKapatYazi}>Harika Bir Gündü, Bitir! 🎉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {aktifSayfa === 'AnaSayfa' && (
        <View style={styles.sayfaIcerigi}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>FitSync</Text>
            <Text style={styles.subtitle}>Akıllı Antrenman Asistanı</Text>
          </View>

          <View style={styles.suKutusu}>
            <View style={styles.suBaslikSatiri}>
              <Text style={styles.suBaslik}>💧 Su Tüketimi: {suGecmisi[bugununAdi]} / 2000 ml</Text>
              <TouchableOpacity onPress={() => suGuncelle(-250)}>
                <Text style={styles.suGeriAl}>Geri Al</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.suBarArka}>
              <View style={[styles.suBarDolum, { width: `${Math.min((suGecmisi[bugununAdi] / 2000) * 100, 100)}%` }]} />
            </View>
            <TouchableOpacity style={styles.suButonu} onPress={() => suGuncelle(250)}>
              <Text style={styles.suButonuYazi}>+ 250ml İçtim</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>Bugün nasıl hissediyorsun?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={() => { setDurum('Harika 💪'); setSikintiliBolge(''); }}>
                <Text style={styles.buttonText}>Harika</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setDurum('Yorgun 🔋')}>
                <Text style={styles.buttonText}>Yorgun</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setDurum('Ağrılı 🤕')}>
                <Text style={styles.buttonText}>Ağrılı</Text>
              </TouchableOpacity>
            </View>

            {(durum === 'Ağrılı 🤕' || durum === 'Yorgun 🔋') && (
              <View style={styles.sorunluBolgeKutusu}>
                <Text style={styles.sorunluBolgeSoru}>Hangi bölgeyi dinlendirmek istersin?</Text>
                <View style={styles.yatayKutuForm}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {gercekBolgeler.map((bolge) => (
                      <TouchableOpacity 
                        key={bolge} 
                        style={[styles.kategoriButonu, sikintiliBolge === bolge && styles.kategoriButonuAktif]} 
                        onPress={() => setSikintiliBolge(bolge)}
                      >
                        <Text style={[styles.kategoriYazi, sikintiliBolge === bolge && styles.kategoriYaziAktif]}>{bolge}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          <View style={styles.listBox}>
            <Text style={styles.listTitle}>{bugununAdi} Programı:</Text>
            {filtrelenmisGunlukListe.length === 0 ? (
              <Text style={styles.emptyText}>Bugün için dinlenme günü veya uygun hareket yok! 🎉</Text>
            ) : (
              <FlatList 
                data={filtrelenmisGunlukListe}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                  <TouchableOpacity style={styles.isinmaTetikleyici} onPress={() => setIsinmaModalAcik(true)}>
                    <Text style={styles.isinmaTetikleyiciYazi}>🔥 Başlamadan Önce: Isınma Rutini</Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                  <TouchableOpacity 
                    style={[styles.sogumaTetikleyici, hepsiTamamlandi && styles.sogumaTetikleyiciAktif]} 
                    onPress={() => setSogumaModalAcik(true)}
                  >
                    <Text style={[styles.sogumaTetikleyiciYazi, hepsiTamamlandi && styles.sogumaTetikleyiciYaziAktif]}>
                      {hepsiTamamlandi ? "🎉 Antrenman Bitti! Şimdi Soğuma Vakti 🧊" : "🧊 Bitirirken: Soğuma ve Esneme"}
                    </Text>
                  </TouchableOpacity>
                )}
                renderItem={({ item }) => (
                  <View style={[styles.hareketKutu, item.tamamlandi && styles.hareketKutuTamamlandi]}>
                    <View style={styles.hareketSolKisim}>
                      <TouchableOpacity 
                        style={[styles.checkButonu, item.tamamlandi && styles.checkButonuAktif]} 
                        onPress={() => hareketTamamla(bugununAdi, item.id)}
                      >
                        {item.tamamlandi && <Text style={styles.checkYazi}>✓</Text>}
                      </TouchableOpacity>
                      <View>
                        <Text style={[styles.hareketIsim, item.tamamlandi && styles.hareketIsimTamamlandi]}>
                          {item.isim}
                        </Text>
                        <Text style={styles.hareketBolge}>
                          {item.bolge}  •  {item.set ? `${item.set} Set x ${item.tekrar} Tekrar` : ''} 
                          {item.agirlik ? ` | ${item.agirlik} kg` : ''}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.silButonu} onPress={() => programdanSil(bugununAdi, item.id)}>
                      <Text style={styles.silButonuYazi}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      )}

      {aktifSayfa === 'Program' && (
        <View style={styles.sayfaIcerigi}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>Kütüphane</Text>
            <Text style={styles.subtitle}>Hareket seç veya kendi hareketini yarat</Text>
          </View>
          
          <View style={styles.formKutusu}>
            {!ozelEkleAcik ? (
              <TouchableOpacity style={styles.ozelEkleAcmaButonu} onPress={() => setOzelEkleAcik(true)}>
                <Text style={styles.ozelEkleAcmaYazi}>+ Kütüphanede bulamadın mı? Kendin Ekle</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ozelHareketFormu}>
                <Text style={styles.formBaslik}>Özel Hareket Adı:</Text>
                <TextInput style={styles.input} placeholder="Örn: Bulgarian Split Squat" value={ozelIsim} onChangeText={setOzelIsim} />
                <Text style={styles.formBaslik}>Bölgesi:</Text>
                <View style={styles.yatayKutuForm}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {gercekBolgeler.map((bolge) => (
                      <TouchableOpacity 
                        key={bolge} 
                        style={[styles.kategoriButonu, ozelBolge === bolge && styles.kategoriButonuAktif]} 
                        onPress={() => setOzelBolge(bolge)}
                      >
                        <Text style={[styles.kategoriYazi, ozelBolge === bolge && styles.kategoriYaziAktif]}>{bolge}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                  <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#10B981', paddingVertical: 12}]} onPress={ozelHareketKaydet}>
                    <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>Kaydet</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#EF4444', paddingVertical: 12}]} onPress={() => setOzelEkleAcik(false)}>
                    <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>İptal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.yatayKutu}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {gunler.map((gun) => (
                  <TouchableOpacity key={gun} style={[styles.gunButonu, seciliGun === gun && styles.gunButonuAktif]} onPress={() => setSeciliGun(gun)}>
                    <Text style={[styles.gunYazi, seciliGun === gun && styles.gunYaziAktif]}>{gun}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.yatayKutu}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {kategoriler.map((kat) => (
                  <TouchableOpacity key={kat} style={[styles.kategoriButonu, seciliKategori === kat && styles.kategoriButonuAktif]} onPress={() => setSeciliKategori(kat)}>
                    <Text style={[styles.kategoriYazi, seciliKategori === kat && styles.kategoriYaziAktif]}>{kat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput style={styles.aramaKutusu} placeholder="🔍 Kütüphanede ara..." value={aramaMetni} onChangeText={setAramaMetni} />

            <FlatList 
              data={filtrelenmisKutuphane}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                const hareketOrijinalMi = baslangicKutuphanesi.some((orjinalHareket) => orjinalHareket.id === item.id);
                return (
                  <View style={styles.listeSatiri}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listeIsim}>{item.isim}</Text>
                      <Text style={styles.listeBolge}>{item.bolge} • {item.tip}</Text>
                    </View>
                    <View style={styles.kutuphaneAksiyonKutusu}>
                      {!hareketOrijinalMi && (
                        <TouchableOpacity style={styles.kutuphaneSilButonu} onPress={() => kutuphanedenSil(item.id)}>
                          <Text style={styles.kutuphaneSilYazi}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.ekleButonu} onPress={() => kütüphanedenEkle(item)}>
                        <Text style={styles.ekleButonuYazi}>+ Ekle</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}

      {aktifSayfa === 'Profil' && (
        <View style={styles.sayfaIcerigi}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>Senin Profilin</Text>
            <Text style={styles.subtitle}>Gelişimini ve serini takip et</Text>
          </View>

          <View style={styles.profilIcerigi}>
            <View style={{flexDirection: 'row', gap: 15}}>
              <View style={[styles.istatistikKarti, {flex: 1}]}>
                <Text style={styles.istatistikSayi}>{toplamTamamlanan}</Text>
                <Text style={styles.istatistikBaslik}>Biten Hareket</Text>
              </View>
              <View style={[styles.istatistikKarti, {flex: 1}]}>
                <Text style={[styles.istatistikSayi, {fontSize: 22, color: '#3B82F6', marginTop: 10}]}>{enCokCalisilanBolge}</Text>
                <Text style={styles.istatistikBaslik}>Favori Bölge</Text>
              </View>
            </View>

            <View style={styles.streakKarti}>
              <Text style={styles.streakBaslik}>🔥 Haftalık Seri (Streak)</Text>
              <Text style={styles.streakAltBaslik}>Yeşil günleri bozmamaya çalış!</Text>
              <View style={styles.streakSatiri}>
                {gunler.map((gun) => {
                  const bugunAktifMi = aktifGunler.includes(gun);
                  const kisaGun = gun.substring(0, 1);
                  return (
                    <View key={gun} style={[styles.streakKutusu, bugunAktifMi && styles.streakKutusuAktif]}>
                      <Text style={[styles.streakGunYazi, bugunAktifMi && styles.streakGunYaziAktif]}>{kisaGun}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.altMenu}>
        <TouchableOpacity style={styles.menuButonu} onPress={() => setAktifSayfa('AnaSayfa')}>
          <Text style={[styles.menuYazi, aktifSayfa === 'AnaSayfa' && styles.menuAktifYazi]}>🏠 Ana Ekran</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButonu} onPress={() => setAktifSayfa('Program')}>
          <Text style={[styles.menuYazi, aktifSayfa === 'Program' && styles.menuAktifYazi]}>🏋️ Kütüphane</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButonu} onPress={() => setAktifSayfa('Profil')}>
          <Text style={[styles.menuYazi, aktifSayfa === 'Profil' && styles.menuAktifYazi]}>👤 Profil</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  suKutusu: { width: '90%', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  suBaslikSatiri: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  suBaslik: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  suGeriAl: { fontSize: 13, color: '#EF4444', fontWeight: 'bold' },
  suBarArka: { height: 14, backgroundColor: '#E5E7EB', borderRadius: 7, overflow: 'hidden', marginBottom: 12 },
  suBarDolum: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 7 },
  suButonu: { backgroundColor: '#DBEAFE', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  suButonuYazi: { color: '#2563EB', fontWeight: 'bold', fontSize: 16 },

  kronometreBar: { backgroundColor: '#3B82F6', width: '90%', padding: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 20, marginTop: 45, marginBottom: -5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  kronometreYazi: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  profilIcerigi: { width: '90%', flex: 1, marginTop: 10 },
  istatistikKarti: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  istatistikSayi: { fontSize: 36, fontWeight: 'bold', color: '#10B981' },
  istatistikBaslik: { fontSize: 14, color: '#6B7280', marginTop: 5, fontWeight: '600' },
  streakKarti: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  streakBaslik: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  streakAltBaslik: { fontSize: 13, color: '#6B7280', marginTop: 5, marginBottom: 15 },
  streakSatiri: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  streakKutusu: { width: 35, height: 35, borderRadius: 8, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  streakKutusuAktif: { backgroundColor: '#10B981' },
  streakGunYazi: { fontSize: 14, fontWeight: 'bold', color: '#6B7280' },
  streakGunYaziAktif: { color: 'white' },

  modalArkaPlan: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalKutu: { width: '85%', backgroundColor: '#FFFFFF', padding: 25, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  rutinModalKutu: { width: '90%', backgroundColor: '#FFFFFF', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalBaslik: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' },
  modalAltBaslik: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 5, marginBottom: 15 },
  modalGirdiSatiri: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, 
  modalGirdiKutusu: { flex: 1 },

  rutinSatiri: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 8, width: '100%', borderWidth: 1, borderColor: '#F3F4F6' },
  rutinIsim: { fontSize: 15, fontWeight: '600', color: '#374151', flex: 1 },
  rutinSure: { fontSize: 14, fontWeight: 'bold', color: '#3B82F6' },
  rutinKapatButonu: { backgroundColor: '#1F2937', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 10 },
  rutinKapatYazi: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  isinmaTetikleyici: { backgroundColor: '#FFF7ED', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#FED7AA', alignItems: 'center' },
  isinmaTetikleyiciYazi: { color: '#EA580C', fontWeight: 'bold', fontSize: 16 },
  sogumaTetikleyici: { backgroundColor: '#F0FDF4', padding: 15, borderRadius: 12, marginTop: 5, marginBottom: 20, borderWidth: 1, borderColor: '#BBF7D0', alignItems: 'center' },
  sogumaTetikleyiciAktif: { backgroundColor: '#10B981', borderColor: '#059669' },
  sogumaTetikleyiciYazi: { color: '#166534', fontWeight: 'bold', fontSize: 16 },
  sogumaTetikleyiciYaziAktif: { color: '#FFFFFF', fontSize: 16 },

  sayfaIcerigi: { flex: 1, alignItems: 'center', paddingTop: 20, width: '100%' }, 
  headerBox: { alignItems: 'center', marginBottom: 15, marginTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 5 },
  questionBox: { alignItems: 'center', width: '100%', marginBottom: 20 },
  questionText: { fontSize: 20, fontWeight: '600', color: '#374151', marginBottom: 15 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  
  sorunluBolgeKutusu: { width: '90%', marginTop: 15, alignItems: 'center' },
  sorunluBolgeSoru: { fontSize: 16, fontWeight: '600', color: '#4B5563', marginBottom: 10 },

  listBox: { flex: 1, width: '90%' },
  listTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 15 },
  emptyText: { fontSize: 16, color: '#6B7280', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }, 
  
  hareketKutu: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  hareketKutuTamamlandi: { opacity: 0.6, backgroundColor: '#F9FAFB' },
  hareketSolKisim: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  
  checkButonu: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkButonuAktif: { backgroundColor: '#10B981', borderColor: '#10B981' }, 
  checkYazi: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  
  hareketIsim: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  hareketIsimTamamlandi: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  
  hareketBolge: { fontSize: 14, color: '#6B7280', marginTop: 3 },
  silButonu: { paddingVertical: 8, paddingHorizontal: 12 },
  silButonuYazi: { fontSize: 18 },
  
  altMenu: { flexDirection: 'row', backgroundColor: '#FFFFFF', height: 85, width: '100%', borderTopWidth: 1, borderColor: '#E5E7EB', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 25 },
  menuButonu: { padding: 10, alignItems: 'center' },
  menuYazi: { fontSize: 15, color: '#9CA3AF', fontWeight: '600' }, 
  menuAktifYazi: { color: '#3B82F6', fontWeight: 'bold' },
  formKutusu: { width: '90%', flex: 1 },
  yatayKutu: { flexDirection: 'row', marginBottom: 15, maxHeight: 45 },
  yatayKutuForm: { flexDirection: 'row', marginBottom: 10, maxHeight: 45 }, 
  gunButonu: { backgroundColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, height: 40, justifyContent:'center' },
  gunButonuAktif: { backgroundColor: '#10B981' },
  gunYazi: { color: '#4B5563', fontWeight: '600' },
  gunYaziAktif: { color: '#FFFFFF' },
  kategoriButonu: { backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#D1D5DB', height: 38, justifyContent:'center' },
  kategoriButonuAktif: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  kategoriYazi: { color: '#4B5563', fontWeight: '500' },
  kategoriYaziAktif: { color: '#FFFFFF' },
  aramaKutusu: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 16, marginBottom: 15 },
  
  listeSatiri: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  listeIsim: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  listeBolge: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  
  kutuphaneAksiyonKutusu: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kutuphaneSilButonu: { backgroundColor: '#FEE2E2', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  kutuphaneSilYazi: { fontSize: 14 },
  
  ekleButonu: { backgroundColor: '#1F2937', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  ekleButonuYazi: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  
  ozelEkleAcmaButonu: { backgroundColor: '#E0E7FF', padding: 12, borderRadius: 10, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  ozelEkleAcmaYazi: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
  ozelHareketFormu: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  formBaslik: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 5 },
  input: { backgroundColor: '#FFFFFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 14, marginBottom: 10 }
});