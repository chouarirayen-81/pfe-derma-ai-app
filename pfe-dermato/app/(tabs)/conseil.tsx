import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';

interface Conseil {
  id: number;
  icon: string;
  title: string;
  color: string;
  bgColor: string;
  tips: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const conseils: Conseil[] = [
  {
    id: 1,
    icon: '☀️',
    title: 'Protection solaire',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    tips: [
      'Appliquez un SPF 30+ quotidiennement',
      'Réappliquez toutes les 2 heures en extérieur',
      "Évitez l'exposition entre 11h et 16h",
    ],
  },
  {
    id: 2,
    icon: '💧',
    title: 'Hydratation',
    color: '#00C6A7',
    bgColor: '#f0fdfb',
    tips: [
      "Buvez au moins 1,5 L d'eau par jour",
      'Utilisez une crème hydratante matin et soir',
      'Évitez les douches trop chaudes',
    ],
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Prévention eczéma',
    color: '#6366f1',
    bgColor: '#eef2ff',
    tips: [
      'Utilisez des produits hypoallergéniques',
      'Portez des vêtements en coton',
      'Évitez les parfums sur la peau',
    ],
  },
  {
    id: 4,
    icon: '🥗',
    title: 'Alimentation',
    color: '#10b981',
    bgColor: '#f0fdf4',
    tips: [
      'Consommez des oméga-3 régulièrement',
      'Mangez des fruits et légumes colorés',
      'Limitez les aliments transformés',
    ],
  },
  {
    id: 5,
    icon: '😴',
    title: 'Sommeil',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    tips: [
      'Dormez 7 à 9 heures par nuit',
      'La peau se régénère pendant le sommeil',
      "Changez vos taies d'oreiller régulièrement",
    ],
  },
  {
    id: 6,
    icon: '🌿',
    title: 'Environnement',
    color: '#00C6A7',
    bgColor: '#f0fdfb',
    tips: [
      "Maintenez l'humidité à 40–60%",
      'Aérez votre logement quotidiennement',
      'Évitez les atmosphères trop sèches',
    ],
  },
];

// ─── Palette (identique à HomeScreen) ────────────────────────────────────────
const C = {
  primary:   '#00C6A7',
  primary2:  '#00957D',
  secondary: '#FF6B4A',
  bg:        '#F0F6F4',
  card:      '#FFFFFF',
  text:      '#0D2B22',
  textLight: '#7A9E95',
  inactive:  '#C5D9D5',
};

// ─── SVG Icons (identiques à HomeScreen) ─────────────────────────────────────
const IconHome = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 3l9 9v9H15v-5H9v5H3v-9z"
      stroke={active ? C.primary : C.inactive}
      strokeWidth={2} strokeLinejoin="round"
      fill={active ? C.primary + '22' : 'none'} />
  </Svg>
);

const IconClock = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={active ? C.primary : C.inactive} strokeWidth={2} />
    <Path d="M12 7v5l3.5 3.5" stroke={active ? C.primary : C.inactive}
      strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconBulb = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a7 7 0 00-3.5 13.07V17a1 1 0 001 1h5a1 1 0 001-1v-1.93A7 7 0 0012 2z"
      stroke={active ? C.primary : C.inactive} strokeWidth={2}
      fill={active ? C.primary + '22' : 'none'} />
    <Path d="M10 21h4" stroke={active ? C.primary : C.inactive}
      strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconUser = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={4} stroke={active ? C.primary : C.inactive} strokeWidth={2}
      fill={active ? C.primary + '22' : 'none'} />
    <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7"
      stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconCamera = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
      stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
    <Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={2} />
  </Svg>
);

const IconBack = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7"
      stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── Conseil Card (dépliable) ─────────────────────────────────────────────────
