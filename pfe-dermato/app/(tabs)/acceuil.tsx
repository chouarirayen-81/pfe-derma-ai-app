import React, { useState } from 'react';
import { useRouter, usePathname } from "expo-router";
import {
  View, Text, ScrollView, TouchableOpacity, Image, TextInput,
  Modal, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';

interface Analysis {
  id: number; date: string; title: string; confidence: number;
  color: string; bgColor: string; img: string; tag: string;
}
const username = "John Doe";
const initials = username
  .split(" ")
  .map(n => n[0])
  .join("")
  .toUpperCase();
const recentAnalyses: Analysis[] = [
  { id:1, date:'2 janv. 2026', title:'Eczéma léger', confidence:87, color:'#10b981', bgColor:'#d1fae5', img:'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=120&h=120&fit=crop', tag:'Faible risque' },
  { id:2, date:'28 déc. 2025', title:'Acné modérée', confidence:92, color:'#f59e0b', bgColor:'#fef3c7', img:'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=120&h=120&fit=crop', tag:'Suivi conseillé' },
];

const stats = [
  { label:'Analyses', value:'12', icon:'🔬' },
  { label:'Ce mois',  value:'3',  icon:'📅' },
  { label:'Score santé', value:'94%', icon:'💚' },
];

const C = {
  primary:'#00C6A7', primary2:'#00957D', secondary:'#FF6B4A',
  bg:'#F0F6F4', card:'#FFFFFF', text:'#0D2B22',
  textLight:'#7A9E95', inactive:'#C5D9D5',
};

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

// ─── Composant Principal ──────────────────────────────────────────────────────
export default function HomeScreen() {
  const router   = useRouter();
  const pathname = usePathname();

  const [showFormModal, setShowFormModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError]         = useState(false);
  const [formData, setFormData] = useState({ nom:'', age:'', antecedents:'', allergies:'' });


  const isActive = (tabId: TabId): boolean => {
  if (tabId === 'accueil')    return pathname === '/(tabs)' || pathname === '/(tabs)/acceuil';
  if (tabId === 'historique') return pathname.startsWith('/(tabs)/historique');
  if (tabId === 'scan')       return pathname.startsWith('/(tabs)/scan');
  if (tabId === 'conseils')   return pathname.startsWith('/(tabs)/conseil');
  if (tabId === 'profil')     return pathname.startsWith('/(tabs)/profile');
  return false;
};
  // Même logique goTab que HomeScreen
  const goTab = (tabId: TabId) => {
    switch (tabId) {
      case 'accueil':    router.push('/acceuil');         break;
      case 'historique': router.push('/historique');     break;
      case 'scan':       router.push('/scan');    break;
      case 'conseils':   router.push('/conseil');    break;
      case 'profil':     router.push('/profile'); break;
    }
  };

  const handleFormSubmit = () => {
    if (!formData.nom || !formData.age || !formData.antecedents) {
      setFormError(true); return;
    }
    setFormError(false);
    setFormSubmitted(true);
    setTimeout(() => setShowFormModal(false), 1400);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Bonjour 👋</Text>
            <Text style={s.userName}>utilisateur</Text>
          </View>
          <View style={s.headerRight}>
            <TouchableOpacity
              onPress={() => { setShowFormModal(true); setFormSubmitted(false); setFormError(false); }}
              style={[s.iconBtn, formSubmitted ? s.iconBtnGreen : s.iconBtnRed]}
              activeOpacity={0.8}>
              <IconForm done={formSubmitted}/>
              {!formSubmitted && <View style={s.dot}/>}
            </TouchableOpacity>
            <TouchableOpacity
              style={s.avatar}
             onPress={() => router.push("/profile")} >
              <Text style={s.avatarTxt}>{initials}</Text>
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
            onPress={() => { if (!formSubmitted) { setShowFormModal(true); setFormError(false); return; } router.replace('/(tabs)/scan'); }}>
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
            onPress={() => { if (!formSubmitted) { setShowFormModal(true); setFormError(false); return; } router.replace('/(tabs)/preview'); }}>
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
          <TouchableOpacity style={s.seeAllBtn} onPress={() => router.replace('/(tabs)/historique')}>
            <Text style={s.seeAllTxt}>Voir tout</Text>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round"/>
            </Svg>
          </TouchableOpacity>
        </View>

        {recentAnalyses.map((item) => (
          <TouchableOpacity key={item.id} style={s.analysisCard} activeOpacity={0.82}>
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

        {/* CONSEIL DU JOUR */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Conseil du jour</Text>
        </View>
        <View style={s.conseilCard}>
          <View style={s.conseilLeft}><Text style={{ fontSize:28 }}>☀️</Text></View>
          <View style={{ flex:1 }}>
            <Text style={s.conseilTitle}>Protection solaire</Text>
            <Text style={s.conseilText}>Appliquez un SPF 30+ chaque jour, même par temps nuageux.</Text>
            <TouchableOpacity style={s.conseilBtn} onPress={() => router.replace('/(tabs)/conseil')}>
              <Text style={s.conseilBtnTxt}>En savoir plus →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* QUICK TIPS */}
        <View style={s.tipsRow}>
          {[
            { icon:'💧', title:'Hydratation', sub:'8 verres/jour' },
            { icon:'😴', title:'Sommeil',     sub:'7–9 heures'   },
            { icon:'🥗', title:'Nutrition',   sub:'Antioxydants' },
          ].map((tip, i) => (
            <View key={i} style={s.tipCard}>
              <Text style={s.tipEmoji}>{tip.icon}</Text>
              <Text style={s.tipTitle}>{tip.title}</Text>
              <Text style={s.tipSub}>{tip.sub}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* ── BOTTOM NAVBAR ── */}
      <View style={s.navbar}>

        {/* Accueil */}
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('accueil')} activeOpacity={0.7}>
          {isActive('accueil') && <View style={s.tabActiveBg}/>}
          <IconHome active={isActive('accueil')}/>
          <Text style={[s.tabLabel, isActive('accueil') && s.tabLabelActive]}>Accueil</Text>
        </TouchableOpacity>

        {/* Historique */}
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('historique')} activeOpacity={0.7}>
          {isActive('historique') && <View style={s.tabActiveBg}/>}
          <IconClock active={isActive('historique')}/>
          <Text style={[s.tabLabel, isActive('historique') && s.tabLabelActive]}>Historique</Text>
        </TouchableOpacity>

        {/* ✅ FIX 3 — FAB : View wrapper (non cliquable) + TouchableOpacity seulement sur le bouton */}
        <View style={s.fabWrap}>
          <TouchableOpacity style={s.fab} onPress={() => goTab('scan')} activeOpacity={0.85}>
            <IconCamera/>
          </TouchableOpacity>
        </View>

        {/* Conseils */}
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('conseils')} activeOpacity={0.7}>
          {isActive('conseils') && <View style={s.tabActiveBg}/>}
          <IconBulb active={isActive('conseils')}/>
          <Text style={[s.tabLabel, isActive('conseils') && s.tabLabelActive]}>Conseils</Text>
        </TouchableOpacity>

        {/* Profil */}
        <TouchableOpacity style={s.tabItem} onPress={() => goTab('profil')} activeOpacity={0.7}>
          {isActive('profil') && <View style={s.tabActiveBg}/>}
          <IconUser active={isActive('profil')}/>
          <Text style={[s.tabLabel, isActive('profil') && s.tabLabelActive]}>Profil</Text>
        </TouchableOpacity>

      </View>

      {/* ── MODAL FORMULAIRE ── */}
      <Modal visible={showFormModal} animationType="slide" transparent onRequestClose={() => setShowFormModal(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowFormModal(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width:'100%' }}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={s.sheet}>
                <View style={s.sheetHandle}/>
                <View style={s.sheetHeader}>
                  <View style={s.sheetIconWrap}><IconForm done={false}/></View>
                  <View>
                    <Text style={s.sheetTitle}>Formulaire médical</Text>
                    <Text style={s.sheetSub}>⚠ Obligatoire avant toute analyse</Text>
                  </View>
                </View>

                {[
                  { key:'nom',         label:'Nom complet *',          placeholder:'Jean Dupont',             kb:'default' },
                  { key:'age',         label:'Âge *',                  placeholder:'Ex: 32',                  kb:'numeric' },
                  { key:'antecedents', label:'Antécédents médicaux *', placeholder:'Ex: eczéma, psoriasis...', kb:'default' },
                  { key:'allergies',   label:'Allergies connues',      placeholder:'Ex: pénicilline...',      kb:'default' },
                ].map(({ key, label, placeholder, kb }) => {
                  const req = key !== 'allergies';
                  const err = formError && req && !formData[key as keyof typeof formData];
                  return (
                    <View key={key} style={s.fieldWrap}>
                      <Text style={[s.fieldLabel, err && { color:'#ef4444' }]}>{label}</Text>
                      <TextInput
                        style={[s.input, err && s.inputErr]}
                        placeholder={placeholder} placeholderTextColor="#bbb"
                        keyboardType={kb as any}
                        value={formData[key as keyof typeof formData]}
                        onChangeText={(t) => setFormData(p => ({ ...p, [key]:t }))}
                      />
                    </View>
                  );
                })}

                {formError && <View style={s.errBanner}><Text style={s.errTxt}>⚠ Remplissez tous les champs obligatoires (*)</Text></View>}
                {formSubmitted && <View style={s.okBanner}><Text style={s.okTxt}>✅ Formulaire soumis avec succès !</Text></View>}

                <TouchableOpacity style={s.submitBtn} onPress={handleFormSubmit} activeOpacity={0.85}>
                  <Text style={s.submitTxt}>Soumettre le formulaire</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:         { flex:1, backgroundColor:C.bg },
  scroll:       { flex:1 },
  scrollContent:{ paddingBottom:28 },
  header:       { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:C.card, paddingHorizontal:22, paddingTop:18, paddingBottom:18, borderBottomWidth:1, borderBottomColor:'#EEF5F3' },
  greeting:     { fontSize:13, color:C.textLight, fontWeight:'500', letterSpacing:0.3 },
  userName:     { fontSize:24, fontWeight:'800', color:C.text, marginTop:2, letterSpacing:-0.5 },
  headerRight:  { flexDirection:'row', alignItems:'center', gap:10 },
  iconBtn:      { width:46, height:46, borderRadius:14, alignItems:'center', justifyContent:'center', borderWidth:2 },
  iconBtnRed:   { backgroundColor:'#fff5f5', borderColor:'#ef4444' },
  iconBtnGreen: { backgroundColor:'#f0fdf4', borderColor:C.primary },
  dot:          { position:'absolute', top:-4, right:-4, width:12, height:12, borderRadius:6, backgroundColor:'#ef4444', borderWidth:2, borderColor:C.card },
  avatar:       { width:46, height:46, borderRadius:14, backgroundColor:C.primary, alignItems:'center', justifyContent:'center' },
  avatarTxt:    { color:'#fff', fontWeight:'800', fontSize:15, letterSpacing:0.5 },
  statsRow:     { flexDirection:'row', gap:10, marginHorizontal:18, marginTop:18 },
  statCard:     { flex:1, backgroundColor:C.card, borderRadius:18, padding:14, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:3 },
  statEmoji:    { fontSize:22, marginBottom:4 },
  statValue:    { fontSize:18, fontWeight:'800', color:C.text },
  statLabel:    { fontSize:10, color:C.textLight, marginTop:2, fontWeight:'600' },
  sectionLabel: { fontSize:13, fontWeight:'700', color:C.textLight, marginHorizontal:22, marginTop:22, marginBottom:12, letterSpacing:0.8, textTransform:'uppercase' },
  cardsRow:     { flexDirection:'row', gap:12, marginHorizontal:18 },
  cardGreen:    { flex:1, backgroundColor:C.primary, borderRadius:24, padding:20, overflow:'hidden', shadowColor:C.primary, shadowOffset:{width:0,height:10}, shadowOpacity:0.4, shadowRadius:16, elevation:8 },
  cardOrange:   { flex:1, backgroundColor:C.secondary, borderRadius:24, padding:20, overflow:'hidden', shadowColor:C.secondary, shadowOffset:{width:0,height:10}, shadowOpacity:0.4, shadowRadius:16, elevation:8 },
  cardGlow:     { position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:40, backgroundColor:'rgba(255,255,255,0.15)' },
  cardIconCircle:{ width:48, height:48, borderRadius:16, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center', marginBottom:14 },
  cardTitle:    { color:'#fff', fontWeight:'800', fontSize:17, letterSpacing:-0.3 },
  cardChip:     { backgroundColor:'rgba(255,255,255,0.25)', borderRadius:8, paddingHorizontal:8, paddingVertical:4, alignSelf:'flex-start', marginTop:10 },
  cardChipTxt:  { color:'#fff', fontSize:11, fontWeight:'700' },
  alertBox:     { flexDirection:'row', alignItems:'center', backgroundColor:'#fffbeb', borderWidth:1.5, borderColor:'#fde68a', borderRadius:16, padding:14, marginHorizontal:18, marginTop:18 },
  alertTitle:   { fontWeight:'700', fontSize:13, color:'#92400e' },
  alertText:    { fontSize:12, color:'#b45309', marginTop:2, lineHeight:17 },
  sectionHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginHorizontal:18, marginTop:24, marginBottom:12 },
  sectionTitle: { fontWeight:'800', fontSize:17, color:C.text },
  seeAllBtn:    { flexDirection:'row', alignItems:'center', gap:2 },
  seeAllTxt:    { color:C.primary, fontWeight:'700', fontSize:13 },
  analysisCard: { flexDirection:'row', alignItems:'center', gap:14, marginHorizontal:18, marginBottom:12, backgroundColor:C.card, borderRadius:20, padding:14, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:10, elevation:4 },
  analysisImg:  { width:64, height:64, borderRadius:16 },
  analysisTopRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:5 },
  tagBadge:     { borderRadius:8, paddingHorizontal:8, paddingVertical:3 },
  tagTxt:       { fontSize:10, fontWeight:'700' },
  analysisDate: { fontSize:10, color:C.textLight },
  analysisTitle:{ fontWeight:'800', fontSize:15, color:C.text, marginBottom:8 },
  confidenceRow:{ flexDirection:'row', alignItems:'center', gap:8 },
  confidenceBar:{ flex:1, height:5, backgroundColor:'#EEF5F3', borderRadius:3, overflow:'hidden' },
  confidenceFill:{ height:5, borderRadius:3 },
  confidencePct:{ fontSize:11, fontWeight:'700', minWidth:32 },
  conseilCard:  { marginHorizontal:18, backgroundColor:C.card, borderRadius:22, padding:18, flexDirection:'row', gap:16, alignItems:'flex-start', shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.06, shadowRadius:10, elevation:4 },
  conseilLeft:  { width:54, height:54, borderRadius:16, backgroundColor:'#fff7ed', alignItems:'center', justifyContent:'center' },
  conseilTitle: { fontWeight:'800', fontSize:15, color:C.text },
  conseilText:  { fontSize:13, color:C.textLight, marginTop:4, lineHeight:19 },
  conseilBtn:   { marginTop:10 },
  conseilBtnTxt:{ color:C.primary, fontWeight:'700', fontSize:13 },
  tipsRow:      { flexDirection:'row', gap:10, marginHorizontal:18, marginTop:14 },
  tipCard:      { flex:1, backgroundColor:C.card, borderRadius:18, padding:14, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:6, elevation:3 },
  tipEmoji:     { fontSize:24, marginBottom:6 },
  tipTitle:     { fontWeight:'800', fontSize:12, color:C.text },
  tipSub:       { fontSize:10, color:C.textLight, marginTop:2 },

  // ✅ Navbar — FAB séparé proprement
  navbar:        { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderTopWidth:1, borderTopColor:'#EEF5F3', height:74, paddingHorizontal:8, shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.07, shadowRadius:14, elevation:14 },
  tabItem:       { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:6, gap:4, position:'relative' },
  tabActiveBg:   { position:'absolute', top:4, width:44, height:32, borderRadius:12, backgroundColor:C.primary+'18' },
  tabLabel:      { fontSize:10, fontWeight:'600', color:C.inactive },
  tabLabelActive:{ color:C.primary },
  // ✅ View wrapper non-cliquable, le TouchableOpacity est seulement sur le bouton
  fabWrap:       { flex:1, alignItems:'center', justifyContent:'center', marginTop:-26 },
  fab:           { width:62, height:62, borderRadius:31, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:C.card, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:14, elevation:12 },

  // Modal
  overlay:      { flex:1, backgroundColor:'rgba(0,0,0,0.55)', justifyContent:'flex-end' },
  sheet:        { backgroundColor:C.card, borderTopLeftRadius:32, borderTopRightRadius:32, paddingHorizontal:24, paddingBottom:42, paddingTop:20 },
  sheetHandle:  { width:42, height:4, backgroundColor:'#e0e0e0', borderRadius:2, alignSelf:'center', marginBottom:24 },
  sheetHeader:  { flexDirection:'row', alignItems:'center', gap:12, marginBottom:24 },
  sheetIconWrap:{ width:48, height:48, borderRadius:14, backgroundColor:'#fff5f5', alignItems:'center', justifyContent:'center' },
  sheetTitle:   { fontWeight:'800', fontSize:18, color:C.text },
  sheetSub:     { fontSize:12, color:'#ef4444', fontWeight:'600', marginTop:2 },
  fieldWrap:    { marginBottom:16 },
  fieldLabel:   { fontSize:13, fontWeight:'700', color:C.textLight, marginBottom:7 },
  input:        { padding:14, borderRadius:14, borderWidth:1.5, borderColor:'#E2EEE9', fontSize:14, backgroundColor:'#F8FDFA', color:C.text },
  inputErr:     { borderColor:'#ef4444', backgroundColor:'#fff5f5', borderWidth:2 },
  errBanner:    { backgroundColor:'#fff5f5', borderWidth:1, borderColor:'#fecaca', borderRadius:12, padding:12, marginBottom:14 },
  errTxt:       { color:'#ef4444', fontSize:13, fontWeight:'600' },
  okBanner:     { backgroundColor:'#f0fdf4', borderWidth:1, borderColor:'#bbf7d0', borderRadius:12, padding:12, marginBottom:14, alignItems:'center' },
  okTxt:        { color:'#16a34a', fontSize:14, fontWeight:'700' },
  submitBtn:    { backgroundColor:C.primary, borderRadius:18, padding:17, alignItems:'center', shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.4, shadowRadius:14, elevation:8 },
  submitTxt:    { color:'#fff', fontWeight:'800', fontSize:16, letterSpacing:0.3 },
});
