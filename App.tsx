import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. BAŞLANGIÇ KÜTÜPHANESİ (Kullanıcı ilk yüklediğinde bu standart liste gelecek)
const baslangicKutuphanesi = [
  { id: 'e1', isim: 'Şınav (Push-up)', bolge: 'Göğüs', tip: 'Zorlu' },
  { id: 'e3', isim: 'Barfiks (Pull-up)', bolge: 'Sırt', tip: 'Zorlu' },
  { id: 'e5', isim: 'Squat', bolge: 'Bacak', tip: 'Zorlu' },
  { id: 'e7', isim: 'Plank', bolge: 'Core', tip: 'Güvenli' },
];

const kategoriler = ['Tümü', 'Göğüs', 'Sırt', 'Bacak', 'Kol', 'Omuz', 'Core', 'Kardiyo', 'Tüm Vücut'];
const gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const baslangicProgrami: any = {
  'Pazartesi': [], 'Salı': [], 'Çarşamba': [], 'Perşembe': [], 'Cuma': [], 'Cumartesi': [], 'Pazar': []
};

export default function App() {
  const [aktifSayfa, setAktifSayfa] = useState('AnaSayfa'); 
  const [durum, setDurum] = useState('Harika 💪');
  const [program, setProgram] = useState(baslangicProgrami);
  
  // YENİ: Kütüphanemizi de artık hafızada tutuyoruz!
  const [kutuphane, setKutuphane] = useState(baslangicKutuphanesi);
  
  const [seciliGun, setSeciliGun] = useState('Pazartesi');
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  const [aramaMetni, setAramaMetni] = useState('');

  // YENİ: Özel Hareket Ekleme Formu Hafızaları
  const [ozelEkleAcik, setOzelEkleAcik] = useState(false); // Form açık mı kapalı mı?
  const [ozelIsim, setOzelIsim] = useState('');
  const [ozelBolge, setOzelBolge] = useState('Tüm Vücut');

  useEffect(() => { verileriYukle(); }, []);

  const verileriYukle = async () => {
    try {
      // Programı yükle
      const kayitliVeri = await AsyncStorage.getItem('kayitliProgram');
      if (kayitliVeri !== null) setProgram(JSON.parse(kayitliVeri));

      // YENİ: Varsa kullanıcının kendi kütüphanesini yükle
      const kayitliKutuphane = await AsyncStorage.getItem('kayitliKutuphane');
      if (kayitliKutuphane !== null) setKutuphane(JSON.parse(kayitliKutuphane));
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

  // KÜTÜPHANEYE YENİ ÖZEL HAREKET EKLEME MOTORU
  const ozelHareketKaydet = () => {
    if (ozelIsim === '') {
      Alert.alert('Hata', 'Lütfen bir hareket adı yazın!');
      return;
    }
    const yeniHareket = {
      id: Math.random().toString(),
      isim: ozelIsim,
      bolge: ozelBolge,
      tip: 'Zorlu' // Varsayılan
    };

    // Mevcut kütüphaneye yeni hareketi ekle
    const guncelKutuphane = [...kutuphane, yeniHareket];
    setKutuphane(guncelKutuphane);
    kutuphaneyiKaydet(guncelKutuphane); // Telefona kalıcı olarak kaydet

    // Formu temizle ve kapat
    setOzelIsim('');
    setOzelEkleAcik(false);
    Alert.alert('Harika!', `${ozelIsim} kütüphanene eklendi. Artık aramalarda çıkacak! 🚀`);
  };

  const kütüphanedenEkle = (secilenHareket: any) => {
    const yeniHareket = {
      id: Math.random().toString(), 
      isim: secilenHareket.isim,
      bolge: secilenHareket.bolge,
      tip: secilenHareket.tip
    };
    const guncelProgram = { ...program };
    guncelProgram[seciliGun] = [...guncelProgram[seciliGun], yeniHareket];
    setProgram(guncelProgram); 
    verileriKaydet(guncelProgram); 
    Alert.alert('Başarılı!', `${secilenHareket.isim}, ${seciliGun} gününe eklendi. 💪`);
  };

  // Artık egzersizKutuphanesi sabitini değil, state'teki kutuphane'yi filtreliyoruz!
  const filtrelenmisKutuphane = kutuphane.filter((hareket) => {
    const kategoriUyuyorMu = seciliKategori === 'Tümü' || hareket.bolge === seciliKategori;
    const aramaUyuyorMu = hareket.isim.toLowerCase().includes(aramaMetni.toLowerCase());
    return kategoriUyuyorMu && aramaUyuyorMu;
  });

  const bugununIndeksi = new Date().getDay(); 
  const pazarGunuDuzenlemesi = bugununIndeksi === 0 ? 6 : bugununIndeksi - 1;
  const bugununAdi = gunler[pazarGunuDuzenlemesi]; 
  const bugununProgrami = program[bugununAdi] || [];
  
  const filtrelenmisGunlukListe = bugununProgrami.filter((hareket: any) => {
    if (durum === 'Ağrılı 🤕' || durum === 'Yorgun 🔋') return hareket.tip === 'Güvenli';
    return true; 
  });

  return (
    <SafeAreaView style={styles.container}>
      
      {aktifSayfa === 'AnaSayfa' ? (
        <View style={styles.sayfaIcerigi}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>FitSync</Text>
            <Text style={styles.subtitle}>Akıllı Antrenman Asistanı</Text>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>Bugün nasıl hissediyorsun?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={() => setDurum('Harika 💪')}>
                <Text style={styles.buttonText}>Harika</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setDurum('Yorgun 🔋')}>
                <Text style={styles.buttonText}>Yorgun</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setDurum('Ağrılı 🤕')}>
                <Text style={styles.buttonText}>Ağrılı</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.statusText}>Şu anki durum: {durum}</Text>
          </View>

          <View style={styles.listBox}>
            <Text style={styles.listTitle}>{bugununAdi} Programı:</Text>
            {filtrelenmisGunlukListe.length === 0 ? (
              <Text style={styles.emptyText}>Bugün için dinlenme günü veya uygun hareket yok! 🎉</Text>
            ) : (
              <FlatList 
                data={filtrelenmisGunlukListe}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.hareketKutu}>
                    <Text style={styles.hareketIsim}>{item.isim}</Text>
                    <Text style={styles.hareketBolge}>{item.bolge}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.sayfaIcerigi}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>Kütüphane</Text>
            <Text style={styles.subtitle}>Hareket seç veya kendi hareketini yarat</Text>
          </View>
          
          <View style={styles.formKutusu}>
            
            {/* YENİ: ÖZEL HAREKET EKLEME BUTONU VE FORMU */}
            {!ozelEkleAcik ? (
              <TouchableOpacity style={styles.ozelEkleAcmaButonu} onPress={() => setOzelEkleAcik(true)}>
                <Text style={styles.ozelEkleAcmaYazi}>+ Kütüphanede bulamadın mı? Kendin Ekle</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ozelHareketFormu}>
                <Text style={styles.formBaslik}>Özel Hareket Adı:</Text>
                <TextInput style={styles.input} placeholder="Örn: Bulgarian Split Squat" value={ozelIsim} onChangeText={setOzelIsim} />
                <Text style={styles.formBaslik}>Bölgesi:</Text>
                <TextInput style={styles.input} placeholder="Örn: Bacak" value={ozelBolge} onChangeText={setOzelBolge} />
                
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

            {/* ARAYÜZ (GÜNLER VE KATEGORİLER) */}
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
              renderItem={({ item }) => (
                <View style={styles.listeSatiri}>
                  <View>
                    <Text style={styles.listeIsim}>{item.isim}</Text>
                    <Text style={styles.listeBolge}>{item.bolge} • {item.tip}</Text>
                  </View>
                  <TouchableOpacity style={styles.ekleButonu} onPress={() => kütüphanedenEkle(item)}>
                    <Text style={styles.ekleButonuYazi}>+ Ekle</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
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
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  sayfaIcerigi: { flex: 1, alignItems: 'center', paddingTop: 60, width: '100%' },
  headerBox: { alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 5 },
  questionBox: { alignItems: 'center', width: '100%', marginBottom: 20 },
  questionText: { fontSize: 20, fontWeight: '600', color: '#374151', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  statusText: { marginTop: 15, fontSize: 16, color: '#10B981', fontWeight: 'bold' }, 
  listBox: { flex: 1, width: '90%' },
  listTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 15 },
  emptyText: { fontSize: 16, color: '#6B7280', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }, 
  hareketKutu: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  hareketIsim: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  hareketBolge: { fontSize: 14, color: '#6B7280', marginTop: 5 },
  altMenu: { flexDirection: 'row', backgroundColor: '#FFFFFF', height: 85, width: '100%', borderTopWidth: 1, borderColor: '#E5E7EB', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 25 },
  menuButonu: { padding: 10 },
  menuYazi: { fontSize: 16, color: '#9CA3AF', fontWeight: '600' }, 
  menuAktifYazi: { color: '#3B82F6', fontWeight: 'bold' },
  formKutusu: { width: '90%', flex: 1 },
  yatayKutu: { flexDirection: 'row', marginBottom: 15, maxHeight: 45 },
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
  ekleButonu: { backgroundColor: '#1F2937', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  ekleButonuYazi: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  
  // YENİ ÖZEL HAREKET FORMU STİLLERİ
  ozelEkleAcmaButonu: { backgroundColor: '#E0E7FF', padding: 12, borderRadius: 10, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  ozelEkleAcmaYazi: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
  ozelHareketFormu: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  formBaslik: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 5 },
  input: { backgroundColor: '#FFFFFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 14, marginBottom: 10 }
});