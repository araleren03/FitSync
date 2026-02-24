import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList, TextInput, ScrollView, Alert, Modal, Vibration, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

// --- I18N & LOCALIZATION IMPORTS ---
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// --- ÇEVİRİ SÖZLÜKLERİ (RESOURCES) ---
const resources = {
  tr: {
    translation: {
      "app_name": "FitSync",
      "subtitle_home": "Akıllı Antrenman Asistanı",
      "subtitle_library": "Hareket Kütüphanesi",
      "subtitle_stats": "Gelişim & İstatistikler",
      "stat_volume_chart": "📈 Gelişim: Tarihsel Hacim (Kg)",
      "stat_volume_sub": "Set x Tekrar x Ağırlık",
      "mode_weight": "🏋️ Ağırlık",
      "mode_bw": "🤸 Vücut Ağırlığı",
      "label_rep_sec": "Tekrar / Saniye",
      "label_extra_kg": "Ekstra Kg",
      "text_bw": "Vücut Ağırlığı (BW)",
      
      //Dışa Aktarma
      "btn_export": "📥 Verileri Dışa Aktar (CSV)",
      "export_success": "Başarılı",
      "export_error": "Paylaşım bu cihazda desteklenmiyor.",

      // Durumlar
      "status_great": "Harika 💪",
      "status_tired": "Yorgun 🔋",
      "status_sore": "Ağrılı 🤕",
      "how_are_you": "Şu an nasılsın?",
      
      // Bölgeler (Görünen İsimler)
      "region_chest": "Göğüs",
      "region_back": "Sırt",
      "region_legs": "Bacak",
      "region_arms": "Kol",
      "region_shoulders": "Omuz",
      "region_core": "Core",
      "region_cardio": "Kardiyo",
      "region_fullbody": "Tüm Vücut",
      "region_general": "Genel",
      "cat_all": "Tümü",

      // Günler (Görünen İsimler)
      "day_monday": "Pazartesi",
      "day_tuesday": "Salı",
      "day_wednesday": "Çarşamba",
      "day_thursday": "Perşembe",
      "day_friday": "Cuma",
      "day_saturday": "Cumartesi",
      "day_sunday": "Pazar",
      "day_short_monday": "Pzt",
      "day_short_tuesday": "Sal",
      "day_short_wednesday": "Çar",
      "day_short_thursday": "Per",
      "day_short_friday": "Cum",
      "day_short_saturday": "Cmt",
      "day_short_sunday": "Pzr",

      // UI Metinleri
      "list_title": "{{day}} Programı:",
      "empty_list": "Bugün için dinlenme günü veya hareket yok! 🎉",
      "warmup_trigger": "🔥 Başlamadan Önce: Isınma Rutini",
      "cooldown_trigger": "🧊 Bitirirken: Soğuma ve Esneme",
      "cooldown_finished": "🎉 Antrenman Bitti! Şimdi Soğuma Vakti 🧊",
      "add_custom_btn": "+ Kütüphanede bulamadın mı? Kendin Ekle",
      "search_placeholder": "🔍 Kütüphanede ara...",
      "btn_save": "Kaydet",
      "btn_cancel": "İptal",
      "btn_add": "+ Ekle",
      "btn_start": "Başla! 💪",
      "btn_finish": "Bitir! 🎉",
      
      // Modal & Formlar
      "modal_warmup_title": "🔥 Bölgesel Isınma",
      "modal_warmup_desc": "Bugünkü programa özel vücut hazırlığı.",
      "modal_cooldown_title": "🧊 Bölgesel Esneme",
      "modal_cooldown_desc": "Kaslarını özel olarak rahatlat.",
      "modal_target_title": "Hedefini belirle veya eski rekorunu geç!",
      "label_set": "Set",
      "label_rep": "Tekrar",
      "label_kg": "Kg",
      "label_custom_name": "Özel Hareket Adı:",
      "label_custom_region": "Bölgesi:",
      "alert_error": "Hata",
      "alert_enter_name": "Lütfen bir hareket adı yazın!",
      "alert_added": "Eklendi!",
      "alert_added_msg": "{{name}} programa başarıyla eklendi. 💪",
      "alert_delete_title": "Hareketi Sil",
      "alert_delete_msg": "Bu hareketi programdan çıkarmak istediğine emin misin?",
      "alert_delete_lib_msg": "Kendi eklediğin bu hareketi kütüphaneden kalıcı olarak silmek istediğine emin misin?",
      "alert_rest_finished": "⏰ Dinlenme Bitti!",
      "alert_rest_msg": "Kasların toparlandı, hadi diğer sete veya harekete geçelim! Parçalamaya devam! 💪",

      // Koç Mesajları
      "enemy_alert_title": "DÜŞMAN BÖLGE TESPİTİ",
      "enemy_alert_sub": "Piyasadaki diğerleri gibi seni pofpoflamayacağım. Kalk ve kütüphaneden hareket ekle!",
      "enemy_btn": "Anlaşıldı Koç! 🫡",
      "msg_balanced": "Programın dengeli, antrenmanı parçalamaya hazırsın! 💪",
      "msg_overtrain": "DİKKAT! Dün {{muscles}} çalıştın. 48 saat dinlenmen lazım. ⚠️",
      "msg_rest_day": "Bugün dinlenme günün! Unutma, kaslar dinlenirken büyür. 💧",
      "msg_revize": "Aşağıdan yorgun bölgeni seçersen programı senin için revize edebilirim. 🧠",
      "msg_resting": "{{region}} dinleniyor. {{advice}} 🧘‍♂️",
      
      // İstatistikler
      "stat_finished": "Biten Hareket",
      "stat_fav_region": "Favori Bölge",
      "stat_weekly_chart": "📊 Haftalık Aktivite Grafiği",
      "stat_streak_title": "🔥 Haftalık Seri (Streak)",
      "stat_streak_sub": "Yeşil günleri bozmamaya çalış!",
      
      // Tavsiyeler
      "advice_chest": "Göğüs kasların dinlenirken, Bacak veya Core çalışmak için şahane bir gün.",
      "advice_back": "Sırt ağrısı ihmale gelmez. Belki bugün sadece hafif kardiyoya odaklanmalıyız.",
      "advice_legs": "Bacakların yorgunsa onları zorlama. Üst vücut (Göğüs/Omuz) çalışmak için harika bir fırsat!",
      "advice_arms": "Kolların ağrıyorsa itme/çekme hareketlerini pas geç. Sadece Bacak veya Kardiyo yapalım.",
      "advice_shoulders": "Omuz eklemi çok hassastır. Omuzlarını dinlendirip Core veya Bacak çalışabilirsin.",
      "advice_core": "Karın kasların ağrıyorsa mekikleri bırak. Hafif bir yürüyüş veya Kol antrenmanı iyi gider.",
      "advice_cardio": "Genel bir yorgunluk var demek ki. Sadece bölgesel ağırlık veya esneme yapabilirsin.",
      "advice_fullbody": "Bütün vücudun ağrıyorsa kesinlikle aktif dinlenme (sadece esneme) yapmalısın.",
      "advice_default": "Farklı bir bölgeye odaklanabilirsin.",

      // HAREKET İSİMLERİ (ID Eşleşmeli)
      "ex_g1": "Şınav (Push-up)",
      "ex_g2": "Bench Press",
      "ex_g3": "Incline Dumbbell Press",
      "ex_g4": "Dumbbell Fly",
      "ex_s1": "Barfiks (Pull-up)",
      "ex_s2": "Lat Pulldown",
      "ex_s4": "Barbell Row",
      "ex_s5": "Deadlift",
      "ex_b1": "Squat",
      "ex_b2": "Leg Press",
      "ex_b3": "Lunge",
      "ex_k1": "Bicep Curl",
      "ex_k3": "Tricep Pushdown",
      "ex_o1": "Overhead Press",
      "ex_o2": "Lateral Raise",
      "ex_c1": "Plank",
      "ex_c2": "Mekik (Crunch)",
      "ex_v1": "Koşu Bandı (Hafif Tempo)",
      "ex_v6": "Tam Vücut Esneme (Stretching)",
      
      // Rutin İsimleri
      "rout_i_gen1": "Hafif Tempo Yerinde Koşu",
      "rout_i_gen2": "Jumping Jack",
      "rout_i_gogus": "Dinamik Göğüs Açış",
      "rout_i_sirt": "Kedi-İnek Esnemesi",
      "rout_i_bacak": "Dinamik Lunge",
      "rout_i_bacak2": "Bacak Savurma",
      "rout_i_kol": "Kol Çevirme",
      "rout_i_omuz": "Omuz Rotasyonları",
      "rout_i_core": "Gövde Çevirme",
      
      "rout_s_gen1": "Derin Nefes ve Yavaş Yürüyüş",
      "rout_s_gogus": "Kapı Eşiği Göğüs Esnetme",
      "rout_s_sirt": "Çocuk Pozu",
      "rout_s_bacak": "Oturarak Öne Eğilme",
      "rout_s_bacak2": "Ayakta Quad Esnetme",
      "rout_s_kol": "Triceps ve Biceps Statik",
      "rout_s_omuz": "Çapraz Kol Omuz Esnetme",
      "rout_s_core": "Kobra Pozu",

      // Menü
      "menu_home": "Ana Ekran",
      "menu_library": "Kütüphane",
      "menu_profile": "Profil",
      "type_hard": "Zorlu",
      "type_safe": "Güvenli",

      //Tavuk Bacak :)
      "warn_no_legs_cardio": "Haftalık listende hiç Bacak veya Kardiyo yok. Tavuk bacak uyarısı! 🍗",
      "warn_no_legs": "Bacak çalışmayı unuttun! Kas dengesizliği yolda.",
      "warn_no_cardio": "Kondisyonun düşüyor, sadece ağırlıkla olmaz. Kardiyo ekle!",

      // Kalistenik Hareketleri
      "ex_cal1": "Muscle-up",
      "ex_cal2": "Front Lever",
      "ex_cal3": "Back Lever",
      "ex_cal4": "L-Sit",
      "ex_cal5": "Human Flag (İnsan Bayrağı)",
      "ex_cal6": "Handstand Push-up (Amuda Kalkarak Şınav)",
      "ex_cal7": "Pistol Squat (Tek Bacak Squat)",
      "ex_cal8": "Dips (Paralel Bar)",
      "ex_cal9": "Planche",
    }
  },
  en: {
    translation: {
      "app_name": "FitSync",
      "subtitle_home": "Smart Workout Assistant",
      "subtitle_library": "Exercise Library",
      "subtitle_stats": "Progress & Stats",
      "stat_volume_chart": "📈 Progression: Historical Volume (Kg)",
      "stat_volume_sub": "Sets x Reps x Weight",
      "mode_weight": "🏋️ Weights",
      "mode_bw": "🤸 Bodyweight",
      "label_rep_sec": "Reps / Sec",
      "label_extra_kg": "Extra Kg",
      "text_bw": "Bodyweight (BW)",

      "btn_export": "📥 Export Data (CSV)",
      "export_success": "Success",
      "export_error": "Sharing is not supported on this device.",
      
      "status_great": "Great 💪",
      "status_tired": "Tired 🔋",
      "status_sore": "Sore 🤕",
      "how_are_you": "How do you feel?",
      
      "region_chest": "Chest",
      "region_back": "Back",
      "region_legs": "Legs",
      "region_arms": "Arms",
      "region_shoulders": "Shoulders",
      "region_core": "Core",
      "region_cardio": "Cardio",
      "region_fullbody": "Full Body",
      "region_general": "General",
      "cat_all": "All",

      "day_monday": "Monday",
      "day_tuesday": "Tuesday",
      "day_wednesday": "Wednesday",
      "day_thursday": "Thursday",
      "day_friday": "Friday",
      "day_saturday": "Saturday",
      "day_sunday": "Sunday",
      "day_short_monday": "Mon",
      "day_short_tuesday": "Tue",
      "day_short_wednesday": "Wed",
      "day_short_thursday": "Thu",
      "day_short_friday": "Fri",
      "day_short_saturday": "Sat",
      "day_short_sunday": "Sun",

      "list_title": "{{day}} Routine:",
      "empty_list": "Rest day or no exercises planned! 🎉",
      "warmup_trigger": "🔥 Before Start: Warm-up Routine",
      "cooldown_trigger": "🧊 Finishing Up: Cool-down & Stretch",
      "cooldown_finished": "🎉 Workout Done! Time to Cool Down 🧊",
      "add_custom_btn": "+ Can't find it? Add Custom",
      "search_placeholder": "🔍 Search library...",
      "btn_save": "Save",
      "btn_cancel": "Cancel",
      "btn_add": "+ Add",
      "btn_start": "Start! 💪",
      "btn_finish": "Finish! 🎉",
      
      "modal_warmup_title": "🔥 Zone Warm-up",
      "modal_warmup_desc": "Body prep specific to today's program.",
      "modal_cooldown_title": "🧊 Zone Stretching",
      "modal_cooldown_desc": "Relax your muscles specifically.",
      "modal_target_title": "Set your goal or beat your record!",
      "label_set": "Set",
      "label_rep": "Rep",
      "label_kg": "Kg",
      "label_custom_name": "Custom Exercise Name:",
      "label_custom_region": "Region:",
      "alert_error": "Error",
      "alert_enter_name": "Please enter an exercise name!",
      "alert_added": "Added!",
      "alert_added_msg": "{{name}} added to the program. 💪",
      "alert_delete_title": "Delete Exercise",
      "alert_delete_msg": "Are you sure you want to remove this?",
      "alert_delete_lib_msg": "Permanently delete this custom exercise from library?",
      "alert_rest_finished": "⏰ Rest Over!",
      "alert_rest_msg": "Muscles recovered, let's crush the next set! 💪",

      "enemy_alert_title": "ENEMY ZONE DETECTED",
      "enemy_alert_sub": "I won't pamper you like others. Get up and add exercises!",
      "enemy_btn": "Understood Coach! 🫡",
      "msg_balanced": "Program is balanced, ready to crush it! 💪",
      "msg_overtrain": "WARNING! You trained {{muscles}} yesterday. Rest 48h. ⚠️",
      "msg_rest_day": "Rest day! Muscles grow while resting. 💧",
      "msg_revize": "Select your tired zone below to revise the program. 🧠",
      "msg_resting": "{{region}} is resting. {{advice}} 🧘‍♂️",
      
      "stat_finished": "Completed",
      "stat_fav_region": "Fav Zone",
      "stat_weekly_chart": "📊 Weekly Activity Chart",
      "stat_streak_title": "🔥 Weekly Streak",
      "stat_streak_sub": "Keep the green days going!",
      
      "advice_chest": "Great day to train Legs or Core while Chest rests.",
      "advice_back": "Back pain is serious. Maybe just light cardio today.",
      "advice_legs": "Don't push tired legs. Great chance for Upper Body!",
      "advice_arms": "Skip push/pull if arms hurt. Go for Legs or Cardio.",
      "advice_shoulders": "Shoulders are sensitive. Rest them, try Core or Legs.",
      "advice_core": "Skip crunches if abs hurt. Light walk or Arms works.",
      "advice_cardio": "General fatigue detected. Try regional weights or stretch.",
      "advice_fullbody": "If whole body hurts, definitely do Active Rest (stretch only).",
      "advice_default": "You can focus on a different zone.",

      "ex_g1": "Push-up",
      "ex_g2": "Bench Press",
      "ex_g3": "Incline Dumbbell Press",
      "ex_g4": "Dumbbell Fly",
      "ex_s1": "Pull-up",
      "ex_s2": "Lat Pulldown",
      "ex_s4": "Barbell Row",
      "ex_s5": "Deadlift",
      "ex_b1": "Squat",
      "ex_b2": "Leg Press",
      "ex_b3": "Lunge",
      "ex_k1": "Bicep Curl",
      "ex_k3": "Tricep Pushdown",
      "ex_o1": "Overhead Press",
      "ex_o2": "Lateral Raise",
      "ex_c1": "Plank",
      "ex_c2": "Crunch",
      "ex_v1": "Treadmill (Light)",
      "ex_v6": "Full Body Stretching",

      "rout_i_gen1": "Light Jog in Place",
      "rout_i_gen2": "Jumping Jack",
      "rout_i_gogus": "Dynamic Chest Fly",
      "rout_i_sirt": "Cat-Cow Stretch",
      "rout_i_bacak": "Dynamic Lunge",
      "rout_i_bacak2": "Leg Swings",
      "rout_i_kol": "Arm Circles",
      "rout_i_omuz": "Shoulder Rotations",
      "rout_i_core": "Torso Twist",
      
      "rout_s_gen1": "Deep Breath & Walk",
      "rout_s_gogus": "Doorway Chest Stretch",
      "rout_s_sirt": "Child's Pose",
      "rout_s_bacak": "Seated Forward Bend",
      "rout_s_bacak2": "Standing Quad Stretch",
      "rout_s_kol": "Triceps & Biceps Static",
      "rout_s_omuz": "Cross-body Shoulder",
      "rout_s_core": "Cobra Pose",

      "menu_home": "Home",
      "menu_library": "Library",
      "menu_profile": "Profile",
      "type_hard": "Hard",
      "type_safe": "Safe",

      "warn_no_legs_cardio": "No Legs or Cardio in your weekly list. Chicken legs alert! 🍗",
      "warn_no_legs": "You forgot to train Legs! Muscle imbalance incoming.",
      "warn_no_cardio": "Your conditioning is dropping, weights aren't enough. Add Cardio!",

      // Calisthenics Movements
      "ex_cal1": "Muscle-up",
      "ex_cal2": "Front Lever",
      "ex_cal3": "Back Lever",
      "ex_cal4": "L-Sit",
      "ex_cal5": "Human Flag",
      "ex_cal6": "Handstand Push-up (HSPU)",
      "ex_cal7": "Pistol Squat",
      "ex_cal8": "Parallel Bar Dips",
      "ex_cal9": "Planche",
    }
  }
};

