// qualite.tsx — Vérification qualité via IA
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Animated, Easing, ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import API from '@/backend/src/api/client';

const C = { primary:'#00C6A7', bg:'#F0F6F4', card:'#FFFFFF', text:'#0D2B22', light:'#7A9E95', border:'#EEF5F3', red:'#ef4444', orange:'#f59e0b' };

const IconX = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={C.text} strokeWidth={2.2} strokeLinecap="round"/>
  </Svg>
);
const IconFocus = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Circle cx={12} cy={12} r={3} stroke={C.primary} strokeWidth={2}/>
  </Svg>
);
const IconSun = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={5} stroke={C.primary} strokeWidth={2}/>
    <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconTarget = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={C.primary} strokeWidth={2}/>
    <Circle cx={12} cy={12} r={5}  stroke={C.primary} strokeWidth={2}/>
    <Circle cx={12} cy={12} r={1.5} fill={C.primary}/>
  </Svg>
);
const IconCheckCircle = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={C.primary} strokeWidth={2} fill={C.primary+'22'}/>
    <Polyline points="9 12 11 14 15 10" stroke={C.primary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconAI = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2a10 10 0 110 20A10 10 0 0112 2z" stroke="#fff" strokeWidth={2}/>
    <Path d="M8 12s1.5-2 4-2 4 2 4 2" stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
    <Circle cx={9} cy={9} r={1.5} fill="#fff"/>
    <Circle cx={15} cy={9} r={1.5} fill="#fff"/>
  </Svg>
);

