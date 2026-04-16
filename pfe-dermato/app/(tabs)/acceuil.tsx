import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from "expo-router";
import {
  View, Text, ScrollView, TouchableOpacity, Image, TextInput,
  Modal, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Alert,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/backend/src/api/client';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImage } from '@/backend/src/api/client';
type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';
const BACKEND_BASE_URL = 'http://192.168.1.107:3000';
interface Analysis {
  id: number; date: string; title: string; confidence: number;
  color: string; bgColor: string; img: string; tag: string;
}

interface Conseil {
  id: number;
  titre: string;
  contenu: string;
  type: 'prevention' | 'traitement' | 'urgence' | 'information';
  ordre: number;
}

// ✅ Interface pour les tips généraux (Hydratation, Sommeil, Nutrition...)
interface Tip {
  id: number;
  titre: string;
  valeur: string;   // ex: "8 verres/jour"
  emoji: string;    // ex: "💧"
}

const C = {
  primary:'#00C6A7', primary2:'#00957D', secondary:'#FF6B4A',
  bg:'#F0F6F4', card:'#FFFFFF', text:'#0D2B22',
  textLight:'#7A9E95', inactive:'#C5D9D5',
};

const CONSEIL_ICONS: Record<string, string> = {
  prevention:  '🛡️',
  traitement:  '💊',
  urgence:     '🚨',
  information: '💡',
};

const CONSEIL_COLORS: Record<string, { bg: string; text: string }> = {
  prevention:  { bg: '#e0fdf4', text: '#059669' },
  traitement:  { bg: '#eff6ff', text: '#2563eb' },
  urgence:     { bg: '#fee2e2', text: '#dc2626' },
  information: { bg: '#fef9c3', text: '#ca8a04' },
};

// ─── Fallback tips si la DB ne répond pas ─────────────────────────────────────
const DEFAULT_TIPS: Tip[] = [
  { id:1, titre:'Hydratation', valeur:'8 verres/jour', emoji:'💧' },
  { id:2, titre:'Sommeil',     valeur:'7–9 heures',    emoji:'😴' },
  { id:3, titre:'Nutrition',   valeur:'Antioxydants',  emoji:'🥗' },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconHome = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 3l9 9v9H15v-5H9v5H3v-9z" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinejoin="round" fill={active ? C.primary+'22' : 'none'}/>
  </Svg>
);
const IconClock = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={active ? C.primary : C.inactive} strokeWidth={2}/>
    <Path d="M12 7v5l3.5 3.5" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconBulb = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a7 7 0 00-3.5 13.07V17a1 1 0 001 1h5a1 1 0 001-1v-1.93A7 7 0 0012 2z" stroke={active ? C.primary : C.inactive} strokeWidth={2} fill={active ? C.primary+'22' : 'none'}/>
    <Path d="M10 21h4" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconUser = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={4} stroke={active ? C.primary : C.inactive} strokeWidth={2} fill={active ? C.primary+'22' : 'none'}/>
    <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconCamera = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#fff" strokeWidth={2} strokeLinejoin="round"/>
    <Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={2}/>
  </Svg>
);
const IconChevron = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={C.inactive} strokeWidth={2.5} strokeLinecap="round"/>
  </Svg>
);
const IconAlert = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#d97706" strokeWidth={2} fill="#fef3c7" strokeLinejoin="round"/>
    <Path d="M12 9v4M12 17h.01" stroke="#d97706" strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconForm = ({ done }: { done: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    {done ? (
      <Path d="M5 13l4 4L19 7" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    ) : (
      <>
        <Rect x={4} y={2} width={14} height={18} rx={2} stroke="#ef4444" strokeWidth={2} fill="#fff5f5"/>
        <Path d="M8 8h8M8 12h8M8 16h5" stroke="#ef4444" strokeWidth={1.8} strokeLinecap="round"/>
        <Circle cx={19} cy={5} r={4} fill="#ef4444"/>
        <Path d="M19 3.5v3M19 7.2v.3" stroke="#fff" strokeWidth={1.5} strokeLinecap="round"/>
      </>
    )}
  </Svg>
);

const TAB_ROUTES: Record<TabId, string> = {
  accueil:    '/(tabs)/acceuil',
  historique: '/(tabs)/historique',
  scan:       '/(tabs)/scan',
  conseils:   '/(tabs)/conseil',
  profil:     '/(tabs)/profile',
};

// ─── Composant Principal ──────────────────────────────────────────────────────
export default function HomeScreen() {
  const router   = useRouter();
  const pathname = usePathname();

  const [loading,           setLoading]           = useState(false);
  const [user,              setUser]              = useState<any>(null);
  const [recentAnalyses,    setRecentAnalyses]    = useState<Analysis[]>([]);
  const [stats,             setStats]             = useState([
    { label:'Analyses',    value:'--', icon:'🔬' },
    { label:'Ce mois',     value:'--', icon:'📅' },
    { label:'Score santé', value:'--', icon:'💚' },
  ]);

  //code de 2 icon nouvelle analyse et importation
  const handleDirectCamera = async () => {
  if (!formSubmitted) {
    setShowFormModal(true);
    setFormError(false);
    return;
  }

  try {
    setLoading(true);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        "Veuillez autoriser l'accès à la caméra dans les paramètres de votre téléphone.",
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;

      const res = await analyzeImage(imageUri);
      console.log('REPONSE POST /analyses =', res);

      const analyseId =
        res?.analyseId ??
        res?.id ??
        res?.data?.analyseId ??
        res?.data?.id;

      const imageUrl =
        res?.imageUrl ??
        res?.imageMiniature ??
        res?.data?.imageUrl ??
        res?.data?.imageMiniature ??
        '';

      if (analyseId === undefined || analyseId === null || isNaN(Number(analyseId))) {
        Alert.alert('Erreur', `analyseId invalide reçu du backend: ${String(analyseId)}`);
        return;
      }

      router.push({
        pathname: '/(tabs)/preview',
        params: {
          imageUri,
          imageUrl,
          analyseId: String(analyseId),
          source: 'camera',
        },
      });
    }
  } catch (err: any) {
    console.log('Erreur caméra:', err?.response?.data || err?.message || err);
    Alert.alert('Erreur', "Impossible d'accéder à la caméra");
  } finally {
    setLoading(false);
  }
};

const handleDirectGallery = async () => {
  if (!formSubmitted) {
    setShowFormModal(true);
    setFormError(false);
    return;
  }

  try {
    setLoading(true);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        "Veuillez autoriser l'accès à la galerie dans les paramètres de votre téléphone.",
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;

      const res = await analyzeImage(imageUri);
      console.log('REPONSE POST /analyses =', res);

      const analyseId =
        res?.analyseId ??
        res?.id ??
        res?.data?.analyseId ??
        res?.data?.id;

      const imageUrl =
        res?.imageUrl ??
        res?.imageMiniature ??
        res?.data?.imageUrl ??
        res?.data?.imageMiniature ??
        '';

      if (analyseId === undefined || analyseId === null || isNaN(Number(analyseId))) {
        Alert.alert('Erreur', `analyseId invalide reçu du backend: ${String(analyseId)}`);
        return;
      }

      router.push({
        pathname: '/(tabs)/preview',
        params: {
          imageUri,
          imageUrl,
          analyseId: String(analyseId),
          source: 'gallery',
        },
      });
    }
  } catch (err: any) {
    console.log('Erreur galerie:', err?.response?.data || err?.message || err);
    Alert.alert('Erreur', "Impossible d'accéder à la galerie");
  } finally {
    setLoading(false);
  }
};

  // ✅ Conseils personnalisés (liés à la pathologie)
  const [conseils,         setConseils]         = useState<Conseil[]>([]);
  const [conseilsLoading,  setConseilsLoading]  = useState(true);
  const [lastPathologieId, setLastPathologieId] = useState<number | null>(null);

  // ✅ Tips généraux depuis la DB (Hydratation, Sommeil, Nutrition...)
  const [tips,        setTips]        = useState<Tip[]>(DEFAULT_TIPS);
  const [tipsLoading, setTipsLoading] = useState(true);

  const [formData, setFormData] = useState({
    age:'', sexe:'', antecedents:'', allergies:'',
    traitements:'', dureeLesion:'', symptomes:'',
    zoneCorps:'', observation:'',
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError,     setFormError]     = useState(false);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const displayName = user?.prenom && user?.nom
    ? `${user.prenom} ${user.nom}` : 'Utilisateur';

  const getInitials = () => {
    const p = user?.prenom?.trim() || '';
    const n = user?.nom?.trim()    || '';
    if (p && n) return `${p[0]}${n[0]}`.toUpperCase();
    if (p) return p[0].toUpperCase();
    if (n) return n[0].toUpperCase();
    return 'U';
  };

  const isMedicalFormComplete = (data: typeof formData) => {
    const age = Number(data.age);
    return (
      !!data.age?.trim() && !isNaN(age) && age > 0 && age <= 120 &&
      !!data.sexe?.trim() && !!data.antecedents?.trim() &&
      !!data.dureeLesion?.trim() && !!data.zoneCorps?.trim()
    );
  };

  const getColor   = (s: number) => s >= 85 ? '#10b981' : s >= 70 ? '#f59e0b' : '#ef4444';
  const getBgColor = (s: number) => s >= 85 ? '#d1fae5' : s >= 70 ? '#fef3c7' : '#fee2e2';
  const getTag     = (t: string) => t || 'Faible risque';

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const isActive = (tabId: TabId): boolean => {
    if (tabId === 'accueil') return pathname === '/(tabs)' || pathname === TAB_ROUTES.accueil;
    return pathname.startsWith(TAB_ROUTES[tabId]);
  };

  const goTab = (tabId: TabId) => {
    if (isActive(tabId)) return;
    router.navigate(TAB_ROUTES[tabId] as any);
  };

  // ─── Chargement conseils personnalisés ──────────────────────────────────────
  const loadConseils = async (pathologieId: number | null) => {
  try {
    setConseilsLoading(true);

    if (!pathologieId) {
      setConseils([]);
      return;
    }

    const res = await API.get(`/conseils/pathologie/${pathologieId}`);
    const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    setConseils(list);
  } catch (err: any) {
    console.log('Erreur conseils:', err?.response?.data || err?.message);
    setConseils([]);
  } finally {
    setConseilsLoading(false);
  }
};

  // ✅ Chargement tips généraux depuis la DB
  // Route backend : GET /conseils/tips?limit=3
  // Retourne : [{ id, titre, valeur, emoji }]
  const loadTips = async () => {
  try {
    setTipsLoading(true);

    const res = await API.get('/conseils/tips?limit=3');
    const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);

    if (list.length > 0) {
      setTips(list);
    } else {
      setTips(DEFAULT_TIPS);
    }
  } catch (err: any) {
    console.log('Erreur tips:', err?.response?.data || err?.message);
    setTips(DEFAULT_TIPS);
  } finally {
    setTipsLoading(false);
  }
};

  // ─── Chargement global ───────────────────────────────────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      try {
        // 1. User
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // 2. Dashboard (stats + analyses récentes)
        const dashRes = await API.get('/analyses/dashboard');
        const data    = dashRes.data;

        setStats([
          { label:'Analyses',    value: String(data.totalAnalyses),  icon:'🔬' },
          { label:'Ce mois',     value: String(data.analysesCeMois), icon:'📅' },
          { label:'Score santé', value: `${data.scoreSante}%`,       icon:'💚' },
        ]);

        const analyses = data.recentAnalyses || [];