const systemLanguage = Localization.getLocales()[0]?.languageCode || 'en';
i18n.use(initReactI18next).init({
  resources,
  lng: systemLanguage,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false }
});

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
  // --- Kalistenik (Vücut Ağırlığı) ---
  { id: 'cal1', isim: 'Muscle-up', bolge: 'Sırt', tip: 'Zorlu' },
  { id: 'cal2', isim: 'Front Lever', bolge: 'Core', tip: 'Zorlu' },
  { id: 'cal3', isim: 'Back Lever', bolge: 'Core', tip: 'Zorlu' },
  { id: 'cal4', isim: 'L-Sit', bolge: 'Core', tip: 'Zorlu' },
  { id: 'cal5', isim: 'Human Flag', bolge: 'Core', tip: 'Zorlu' },
  { id: 'cal6', isim: 'Handstand Push-up (HSPU)', bolge: 'Omuz', tip: 'Zorlu' },
  { id: 'cal7', isim: 'Pistol Squat', bolge: 'Bacak', tip: 'Zorlu' },
  { id: 'cal8', isim: 'Dips', bolge: 'Göğüs', tip: 'Zorlu' },
  { id: 'cal9', isim: 'Planche', bolge: 'Omuz', tip: 'Zorlu' },
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
  const { t, i18n } = useTranslation();
  const [aktifDil, setAktifDil] = useState(i18n.language);

  const [aktifSayfa, setAktifSayfa] = useState('AnaSayfa'); 
  const [durum, setDurum] = useState('Harika 💪');
  const [sikintiliBolge, setSikintiliBolge] = useState(''); 
   
  const [program, setProgram] = useState(baslangicProgrami);
  const [kutuphane, setKutuphane] = useState(baslangicKutuphanesi);
  const [suGecmisi, setSuGecmisi] = useState(baslangicSu);
  const [isDarkMode, setIsDarkMode] = useState(false);
   
  const [seciliGun, setSeciliGun] = useState(gercekZamanliBugun);
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  
  // 🚀 YENİ: Ömür Boyu ve Hacim Hafızası
  const [genelIstatistikler, setGenelIstatistikler] = useState<any>({ toplam: 0, bolgeler: {} });
  const [hacimGecmisi, setHacimGecmisi] = useState<any>({});
  const [grafikBolge, setGrafikBolge] = useState('Tümü');

  const [aramaMetni, setAramaMetni] = useState('');

  const [ozelEkleAcik, setOzelEkleAcik] = useState(false);
  const [ozelIsim, setOzelIsim] = useState('');
  const [ozelBolge, setOzelBolge] = useState('Göğüs'); 

  const [hedefHareket, setHedefHareket] = useState<any>(null); 
  const [vucutAgirligiMi, setVucutAgirligiMi] = useState(false);
  const [setSayisi, setSetSayisi] = useState('3'); 
  const [tekrarSayisi, setTekrarSayisi] = useState('12'); 
  const [agirlik, setAgirlik] = useState(''); 

  const [isinmaModalAcik, setIsinmaModalAcik] = useState(false);
  const [sogumaModalAcik, setSogumaModalAcik] = useState(false);

  const [dinlenmeSuresi, setDinlenmeSuresi] = useState(0);
  const [sayacAktifMi, setSayacAktifMi] = useState(false); 
   
  const [dusmanPopUpGizlendi, setDusmanPopUpGizlendi] = useState(false);

  // YARDIMCI FONKSİYONLAR
  const getHareketIsmi = (item: any) => {
    return i18n.exists(`ex_${item.id}`) ? t(`ex_${item.id}`) : item.isim;
  };
  
  const getSureCevirisi = (sureStr: string) => {
    if (i18n.language === 'tr') return sureStr;
    const ceviriSozlugu: any = {
      '2 Dakika': '2 Minutes', '30 Saniye': '30 Seconds', '10 Tekrar': '10 Reps',
      'Her Bacak 10 Tekrar': '10 Reps Each Leg', '1 Dakika': '1 Minute',
      'Her Bacak 30 Saniye': '30 Sec Each Leg', 'Her Kol 30 Saniye': '30 Sec Each Arm'
    };
    return ceviriSozlugu[sureStr] || sureStr;
  };

  const getBolgeIsmi = (bolgeKey: string) => {
    if(bolgeKey === 'Tümü') return t('cat_all');
    const map: any = {
      'Göğüs': 'region_chest', 'Sırt': 'region_back', 'Bacak': 'region_legs',
      'Kol': 'region_arms', 'Omuz': 'region_shoulders', 'Core': 'region_core',
      'Kardiyo': 'region_cardio', 'Tüm Vücut': 'region_fullbody', 'Genel': 'region_general'
    };
    return map[bolgeKey] ? t(map[bolgeKey]) : bolgeKey;
  };

  const getGunIsmi = (gunKey: string, kisa = false) => {
    const map: any = {
      'Pazartesi': kisa ? 'day_short_monday' : 'day_monday',
      'Salı': kisa ? 'day_short_tuesday' : 'day_tuesday',
      'Çarşamba': kisa ? 'day_short_wednesday' : 'day_wednesday',
      'Perşembe': kisa ? 'day_short_thursday' : 'day_thursday',
      'Cuma': kisa ? 'day_short_friday' : 'day_friday',
      'Cumartesi': kisa ? 'day_short_saturday' : 'day_saturday',
      'Pazar': kisa ? 'day_short_sunday' : 'day_sunday'
    };
    return map[gunKey] ? t(map[gunKey]) : gunKey;
  };

  useEffect(() => {
    let interval: any;
    if (sayacAktifMi && dinlenmeSuresi > 0) {
      interval = setInterval(() => { setDinlenmeSuresi((prev) => prev - 1); }, 1000);
    } 
    else if (sayacAktifMi && dinlenmeSuresi === 0) {
      Vibration.vibrate(); 
      setTimeout(() => Vibration.vibrate(), 500); 
      setSayacAktifMi(false);
      Alert.alert(t('alert_rest_finished'), t('alert_rest_msg'));
    }
    return () => clearInterval(interval);
  }, [dinlenmeSuresi, sayacAktifMi]);

  useEffect(() => { verileriYukle(); }, []);

  const getPazartesiTarihi = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay() || 7; 
    d.setDate(d.getDate() - (day - 1)); 
    return d.toISOString();
  };

  const verileriYukle = async () => {
    try {
      let guncelProgram = baslangicProgrami;
      let guncelSu = baslangicSu;

      const kayitliProgram = await AsyncStorage.getItem('kayitliProgram');
      if (kayitliProgram !== null) guncelProgram = JSON.parse(kayitliProgram);

      const kayitliSu = await AsyncStorage.getItem('suGecmisi');
      if (kayitliSu !== null) guncelSu = JSON.parse(kayitliSu);
      
      const kayitliIstatistik = await AsyncStorage.getItem('genelIstatistikler');
      if (kayitliIstatistik !== null) setGenelIstatistikler(JSON.parse(kayitliIstatistik));

      // 🚀 YENİ: Geçmiş Hacim Verilerini Yükle
      const kayitliHacim = await AsyncStorage.getItem('hacimGecmisi');
      if (kayitliHacim !== null) setHacimGecmisi(JSON.parse(kayitliHacim));

      const bugunStr = new Date().toDateString();
      const mevcutHaftaPazartesi = getPazartesiTarihi();
      
      const sonGiris = await AsyncStorage.getItem('sonGirisTarihi');
      const kayitliHafta = await AsyncStorage.getItem('kayitliHafta');

      // Haftalık Sıfırlama (Tikler silinir ama İstatistikler & Tarihsel Grafik silinmez!)
      if (kayitliHafta !== mevcutHaftaPazartesi) {
        gunler.forEach(gun => {
          if(guncelProgram[gun]) {
             guncelProgram[gun] = guncelProgram[gun].map((h: any) => ({ ...h, tamamlandi: false }));
          }
          guncelSu[gun] = 0;
        });
        await AsyncStorage.setItem('kayitliHafta', mevcutHaftaPazartesi);
      }

      // 🧠 YENİ: Uyarı hafızasını kontrol et
      const gizlenenHafta = await AsyncStorage.getItem('gizlenenUyariHaftasi');
      if (gizlenenHafta === mevcutHaftaPazartesi) {
        setDusmanPopUpGizlendi(true); // Eğer bu hafta zaten susturulduysa baştan gizli başlat
      }
      
      if (sonGiris !== bugunStr) {
        guncelSu[gercekZamanliBugun] = 0;
        await AsyncStorage.setItem('sonGirisTarihi', bugunStr);
      }
      
      setProgram(guncelProgram);
      setSuGecmisi(guncelSu);

      const kayitliTema = await AsyncStorage.getItem('isDarkMode');
      if (kayitliTema !== null) setIsDarkMode(JSON.parse(kayitliTema));

      const kayitliDil = await AsyncStorage.getItem('seciliDil');
      if (kayitliDil !== null) {
        i18n.changeLanguage(kayitliDil);
        setAktifDil(kayitliDil);
      }

      const kayitliKutuphane = await AsyncStorage.getItem('kayitliKutuphane');
      if (kayitliKutuphane !== null) {
        const hafizadakiListe = JSON.parse(kayitliKutuphane);
        const ozelHareketler = hafizadakiListe.filter((hafizaHareketi: any) => 
          !baslangicKutuphanesi.some((orjinal: any) => orjinal.isim === hafizaHareketi.isim)
        );
        const kusursuzListe = [...baslangicKutuphanesi, ...ozelHareketler];
        setKutuphane(kusursuzListe);
        kutuphaneyiKaydet(kusursuzListe); 
      } else {
        setKutuphane(baslangicKutuphanesi);
        kutuphaneyiKaydet(baslangicKutuphanesi);
      }
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

  // --- 📈 YENİ: TARİHSEL HACİM KAYDEDİCİ ---
  const gunlukHacimiKaydet = (guncelProg: any) => {
    const bugunStr = new Date().toDateString(); 
    const bugunAdi = gercekZamanliBugun; 
    const bugunProgrami = guncelProg[bugunAdi] || [];
    
    let bolgesel: any = { 'Tümü': 0 };
    
    bugunProgrami.forEach((h: any) => {
      if (h.tamamlandi) {
        const s = parseInt(h.set) || 0;
        const t = parseInt(h.tekrar) || 0;
        const a = parseInt(h.agirlik) || 1; 
        const hacim = s * t * a;
        
        bolgesel['Tümü'] += hacim;
        bolgesel[h.bolge] = (bolgesel[h.bolge] || 0) + hacim;
      }
    });

    setHacimGecmisi((oncekiGecmis: any) => {
      const yeniGecmis = { ...oncekiGecmis, [bugunStr]: bolgesel };
      AsyncStorage.setItem('hacimGecmisi', JSON.stringify(yeniGecmis));
      return yeniGecmis;
    });
  };

  // --- 📥 YENİ: VERİ DIŞA AKTARMA (CSV) FONKSİYONU ---
  const verileriDisaAktar = async () => {
    try {
      let csvIcerik = "Tarih,Bolge,Toplam Hacim (Kg)\n";
      
      Object.keys(hacimGecmisi).forEach(tarih => {
        Object.keys(hacimGecmisi[tarih]).forEach(bolge => {
          if(bolge !== 'Tümü' && hacimGecmisi[tarih][bolge] > 0) {
             csvIcerik += `${tarih},${getBolgeIsmi(bolge)},${hacimGecmisi[tarih][bolge]}\n`;
          }
        });
      });

      const dosyaIsmi = "FitSync_Gelisim_Raporu.csv";
      
      const klasorYolu = FileSystem.documentDirectory || "";
      const dosyaYolu = klasorYolu + dosyaIsmi;
      
      await FileSystem.writeAsStringAsync(dosyaYolu, csvIcerik, { encoding: 'utf8' });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dosyaYolu, { dialogTitle: 'Gelişim Raporunu Paylaş' });
      } else {
        Alert.alert(t('alert_error'), t('export_error'));
      }
    } catch (error) {
      console.log("Dışa aktarma hatası:", error);
    }
  };

  // --- 🧠 YENİ: KOÇU BU HAFTALIK SUSTURMA HAFIZASI ---
  const uyariyiKapat = async () => {
    setDusmanPopUpGizlendi(true); // Ekrandan anında gizle
    try {
      // Hangi hafta susturulduğunu kalıcı hafızaya kaydet
      await AsyncStorage.setItem('gizlenenUyariHaftasi', getPazartesiTarihi());
    } catch (error) { console.log(error); }
  };

  const temaDegistir = () => {
    const yeniTema = !isDarkMode;
    setIsDarkMode(yeniTema);
    AsyncStorage.setItem('isDarkMode', JSON.stringify(yeniTema));
  };

  const dilDegistir = () => {
    const yeniDil = aktifDil === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(yeniDil);
    setAktifDil(yeniDil);
    AsyncStorage.setItem('seciliDil', yeniDil);
  };

  const suGuncelle = (miktar: number) => {
    const guncelSu = { ...suGecmisi };
    guncelSu[bugununAdi] = Math.max(0, guncelSu[bugununAdi] + miktar);
    setSuGecmisi(guncelSu);
    AsyncStorage.setItem('suGecmisi', JSON.stringify(guncelSu));
  };

  const ozelHareketKaydet = () => {
    if (ozelIsim === '') {
      Alert.alert(t('alert_error'), t('alert_enter_name'));
      return;
    }
    const yeniHareket = { id: Math.random().toString(), isim: ozelIsim, bolge: ozelBolge, tip: 'Zorlu', tamamlandi: false };
    const guncelKutuphane = [...kutuphane, yeniHareket];
    setKutuphane(guncelKutuphane);
    kutuphaneyiKaydet(guncelKutuphane); 
    setOzelIsim(''); setOzelBolge('Göğüs'); setOzelEkleAcik(false);
    Alert.alert(t('alert_added'), t('alert_added_msg', {name: ozelIsim}));
  };

  const kutuphanedenSil = (hareketId: string) => {
    Alert.alert(
      t('alert_delete_title'), t('alert_delete_lib_msg'),
      [{ text: t('btn_cancel'), style: 'cancel' }, { text: 'Sil', style: 'destructive', onPress: () => {
            const guncelKutuphane = kutuphane.filter((h: any) => h.id !== hareketId);
            setKutuphane(guncelKutuphane); kutuphaneyiKaydet(guncelKutuphane);
          }
        }]
    );
  };

  const kütüphanedenEkle = (secilenHareket: any) => {
    setHedefHareket(secilenHareket);
    let sonSet = '3'; let sonTekrar = '12'; let sonAgirlik = '';
    let sonModBw = secilenHareket.isim.includes('Lever') || secilenHareket.isim.includes('Plank') || secilenHareket.isim.includes('Sit'); 

    gunler.forEach(gun => {
      const gecmisHareket = program[gun].find((h: any) => h.isim === secilenHareket.isim);
      if (gecmisHareket && gecmisHareket.set) {
        sonSet = gecmisHareket.set;
        sonTekrar = gecmisHareket.tekrar;
        sonAgirlik = gecmisHareket.agirlik || ''; 
        if (gecmisHareket.isBodyweight !== undefined) sonModBw = gecmisHareket.isBodyweight;
      }
    });
    setSetSayisi(sonSet); setTekrarSayisi(sonTekrar); setAgirlik(sonAgirlik); setVucutAgirligiMi(sonModBw);
  };

  const hareketProgramKayıt = () => {
    if (!hedefHareket) return;
    const guncelProgram = { ...program };

    if (hedefHareket.isEditing) {
      const gun = hedefHareket.editGun;
      guncelProgram[gun] = guncelProgram[gun].map((h: any) => {
        if (h.id === hedefHareket.id) return { ...h, set: setSayisi, tekrar: tekrarSayisi, agirlik: agirlik, isBodyweight: vucutAgirligiMi };
        return h;
      });
      setProgram(guncelProgram); 
      verileriKaydet(guncelProgram); 
      gunlukHacimiKaydet(guncelProgram); 
      Alert.alert("Güncellendi!", "Hedefler başarıyla güncellendi. Yeni rekorlara! 🚀");
    } else {
      const yeniHareket = { 
  id: Math.random().toString(), isim: hedefHareket.isim, bolge: hedefHareket.bolge, tip: hedefHareket.tip, 
  tamamlandi: false, set: setSayisi, tekrar: tekrarSayisi, agirlik: agirlik, refId: hedefHareket.id,
  isBodyweight: vucutAgirligiMi
      };
      guncelProgram[seciliGun] = [...guncelProgram[seciliGun], yeniHareket];
      setProgram(guncelProgram); 
      verileriKaydet(guncelProgram); 
      gunlukHacimiKaydet(guncelProgram); 
      Alert.alert(t('alert_added'), t('alert_added_msg', {name: getHareketIsmi(hedefHareket)}));
    }
    setHedefHareket(null); 
  };

  const programdanSil = (gun: string, hareketId: string) => {
    Alert.alert(t('alert_delete_title'), t('alert_delete_msg'), [
      { text: t('btn_cancel'), style: 'cancel' }, 
      { text: 'Sil', style: 'destructive', onPress: () => {
          const guncelProgram = { ...program };
          guncelProgram[gun] = guncelProgram[gun].filter((h: any) => h.id !== hareketId);
          setProgram(guncelProgram); 
          verileriKaydet(guncelProgram);
          gunlukHacimiKaydet(guncelProgram); 
        }
      }
    ]);
  };

  const hareketTamamla = (gun: string, hareketId: string) => {
    let tikAatildiMi: boolean = false; 
    let hareketBolgesi = '';
    const guncelProgram = { ...program };
     
    guncelProgram[gun] = guncelProgram[gun].map((h: any) => {
      if (h.id === hareketId) {
        tikAatildiMi = !h.tamamlandi; 
        hareketBolgesi = h.bolge; 
        return { ...h, tamamlandi: tikAatildiMi };
      }
      return h;
    });

    setProgram(guncelProgram);
    verileriKaydet(guncelProgram); 
    gunlukHacimiKaydet(guncelProgram); 

    if (hareketBolgesi !== '') {
      const yeniIstatistikler = { ...genelIstatistikler };
      if(!yeniIstatistikler.bolgeler) yeniIstatistikler.bolgeler = {}; 

      if (tikAatildiMi) {
        yeniIstatistikler.toplam = (yeniIstatistikler.toplam || 0) + 1;
        yeniIstatistikler.bolgeler[hareketBolgesi] = (yeniIstatistikler.bolgeler[hareketBolgesi] || 0) + 1;
      } else {
        yeniIstatistikler.toplam = Math.max(0, (yeniIstatistikler.toplam || 0) - 1);
        yeniIstatistikler.bolgeler[hareketBolgesi] = Math.max(0, (yeniIstatistikler.bolgeler[hareketBolgesi] || 0) - 1);
      }
      setGenelIstatistikler(yeniIstatistikler);
      AsyncStorage.setItem('genelIstatistikler', JSON.stringify(yeniIstatistikler));
    }

    if (tikAatildiMi) {
      setDinlenmeSuresi(120); 
      setSayacAktifMi(true);
    } else {
      setDinlenmeSuresi(0);
      setSayacAktifMi(false);
    }
  };

  const hareketiDuzenle = (hareket: any, gun: string) => {
    setHedefHareket({ ...hareket, isEditing: true, editGun: gun }); 
    setSetSayisi(hareket.set ? hareket.set.toString() : '3');
    setTekrarSayisi(hareket.tekrar ? hareket.tekrar.toString() : '12');
    setAgirlik(hareket.agirlik ? hareket.agirlik.toString() : '');
    setVucutAgirligiMi(hareket.isBodyweight || false); 
  };

  const filtrelenmisKutuphane = kutuphane.filter((hareket) => {
    const kategoriUyuyorMu = seciliKategori === 'Tümü' || hareket.bolge === seciliKategori;
    const gorunenIsim = getHareketIsmi(hareket);
    const aramaUyuyorMu = gorunenIsim.toLowerCase().includes(aramaMetni.toLowerCase());
    return kategoriUyuyorMu && aramaUyuyorMu;
  });

  const bugununAdi = gercekZamanliBugun; 
  const bugununProgrami = program[bugununAdi] || [];
   
  const filtrelenmisGunlukListe = bugununProgrami.filter((hareket: any) => {
    if ((durum === t('status_sore') || durum === t('status_tired')) && sikintiliBolge !== '') {
      return hareket.bolge !== sikintiliBolge;
    }
    return true; 
  });

  const gununAktifKasGruplari = Array.from(new Set(filtrelenmisGunlukListe.map((h: any) => h.bolge)));
  const gunlukOzelIsinma = tumIsinmaRutinleri.filter((rutin) => rutin.bolge === 'Genel' || gununAktifKasGruplari.includes(rutin.bolge));
  const gunlukOzelSoguma = tumSogumaRutinleri.filter((rutin) => rutin.bolge === 'Genel' || gununAktifKasGruplari.includes(rutin.bolge));
  const hepsiTamamlandi = filtrelenmisGunlukListe.length > 0 && filtrelenmisGunlukListe.every((h: any) => h.tamamlandi);

  // --- 🧠 YENİ: ACIMASIZ VE GERÇEKÇİ DÜŞMAN BÖLGE ANALİZİ ---
  const dusmanBolgeAnalizEt = () => {
    // 1. Yeni kullanıcıları hemen darlamamak için önce veritabanında en az 3 günlük kayıt var mı ona bakalım
    const gecmisGunSayisi = Object.keys(hacimGecmisi).length;
    if (gecmisGunSayisi < 3) return null; // Kullanıcı uygulamayı yeni yüklediyse koç sessiz kalıp veri toplar

    // 2. Niyete değil icraata bak: Son 7 günü tara!
    let son7GundeBacakYapildiMi = false;
    let son7GundeKardiyoYapildiMi = false;

    const bugun = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(bugun);
      d.setDate(d.getDate() - i);
      const tarihStr = d.toDateString();

      // O gün gerçekten antrenman yapılmış ve tik atılmış mı?
      if (hacimGecmisi[tarihStr]) {
        if (hacimGecmisi[tarihStr]['Bacak'] > 0) son7GundeBacakYapildiMi = true;
        if (hacimGecmisi[tarihStr]['Kardiyo'] > 0) son7GundeKardiyoYapildiMi = true;
      }
    }

    // 3. İcraat yoksa cezayı kes!
    if (!son7GundeBacakYapildiMi && !son7GundeKardiyoYapildiMi) return t('warn_no_legs_cardio');
    if (!son7GundeBacakYapildiMi) return t('warn_no_legs');
    if (!son7GundeKardiyoYapildiMi) return t('warn_no_cardio');
     
    return null; 
  };

  const uyariMesaji = dusmanBolgeAnalizEt();

  const dun = new Date(); dun.setDate(dun.getDate() - 1);
  const dunkuIndeks = dun.getDay();
  const dununAdi = gunler[dunkuIndeks === 0 ? 6 : dunkuIndeks - 1];

  const dunTamamlananBolgeler = Array.from(new Set(
    program[dununAdi].filter((h: any) => h.tamamlandi).map((h: any) => h.bolge)
  ));

  const bugunPlanlananBolgeler = Array.from(new Set(
    filtrelenmisGunlukListe.map((h: any) => h.bolge)
  ));

  const asiriAntrenmanRiskleri = bugunPlanlananBolgeler.filter((bolge: any) => 
    dunTamamlananBolgeler.includes(bolge) && bolge !== 'Kardiyo' && bolge !== 'Core'
  );

  let kocMesaji = t('msg_balanced');
  let kocDurumu = "iyi"; 

  if (asiriAntrenmanRiskleri.length > 0) {
    const bolgelerStr = asiriAntrenmanRiskleri.map(b => getBolgeIsmi(String(b))).join(', ');
    kocMesaji = t('msg_overtrain', { muscles: bolgelerStr });
    kocDurumu = "uyari";
  } else if (durum === t('status_tired') || durum === t('status_sore')) {
      if(sikintiliBolge !== '') {
        const aiOneriler: any = {
          'Göğüs': t('advice_chest'), 'Sırt': t('advice_back'), 'Bacak': t('advice_legs'),
          'Kol': t('advice_arms'), 'Omuz': t('advice_shoulders'), 'Core': t('advice_core'),
          'Kardiyo': t('advice_cardio'), 'Tüm Vücut': t('advice_fullbody')
        };
        kocMesaji = t('msg_resting', { region: getBolgeIsmi(sikintiliBolge), advice: aiOneriler[sikintiliBolge] || t('advice_default') });
        kocDurumu = "bilgi";
      } else {
        kocMesaji = t('msg_revize');
        kocDurumu = "bilgi";
      }
  } else if (filtrelenmisGunlukListe.length === 0) {
    kocMesaji = t('msg_rest_day');
    kocDurumu = "bilgi";
  }

  // --- 📈 İSTATİSTİK VE GRAFİK HESAPLAMALARI ---
  let aktifGunler: string[] = [];

  const grafikVerisi = gunler.map(gun => {
    let oGunTamamlanan = 0;
    program[gun].forEach((h: any) => {
      if (h.tamamlandi) oGunTamamlanan++;
    });
    if (oGunTamamlanan > 0) aktifGunler.push(gun);
    return { gunKisa: getGunIsmi(gun, true), tamamlanan: oGunTamamlanan };
  });

  const maxGrafikDegeri = Math.max(...grafikVerisi.map(v => v.tamamlanan), 1);

  const toplamTamamlanan = genelIstatistikler.toplam || 0;
  
  let enCokCalisilanBolgeAnahtari = "";
  let maxAntrenmanSayisi = 0;

  if (genelIstatistikler.bolgeler) {
    Object.keys(genelIstatistikler.bolgeler).forEach((key) => {
      if (genelIstatistikler.bolgeler[key] > maxAntrenmanSayisi) {
        maxAntrenmanSayisi = genelIstatistikler.bolgeler[key];
        enCokCalisilanBolgeAnahtari = key;
      }
    });
  }

  const enCokCalisilanBolge = enCokCalisilanBolgeAnahtari !== "" 
    ? getBolgeIsmi(enCokCalisilanBolgeAnahtari) 
    : "-";

  const gecmisTarihler = Object.keys(hacimGecmisi).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const seciliGecmis = gecmisTarihler.filter(tarih => hacimGecmisi[tarih] && hacimGecmisi[tarih][grafikBolge] > 0).slice(-7); 

  const cizimVerisi = seciliGecmis.map(tarih => {
    const d = new Date(tarih);
    const kisaTarih = `${d.getDate()}/${d.getMonth()+1}`; 
    return { etiket: kisaTarih, hacim: hacimGecmisi[tarih][grafikBolge] };
  });

  const gercekCizimVerisi = cizimVerisi.length > 0 ? cizimVerisi : [{etiket: '-', hacim: 0}];
  const maxHacimDegeri = Math.max(...gercekCizimVerisi.map(v => v.hacim), 1);

  const theme = {
    bg: isDarkMode ? '#111827' : '#F3F4F6', card: isDarkMode ? '#1F2937' : '#FFFFFF',
    textMain: isDarkMode ? '#F9FAFB' : '#1F2937', textSub: isDarkMode ? '#9CA3AF' : '#6B7280',
    border: isDarkMode ? '#374151' : '#E5E7EB', inputBg: isDarkMode ? '#374151' : '#FFFFFF',
    buttonBg: isDarkMode ? '#374151' : '#E5E7EB',
    kocIyiArka: isDarkMode ? '#064E3B' : '#ECFDF5', kocIyiYazi: isDarkMode ? '#34D399' : '#059669',
    kocUyariArka: isDarkMode ? '#7F1D1D' : '#FEF2F2', kocUyariYazi: isDarkMode ? '#FCA5A5' : '#DC2626',
    kocBilgiArka: isDarkMode ? '#1E3A8A' : '#EFF6FF', kocBilgiYazi: isDarkMode ? '#93C5FD' : '#2563EB',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
       
      <Modal visible={!!uyariMesaji && !dusmanPopUpGizlendi && aktifSayfa === 'AnaSayfa'} transparent={true} animationType="fade">
        <View style={styles.modalArkaPlan}>
          <View style={[styles.modalKutu, { backgroundColor: isDarkMode ? '#450a0a' : '#FEF2F2', borderColor: '#EF4444', borderWidth: 2 }]}>
            <Text style={{fontSize: 45, textAlign: 'center', marginBottom: 10}}>⚠️</Text>
            <Text style={[styles.modalBaslik, { color: isDarkMode ? '#fca5a5' : '#B91C1C' }]}>{t('enemy_alert_title')}</Text>
            <Text style={[styles.modalAltBaslik, { color: isDarkMode ? '#fef2f2' : '#111827', fontWeight: 'bold', fontSize: 16 }]}>
              {uyariMesaji}
            </Text>
            <Text style={{ color: isDarkMode ? '#fca5a5' : '#7F1D1D', fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginBottom: 20 }}>
              {t('enemy_alert_sub')}
            </Text>
            {/* 🧠 GÜNCELLEME: Butona basıldığında artık bu hafta için uyarıyı susturacak */}
            <TouchableOpacity style={{ backgroundColor: '#EF4444', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center' }} onPress={uyariyiKapat}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{t('enemy_btn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={hedefHareket !== null} transparent={true} animationType="fade">
        <View style={styles.modalArkaPlan}>
          <View style={[styles.modalKutu, { backgroundColor: theme.card }]}>
            
            {/* 1. BAŞLIKLAR */}
            <Text style={[styles.modalBaslik, { color: theme.textMain }]}>{hedefHareket ? getHareketIsmi(hedefHareket) : ''}</Text>
            <Text style={[styles.modalAltBaslik, { color: theme.textSub, marginBottom: 15 }]}>{t('modal_target_title')}</Text>

            {/* 2. 🤸 İŞTE O SİHİRLİ KALİSTENİK ANAHTARI BURADA DURMALI */}
            <View style={{flexDirection: 'row', backgroundColor: theme.inputBg, borderRadius: 10, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: theme.border}}>
              <TouchableOpacity style={{flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: !vucutAgirligiMi ? theme.buttonBg : 'transparent'}} onPress={() => setVucutAgirligiMi(false)}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', color: !vucutAgirligiMi ? theme.textMain : theme.textSub}}>{t('mode_weight')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: vucutAgirligiMi ? theme.buttonBg : 'transparent'}} onPress={() => setVucutAgirligiMi(true)}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', color: vucutAgirligiMi ? theme.textMain : theme.textSub}}>{t('mode_bw')}</Text>
              </TouchableOpacity>
            </View>

            {/* 3. KUTUCUKLAR (Seçilen moda göre isimleri değişir) */}
            <View style={styles.modalGirdiSatiri}>
              <View style={styles.modalGirdiKutusu}>
                <Text style={[styles.formBaslik, { color: theme.textMain }]}>{t('label_set')}</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} value={setSayisi} onChangeText={setSetSayisi} keyboardType="numeric" />
              </View>
              <View style={styles.modalGirdiKutusu}>
                <Text style={[styles.formBaslik, { color: theme.textMain, fontSize: 13 }]}>{vucutAgirligiMi ? t('label_rep_sec') : t('label_rep')}</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} value={tekrarSayisi} onChangeText={setTekrarSayisi} keyboardType="numeric" />
              </View>
              <View style={styles.modalGirdiKutusu}>
                <Text style={[styles.formBaslik, { color: theme.textMain, fontSize: 13 }]}>{vucutAgirligiMi ? t('label_extra_kg') : t('label_kg')}</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} value={agirlik} onChangeText={setAgirlik} keyboardType="numeric" placeholder={vucutAgirligiMi ? "0" : "60"} placeholderTextColor={theme.textSub} />
              </View>
            </View>

            {/* 4. KAYDET VE İPTAL BUTONLARI */}
            <View style={{flexDirection: 'row', gap: 10, marginTop: 15}}>
              <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#10B981', paddingVertical: 12}]} onPress={hareketProgramKayıt}>
                <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>{t('btn_save')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#EF4444', paddingVertical: 12}]} onPress={() => setHedefHareket(null)}>
                <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>{t('btn_cancel')}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <Modal visible={isinmaModalAcik} transparent={true} animationType="slide">
        <View style={styles.modalArkaPlan}>
          <View style={[styles.rutinModalKutu, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalBaslik, { color: theme.textMain }]}>{t('modal_warmup_title')}</Text>
            <Text style={[styles.modalAltBaslik, { color: theme.textSub }]}>{t('modal_warmup_desc')}</Text>
            <ScrollView style={{maxHeight: 300, width: '100%', marginBottom: 15}}>
              {gunlukOzelIsinma.map((item) => (
                <View key={item.id} style={[styles.rutinSatiri, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Text style={[styles.rutinIsim, { color: theme.textMain }]}>• {t(`rout_${item.id}`, { defaultValue: item.isim })}</Text>
                  <Text style={styles.rutinSure}>{getSureCevirisi(item.sure)}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.rutinKapatButonu} onPress={() => setIsinmaModalAcik(false)}>
              <Text style={styles.rutinKapatYazi}>{t('btn_start')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={sogumaModalAcik} transparent={true} animationType="slide">
        <View style={styles.modalArkaPlan}>
          <View style={[styles.rutinModalKutu, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalBaslik, { color: theme.textMain }]}>{t('modal_cooldown_title')}</Text>
            <Text style={[styles.modalAltBaslik, { color: theme.textSub }]}>{t('modal_cooldown_desc')}</Text>
            <ScrollView style={{maxHeight: 300, width: '100%', marginBottom: 15}}>
              {gunlukOzelSoguma.map((item) => (
                <View key={item.id} style={[styles.rutinSatiri, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Text style={[styles.rutinIsim, { color: theme.textMain }]}>• {t(`rout_${item.id}`, { defaultValue: item.isim })}</Text>
                  <Text style={styles.rutinSure}>{getSureCevirisi(item.sure)}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.rutinKapatButonu} onPress={() => setSogumaModalAcik(false)}>
              <Text style={styles.rutinKapatYazi}>{t('btn_finish')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {dinlenmeSuresi > 0 && (
        <View style={styles.kronometreBar}>
          <Text style={styles.kronometreYazi}>
            ⏳ {Math.floor(dinlenmeSuresi / 60)}:{dinlenmeSuresi % 60 < 10 ? '0' : ''}{dinlenmeSuresi % 60}
          </Text>
        </View>
      )}

      {/* HEADER (BAŞLIK) */}
      <View style={styles.headerBox}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={[styles.title, { color: theme.textMain }]}>{t('app_name')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSub }]}>
              {aktifSayfa === 'AnaSayfa' ? t('subtitle_home') : aktifSayfa === 'Program' ? t('subtitle_library') : t('subtitle_stats')}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity style={[styles.temaButonu, { backgroundColor: theme.buttonBg }]} onPress={dilDegistir}>
              <Text style={styles.temaButonuYazi}>{aktifDil === 'tr' ? '🇹🇷' : '🇬🇧'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.temaButonu, { backgroundColor: theme.buttonBg }]} onPress={temaDegistir}>
              <Text style={styles.temaButonuYazi}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {aktifSayfa === 'AnaSayfa' && (
        <View style={styles.sayfaIcerigi}>
          <ScrollView style={styles.listBox} showsVerticalScrollIndicator={false}>
             
            {/* KOMPAKT ARAÇLAR KISMI */}
            <View style={{ paddingBottom: 10 }}>
               
              {/* 1. KOMPAKT YAPAY ZEKA KOÇU */}
              <View style={[styles.kocKartiKompakt, kocDurumu === 'uyari' ? {backgroundColor: theme.kocUyariArka, borderColor: theme.kocUyariYazi} : kocDurumu === 'bilgi' ? {backgroundColor: theme.kocBilgiArka, borderColor: theme.kocBilgiYazi} : {backgroundColor: theme.kocIyiArka, borderColor: theme.kocIyiYazi}]}>
                <Text style={{fontSize: 22, marginRight: 8}}>{kocDurumu === 'uyari' ? '⚠️' : kocDurumu === 'bilgi' ? '🧠' : '🤖'}</Text>
                <Text style={[styles.kocMesajiKompakt, kocDurumu === 'uyari' ? {color: theme.kocUyariYazi} : kocDurumu === 'bilgi' ? {color: theme.kocBilgiYazi} : {color: theme.kocIyiYazi}]}>{kocMesaji}</Text>
              </View>
               
              {/* 2. KOMPAKT SU TAKİBİ */}
              <View style={[styles.suKutusuKompakt, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                <View style={styles.suBaslikSatiriKompakt}>
                  <Text style={[styles.suBaslikKompakt, { color: theme.textMain }]}>💧 {suGecmisi[bugununAdi]} / 2000 ml</Text>
                  <View style={{flexDirection: 'row', gap: 8}}>
                    <TouchableOpacity onPress={() => suGuncelle(-250)} style={styles.suKucukButonGeri}>
                      <Text style={styles.suKucukButonYaziGeri}>- 250</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => suGuncelle(250)} style={styles.suKucukButonEkle}>
                      <Text style={styles.suKucukButonYaziEkle}>+ 250 ml</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.suBarArkaKompakt, { backgroundColor: theme.buttonBg }]}>
                  <View style={[styles.suBarDolum, { width: `${Math.min((suGecmisi[bugununAdi] / 2000) * 100, 100)}%` }]} />
                </View>
              </View>

              {/* 3. KOMPAKT DUYGU DURUMU & BÖLGE SEÇİMİ */}
              <View style={styles.questionBoxKompakt}>
                <Text style={[styles.questionTextKompakt, { color: theme.textSub }]}>{t('how_are_you')}</Text>
                <View style={styles.buttonRowKompakt}>
                  <TouchableOpacity style={[styles.buttonKompakt, {backgroundColor: theme.buttonBg}, durum === t('status_great') && styles.buttonKompaktAktif]} onPress={() => { setDurum(t('status_great')); setSikintiliBolge(''); }}>
                    <Text style={[styles.buttonTextKompakt, {color: durum === t('status_great') ? '#FFF' : theme.textMain}]}>{t('status_great')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonKompakt, {backgroundColor: theme.buttonBg}, durum === t('status_tired') && styles.buttonKompaktAktif]} onPress={() => setDurum(t('status_tired'))}>
                    <Text style={[styles.buttonTextKompakt, {color: durum === t('status_tired') ? '#FFF' : theme.textMain}]}>{t('status_tired')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonKompakt, {backgroundColor: theme.buttonBg}, durum === t('status_sore') && styles.buttonKompaktAktif]} onPress={() => setDurum(t('status_sore'))}>
                    <Text style={[styles.buttonTextKompakt, {color: durum === t('status_sore') ? '#FFF' : theme.textMain}]}>{t('status_sore')}</Text>
                  </TouchableOpacity>
                </View>

                {(durum === t('status_sore') || durum === t('status_tired')) && (
                  <View style={styles.sorunluBolgeKutusuKompakt}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {gercekBolgeler.map((bolge) => (
                        <TouchableOpacity key={bolge} style={[styles.kategoriButonuKompakt, { backgroundColor: theme.buttonBg, borderColor: theme.border }, sikintiliBolge === bolge && styles.kategoriButonuAktifKompakt]} onPress={() => setSikintiliBolge(bolge)}>
                          <Text style={[styles.kategoriYaziKompakt, { color: theme.textMain }, sikintiliBolge === bolge && styles.kategoriYaziAktifKompakt]}>{getBolgeIsmi(bolge)}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <Text style={[styles.listTitle, { color: theme.textMain, marginTop: 10 }]}>{t('list_title', { day: getGunIsmi(bugununAdi) })}</Text>

              {filtrelenmisGunlukListe.length > 0 && (
                <TouchableOpacity style={[styles.isinmaTetikleyici, isDarkMode && { backgroundColor: '#431407', borderColor: '#7C2D12' }]} onPress={() => setIsinmaModalAcik(true)}>
                  <Text style={[styles.isinmaTetikleyiciYazi, isDarkMode && { color: '#FDBA74' }]}>{t('warmup_trigger')}</Text>
                </TouchableOpacity>
              )}
            </View>
             
            {filtrelenmisGunlukListe.length === 0 ? (
               <Text style={styles.emptyText}>{t('empty_list')}</Text>
            ) : (
               filtrelenmisGunlukListe.map((item: any) => {
                 const gorunenIsim = item.refId 
                    ? (i18n.exists(`ex_${item.refId}`) ? t(`ex_${item.refId}`) : item.isim) 
                    : getHareketIsmi(item);
                    const tekrarMetni = item.isBodyweight ? t('label_rep_sec') : t('label_rep');
                    const agirlikMetni = item.isBodyweight 
                    ? (item.agirlik && item.agirlik !== '0' ? `BW + ${item.agirlik}kg` : t('text_bw'))
                    : (item.agirlik ? `${item.agirlik} kg` : '');

                 return (
                  <View key={item.id} style={[styles.hareketKutu, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }, item.tamamlandi && [styles.hareketKutuTamamlandi, isDarkMode && { backgroundColor: '#111827' }]]}>
                    <View style={styles.hareketSolKisim}>
                      <TouchableOpacity style={[styles.checkButonu, { borderColor: theme.border }, item.tamamlandi && styles.checkButonuAktif]} onPress={() => hareketTamamla(bugununAdi, item.id)}>
                        {item.tamamlandi && <Text style={styles.checkYazi}>✓</Text>}
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}> 
                        <Text style={[styles.hareketIsim, { color: theme.textMain }, item.tamamlandi && styles.hareketIsimTamamlandi]}>
                          {gorunenIsim}
                        </Text>
                        <Text style={[styles.hareketBolge, { color: theme.textSub }]}>
                          {getBolgeIsmi(item.bolge)}  •  {item.set ? `${item.set} Set x ${item.tekrar} ${tekrarMetni}` : ''} 
                          {agirlikMetni ? ` | ${agirlikMetni}` : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity style={styles.silButonu} onPress={() => hareketiDuzenle(item, bugununAdi)}>
                        <Text style={styles.silButonuYazi}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.silButonu} onPress={() => programdanSil(bugununAdi, item.id)}>
                        <Text style={styles.silButonuYazi}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
               )})
            )}

            {filtrelenmisGunlukListe.length > 0 && (
              <TouchableOpacity style={[styles.sogumaTetikleyici, isDarkMode && { backgroundColor: '#064E3B', borderColor: '#065F46' }, hepsiTamamlandi && styles.sogumaTetikleyiciAktif]} onPress={() => setSogumaModalAcik(true)}>
                <Text style={[styles.sogumaTetikleyiciYazi, isDarkMode && { color: '#6EE7B7' }, hepsiTamamlandi && styles.sogumaTetikleyiciYaziAktif]}>
                  {hepsiTamamlandi ? t('cooldown_finished') : t('cooldown_trigger')}
                </Text>
              </TouchableOpacity>
            )}

            <View style={{height: 30}} />
          </ScrollView>
        </View>
      )}

      {aktifSayfa === 'Program' && (
        <View style={styles.sayfaIcerigi}>
          <View style={styles.formKutusu}>
            {!ozelEkleAcik ? (
              <TouchableOpacity style={[styles.ozelEkleAcmaButonu, isDarkMode && { backgroundColor: '#312E81', borderColor: '#4338CA' }]} onPress={() => setOzelEkleAcik(true)}>
                <Text style={[styles.ozelEkleAcmaYazi, isDarkMode && { color: '#A5B4FC' }]}>{t('add_custom_btn')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.ozelHareketFormu, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.formBaslik, { color: theme.textMain }]}>{t('label_custom_name')}</Text>
                <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder="Örn: Bulgarian Split Squat" placeholderTextColor={theme.textSub} value={ozelIsim} onChangeText={setOzelIsim} />
                <Text style={[styles.formBaslik, { color: theme.textMain }]}>{t('label_custom_region')}</Text>
                <View style={styles.yatayKutuForm}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {gercekBolgeler.map((bolge) => (
                      <TouchableOpacity key={bolge} style={[styles.kategoriButonu, { backgroundColor: theme.buttonBg, borderColor: theme.border }, ozelBolge === bolge && styles.kategoriButonuAktif]} onPress={() => setOzelBolge(bolge)}>
                        <Text style={[styles.kategoriYazi, { color: theme.textMain }, ozelBolge === bolge && styles.kategoriYaziAktif]}>{getBolgeIsmi(bolge)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                  <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#10B981', paddingVertical: 12}]} onPress={ozelHareketKaydet}>
                    <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>{t('btn_save')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.ekleButonu, {flex: 1, backgroundColor: '#EF4444', paddingVertical: 12}]} onPress={() => setOzelEkleAcik(false)}>
                    <Text style={[styles.ekleButonuYazi, {textAlign: 'center'}]}>{t('btn_cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.yatayKutu}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {gunler.map((gun) => (
                  <TouchableOpacity key={gun} style={[styles.gunButonu, { backgroundColor: theme.buttonBg }, seciliGun === gun && styles.gunButonuAktif]} onPress={() => setSeciliGun(gun)}>
                    <Text style={[styles.gunYazi, { color: theme.textMain }, seciliGun === gun && styles.gunYaziAktif]}>{getGunIsmi(gun)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.yatayKutu}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {kategoriler.map((kat) => (
                  <TouchableOpacity key={kat} style={[styles.kategoriButonu, { backgroundColor: theme.buttonBg, borderColor: theme.border }, seciliKategori === kat && styles.kategoriButonuAktif]} onPress={() => setSeciliKategori(kat)}>
                    <Text style={[styles.kategoriYazi, { color: theme.textMain }, seciliKategori === kat && styles.kategoriYaziAktif]}>{getBolgeIsmi(kat)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput style={[styles.aramaKutusu, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border }]} placeholder={t('search_placeholder')} placeholderTextColor={theme.textSub} value={aramaMetni} onChangeText={setAramaMetni} />

            <FlatList 
              data={filtrelenmisKutuphane}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                const hareketOrijinalMi = baslangicKutuphanesi.some((orjinalHareket) => orjinalHareket.id === item.id);
                const tipCeviri = item.tip === 'Zorlu' ? t('type_hard') : item.tip === 'Güvenli' ? t('type_safe') : item.tip;
                
                return (
                  <View style={[styles.listeSatiri, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.listeIsim, { color: theme.textMain }]}>{getHareketIsmi(item)}</Text>
                      <Text style={[styles.listeBolge, { color: theme.textSub }]}>{getBolgeIsmi(item.bolge)} • {tipCeviri}</Text>
                    </View>
                    <View style={styles.kutuphaneAksiyonKutusu}>
                      {!hareketOrijinalMi && (
                        <TouchableOpacity style={[styles.kutuphaneSilButonu, isDarkMode && { backgroundColor: '#7F1D1D' }]} onPress={() => kutuphanedenSil(item.id)}>
                          <Text style={styles.kutuphaneSilYazi}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={[styles.ekleButonu, isDarkMode && { backgroundColor: '#374151' }]} onPress={() => kütüphanedenEkle(item)}>
                        <Text style={styles.ekleButonuYazi}>{t('btn_add')}</Text>
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
          <ScrollView style={styles.profilIcerigi} showsVerticalScrollIndicator={false}>
            <View style={{flexDirection: 'row', gap: 15}}>
              <View style={[styles.istatistikKarti, { flex: 1, backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                <Text style={styles.istatistikSayi}>{toplamTamamlanan}</Text>
                <Text style={[styles.istatistikBaslik, { color: theme.textSub }]}>{t('stat_finished')}</Text>
              </View>
              <View style={[styles.istatistikKarti, { flex: 1, backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                <Text style={[styles.istatistikSayi, {fontSize: 22, color: '#3B82F6', marginTop: 10}]}>{enCokCalisilanBolge}</Text>
                <Text style={[styles.istatistikBaslik, { color: theme.textSub }]}>{t('stat_fav_region')}</Text>
              </View>
            </View>

            <View style={[styles.grafikKarti, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.grafikBaslik, { color: theme.textMain }]}>{t('stat_weekly_chart')}</Text>
              <View style={styles.grafikSatiri}>
                {grafikVerisi.map((veri, index) => {
                  const sutunBoyu = maxGrafikDegeri > 0 ? (veri.tamamlanan / maxGrafikDegeri) * 70 : 0;
                  return (
                    <View key={index} style={styles.grafikSutunAlani}>
                      <Text style={[styles.grafikRakam, { color: theme.textSub }]}>{veri.tamamlanan}</Text>
                      <View style={[styles.grafikSutun, { height: `${sutunBoyu}%`, minHeight: 4, backgroundColor: veri.tamamlanan > 0 ? '#3B82F6' : theme.buttonBg }]} />
                      <Text style={[styles.grafikGun, { color: theme.textSub }]}>{veri.gunKisa}</Text>
                    </View>
                  )
                })}
              </View>
            </View>

            {/* 📈 YENİ: TARİHSEL HACİM GRAFİĞİ VE BÖLGE FİLTRESİ */}
            <View style={[styles.grafikKarti, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.grafikBaslik, { color: theme.textMain }]}>{t('stat_volume_chart')}</Text>
              <Text style={{color: theme.textSub, fontSize: 12, marginBottom: 15, marginTop: -15}}>{t('stat_volume_sub')}</Text>
              
              {/* BÖLGE FİLTRESİ BUTONLARI */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 20, maxHeight: 40}}>
                {['Tümü', ...gercekBolgeler].map((bolge) => (
                  <TouchableOpacity key={bolge} style={[styles.kategoriButonu, { backgroundColor: theme.buttonBg, borderColor: theme.border }, grafikBolge === bolge && styles.kategoriButonuAktif]} onPress={() => setGrafikBolge(bolge)}>
                    <Text style={[styles.kategoriYazi, { color: theme.textMain }, grafikBolge === bolge && styles.kategoriYaziAktif]}>{getBolgeIsmi(bolge)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.grafikSatiri}>
                {gercekCizimVerisi.map((veri, index) => {
                  const sutunBoyu = maxHacimDegeri > 0 ? (veri.hacim / maxHacimDegeri) * 70 : 0;
                  return (
                    <View key={index} style={styles.grafikSutunAlani}>
                      <Text style={[styles.grafikRakam, { color: theme.textSub, fontSize: 10 }]}>
                        {veri.hacim > 0 ? (veri.hacim >= 1000 ? (veri.hacim/1000).toFixed(1)+'k' : veri.hacim) : '0'}
                      </Text>
                      <View style={[styles.grafikSutun, { height: `${sutunBoyu}%`, minHeight: 4, backgroundColor: veri.hacim > 0 ? '#8B5CF6' : theme.buttonBg }]} />
                      <Text style={[styles.grafikGun, { color: theme.textSub }]}>{veri.etiket}</Text>
                    </View>
                  )
                })}
              </View>
            </View>

            <View style={[styles.streakKarti, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.streakBaslik, { color: theme.textMain }]}>{t('stat_streak_title')}</Text>
              <Text style={[styles.streakAltBaslik, { color: theme.textSub }]}>{t('stat_streak_sub')}</Text>
              <View style={styles.streakSatiri}>
                {gunler.map((gun) => {
                  const bugunAktifMi = aktifGunler.includes(gun);
                  const kisaGun = getGunIsmi(gun, true).substring(0, 1);
                  return (
                    <View key={gun} style={[styles.streakKutusu, { backgroundColor: theme.buttonBg }, bugunAktifMi && styles.streakKutusuAktif]}>
                      <Text style={[styles.streakGunYazi, { color: theme.textSub }, bugunAktifMi && styles.streakGunYaziAktif]}>{kisaGun}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            {/* 📥 DIŞA AKTAR BUTONU */}
            <TouchableOpacity 
              style={{ backgroundColor: '#10B981', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 30 }} 
              onPress={verileriDisaAktar}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{t('btn_export')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <View style={[styles.altMenu, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.menuButonu} onPress={() => setAktifSayfa('AnaSayfa')}>
          <Text style={[styles.menuYazi, aktifSayfa === 'AnaSayfa' && styles.menuAktifYazi]}>🏠 {t('menu_home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButonu} onPress={() => setAktifSayfa('Program')}>
          <Text style={[styles.menuYazi, aktifSayfa === 'Program' && styles.menuAktifYazi]}>🏋️ {t('menu_library')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButonu} onPress={() => setAktifSayfa('Profil')}>
          <Text style={[styles.menuYazi, aktifSayfa === 'Profil' && styles.menuAktifYazi]}>👤 {t('menu_profile')}</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
   
  headerBox: { width: '90%', marginBottom: 5, marginTop: 40, alignSelf: 'center' },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 2 },
  temaButonu: { padding: 10, borderRadius: 12, justifyContent: 'center', alignItems: 'center', width: 44, height: 44 },
  temaButonuYazi: { fontSize: 18 },

  kocKartiKompakt: { padding: 10, borderRadius: 12, marginBottom: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  kocMesajiKompakt: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '500' },

  suKutusuKompakt: { padding: 12, borderRadius: 12, marginBottom: 15 },
  suBaslikSatiriKompakt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  suBaslikKompakt: { fontSize: 14, fontWeight: 'bold' },
  suKucukButonEkle: { backgroundColor: '#3B82F6', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  suKucukButonYaziEkle: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  suKucukButonGeri: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  suKucukButonYaziGeri: { color: '#EF4444', fontWeight: 'bold', fontSize: 12 },
  suBarArkaKompakt: { height: 10, borderRadius: 5, overflow: 'hidden' },
   
  questionBoxKompakt: { width: '100%', marginBottom: 15 },
  questionTextKompakt: { fontSize: 13, fontWeight: '600', marginBottom: 8, fontStyle: 'italic' },
  buttonRowKompakt: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  buttonKompakt: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  buttonKompaktAktif: { backgroundColor: '#3B82F6', borderColor: '#2563EB' },
  buttonTextKompakt: { fontWeight: 'bold', fontSize: 13 },
   
  sorunluBolgeKutusuKompakt: { marginTop: 10, width: '100%' },
  kategoriButonuKompakt: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 8, borderWidth: 1 },
  kategoriButonuAktifKompakt: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  kategoriYaziKompakt: { fontSize: 12, fontWeight: '600' },
  kategoriYaziAktifKompakt: { color: '#FFF' },

  kronometreBar: { backgroundColor: '#3B82F6', width: '90%', padding: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 20, marginTop: 20, marginBottom: -5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  kronometreYazi: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  profilIcerigi: { width: '90%', flex: 1, marginTop: 10, alignSelf: 'center' },
  istatistikKarti: { padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  istatistikSayi: { fontSize: 36, fontWeight: 'bold', color: '#10B981' },
  istatistikBaslik: { fontSize: 14, marginTop: 5, fontWeight: '600' },
   
  grafikKarti: { padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  grafikBaslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  grafikSatiri: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, width: '100%' },
  grafikSutunAlani: { alignItems: 'center', flex: 1 },
  grafikRakam: { fontSize: 12, marginBottom: 5, fontWeight: 'bold' },
  grafikSutun: { width: 22, borderRadius: 10 },
  grafikGun: { fontSize: 12, marginTop: 8, fontWeight: '600' },

  streakKarti: { padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginBottom: 30 },
  streakBaslik: { fontSize: 18, fontWeight: 'bold' },
  streakAltBaslik: { fontSize: 13, marginTop: 5, marginBottom: 15 },
  streakSatiri: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  streakKutusu: { width: 35, height: 35, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  streakKutusuAktif: { backgroundColor: '#10B981' },
  streakGunYazi: { fontSize: 14, fontWeight: 'bold' },
  streakGunYaziAktif: { color: 'white' },

  modalArkaPlan: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalKutu: { width: '85%', padding: 25, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  rutinModalKutu: { width: '90%', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalBaslik: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  modalAltBaslik: { fontSize: 14, textAlign: 'center', marginTop: 5, marginBottom: 15 },
  modalGirdiSatiri: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, 
  modalGirdiKutusu: { flex: 1 },

  rutinSatiri: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 10, marginBottom: 8, width: '100%', borderWidth: 1 },
  rutinIsim: { fontSize: 15, fontWeight: '600', flex: 1 },
  rutinSure: { fontSize: 14, fontWeight: 'bold', color: '#3B82F6' },
  rutinKapatButonu: { backgroundColor: '#3B82F6', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 10 },
  rutinKapatYazi: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  isinmaTetikleyici: { padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, alignItems: 'center' },
  isinmaTetikleyiciYazi: { fontWeight: 'bold', fontSize: 16 },
  sogumaTetikleyici: { padding: 15, borderRadius: 12, marginTop: 5, marginBottom: 20, borderWidth: 1, alignItems: 'center' },
  sogumaTetikleyiciAktif: { backgroundColor: '#10B981', borderColor: '#059669' },
  sogumaTetikleyiciYazi: { fontWeight: 'bold', fontSize: 16 },
  sogumaTetikleyiciYaziAktif: { color: '#FFFFFF', fontSize: 16 },

  sayfaIcerigi: { flex: 1, alignItems: 'center', paddingTop: 0, width: '100%' }, 

  listBox: { flex: 1, width: '90%' },
  listTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#6B7280', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }, 
   
  hareketKutu: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  hareketKutuTamamlandi: { opacity: 0.5 },
  hareketSolKisim: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
   
  checkButonu: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  checkButonuAktif: { backgroundColor: '#10B981', borderColor: '#10B981' }, 
  checkYazi: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
   
  hareketIsim: { fontSize: 16, fontWeight: 'bold' },
  hareketIsimTamamlandi: { textDecorationLine: 'line-through' },
   
  hareketBolge: { fontSize: 13, marginTop: 3 },
  silButonu: { paddingVertical: 8, paddingHorizontal: 12 },
  silButonuYazi: { fontSize: 18 },
   
  altMenu: { flexDirection: 'row', height: 85, width: '100%', borderTopWidth: 1, justifyContent: 'space-around', alignItems: 'center', paddingBottom: 25 },
  menuButonu: { padding: 10, alignItems: 'center' },
  menuYazi: { fontSize: 15, color: '#9CA3AF', fontWeight: '600' }, 
  menuAktifYazi: { color: '#3B82F6', fontWeight: 'bold' },
   
  formKutusu: { width: '90%', flex: 1 },
  yatayKutu: { flexDirection: 'row', marginBottom: 15, maxHeight: 45 },
  yatayKutuForm: { flexDirection: 'row', marginBottom: 10, maxHeight: 45 }, 
  gunButonu: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, height: 40, justifyContent:'center' },
  gunButonuAktif: { backgroundColor: '#10B981' },
  gunYazi: { fontWeight: '600' },
  gunYaziAktif: { color: '#FFFFFF' },
  kategoriButonu: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, marginRight: 10, borderWidth: 1, height: 38, justifyContent:'center' },
  kategoriButonuAktif: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  kategoriYazi: { fontWeight: '500' },
  kategoriYaziAktif: { color: '#FFFFFF' },
  aramaKutusu: { padding: 12, borderRadius: 10, borderWidth: 1, fontSize: 16, marginBottom: 15 },
   
  listeSatiri: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1 },
  listeIsim: { fontSize: 16, fontWeight: 'bold' },
  listeBolge: { fontSize: 13, marginTop: 4 },
   
  kutuphaneAksiyonKutusu: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kutuphaneSilButonu: { backgroundColor: '#FEE2E2', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  kutuphaneSilYazi: { fontSize: 14 },
   
  ekleButonu: { backgroundColor: '#1F2937', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  ekleButonuYazi: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
   
  ozelEkleAcmaButonu: { backgroundColor: '#E0E7FF', padding: 12, borderRadius: 10, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  ozelEkleAcmaYazi: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
  ozelHareketFormu: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  formBaslik: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  input: { padding: 10, borderRadius: 8, borderWidth: 1, fontSize: 14, marginBottom: 10 },
   
  suBarDolum: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 5 }
});