// ─── Barre animée ─────────────────────────────────────────────────────────────
function MetricBar({ label, Icon, value, loading }: {
  label: string; Icon: React.FC; value: number; loading: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (loading) return;
    const sub = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(anim, {
      toValue: value, duration: 900,
      easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
    return () => anim.removeListener(sub);
  }, [value, loading]);

  const widthInterp = anim.interpolate({ inputRange:[0,100], outputRange:['0%','100%'] });
  const color = value >= 70 ? C.primary : value >= 40 ? C.orange : C.red;

  return (
    <View style={b.row}>
      <View style={b.iconWrap}><Icon/></View>
      <View style={{ flex:1 }}>
        <View style={b.labelRow}>
          <Text style={b.label}>{label}</Text>
          {loading ? <ActivityIndicator size="small" color={C.primary}/> : (
            <Text style={[b.pct, { color }]}>{display}%</Text>
          )}
        </View>
        <View style={b.barBg}>
          <Animated.View style={[b.barFill, { width: widthInterp, backgroundColor: color }]}/>
        </View>
      </View>
    </View>
  );
}

export default function QualiteScanScreen() {
  const router = useRouter();
  const { imageUri, analyseId } = useLocalSearchParams<{ imageUri: string; analyseId: string }>();

  const [qualite,        setQualite]        = useState<any>(null);
  const [loading,        setLoading]        = useState(true);
  const [lancementLoading, setLancementLoading] = useState(false);
  const [error,          setError]          = useState('');
  console.log('analyseId reçu dans qualite.tsx =', analyseId);
  // ✅ Appelle le backend pour vérifier la qualité via IA
  useEffect(() => {
    verifierQualite();
  }, []);

const verifierQualite = async () => {
  try {
    setLoading(true);
    setError('');

    const idValue = Array.isArray(analyseId) ? analyseId[0] : analyseId;

    console.log('analyseId brut =', analyseId);
    console.log('analyseId utilisé =', idValue);

    if (!idValue || isNaN(Number(idValue))) {
      throw new Error(`analyseId invalide: ${String(idValue)}`);
    }

    const res = await API.get(`/analyses/${Number(idValue)}/qualite`);

    console.log('Réponse qualité =', res.data);

    setQualite(res.data);
  } catch (err: any) {
    console.log('Erreur qualité:', err?.response?.data || err?.message);
    setError(
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.message ||
      'Erreur de vérification qualité'
    );
    setQualite(null);
  } finally {
    setLoading(false);
  }
};

  // ✅ Lance l'analyse IA complète
const handleLancerAnalyse = async () => {
  try {
    setLancementLoading(true);
    setError('');

    await API.patch(`/analyses/${analyseId}/lancer`);

    router.replace({
      pathname: '/(tabs)/analysescan',
      params: { analyseId: String(analyseId) },
    });
  } catch (err: any) {
    console.log('Erreur lancement IA:', err?.response?.data || err?.message);
    setError(err?.response?.data?.message || err?.message || "Impossible de lancer l'analyse IA");
  } finally {
    setLancementLoading(false);
  }
};

  const metrics = [
    { label:'Netteté',       Icon:IconFocus,  value: qualite?.nettete      ?? 0 },
    { label:'Luminosité',    Icon:IconSun,    value: qualite?.luminosite   ?? 0 },
    { label:'Mise au point', Icon:IconTarget, value: qualite?.miseAuPoint  ?? 0 },
  ];

  const qualiteOk = qualite?.qualiteOk ?? false;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>
      <View style={s.header}>
        <TouchableOpacity style={s.closeBtn}
          onPress={() => router.push({ pathname:'/(tabs)/preview', params:{ imageUri, analyseId } })}
          activeOpacity={0.7}>
          <IconX/>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Vérification qualité</Text>
        <View style={{ width:40 }}/>
      </View>

      <View style={s.body}>
        <Text style={s.title}>Vérification de la qualité</Text>
        <Text style={s.subtitle}>
          {loading ? 'Analyse de votre image en cours...' : 'Résultats de la qualité image'}
        </Text>

        {/* Barres métriques */}
        <View style={s.metricsCard}>
          {metrics.map(({ label, Icon, value }, i) => (
            <View key={i}>
              <MetricBar label={label} Icon={Icon} value={value} loading={loading}/>
              {i < metrics.length - 1 && <View style={s.divider}/>}
            </View>
          ))}
        </View>

        {/* Résultat qualité */}
        {!loading && (
          <View style={[s.resultBanner, qualiteOk ? s.resultOk : s.resultBad]}>
            {qualiteOk ? <IconCheckCircle/> : (
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={C.red} strokeWidth={2} fill={C.red+'22'}/>
                <Path d="M12 8v4M12 16h.01" stroke={C.red} strokeWidth={2} strokeLinecap="round"/>
              </Svg>
            )}
            <Text style={[s.resultTxt, !qualiteOk && { color: C.red }]}>
              {qualiteOk ? 'Image de bonne qualité !' : 'Qualité insuffisante — recommencez'}
            </Text>
          </View>
        )}

        {/* Score global */}
        {!loading && qualite && (
  <View style={[s.resultBanner, qualiteOk ? s.resultOk : s.resultBad]}>
    {qualiteOk ? <IconCheckCircle/> : (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke={C.red} strokeWidth={2} fill={C.red+'22'}/>
        <Path d="M12 8v4M12 16h.01" stroke={C.red} strokeWidth={2} strokeLinecap="round"/>
      </Svg>
    )}
    <Text style={[s.resultTxt, !qualiteOk && { color: C.red }]}>
      {qualiteOk
        ? 'Image de bonne qualité !'
        : "La qualité est insuffisante, l'analyse peut être moins précise."}
    </Text>
  </View>
)}

        {error ? <Text style={s.errorTxt}>{error}</Text> : null}
      </View>

      {/* CTA */}
      <View style={s.footer}>
  {!loading && !qualiteOk && (
    <TouchableOpacity
      style={s.btnSecondary}
      onPress={() => router.push('/(tabs)/scan')}
      activeOpacity={0.88}
    >
      <Text style={s.btnSecondaryTxt}>Reprendre la photo</Text>
    </TouchableOpacity>
  )}

  <TouchableOpacity
    style={[s.btnPrimary, (loading || lancementLoading) && s.btnDisabled]}
    onPress={handleLancerAnalyse}
    activeOpacity={loading ? 1 : 0.88}
    disabled={loading || lancementLoading}
  >
    {lancementLoading ? (
      <ActivityIndicator color="#fff" size="small" />
    ) : (
      <IconAI />
    )}
    <Text style={s.btnTxt}>
      {lancementLoading ? "Lancement..." : "Lancer l'analyse IA"}
    </Text>
  </TouchableOpacity>

  {!loading && !qualiteOk && (
    <Text style={s.warningText}>
      L’analyse reste possible, mais le résultat peut être moins précis.
    </Text>
  )}

  {error ? <Text style={s.errorTxt}>{error}</Text> : null}
</View>
    </SafeAreaView>
  );
}

