import React, { useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  primary:  '#00C6A7',
  bg:       '#F0F6F4',
  card:     '#FFFFFF',
  text:     '#0D2B22',
  light:    '#7A9E95',
  inactive: '#C5D9D5',
  border:   '#EEF5F3',
  orange:   '#f59e0b',
  red:      '#ef4444',
  purple:   '#6366f1',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';

export interface AnalysisResult {
  id: number;
  date: string;
  time: string;
  title: string;
  status: string;
  confidence: number;
  confidenceColor: string;
  img: string;
  description: string;
  conditions: { label: string; percent: number; color: string }[];
  recommendation: { icon: string; title: string; body: string };
  conseils: string[];
}

// ─── Mock data (remplace par props/route params selon ton setup) ──────────────
const mockResult: AnalysisResult = {
  id: 1,
  date: '3 Février 2026',
  time: '14:32',
  title: 'Eczéma léger',
  status: 'Faible',
  confidence: 87,
  confidenceColor: '#10b981',
  img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop',
  description:
    "Irritation cutanée caractéristique d'un eczéma atopique léger. La zone présente des signes de sécheresse et de légère inflammation.",
  conditions: [
    { label: 'Eczéma atop.',  percent: 87, color: '#10b981' },
    { label: 'Psoriasis',     percent: 8,  color: C.orange  },
    { label: 'Autre',         percent: 5,  color: C.light   },
  ],
  recommendation: {
    icon: '🏠',
    title: 'Suivi à domicile recommandé',
    body: 'Cette condition peut généralement être gérée avec des soins appropriés à domicile.',
  },
  conseils: [
    'Appliquez une crème hydratante hypoallergénique 2 fois par jour',
    'Évitez les savons agressifs et préférez des nettoyants doux',
    'Portez des vêtements en coton pour réduire l\'irritation',
    'Évitez de gratter la zone affectée',
  ],
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconBack = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7"
      stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconShare = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx={18} cy={5}  r={3} stroke={C.text} strokeWidth={2}/>
    <Circle cx={6}  cy={12} r={3} stroke={C.text} strokeWidth={2}/>
    <Circle cx={18} cy={19} r={3} stroke={C.text} strokeWidth={2}/>
    <Path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"
      stroke={C.text} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconCalendar = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={4} width={18} height={18} rx={2} stroke={C.light} strokeWidth={2}/>
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconClock2 = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={C.light} strokeWidth={2}/>
    <Path d="M12 7v5l3 3" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconAlert = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke="#d97706" strokeWidth={2} fill="#fef3c7" strokeLinejoin="round"/>
    <Path d="M12 9v4M12 17h.01" stroke="#d97706" strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconDownload = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M7 10l5 5 5-5M12 15V3" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconSearch2 = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx={11} cy={11} r={8} stroke="#fff" strokeWidth={2}/>
    <Path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);

// ─── Navbar icons ─────────────────────────────────────────────────────────────
const IconHome  = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 3l9 9v9H15v-5H9v5H3v-9z"
      stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinejoin="round"
      fill={active ? C.primary+'22' : 'none'}/>
  </Svg>
);
const IconClockNav = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={active ? C.primary : C.inactive} strokeWidth={2}/>
    <Path d="M12 7v5l3.5 3.5" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconBulb = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a7 7 0 00-3.5 13.07V17a1 1 0 001 1h5a1 1 0 001-1v-1.93A7 7 0 0012 2z"
      stroke={active ? C.primary : C.inactive} strokeWidth={2}
      fill={active ? C.primary+'22' : 'none'}/>
    <Path d="M10 21h4" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconUser = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={4} stroke={active ? C.primary : C.inactive} strokeWidth={2}
      fill={active ? C.primary+'22' : 'none'}/>
    <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7"
      stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconCamera = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
      stroke="#fff" strokeWidth={2} strokeLinejoin="round"/>
    <Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={2}/>
  </Svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AnalysisDetailScreen() {
  const router   = useRouter();
  const pathname = usePathname();

  // En vrai projet : récupère l'item via useLocalSearchParams() ou props de navigation
  const result = mockResult;

  const isActive = (tabId: TabId): boolean => {
    if (tabId === 'accueil')    return pathname === '/(tabs)' || pathname === '/(tabs)/index';
    if (tabId === 'historique') return pathname.startsWith('/historique');
    if (tabId === 'scan')       return pathname.startsWith('/(tabs)/scan');
    if (tabId === 'conseils')   return pathname.startsWith('/(tabs)/tips');
    if (tabId === 'profil')     return pathname.startsWith('/(tabs)/profile');
    return false;
  };

  const goTab = (tabId: TabId) => {
    switch (tabId) {
      case 'accueil':    router.push('/welcome'); break;
      case 'historique': router.push('/historique'); break;
      case 'scan':       router.push('/scan'); break;
      case 'conseils':   router.push('/conseil'); break;
      case 'profil':     router.push('/profile'); break;
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      {/* ── HEADER ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} activeOpacity={0.7}
          onPress={() => router.push('/historique')}>
          <IconBack/>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Résultat de l'analyse</Text>
        <TouchableOpacity style={s.headerBtn} activeOpacity={0.7}>
          <IconShare/>
        </TouchableOpacity>
      </View>

      {/* ── SCROLL ── */}
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── HERO CARD ── */}
        <View style={s.heroCard}>
          {/* Date + heure */}
          <View style={s.heroMeta}>
            <View style={s.metaItem}>
              <IconCalendar/>
              <Text style={s.metaTxt}>{result.date}</Text>
            </View>
            <View style={s.metaItem}>
              <IconClock2/>
              <Text style={s.metaTxt}>{result.time}</Text>
            </View>
          </View>

          {/* Image + titre + badge */}
          <View style={s.heroBody}>
            <Image source={{ uri: result.img }} style={s.heroImg}/>
            <View style={{ flex:1 }}>
              <Text style={s.heroTitle}>{result.title}</Text>
              <View style={[s.statusBadge, { backgroundColor: result.confidenceColor+'20' }]}>
                <View style={[s.statusDot, { backgroundColor: result.confidenceColor }]}/>
                <Text style={[s.statusTxt, { color: result.confidenceColor }]}>
                  {result.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Barre confiance */}
          <View style={s.confRow}>
            <Text style={s.confLabel}>Niveau de confiance</Text>
            <Text style={[s.confPct, { color: result.confidenceColor }]}>
              {result.confidence}%
            </Text>
          </View>
          <View style={s.confBarBg}>
            <View style={[s.confBarFill, {
              width: `${result.confidence}%` as any,
              backgroundColor: result.confidenceColor,
            }]}/>
          </View>
        </View>

        {/* ── DESCRIPTION ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Description</Text>
          <View style={s.descCard}>
            <Text style={s.descText}>{result.description}</Text>
          </View>
        </View>

        {/* ── CONDITIONS POSSIBLES ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Conditions possibles</Text>
          <View style={s.condCard}>
            {result.conditions.map((cond, i) => (
              <View key={i} style={s.condRow}>
                <View style={s.condLabelWrap}>
                  <View style={[s.condDot, { backgroundColor: cond.color }]}/>
                  <Text style={s.condLabel}>{cond.label}</Text>
                </View>
                <View style={s.condBarBg}>
                  <View style={[s.condBarFill, {
                    width: `${cond.percent}%` as any,
                    backgroundColor: cond.color,
                  }]}/>
                </View>
                <Text style={[s.condPct, { color: cond.color }]}>{cond.percent}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── RECOMMANDATION ── */}
        <View style={s.section}>
          <View style={s.recoCard}>
            <View style={s.recoIconWrap}>
              <Text style={{ fontSize: 22 }}>{result.recommendation.icon}</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={s.recoTitle}>{result.recommendation.title}</Text>
              <Text style={s.recoBody}>{result.recommendation.body}</Text>
            </View>
          </View>
        </View>

        {/* ── CONSEILS PERSONNALISÉS ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Conseils personnalisés</Text>
          <View style={s.conseilsCard}>
            {result.conseils.map((tip, i) => (
              <View key={i} style={[s.conseilRow, i < result.conseils.length - 1 && s.conseilBorder]}>
                <View style={s.conseilBullet}>
                  <Text style={s.conseilBulletTxt}>{i + 1}</Text>
                </View>
                <Text style={s.conseilTxt}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── AVERTISSEMENT ── */}
        <View style={s.alertBox}>
          <IconAlert/>
          <View style={{ flex:1, marginLeft:10 }}>
            <Text style={s.alertTitle}>Avertissement</Text>
            <Text style={s.alertText}>
              Cette analyse a été réalisée à titre informatif et ne remplace pas un diagnostic médical professionnel.
            </Text>
          </View>
        </View>

        {/* ── CTA BUTTONS ── */}
        <TouchableOpacity style={s.btnPrimary} activeOpacity={0.85}>
          <IconSearch2/>
          <Text style={s.btnPrimaryTxt}>Trouver un dermatologue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnSecondary} activeOpacity={0.85}>
          <IconDownload/>
          <Text style={s.btnSecondaryTxt}>Télécharger le rapport</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ── BOTTOM NAVBAR ── */}
      <View style={s.navbar}>
        {([
          { id:'accueil',    label:'Accueil',    Icon:IconHome     },
          { id:'historique', label:'Historique', Icon:IconClockNav },
          { id:'scan',       label:'',           Icon:null, fab:true },
          { id:'conseils',   label:'Conseils',   Icon:IconBulb     },
          { id:'profil',     label:'Profil',     Icon:IconUser     },
        ] as any[]).map((tab) => {
          const active = isActive(tab.id);
          if (tab.fab) return (
            <TouchableOpacity key="scan" style={s.fabWrap} onPress={() => goTab('scan')} activeOpacity={0.85}>
              <View style={s.fab}><IconCamera/></View>
            </TouchableOpacity>
          );
          const Icon = tab.Icon;
          return (
            <TouchableOpacity key={tab.id} style={s.tabItem}
              onPress={() => goTab(tab.id as TabId)} activeOpacity={0.7}>
              {active && <View style={s.tabActiveBg}/>}
              <Icon active={active}/>
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
  safe:          { flex:1, backgroundColor:C.bg },
  scroll:        { flex:1 },
  scrollContent: { paddingBottom:32 },

  // Header
  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:C.card, paddingHorizontal:18, paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border },
  headerBtn:   { width:40, height:40, borderRadius:12, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:17, fontWeight:'800', color:C.text, letterSpacing:-0.3 },

  // Hero card
  heroCard: { backgroundColor:C.card, marginHorizontal:18, marginTop:18, borderRadius:22, padding:18, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:12, elevation:5 },
  heroMeta: { flexDirection:'row', gap:16, marginBottom:14 },
  metaItem: { flexDirection:'row', alignItems:'center', gap:5 },
  metaTxt:  { fontSize:12, color:C.light, fontWeight:'500' },
  heroBody: { flexDirection:'row', alignItems:'center', gap:14, marginBottom:18 },
  heroImg:  { width:72, height:72, borderRadius:18 },
  heroTitle:{ fontSize:20, fontWeight:'800', color:C.text, marginBottom:8, letterSpacing:-0.4 },
  statusBadge:{ flexDirection:'row', alignItems:'center', gap:6, alignSelf:'flex-start', borderRadius:10, paddingHorizontal:10, paddingVertical:5 },
  statusDot:  { width:7, height:7, borderRadius:4 },
  statusTxt:  { fontSize:12, fontWeight:'700' },
  confRow:  { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  confLabel:{ fontSize:13, color:C.light, fontWeight:'600' },
  confPct:  { fontSize:22, fontWeight:'900', letterSpacing:-0.5 },
  confBarBg:  { height:8, backgroundColor:C.border, borderRadius:4, overflow:'hidden' },
  confBarFill:{ height:8, borderRadius:4 },

  // Sections
  section:      { marginHorizontal:18, marginTop:20 },
  sectionTitle: { fontSize:16, fontWeight:'800', color:C.text, marginBottom:12, letterSpacing:-0.3 },

  // Description
  descCard: { backgroundColor:C.card, borderRadius:18, padding:16, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:3 },
  descText: { fontSize:14, color:C.light, lineHeight:21 },

  // Conditions
  condCard:    { backgroundColor:C.card, borderRadius:18, padding:16, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:3 },
  condRow:     { flexDirection:'row', alignItems:'center', gap:10, marginBottom:12 },
  condLabelWrap:{ flexDirection:'row', alignItems:'center', gap:6, width:100 },
  condDot:     { width:8, height:8, borderRadius:4 },
  condLabel:   { fontSize:12, color:C.text, fontWeight:'600', flexShrink:1 },
  condBarBg:   { flex:1, height:6, backgroundColor:C.border, borderRadius:3, overflow:'hidden' },
  condBarFill: { height:6, borderRadius:3 },
  condPct:     { fontSize:12, fontWeight:'700', minWidth:34, textAlign:'right' },

  // Recommandation
  recoCard:    { backgroundColor:'#f0fdfb', borderWidth:1.5, borderColor:C.primary+'44', borderRadius:18, padding:16, flexDirection:'row', gap:14, alignItems:'flex-start' },
  recoIconWrap:{ width:48, height:48, borderRadius:14, backgroundColor:C.primary+'22', alignItems:'center', justifyContent:'center' },
  recoTitle:   { fontSize:14, fontWeight:'800', color:C.text, marginBottom:5 },
  recoBody:    { fontSize:13, color:C.light, lineHeight:19 },

  // Conseils
  conseilsCard:  { backgroundColor:C.card, borderRadius:18, paddingHorizontal:16, paddingTop:8, paddingBottom:4, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:3 },
  conseilRow:    { flexDirection:'row', alignItems:'flex-start', gap:12, paddingVertical:12 },
  conseilBorder: { borderBottomWidth:1, borderBottomColor:C.border },
  conseilBullet: { width:24, height:24, borderRadius:8, backgroundColor:C.primary+'22', alignItems:'center', justifyContent:'center', marginTop:1 },
  conseilBulletTxt:{ fontSize:12, fontWeight:'800', color:C.primary },
  conseilTxt:    { flex:1, fontSize:13, color:C.text, lineHeight:20 },

  // Alert
  alertBox:  { flexDirection:'row', alignItems:'flex-start', backgroundColor:'#fffbeb', borderWidth:1.5, borderColor:'#fde68a', borderRadius:16, padding:14, marginHorizontal:18, marginTop:20 },
  alertTitle:{ fontWeight:'700', fontSize:13, color:'#92400e', marginBottom:3 },
  alertText: { fontSize:12, color:'#b45309', lineHeight:17 },

  // CTA buttons
  btnPrimary:    { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, backgroundColor:C.primary, borderRadius:18, padding:17, marginHorizontal:18, marginTop:20, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.4, shadowRadius:14, elevation:8 },
  btnPrimaryTxt: { color:'#fff', fontWeight:'800', fontSize:15 },
  btnSecondary:  { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, backgroundColor:C.card, borderRadius:18, padding:16, marginHorizontal:18, marginTop:12, borderWidth:2, borderColor:C.primary },
  btnSecondaryTxt:{ color:C.primary, fontWeight:'800', fontSize:15 },

  // Navbar
  navbar:        { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderTopWidth:1, borderTopColor:C.border, height:74, paddingHorizontal:8, shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.07, shadowRadius:14, elevation:14 },
  tabItem:       { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:6, gap:4, position:'relative' },
  tabActiveBg:   { position:'absolute', top:4, width:44, height:32, borderRadius:12, backgroundColor:C.primary+'18' },
  tabLabel:      { fontSize:10, fontWeight:'600', color:C.inactive },
  tabLabelActive:{ color:C.primary },
  fabWrap:       { flex:1, alignItems:'center', justifyContent:'center', marginTop:-26 },
  fab:           { width:62, height:62, borderRadius:31, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:C.card, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:14, elevation:12 },
});
