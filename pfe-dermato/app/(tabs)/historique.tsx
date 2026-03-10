import React, { useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  TextInput, StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';
type FilterId = 'toutes' | 'ce_mois' | 'en_attente';

interface AnalysisItem {
  id: number; date: string; title: string;
  confidence: number; color: string; img: string; status: 'done' | 'pending';
}

const allAnalyses: AnalysisItem[] = [
  { id:1, date:'3 février 2026',   title:'Eczéma léger',       confidence:87, color:'#10b981', img:'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=120&h=120&fit=crop', status:'done' },
  { id:2, date:'2 janvier 2026',   title:'Acné modérée',       confidence:92, color:'#f59e0b', img:'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=120&h=120&fit=crop', status:'done' },
  { id:3, date:'28 décembre 2025', title:'Réaction allergique', confidence:76, color:'#6366f1', img:'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop', status:'done' },
  { id:4, date:'10 décembre 2025', title:'Dermatite contact',  confidence:81, color:'#ef4444', img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&h=120&fit=crop', status:'pending' },
];

const C = {
  primary:'#00C6A7', primary2:'#00957D', secondary:'#FF6B4A',
  bg:'#F0F6F4', card:'#FFFFFF', text:'#0D2B22',
  light:'#7A9E95', textLight:'#7A9E95', inactive:'#C5D9D5', border:'#EEF5F3',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconBack = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconFilter = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2l8 9.46V19l4 2v-7.54L22 3z" stroke={C.text} strokeWidth={2} strokeLinejoin="round"/>
  </Svg>
);
const IconSearch = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={11} cy={11} r={8} stroke={C.light} strokeWidth={2}/>
    <Path d="M21 21l-4.35-4.35" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconChevron = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={C.light} strokeWidth={2.2} strokeLinecap="round"/>
  </Svg>
);
const IconTrash = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconCalendar = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={4} width={18} height={18} rx={2} stroke={C.light} strokeWidth={2}/>
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);