const b = StyleSheet.create({
  row:      { flexDirection:'row', alignItems:'center', gap:14, paddingVertical:14, paddingHorizontal:6 },
  iconWrap: { width:40, height:40, borderRadius:12, backgroundColor:'#00C6A718', alignItems:'center', justifyContent:'center' },
  labelRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:7 },
  label:    { fontSize:14, fontWeight:'700', color:'#0D2B22' },
  pct:      { fontSize:14, fontWeight:'800' },
  barBg:    { height:8, backgroundColor:'#EEF5F3', borderRadius:4, overflow:'hidden' },
  barFill:  { height:8, borderRadius:4 },
});

const s = StyleSheet.create({
  safe:        { flex:1, backgroundColor:C.bg },
  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:C.card, paddingHorizontal:18, paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border },
  closeBtn:    { width:40, height:40, borderRadius:12, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:17, fontWeight:'800', color:C.text },
  body:        { flex:1, paddingHorizontal:24, paddingTop:36 },
  title:       { fontSize:26, fontWeight:'900', color:C.text, textAlign:'center', letterSpacing:-0.5, marginBottom:8 },
  subtitle:    { fontSize:14, color:C.light, textAlign:'center', marginBottom:28 },
  metricsCard: { backgroundColor:C.card, borderRadius:22, paddingHorizontal:10, paddingVertical:6, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.07, shadowRadius:12, elevation:5 },
  divider:     { height:1, backgroundColor:C.border, marginHorizontal:6 },
  resultBanner:{ flexDirection:'row', alignItems:'center', gap:10, borderRadius:14, padding:14, marginTop:16, borderWidth:1.5 },
  resultOk:    { backgroundColor:'#f0fdfb', borderColor:'#00C6A744' },
  resultBad:   { backgroundColor:'#fff5f5', borderColor:'#ef444444' },
  resultTxt:   { fontSize:14, fontWeight:'700', color:C.text },
  scoreCard:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:C.card, borderRadius:14, padding:14, marginTop:12 },
  scoreLabel:  { fontSize:14, fontWeight:'600', color:C.light },
  scoreValue:  { fontSize:22, fontWeight:'900' },
  errorTxt:    { color:C.red, fontSize:13, fontWeight:'600', marginTop:10, textAlign:'center' },
  footer:      { paddingHorizontal:24, paddingBottom:36, gap:12 },
  btnPrimary:  { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, backgroundColor:C.primary, borderRadius:18, padding:17, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.4, shadowRadius:14, elevation:8 },
  btnDisabled: { backgroundColor:'#C5D9D5', shadowOpacity:0, elevation:0 },
  btnTxt:      { color:'#fff', fontWeight:'800', fontSize:15 },
  btnSecondary:{ flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, backgroundColor:C.card, borderRadius:18, padding:16, borderWidth:2, borderColor:C.primary },
  btnSecondaryTxt:{ color:C.primary, fontWeight:'800', fontSize:15 },
  warningText: {
  marginTop: 10,
  textAlign: 'center',
  color: C.orange,
  fontSize: 13,
  fontWeight: '600',
},
});