setRecentAnalyses(
  analyses.map((a: any) => {
    const confidence = Math.round(a.confidence ?? a.scoreConfiance ?? 0);

    const imageUrl =
      a.imageUrl ||
      (a.imageMiniature
        ? `${BACKEND_BASE_URL}/${String(a.imageMiniature).replace(/^\.?\//, '')}`
        : 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=120&h=120&fit=crop');

    return {
      id: a.id,
      date: new Date(a.date || a.creeLe).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      title: a.title || a.classePredite || 'Analyse dermatologique',
      confidence,
      color: getColor(confidence),
      bgColor: getBgColor(confidence),
      img: imageUrl,
      tag: getTag(a.tag || a.niveauUrgence),
    };
  })
);
        // 3. Conseils personnalisés (selon pathologie dernière analyse)
        const derniere = analyses[0];
        const pid: number | null = derniere?.pathologieId ?? null;
        setLastPathologieId(pid);
        await loadConseils(pid);

        // 4. Formulaire médical
        const profileRes = await API.get('/utilisateurs/profil');
        const profile    = profileRes.data;
        const loadedForm = {
          age:         profile.age         ? String(profile.age) : '',
          sexe:        profile.sexe        || '',
          antecedents: profile.antecedents || '',
          allergies:   profile.allergies   || '',
          traitements: profile.traitements || '',
          dureeLesion: profile.dureeLesion || '',
          symptomes:   profile.symptomes   || '',
          zoneCorps:   profile.zoneCorps   || '',
          observation: profile.observation || '',
        };
        setFormData(loadedForm);
        setFormSubmitted(isMedicalFormComplete(loadedForm));

      } catch (error: any) {
        console.log('Erreur chargement:', error?.response?.data || error?.message);
        await loadConseils(null);
      }

      // ✅ 5. Tips généraux (indépendant, garde le fallback si erreur)
      await loadTips();
    };

    loadAll();
  }, []);

  // ─── Formulaire médical ──────────────────────────────────────────────────────
  const normalizeSexe = (value: string) => {
  const v = value.trim().toLowerCase();
  if (v === 'homme') return 'homme';
  if (v === 'femme') return 'femme';
  if (v === 'autre') return 'autre';
  return null;
};
sexe: normalizeSexe(formData.sexe)

  const handleFormSubmit = async () => {
    if (!isMedicalFormComplete(formData)) {
      setFormError(true); setFormSubmitted(false); return;
    }
    try {
      setFormError(false); setLoading(true);
      await API.patch('/utilisateurs/me', {
  age: Number(formData.age),
  sexe: formData.sexe?.trim().toLowerCase() || null,
  antecedents: formData.antecedents?.trim() || null,
  allergies: formData.allergies?.trim() || null,
  traitements: formData.traitements?.trim() || null,
  dureeLesion: formData.dureeLesion?.trim() || null,
  symptomes: formData.symptomes?.trim() || null,
  zoneCorps: formData.zoneCorps?.trim() || null,
  observation: formData.observation?.trim() || null,
});
      setFormSubmitted(true);
      setShowFormModal(false);
    } catch (error: any) {
      console.log('Erreur formulaire:', error?.response?.data || error?.message);
      setFormError(true);
    } finally {
      setLoading(false);
    }
  };

  // ─── Rendu ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Bonjour 👋</Text>
            <Text style={s.userName}>{displayName}</Text>
          </View>
          <View style={s.headerRight}>
            <TouchableOpacity
              onPress={() => { setShowFormModal(true); setFormError(false); }}
              style={[s.iconBtn, formSubmitted ? s.iconBtnGreen : s.iconBtnRed]}
              activeOpacity={0.8}>
              <IconForm done={formSubmitted}/>
              {!formSubmitted && <View style={s.dot}/>}
            </TouchableOpacity>
            <TouchableOpacity style={s.avatar} onPress={() => router.navigate('/(tabs)/profile' as any)}>
              <Text style={s.avatarText}>{getInitials()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS */}
        <View style={s.statsRow}>
          {stats.map((st, i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statEmoji}>{st.icon}</Text>
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionLabel}>Que voulez-vous faire ?</Text>

        {/* CARTES ACTION */}
        <View style={s.cardsRow}>
          <TouchableOpacity activeOpacity={0.88} style={s.cardGreen}
            onPress={handleDirectCamera}>
            <View style={s.cardGlow}/>
            <View style={s.cardIconCircle}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#fff" strokeWidth={2} strokeLinejoin="round"/>
                <Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={2}/>
              </Svg>
            </View>
            <Text style={s.cardTitle}>Nouvelle</Text>
            <Text style={s.cardTitle}>analyse</Text>
            <View style={s.cardChip}><Text style={s.cardChipTxt}>📷 Photo</Text></View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.88} style={s.cardOrange}
            onPress={handleDirectGallery}>
            <View style={[s.cardGlow, { backgroundColor:'rgba(255,255,255,0.12)' }]}/>
            <View style={s.cardIconCircle}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={3} width={18} height={18} rx={3} stroke="#fff" strokeWidth={2}/>
                <Path d="M3 9h18M9 21V9" stroke="#fff" strokeWidth={2}/>
              </Svg>
            </View>
            <Text style={s.cardTitle}>Importer</Text>
            <Text style={[s.cardTitle, { marginBottom:0 }]}> </Text>
            <View style={s.cardChip}><Text style={s.cardChipTxt}>🖼️ Galerie</Text></View>
          </TouchableOpacity>
        </View>

        {/* AVERTISSEMENT */}
        <View style={s.alertBox}>
          <IconAlert/>
          <View style={{ flex:1, marginLeft:10 }}>
            <Text style={s.alertTitle}>Information importante</Text>
            <Text style={s.alertText}>Cette app ne remplace pas un avis médical professionnel.</Text>
          </View>
        </View>

        {/* ANALYSES RÉCENTES */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Analyses récentes</Text>
          <TouchableOpacity style={s.seeAllBtn} onPress={() => goTab('historique')}>
            <Text style={s.seeAllTxt}>Voir tout</Text>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round"/>
            </Svg>
          </TouchableOpacity>
        </View>

        {recentAnalyses.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>Aucune analyse pour l'instant</Text>
          </View>
        ) : recentAnalyses.map((item) => (
          <TouchableOpacity key={item.id} style={s.analysisCard} activeOpacity={0.82}
                          onPress={() =>
                router.push({
                  pathname: '/(tabs)/analysescan',
                  params: { analyseId: String(item.id) },
                })
              }>
            <Image source={{ uri: item.img }} style={s.analysisImg}/>
            <View style={{ flex:1 }}>
              <View style={s.analysisTopRow}>
                <View style={[s.tagBadge, { backgroundColor: item.bgColor }]}>
                  <Text style={[s.tagTxt, { color: item.color }]}>{item.tag}</Text>
                </View>
                <Text style={s.analysisDate}>{item.date}</Text>
              </View>
              <Text style={s.analysisTitle}>{item.title}</Text>
              <View style={s.confidenceRow}>
                <View style={s.confidenceBar}>
                  <View style={[s.confidenceFill, { width:`${item.confidence}%` as any, backgroundColor: item.color }]}/>
                </View>
                <Text style={[s.confidencePct, { color: item.color }]}>{item.confidence}%</Text>
              </View>
            </View>
            <IconChevron/>
          </TouchableOpacity>
        ))}

        {/* ✅ CONSEILS PERSONNALISÉS DEPUIS DB */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionTitle}>Conseils personnalisés</Text>
            <Text style={s.sectionSubtitle}>
              {lastPathologieId ? '📊 Basés sur votre dernière analyse' : '💡 Conseils généraux'}
            </Text>
          </View>
          <TouchableOpacity style={s.seeAllBtn} onPress={() => goTab('conseils')}>
            <Text style={s.seeAllTxt}>Voir tout</Text>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round"/>
            </Svg>
          </TouchableOpacity>
        </View>

        {conseilsLoading ? (
          [1,2].map((i) => (
            <View key={i} style={[s.conseilCard, { opacity:0.4 }]}>
              <View style={[s.conseilLeft, { backgroundColor:'#e5e7eb' }]}/>
              <View style={{ flex:1, gap:8 }}>
                <View style={{ height:14, backgroundColor:'#e5e7eb', borderRadius:7, width:'60%' }}/>
                <View style={{ height:11, backgroundColor:'#e5e7eb', borderRadius:6, width:'90%' }}/>
              </View>
            </View>
          ))
        ) : conseils.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>Aucun conseil disponible</Text>
          </View>
        ) : conseils.map((conseil) => {
          const icon   = CONSEIL_ICONS[conseil.type]  ?? '💡';
          const colors = CONSEIL_COLORS[conseil.type] ?? { bg:'#f0fdf4', text:'#059669' };
          return (
            <View key={conseil.id} style={s.conseilCard}>
              <View style={[s.conseilLeft, { backgroundColor: colors.bg }]}>
                <Text style={{ fontSize:26 }}>{icon}</Text>
              </View>
              <View style={{ flex:1 }}>
                <View style={[s.conseilTypeBadge, { backgroundColor: colors.bg }]}>
                  <Text style={[s.conseilTypeTxt, { color: colors.text }]}>
                    {conseil.type.charAt(0).toUpperCase() + conseil.type.slice(1)}
                  </Text>
                </View>
                <Text style={s.conseilTitle}>{conseil.titre}</Text>
                <Text style={s.conseilText} numberOfLines={3}>{conseil.contenu}</Text>
                <TouchableOpacity style={s.conseilBtn} onPress={() => goTab('conseils')}>
                  <Text style={s.conseilBtnTxt}>En savoir plus →</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* ✅ QUICK TIPS DEPUIS DB (Hydratation, Sommeil, Nutrition...) */}
        <View style={s.tipsRow}>
          {tipsLoading ? (
            // Skeleton
            [1,2,3].map((i) => (
              <View key={i} style={[s.tipCard, { opacity:0.4 }]}>
                <View style={{ width:32, height:32, backgroundColor:'#e5e7eb', borderRadius:16, marginBottom:6 }}/>
                <View style={{ height:12, backgroundColor:'#e5e7eb', borderRadius:6, width:'70%', marginBottom:4 }}/>
                <View style={{ height:10, backgroundColor:'#e5e7eb', borderRadius:5, width:'85%' }}/>
              </View>
            ))
          ) : tips.map((tip) => (
            <View key={tip.id} style={s.tipCard}>
              <Text style={s.tipEmoji}>{tip.emoji}</Text>
              <Text style={s.tipTitle}>{tip.titre}</Text>
              <Text style={s.tipSub}>{tip.valeur}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* ── BOTTOM NAVBAR ── */}
      <View style={s.navbar}>
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('accueil')} activeOpacity={0.7}>
          {isActive('accueil') && <View style={s.tabActiveBg}/>}
          <IconHome active={isActive('accueil')}/>
          <Text style={[s.tabLabel, isActive('accueil') && s.tabLabelActive]}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('historique')} activeOpacity={0.7}>
          {isActive('historique') && <View style={s.tabActiveBg}/>}
          <IconClock active={isActive('historique')}/>
          <Text style={[s.tabLabel, isActive('historique') && s.tabLabelActive]}>Historique</Text>
        </TouchableOpacity>
        <View style={s.fabWrap}>
          <TouchableOpacity style={s.fab} onPress={() => goTab('scan')} activeOpacity={0.85}>
            <IconCamera/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('conseils')} activeOpacity={0.7}>
          {isActive('conseils') && <View style={s.tabActiveBg}/>}
          <IconBulb active={isActive('conseils')}/>
          <Text style={[s.tabLabel, isActive('conseils') && s.tabLabelActive]}>Conseils</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('profil')} activeOpacity={0.7}>
          {isActive('profil') && <View style={s.tabActiveBg}/>}
          <IconUser active={isActive('profil')}/>
          <Text style={[s.tabLabel, isActive('profil') && s.tabLabelActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* ── MODAL FORMULAIRE ── */}
      <Modal visible={showFormModal} animationType="slide" transparent onRequestClose={() => setShowFormModal(false)}>
        <View style={s.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.keyboardView}>
            <View style={s.sheet}>
              <View style={s.sheetHandle}/>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={s.sheetScrollContent}>
                <View style={s.sheetHeader}>
                  <View style={s.sheetIconWrap}><IconForm done={false}/></View>
                  <View>
                    <Text style={s.sheetTitle}>Formulaire médical</Text>
                    <Text style={s.sheetSub}>⚠ Obligatoire avant toute analyse</Text>
                  </View>
                </View>
                {[
                  { key:'age',         label:'Âge *',                  placeholder:'Ex: 32',                      kb:'numeric' },
                  { key:'sexe',        label:'Sexe *',                 placeholder:'Homme / Femme / Autre',        kb:'default' },
                  { key:'antecedents', label:'Antécédents médicaux *', placeholder:'Ex: eczéma, psoriasis...',     kb:'default' },
                  { key:'allergies',   label:'Allergies connues',      placeholder:'Ex: pénicilline...',           kb:'default' },
                  { key:'traitements', label:'Traitements en cours',   placeholder:'Ex: crème, antibiotiques',     kb:'default' },
                  { key:'dureeLesion', label:'Durée de la lésion *',   placeholder:'Ex: 2 semaines',               kb:'default' },
                  { key:'symptomes',   label:'Symptômes',              placeholder:'Ex: douleur, démangeaison',    kb:'default' },
                  { key:'zoneCorps',   label:'Zone du corps *',        placeholder:'Ex: bras, visage',             kb:'default' },
                  { key:'observation', label:'Observation',            placeholder:'Informations supplémentaires', kb:'default' },
                ].map(({ key, label, placeholder, kb }) => {
                  const requiredFields = ['age','sexe','antecedents','dureeLesion','zoneCorps'];
                  const isRequired  = requiredFields.includes(key);
                  const value       = formData[key as keyof typeof formData];
                  const err         = formError && isRequired && !value?.trim();
                  const isMultiline = ['antecedents','allergies','traitements','symptomes','observation'].includes(key);
                  return (
                    <View key={key} style={s.fieldWrap}>
                      <Text style={[s.fieldLabel, err && { color:'#ef4444' }]}>{label}</Text>
                      <TextInput
                        style={[s.input, isMultiline && s.inputMultiline, err && s.inputErr]}
                        placeholder={placeholder} placeholderTextColor="#bbb"
                        keyboardType={kb as any} value={value}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, [key]: t }))}
                        multiline={isMultiline} textAlignVertical={isMultiline ? 'top' : 'center'}
                      />
                    </View>
                  );
                })}
                {formError    && <View style={s.errBanner}><Text style={s.errTxt}>⚠ Remplissez tous les champs obligatoires (*)</Text></View>}
                {formSubmitted && <View style={s.okBanner}><Text style={s.okTxt}>✅ Formulaire soumis avec succès !</Text></View>}
                <TouchableOpacity style={[s.submitBtn, loading && { opacity:0.7 }]}
                  onPress={handleFormSubmit} activeOpacity={0.85} disabled={loading}>
                  <Text style={s.submitTxt}>{loading ? 'Envoi en cours...' : 'Soumettre le formulaire'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.closeBtn} onPress={() => setShowFormModal(false)} activeOpacity={0.85}>
                  <Text style={s.closeTxt}>Fermer</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex:1, backgroundColor:C.bg },
  scroll:          { flex:1 },
  scrollContent:   { paddingBottom:28 },
  header:          { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:C.card, paddingHorizontal:22, paddingTop:18, paddingBottom:18, borderBottomWidth:1, borderBottomColor:'#EEF5F3' },
  greeting:        { fontSize:13, color:C.textLight, fontWeight:'500', letterSpacing:0.3 },
  userName:        { fontSize:24, fontWeight:'800', color:C.text, marginTop:2, letterSpacing:-0.5 },
  headerRight:     { flexDirection:'row', alignItems:'center', gap:10 },
  iconBtn:         { width:46, height:46, borderRadius:14, alignItems:'center', justifyContent:'center', borderWidth:2 },
  iconBtnRed:      { backgroundColor:'#fff5f5', borderColor:'#ef4444' },
  iconBtnGreen:    { backgroundColor:'#f0fdf4', borderColor:C.primary },
  dot:             { position:'absolute', top:-4, right:-4, width:12, height:12, borderRadius:6, backgroundColor:'#ef4444', borderWidth:2, borderColor:C.card },
  avatar:          { width:46, height:46, borderRadius:14, backgroundColor:C.primary, alignItems:'center', justifyContent:'center' },
  avatarText:      { color:'#fff', fontWeight:'800', fontSize:15, letterSpacing:0.5 },
  statsRow:        { flexDirection:'row', gap:10, marginHorizontal:18, marginTop:18 },
  statCard:        { flex:1, backgroundColor:C.card, borderRadius:18, padding:14, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:3 },
  statEmoji:       { fontSize:22, marginBottom:4 },
  statValue:       { fontSize:18, fontWeight:'800', color:C.text },
  statLabel:       { fontSize:10, color:C.textLight, marginTop:2, fontWeight:'600' },
  sectionLabel:    { fontSize:13, fontWeight:'700', color:C.textLight, marginHorizontal:22, marginTop:22, marginBottom:12, letterSpacing:0.8, textTransform:'uppercase' },
  cardsRow:        { flexDirection:'row', gap:12, marginHorizontal:18 },
  cardGreen:       { flex:1, backgroundColor:C.primary, borderRadius:24, padding:20, overflow:'hidden', shadowColor:C.primary, shadowOffset:{width:0,height:10}, shadowOpacity:0.4, shadowRadius:16, elevation:8 },
  cardOrange:      { flex:1, backgroundColor:C.secondary, borderRadius:24, padding:20, overflow:'hidden', shadowColor:C.secondary, shadowOffset:{width:0,height:10}, shadowOpacity:0.4, shadowRadius:16, elevation:8 },
  cardGlow:        { position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:40, backgroundColor:'rgba(255,255,255,0.15)' },
  cardIconCircle:  { width:48, height:48, borderRadius:16, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center', marginBottom:14 },
  cardTitle:       { color:'#fff', fontWeight:'800', fontSize:17, letterSpacing:-0.3 },
  cardChip:        { backgroundColor:'rgba(255,255,255,0.25)', borderRadius:8, paddingHorizontal:8, paddingVertical:4, alignSelf:'flex-start', marginTop:10 },
  cardChipTxt:     { color:'#fff', fontSize:11, fontWeight:'700' },
  alertBox:        { flexDirection:'row', alignItems:'center', backgroundColor:'#fffbeb', borderWidth:1.5, borderColor:'#fde68a', borderRadius:16, padding:14, marginHorizontal:18, marginTop:18 },
  alertTitle:      { fontWeight:'700', fontSize:13, color:'#92400e' },
  alertText:       { fontSize:12, color:'#b45309', marginTop:2, lineHeight:17 },
  sectionHeader:   { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginHorizontal:18, marginTop:24, marginBottom:12 },
  sectionTitle:    { fontWeight:'800', fontSize:17, color:C.text },
  sectionSubtitle: { fontSize:11, color:C.textLight, fontWeight:'500', marginTop:3 },
  seeAllBtn:       { flexDirection:'row', alignItems:'center', gap:2, marginTop:4 },
  seeAllTxt:       { color:C.primary, fontWeight:'700', fontSize:13 },
  emptyWrap:       { alignItems:'center', paddingVertical:24 },
  emptyText:       { fontSize:14, color:C.textLight, fontWeight:'600' },
  analysisCard:    { flexDirection:'row', alignItems:'center', gap:14, marginHorizontal:18, marginBottom:12, backgroundColor:C.card, borderRadius:20, padding:14, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:10, elevation:4 },
  analysisImg:     { width:64, height:64, borderRadius:16 },
  analysisTopRow:  { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:5 },
  tagBadge:        { borderRadius:8, paddingHorizontal:8, paddingVertical:3 },
  tagTxt:          { fontSize:10, fontWeight:'700' },
  analysisDate:    { fontSize:10, color:C.textLight },
  analysisTitle:   { fontWeight:'800', fontSize:15, color:C.text, marginBottom:8 },
  confidenceRow:   { flexDirection:'row', alignItems:'center', gap:8 },
  confidenceBar:   { flex:1, height:5, backgroundColor:'#EEF5F3', borderRadius:3, overflow:'hidden' },
  confidenceFill:  { height:5, borderRadius:3 },
  confidencePct:   { fontSize:11, fontWeight:'700', minWidth:32 },
  conseilCard:     { marginHorizontal:18, marginBottom:12, backgroundColor:C.card, borderRadius:22, padding:18, flexDirection:'row', gap:16, alignItems:'flex-start', shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.06, shadowRadius:10, elevation:4 },
  conseilLeft:     { width:54, height:54, borderRadius:16, alignItems:'center', justifyContent:'center' },
  conseilTypeBadge:{ alignSelf:'flex-start', borderRadius:6, paddingHorizontal:8, paddingVertical:3, marginBottom:6 },
  conseilTypeTxt:  { fontSize:10, fontWeight:'800', textTransform:'uppercase', letterSpacing:0.5 },
  conseilTitle:    { fontWeight:'800', fontSize:15, color:C.text, marginBottom:5 },
  conseilText:     { fontSize:13, color:C.textLight, lineHeight:19 },
  conseilBtn:      { marginTop:10 },
  conseilBtnTxt:   { color:C.primary, fontWeight:'700', fontSize:13 },
  // ✅ Tips depuis DB
  tipsRow:         { flexDirection:'row', gap:10, marginHorizontal:18, marginTop:14 },
  tipCard:         { flex:1, backgroundColor:C.card, borderRadius:18, padding:14, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:6, elevation:3 },
  tipEmoji:        { fontSize:24, marginBottom:6 },
  tipTitle:        { fontWeight:'800', fontSize:12, color:C.text },
  tipSub:          { fontSize:10, color:C.textLight, marginTop:2 },
  navbar:          { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderTopWidth:1, borderTopColor:'#EEF5F3', height:74, paddingHorizontal:8, shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.07, shadowRadius:14, elevation:14 },
  tabItem:         { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:6, gap:4, position:'relative' },
  tabActiveBg:     { position:'absolute', top:4, width:44, height:32, borderRadius:12, backgroundColor:C.primary+'18' },
  tabLabel:        { fontSize:10, fontWeight:'600', color:C.inactive },
  tabLabelActive:  { color:C.primary },
  fabWrap:         { flex:1, alignItems:'center', justifyContent:'center', marginTop:-26 },
  fab:             { width:62, height:62, borderRadius:31, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:C.card, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:14, elevation:12 },
  keyboardView:    { flex:1, justifyContent:'flex-end' },
  overlay:         { flex:1, backgroundColor:'rgba(0,0,0,0.55)', justifyContent:'flex-end' },
  sheet:           { backgroundColor:C.card, borderTopLeftRadius:32, borderTopRightRadius:32, paddingBottom:42, paddingTop:20, maxHeight:'90%' },
  sheetHandle:     { width:42, height:4, backgroundColor:'#e0e0e0', borderRadius:2, alignSelf:'center', marginBottom:24 },
  sheetScrollContent:{ paddingHorizontal:24, paddingBottom:30 },
  sheetHeader:     { flexDirection:'row', alignItems:'center', gap:12, marginBottom:24 },
  sheetIconWrap:   { width:48, height:48, borderRadius:14, backgroundColor:'#fff5f5', alignItems:'center', justifyContent:'center' },
  sheetTitle:      { fontWeight:'800', fontSize:18, color:C.text },
  sheetSub:        { fontSize:12, color:'#ef4444', fontWeight:'600', marginTop:2 },
  fieldWrap:       { marginBottom:16 },
  fieldLabel:      { fontSize:13, fontWeight:'700', color:C.textLight, marginBottom:7 },
  input:           { padding:14, borderRadius:14, borderWidth:1.5, borderColor:'#E2EEE9', fontSize:14, backgroundColor:'#F8FDFA', color:C.text },
  inputMultiline:  { minHeight:90, paddingTop:14 },
  inputErr:        { borderColor:'#ef4444', backgroundColor:'#fff5f5', borderWidth:2 },
  errBanner:       { backgroundColor:'#fff5f5', borderWidth:1, borderColor:'#fecaca', borderRadius:12, padding:12, marginBottom:14 },
  errTxt:          { color:'#ef4444', fontSize:13, fontWeight:'600' },
  okBanner:        { backgroundColor:'#f0fdf4', borderWidth:1, borderColor:'#bbf7d0', borderRadius:12, padding:12, marginBottom:14, alignItems:'center' },
  okTxt:           { color:'#16a34a', fontSize:14, fontWeight:'700' },
  submitBtn:       { backgroundColor:C.primary, borderRadius:18, padding:17, alignItems:'center', shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.4, shadowRadius:14, elevation:8 },
  submitTxt:       { color:'#fff', fontWeight:'800', fontSize:16, letterSpacing:0.3 },
  closeBtn:        { marginTop:14, alignItems:'center', justifyContent:'center', paddingVertical:12 },
  closeTxt:        { fontSize:16, color:'#64748b', fontWeight:'700' },
});