// ─── Navbar icons (same as HomeScreen) ───────────────────────────────────────
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
      stroke={active ? C.primary : C.inactive} strokeWidth={2} fill={active ? C.primary+'22' : 'none'}/>
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HistoriqueScreen() {
  // ✅ Same pattern as HomeScreen
  const router   = useRouter();
  const pathname = usePathname();

  const [search, setSearch]             = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterId>('toutes');
  const [analyses, setAnalyses]         = useState<AnalysisItem[]>(allAnalyses);

  // ✅ Exact same isActive logic as HomeScreen
  const isActive = (tabId: TabId): boolean => {
    if (tabId === 'accueil')    return pathname === '/acceuil' || pathname === '/acceuil';
    if (tabId === 'historique') return pathname.startsWith('/historique');
    if (tabId === 'scan')       return pathname.startsWith('/(tabs)/scan');
    if (tabId === 'conseils')   return pathname.startsWith('/(tabs)/tips');
    if (tabId === 'profil')     return pathname.startsWith('/(tabs)/profile');
    return false;
  };

  // ✅ Exact same goTab logic as HomeScreen
  const goTab = (tabId: TabId) => {
    switch (tabId) {
      case 'accueil':    router.push('/(tabs)'); break;
      case 'historique': router.push('/historique'); break;
      case 'scan':       router.push('/(tabs)/scan'); break;
      case 'conseils':   router.push('/conseil'); break;
      case 'profil':     router.push('/(tabs)/profile'); break;
    }
  };

  const totalCount     = analyses.length;
  const thisMonthCount = analyses.filter(a => a.date.includes('2026') && a.status === 'done').length;
  const pendingCount   = analyses.filter(a => a.status === 'pending').length;

  const filtered = analyses.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === 'ce_mois')    return matchSearch && a.date.includes('2026');
    if (activeFilter === 'en_attente') return matchSearch && a.status === 'pending';
    return matchSearch;
  });

  const handleDelete = (id: number) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cette analyse ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive',
        onPress: () => setAnalyses(prev => prev.filter(a => a.id !== id)) },
    ]);
  };

  const statCards = [
    { label:'Total',       value:totalCount,     id:'toutes'      as FilterId, accentColor:C.primary },
    { label:'Ce mois',     value:thisMonthCount, id:'ce_mois'     as FilterId, accentColor:C.primary },
    { label:'En attente',  value:pendingCount,   id:'en_attente'  as FilterId, accentColor:'#f59e0b' },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} activeOpacity={0.7} onPress={() => router.push('/(tabs)')}>
          <IconBack/>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Historique</Text>
        <TouchableOpacity style={s.headerBtn} activeOpacity={0.7}>
          <IconFilter/>
        </TouchableOpacity>
      </View>

      {/* SCROLL */}
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* SEARCH */}
        <View style={s.searchWrap}>
          <IconSearch/>
          <TextInput style={s.searchInput} placeholder="Rechercher une analyse..."
            placeholderTextColor={C.light} value={search} onChangeText={setSearch}/>
        </View>

        {/* FILTER STATS */}
        <View style={s.statsRow}>
          {statCards.map((st) => {
            const active    = activeFilter === st.id;
            const isPending = st.id === 'en_attente';
            return (
              <TouchableOpacity key={st.id}
              
                style={[s.statCard, active && s.statCardActive,
                  active && isPending && { borderColor:'#f59e0b', backgroundColor:'#fffbeb' }]}
                onPress={() => router.push('/suithistorique')} activeOpacity={0.8}>
                <Text style={[s.statValue, active && { color: st.accentColor }]}>{st.value}</Text>
                <Text style={[s.statLabel, active && { color: st.accentColor }]}>{st.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LIST HEADER */}
        <View style={s.listHeader}>
          <Text style={s.listTitle}>Toutes les analyses</Text>
          <Text style={s.listCount}>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</Text>
        </View>

        {/* LIST */}
        {filtered.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyEmoji}>🔍</Text>
            <Text style={s.emptyText}>Aucune analyse trouvée</Text>
          </View>
        ) : filtered.map((item) => (
          <View key={item.id} style={s.cardWrap}>
            <TouchableOpacity style={s.card} activeOpacity={0.82}>
              <Image source={{ uri: item.img }} style={s.cardImg}/>
              <View style={{ flex:1 }}>
                <View style={s.cardTopRow}>
                  <IconCalendar/>
                  <Text style={s.cardDate}>{item.date}</Text>
                </View>
                <Text style={s.cardTitle}>{item.title}</Text>
                <View style={[s.confidenceBadge, { backgroundColor: item.color+'18' }]}>
                  <View style={[s.confidenceDot, { backgroundColor: item.color }]}/>
                  <Text style={[s.confidenceTxt, { color: item.color }]}>{item.confidence}% confiance</Text>
                </View>
              </View>
              <IconChevron/>
            </TouchableOpacity>
            <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(item.id)} activeOpacity={0.7}>
              <IconTrash/>
              <Text style={s.deleteTxt}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAVBAR — exact same structure as HomeScreen */}
      <View style={s.navbar}>
        {([
          { id:'accueil',    label:'Accueil',    Icon:IconHome  },
          { id:'historique', label:'Historique', Icon:IconClock },
          { id:'scan',       label:'',           Icon:null, fab:true },
          { id:'conseils',   label:'Conseils',   Icon:IconBulb  },
          { id:'profil',     label:'Profil',     Icon:IconUser  },
        ] as any[]).map((tab) => {
          const active = isActive(tab.id);
          if (tab.fab) return (
            <TouchableOpacity key="scan" style={s.fabWrap} onPress={() => goTab('scan')} activeOpacity={0.85}>
              <View style={s.fab}><IconCamera/></View>
            </TouchableOpacity>
          );
          const Icon = tab.Icon;
          return (
            <TouchableOpacity key={tab.id} style={s.tabItem} onPress={() => goTab(tab.id as TabId)} activeOpacity={0.7}>
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
  scrollContent: { paddingBottom:28 },

  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:C.card, paddingHorizontal:18, paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border },
  headerBtn:   { width:40, height:40, borderRadius:12, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:18, fontWeight:'800', color:C.text, letterSpacing:-0.3 },

  searchWrap:  { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:C.card, borderRadius:16, marginHorizontal:18, marginTop:18, paddingHorizontal:16, paddingVertical:13, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:3 },
  searchInput: { flex:1, fontSize:14, color:C.text, padding:0 },

  statsRow:      { flexDirection:'row', gap:10, marginHorizontal:18, marginTop:14 },
  statCard:      { flex:1, backgroundColor:C.card, borderRadius:16, padding:14, alignItems:'center', borderWidth:2, borderColor:'transparent', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.04, shadowRadius:6, elevation:2 },
  statCardActive:{ borderColor:C.primary, backgroundColor:'#f0fdfb' },
  statValue:     { fontSize:22, fontWeight:'800', color:C.text },
  statLabel:     { fontSize:11, color:C.light, marginTop:3, fontWeight:'600' },

  listHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginHorizontal:18, marginTop:22, marginBottom:14 },
  listTitle:  { fontSize:17, fontWeight:'800', color:C.text },
  listCount:  { fontSize:13, color:C.light, fontWeight:'600' },

  cardWrap:  { marginHorizontal:18, marginBottom:4 },
  card:      { flexDirection:'row', alignItems:'center', gap:14, backgroundColor:C.card, borderRadius:20, padding:14, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:10, elevation:4 },
  cardImg:   { width:62, height:62, borderRadius:16 },
  cardTopRow:{ flexDirection:'row', alignItems:'center', gap:5, marginBottom:4 },
  cardDate:  { fontSize:11, color:C.light, fontWeight:'500' },
  cardTitle: { fontSize:15, fontWeight:'800', color:C.text, marginBottom:7 },
  confidenceBadge:{ flexDirection:'row', alignItems:'center', gap:5, alignSelf:'flex-start', borderRadius:8, paddingHorizontal:8, paddingVertical:4 },
  confidenceDot:  { width:6, height:6, borderRadius:3 },
  confidenceTxt:  { fontSize:12, fontWeight:'700' },

  deleteBtn: { flexDirection:'row', alignItems:'center', gap:5, alignSelf:'flex-end', paddingVertical:8, paddingHorizontal:4, marginTop:2, marginBottom:8 },
  deleteTxt: { fontSize:12, color:'#ef4444', fontWeight:'600' },

  emptyWrap: { alignItems:'center', paddingTop:60 },
  emptyEmoji:{ fontSize:48 },
  emptyText: { fontSize:15, color:C.light, marginTop:12, fontWeight:'600' },

  // Navbar — copy of HomeScreen
  navbar:        { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderTopWidth:1, borderTopColor:C.border, height:74, paddingHorizontal:8, shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.07, shadowRadius:14, elevation:14 },
  tabItem:       { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:6, gap:4, position:'relative' },
  tabActiveBg:   { position:'absolute', top:4, width:44, height:32, borderRadius:12, backgroundColor:C.primary+'18' },
  tabLabel:      { fontSize:10, fontWeight:'600', color:C.inactive },
  tabLabelActive:{ color:C.primary },
  fabWrap:       { flex:1, alignItems:'center', justifyContent:'center', marginTop:-26 },
  fab:           { width:62, height:62, borderRadius:31, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:C.card, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:14, elevation:12 },
});