function ConseilCard({ conseil }: { conseil: Conseil }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <TouchableOpacity style={s.conseilCard} onPress={() => setExpanded(!expanded)} activeOpacity={0.9}>
      {/* Header */}
      <View style={s.conseilHeader}>
        <View style={[s.conseilIconWrap, { backgroundColor: conseil.bgColor }]}>
          <Text style={s.conseilEmoji}>{conseil.icon}</Text>
        </View>
        <Text style={[s.conseilTitle, { color: conseil.color }]}>{conseil.title}</Text>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d={expanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
            stroke={C.textLight} strokeWidth={2.2} strokeLinecap="round" />
        </Svg>
      </View>

      {/* Séparateur + Tips */}
      {expanded && (
        <>
          <View style={[s.divider, { backgroundColor: conseil.color + '30' }]} />
          <View style={s.tipsList}>
            {conseil.tips.map((tip, i) => (
              <View key={i} style={s.tipRow}>
                <View style={[s.tipNum, { backgroundColor: conseil.color + '18' }]}>
                  <Text style={[s.tipNumTxt, { color: conseil.color }]}>{i + 1}</Text>
                </View>
                <Text style={s.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

// ─── Composant Principal ──────────────────────────────────────────────────────
export default function ConseilsScreen() {
  const router   = useRouter();
  const pathname = usePathname();

  // Même logique isActive que HomeScreen
  const isActive = (tabId: TabId): boolean => {
  if (tabId === 'accueil')    return pathname === '/(tabs)' || pathname === '/(tabs)/acceuil';
  if (tabId === 'historique') return pathname.startsWith('/(tabs)/historique');
  if (tabId === 'scan')       return pathname.startsWith('/(tabs)/scan');
  if (tabId === 'conseils')   return pathname.startsWith('/(tabs)/conseil');
  if (tabId === 'profil')     return pathname.startsWith('/(tabs)/profile');
  return false;
};

  // ✅ Exact same goTab logic as HomeScreen
const goTab = (tabId: TabId) => {
  switch (tabId) {
    case 'accueil':
      router.replace('/(tabs)/acceuil');
      break;
    case 'historique':
      router.replace('/(tabs)/historique');
      break;
    case 'scan':
      router.replace('/(tabs)/scan');
      break;
    case 'conseils':
      router.replace('/(tabs)/conseil');
      break;
    case 'profil':
      router.replace('/(tabs)/profile');
      break;
  }
};


  const tabs = [
    { id: 'accueil',    label: 'Accueil',    Icon: IconHome },
    { id: 'historique', label: 'Historique', Icon: IconClock },
    { id: 'scan',       label: '',           Icon: null, fab: true },
    { id: 'conseils',   label: 'Conseils',   Icon: IconBulb },
    { id: 'profil',     label: 'Profil',     Icon: IconUser },
  ] as any[];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card} />

      {/* ── HEADER ── */}
     <View style={s.header}>
  <TouchableOpacity
    style={s.headerBtn}
    onPress={() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/acceuil');
      }
    }}
    activeOpacity={0.7}
  >
    <IconBack />
  </TouchableOpacity>
        <Text style={s.headerTitle}>Conseils prévention</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── SCROLL ── */}
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* HERO BANNER */}
        <View style={s.heroBanner}>
          <View style={s.heroCircle1} />
          <View style={s.heroCircle2} />
          <Text style={s.heroTitle}>Prenez soin de{'\n'}votre peau</Text>
          <Text style={s.heroSub}>
            Découvrez nos conseils d'experts pour maintenir une peau saine au quotidien.
          </Text>
        </View>

        {/* STATS RAPIDES */}
        <View style={s.quickStats}>
          {[
            { icon: '📋', label: '6 catégories' },
            { icon: '✅', label: '18 conseils' },
            { icon: '👨‍⚕️', label: 'Validés experts' },
          ].map((st, i) => (
            <View key={i} style={s.quickStatItem}>
              <Text style={s.quickStatIcon}>{st.icon}</Text>
              <Text style={s.quickStatLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* TITRE */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Tous les conseils</Text>
        </View>

        {/* LISTE */}
        {conseils.map((c) => <ConseilCard key={c.id} conseil={c} />)}

        {/* DISCLAIMER */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerIcon}>⚠️</Text>
          <Text style={s.disclaimerText}>
            Ces conseils sont fournis à titre informatif. Pour des recommandations personnalisées, consultez un dermatologue.
          </Text>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAVBAR (identique à HomeScreen) ── */}
      <View style={s.navbar}>
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          if (tab.fab) return (
            <TouchableOpacity key="scan" style={s.fabWrap}
              onPress={() => goTab('scan')} activeOpacity={0.85}>
              <View style={s.fab}><IconCamera /></View>
            </TouchableOpacity>
          );
          const Icon = tab.Icon;
          return (
            <TouchableOpacity key={tab.id} style={s.tabItem}
              onPress={() => goTab(tab.id as TabId)} activeOpacity={0.7}>
              {active && <View style={s.tabActiveBg} />}
              <Icon active={active} />
              <Text style={[s.tabLabel, active && s.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: C.bg },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 30 },

  // Header
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEF5F3' },
  headerBtn:   { width: 40, height: 40, borderRadius: 12, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: C.text, letterSpacing: -0.3 },

  // Hero
  heroBanner:  { margin: 18, borderRadius: 24, backgroundColor: C.primary, padding: 24, overflow: 'hidden', minHeight: 130 },
  heroCircle1: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.12)' },
  heroCircle2: { position: 'absolute', bottom: -40, right: 40, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroTitle:   { fontSize: 24, fontWeight: '900', color: '#fff', lineHeight: 30, letterSpacing: -0.5, marginBottom: 10 },
  heroSub:     { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19 },

  // Quick stats
  quickStats:     { flexDirection: 'row', marginHorizontal: 18, marginBottom: 4, backgroundColor: C.card, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  quickStatItem:  { flex: 1, alignItems: 'center', gap: 5 },
  quickStatIcon:  { fontSize: 22 },
  quickStatLabel: { fontSize: 11, color: C.textLight, fontWeight: '600', textAlign: 'center' },

  // Section
  sectionHeader: { marginHorizontal: 18, marginTop: 20, marginBottom: 12 },
  sectionTitle:  { fontSize: 17, fontWeight: '800', color: C.text },

  // Conseil card
  conseilCard:    { marginHorizontal: 18, marginBottom: 12, backgroundColor: C.card, borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 4 },
  conseilHeader:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  conseilIconWrap:{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  conseilEmoji:   { fontSize: 22 },
  conseilTitle:   { flex: 1, fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  divider:        { height: 1.5, borderRadius: 1, marginVertical: 14 },

  // Tips
  tipsList:   { gap: 10 },
  tipRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  tipNum:     { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  tipNumTxt:  { fontSize: 12, fontWeight: '800' },
  tipText:    { flex: 1, fontSize: 13, color: C.text, lineHeight: 20, fontWeight: '500' },

  // Disclaimer
  disclaimer:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 18, marginTop: 8, backgroundColor: '#fffbeb', borderWidth: 1.5, borderColor: '#fde68a', borderRadius: 16, padding: 16 },
  disclaimerIcon: { fontSize: 18 },
  disclaimerText: { flex: 1, fontSize: 12, color: '#92400e', lineHeight: 18, fontWeight: '500' },

  // Navbar (100% identique à HomeScreen)
  navbar:        { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderTopWidth: 1, borderTopColor: '#EEF5F3', height: 74, paddingHorizontal: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 14 },
  tabItem:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, gap: 4, position: 'relative' },
  tabActiveBg:   { position: 'absolute', top: 4, width: 44, height: 32, borderRadius: 12, backgroundColor: C.primary + '18' },
  tabLabel:      { fontSize: 10, fontWeight: '600', color: C.inactive },
  tabLabelActive:{ color: C.primary },
  fabWrap:       { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -26 },
  fab:           { width: 62, height: 62, borderRadius: 31, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: C.card, shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 12 },
});
