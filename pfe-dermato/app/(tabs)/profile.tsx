import React, { useState } from 'react';
import { logoutUser } from '@/backend/src/api/auth';
import { useRouter, usePathname } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Switch, Alert,
} from 'react-native';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';

// ─── Palette (identique aux autres écrans) ────────────────────────────────────
const C = {
  primary:  '#00C6A7',
  primary2: '#00957D',
  secondary:'#FF6B4A',
  bg:       '#F0F6F4',
  card:     '#FFFFFF',
  text:     '#0D2B22',
  light:    '#7A9E95',
  inactive: '#C5D9D5',
  border:   '#EEF5F3',
  red:      '#ef4444',
  orange:   '#f59e0b',
  verified: '#3b82f6',
};

type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconBack = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconEdit = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconChevron = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={C.inactive} strokeWidth={2.2} strokeLinecap="round"/>
  </Svg>
);
const IconVerified = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={C.verified} strokeWidth={2.2} strokeLinecap="round"/>
    <Path d="M22 4L12 14.01l-3-3" stroke={C.verified} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconUser2 = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={4} stroke={C.light} strokeWidth={2}/>
    <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconMail = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={4} width={20} height={16} rx={2} stroke={C.light} strokeWidth={2}/>
    <Path d="M2 7l10 7 10-7" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconPhone = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.1 2.82 2 2 0 012.1 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={C.light} strokeWidth={2} strokeLinejoin="round"/>
  </Svg>
);
const IconShield = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={C.light} strokeWidth={2} strokeLinejoin="round"/>
  </Svg>
);
const IconBell = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={C.light} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconHelpCircle = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={C.light} strokeWidth={2}/>
    <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconFileText = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={C.light} strokeWidth={2} strokeLinejoin="round"/>
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconLock = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={11} width={18} height={11} rx={2} stroke={C.light} strokeWidth={2}/>
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconLogOut = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={C.red} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconStar = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={C.orange} strokeWidth={2} fill={C.orange+'33'} strokeLinejoin="round"/>
  </Svg>
);
const IconActivity = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={C.light} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// ─── Navbar icons ─────────────────────────────────────────────────────────────
const IconHome = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 3l9 9v9H15v-5H9v5H3v-9z"
      stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinejoin="round"
      fill={active ? C.primary+'22' : 'none'}/>
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
    <Path d="M12 2a7 7 0 00-3.5 13.07V17a1 1 0 001 1h5a1 1 0 001-1v-1.93A7 7 0 0012 2z"
      stroke={active ? C.primary : C.inactive} strokeWidth={2}
      fill={active ? C.primary+'22' : 'none'}/>
    <Path d="M10 21h4" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconUserNav = ({ active }: { active: boolean }) => (
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

// ─── Reusable Row ─────────────────────────────────────────────────────────────
const Row = ({
  icon, label, value, onPress, danger = false,
}: {
  icon: React.ReactNode; label: string; value?: string;
  onPress?: () => void; danger?: boolean;
}) => (
  <TouchableOpacity style={r.row} onPress={onPress} activeOpacity={0.7}>
    <View style={r.rowIcon}>{icon}</View>
    <View style={{ flex:1 }}>
      <Text style={[r.rowLabel, danger && { color: C.red }]}>{label}</Text>
      {value ? <Text style={r.rowValue}>{value}</Text> : null}
    </View>
    <IconChevron/>
  </TouchableOpacity>
);

// ─── Toggle Row ───────────────────────────────────────────────────────────────
const ToggleRow = ({
  icon, label, value, onToggle,
}: {
  icon: React.ReactNode; label: string; value: boolean; onToggle: () => void;
}) => (
  <View style={r.row}>
    <View style={r.rowIcon}>{icon}</View>
    <Text style={[r.rowLabel, { flex:1 }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: C.inactive, true: C.primary }}
      thumbColor={C.card}
      ios_backgroundColor={C.inactive}
    />
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router   = useRouter();
  const pathname = usePathname();

  const [twoFA, setTwoFA]           = useState(true);
  const [notifications, setNotifs]  = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

 const isActive = (tabId: TabId): boolean => {
  if (tabId === 'accueil')    return pathname === '/(tabs)' || pathname === '/(tabs)/acceuil';
  if (tabId === 'historique') return pathname.startsWith('/(tabs)/historique');
  if (tabId === 'scan')       return pathname.startsWith('/(tabs)/scan');
  if (tabId === 'conseils')   return pathname.startsWith('/(tabs)/conseil');
  if (tabId === 'profil')     return pathname.startsWith('/(tabs)/profile');
  return false;
};

 const goTab = (tabId: TabId) => {
    switch (tabId) {
      case 'accueil':    router.push('/acceuil');         break;
      case 'historique': router.push('/historique');     break;
      case 'scan':       router.push('/scan');    break;
      case 'conseils':   router.push('/conseil');    break;
      case 'profil':     router.push('/profile'); break;
    }
  };


 const handleLogout = () => {
  Alert.alert('Se déconnecter', 'Voulez-vous vraiment vous déconnecter ?', [
    { text: 'Annuler', style: 'cancel' },
    {
      text: 'Déconnecter',
      style: 'destructive',
      onPress: async () => {
        try {
          await logoutUser(); // appel backend + suppression token local
          router.replace('/login');
        } catch (error) {
          console.log('Erreur logout:', error);
          router.replace('/login');
        }
      },
    },
  ]);
};
  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      {/* HEADER */}
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
        <Text style={s.headerTitle}>Mon profil</Text>
        <TouchableOpacity style={s.headerBtn} activeOpacity={0.7}>
          <IconEdit/>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── HERO PROFIL ── */}
        <View style={s.heroCard}>
          {/* Avatar */}
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>JD</Text>
            </View>
            <TouchableOpacity style={s.avatarEditBtn} activeOpacity={0.8}>
              <IconEdit/>
            </TouchableOpacity>
          </View>

          {/* Nom + badge vérifié */}
          <Text style={s.heroName}>Jean Dupont</Text>
          <View style={s.verifiedBadge}>
            <IconVerified/>
            <Text style={s.verifiedTxt}>Compte vérifié</Text>
          </View>
          <Text style={s.heroSince}>Membre depuis janvier 2025</Text>

          {/* Stats */}
          <View style={s.statsRow}>
            {[
              { value:'12', label:'Analyses', icon:'🔬' },
              { value:'3',  label:'Ce mois',  icon:'📅' },
              { value:'7j', label:'Série',    icon:'🔥' },
            ].map((st, i) => (
              <View key={i} style={[s.statItem, i < 2 && s.statBorder]}>
                <Text style={s.statEmoji}>{st.icon}</Text>
                <Text style={s.statValue}>{st.value}</Text>
                <Text style={s.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── SCORE SANTÉ ── */}
        <View style={s.scoreCard}>
          <View style={s.scoreLeft}>
            <Text style={s.scoreTitle}>Score santé</Text>
            <Text style={s.scoreSub}>Basé sur vos 12 analyses</Text>
          </View>
          <View style={s.scoreRight}>
            <Text style={s.scoreValue}>94</Text>
            <Text style={s.scoreUnit}>/100</Text>
          </View>
          <View style={s.scoreBarBg}>
            <View style={[s.scoreBarFill, { width: '94%' }]}/>
          </View>
          <Text style={s.scoreNote}>Excellent • Continuez vos bonnes habitudes 💚</Text>
        </View>

        {/* ── COMPTE ── */}
        <Text style={s.groupLabel}>COMPTE</Text>
        <View style={s.card}>
          <Row icon={<IconUser2/>}   label="Informations personnelles" onPress={() => {}}/>
          <View style={s.divider}/>
          <Row icon={<IconMail/>}    label="Email" value="jean.dupont@gmail.com" onPress={() => {}}/>
          <View style={s.divider}/>
          <Row icon={<IconPhone/>}   label="Téléphone" value="+33 6 12 34 56 78" onPress={() => {}}/>
          <View style={s.divider}/>
          <Row icon={<IconActivity/>} label="Historique médical" onPress={() => router.push('/historique')}/>
        </View>

        {/* ── SÉCURITÉ ── */}
        <Text style={s.groupLabel}>SÉCURITÉ</Text>
        <View style={s.card}>
          <ToggleRow icon={<IconShield/>} label="Double authentification" value={twoFA} onToggle={() => setTwoFA(v => !v)}/>
          <View style={s.divider}/>
          <ToggleRow icon={<IconBell/>}   label="Notifications push"      value={notifications} onToggle={() => setNotifs(v => !v)}/>
          <View style={s.divider}/>
          <ToggleRow icon={<IconMail/>}   label="Alertes par email"       value={emailAlerts} onToggle={() => setEmailAlerts(v => !v)}/>
          <View style={s.divider}/>
          <Row icon={<IconLock/>} label="Changer le mot de passe" onPress={() => {}}/>
        </View>

        {/* ── ABONNEMENT ── */}
        <Text style={s.groupLabel}>ABONNEMENT</Text>
        <TouchableOpacity style={s.proCard} activeOpacity={0.88}>
          <View style={s.proLeft}>
            <View style={s.proBadge}>
              <Text style={s.proBadgeTxt}>GRATUIT</Text>
            </View>
            <Text style={s.proTitle}>Passer à DermaPro+</Text>
            <Text style={s.proSub}>Analyses illimitées, rapport PDF, priorité médecin</Text>
          </View>
          <View style={s.proStars}>
            <IconStar/>
          </View>
        </TouchableOpacity>

        {/* ── SUPPORT ── */}
        <Text style={s.groupLabel}>SUPPORT</Text>
        <View style={s.card}>
          <Row icon={<IconHelpCircle/>} label="Aide et FAQ"                  onPress={() => {}}/>
          <View style={s.divider}/>
          <Row icon={<IconFileText/>}   label="Conditions d'utilisation"     onPress={() => {}}/>
          <View style={s.divider}/>
          <Row icon={<IconLock/>}       label="Politique de confidentialité" onPress={() => {}}/>
        </View>

        {/* ── DANGER ZONE ── */}
        <Text style={s.groupLabel}>ZONE DANGEREUSE</Text>
        <View style={s.card}>
          <TouchableOpacity style={s.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={[s.rowIcon, { backgroundColor: '#fff5f5' }]}><IconLogOut/></View>
            <Text style={[s.rowLabelDanger]}>Se déconnecter</Text>
          </TouchableOpacity>
          <View style={s.divider}/>
          <TouchableOpacity style={s.logoutRow} onPress={handleDeleteAccount} activeOpacity={0.7}>
            <View style={[s.rowIcon, { backgroundColor: '#fff5f5' }]}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
                  stroke={C.red} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </View>
            <Text style={s.rowLabelDanger}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={s.versionTxt}>DermaVision v1.0.0</Text>

      </ScrollView>

      {/* ── BOTTOM NAVBAR ── */}
      <View style={s.navbar}>
        {([
          { id:'accueil',    label:'Accueil',    Icon:IconHome    },
          { id:'historique', label:'Historique', Icon:IconClock   },
          { id:'scan',       label:'',           Icon:null, fab:true },
          { id:'conseils',   label:'Conseils',   Icon:IconBulb    },
          { id:'profil',     label:'Profil',     Icon:IconUserNav },
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

// ─── Row styles (separate for reuse) ─────────────────────────────────────────
const r = StyleSheet.create({
  row:        { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:13, paddingHorizontal:16 },
  rowIcon:    { width:36, height:36, borderRadius:10, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  rowLabel:   { fontSize:14, fontWeight:'600', color:C.text },
  rowValue:   { fontSize:12, color:C.light, marginTop:2, fontWeight:'500' },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex:1, backgroundColor:C.bg },
  scroll:        { flex:1 },
  scrollContent: { paddingBottom:32 },

  // Header
  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:C.card, paddingHorizontal:18, paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border },
  headerBtn:   { width:40, height:40, borderRadius:12, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:17, fontWeight:'800', color:C.text, letterSpacing:-0.3 },

  // Hero card
  heroCard:     { backgroundColor:C.card, marginHorizontal:18, marginTop:18, borderRadius:24, padding:22, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.08, shadowRadius:14, elevation:5 },
  avatarWrap:   { position:'relative', marginBottom:14 },
  avatar:       { width:80, height:80, borderRadius:24, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', shadowColor:C.primary, shadowOffset:{width:0,height:6}, shadowOpacity:0.35, shadowRadius:12, elevation:8 },
  avatarTxt:    { color:'#fff', fontWeight:'900', fontSize:26, letterSpacing:1 },
  avatarEditBtn:{ position:'absolute', bottom:-6, right:-6, width:28, height:28, borderRadius:9, backgroundColor:C.card, borderWidth:2, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  heroName:     { fontSize:22, fontWeight:'900', color:C.text, letterSpacing:-0.5, marginBottom:6 },
  verifiedBadge:{ flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'#eff6ff', borderRadius:10, paddingHorizontal:10, paddingVertical:5, marginBottom:5 },
  verifiedTxt:  { fontSize:12, fontWeight:'700', color:C.verified },
  heroSince:    { fontSize:12, color:C.light, marginBottom:18, fontWeight:'500' },
  statsRow:     { flexDirection:'row', width:'100%', backgroundColor:C.bg, borderRadius:16, overflow:'hidden' },
  statItem:     { flex:1, alignItems:'center', paddingVertical:12 },
  statBorder:   { borderRightWidth:1, borderRightColor:C.border },
  statEmoji:    { fontSize:16, marginBottom:4 },
  statValue:    { fontSize:18, fontWeight:'900', color:C.text },
  statLabel:    { fontSize:10, color:C.light, marginTop:2, fontWeight:'600' },

  // Score card
  scoreCard:  { backgroundColor:C.card, marginHorizontal:18, marginTop:14, borderRadius:20, padding:18, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.06, shadowRadius:10, elevation:4 },
  scoreLeft:  { flex:1 },
  scoreRight: { flexDirection:'row', alignItems:'flex-end', gap:2, position:'absolute', right:18, top:18 },
  scoreValue: { fontSize:36, fontWeight:'900', color:C.primary, lineHeight:40 },
  scoreUnit:  { fontSize:14, color:C.light, fontWeight:'700', marginBottom:4 },
  scoreTitle: { fontSize:16, fontWeight:'800', color:C.text, marginBottom:2 },
  scoreSub:   { fontSize:12, color:C.light, marginBottom:14 },
  scoreBarBg: { height:8, backgroundColor:C.border, borderRadius:4, overflow:'hidden', marginTop:10, marginBottom:8 },
  scoreBarFill:{ height:8, backgroundColor:C.primary, borderRadius:4 },
  scoreNote:  { fontSize:12, color:C.light, fontWeight:'600' },

  // Groups
  groupLabel: { fontSize:11, fontWeight:'800', color:C.light, marginHorizontal:18, marginTop:22, marginBottom:10, letterSpacing:1.2, textTransform:'uppercase' },
  card:       { backgroundColor:C.card, marginHorizontal:18, borderRadius:20, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.06, shadowRadius:10, elevation:4 },
  divider:    { height:1, backgroundColor:C.border, marginHorizontal:16 },

  // Row styles inlined
  rowIcon:        { width:36, height:36, borderRadius:10, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  rowLabelDanger: { fontSize:14, fontWeight:'700', color:C.red, flex:1 },
  logoutRow:      { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:13, paddingHorizontal:16 },

  // Pro / upgrade card
  proCard:   { marginHorizontal:18, borderRadius:20, padding:18, backgroundColor:'#0D2B22', flexDirection:'row', alignItems:'center', shadowColor:'#0D2B22', shadowOffset:{width:0,height:8}, shadowOpacity:0.3, shadowRadius:16, elevation:8 },
  proLeft:   { flex:1 },
  proBadge:  { backgroundColor:C.primary+'33', borderRadius:6, paddingHorizontal:8, paddingVertical:3, alignSelf:'flex-start', marginBottom:8 },
  proBadgeTxt:{ fontSize:10, fontWeight:'800', color:C.primary, letterSpacing:1 },
  proTitle:  { fontSize:15, fontWeight:'800', color:'#fff', marginBottom:4 },
  proSub:    { fontSize:12, color:C.inactive, lineHeight:17 },
  proStars:  { width:44, height:44, borderRadius:14, backgroundColor:C.primary+'22', alignItems:'center', justifyContent:'center' },

  // Version
  versionTxt: { textAlign:'center', fontSize:12, color:C.inactive, marginTop:24, marginBottom:4, fontWeight:'500' },

  // Navbar
  navbar:        { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderTopWidth:1, borderTopColor:C.border, height:74, paddingHorizontal:8, shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.07, shadowRadius:14, elevation:14 },
  tabItem:       { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:6, gap:4, position:'relative' },
  tabActiveBg:   { position:'absolute', top:4, width:44, height:32, borderRadius:12, backgroundColor:C.primary+'18' },
  tabLabel:      { fontSize:10, fontWeight:'600', color:C.inactive },
  tabLabelActive:{ color:C.primary },
  fabWrap:       { flex:1, alignItems:'center', justifyContent:'center', marginTop:-26 },
  fab:           { width:62, height:62, borderRadius:31, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:C.card, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:14, elevation:12 },
});
