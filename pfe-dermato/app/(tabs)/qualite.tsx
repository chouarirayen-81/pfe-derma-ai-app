// ─── ÉCRAN 4 : qualitéscan.tsx — Vérification qualité ────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Animated, Easing,
} from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';

const C = { primary: '#00C6A7', bg: '#F0F6F4', card: '#FFFFFF', text: '#0D2B22', light: '#7A9E95', border: '#EEF5F3' };

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
    <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
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
    <Circle cx={12} cy={12} r={10} stroke={C.primary} strokeWidth={2} fill={C.primary + '22'}/>
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

// ── Barre animée ──────────────────────────────────────────────────────────────
function MetricBar({ label, Icon, target, delay }: {
  label: string; Icon: React.FC; target: number; delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const sub = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: target, duration: 900,
        easing: Easing.out(Easing.cubic), useNativeDriver: false,
      }).start();
    }, delay);
    return () => { clearTimeout(timer); anim.removeListener(sub); };
  }, []);

  const widthInterp = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={b.row}>
      <View style={b.iconWrap}><Icon/></View>
      <View style={{ flex: 1 }}>
        <View style={b.labelRow}>
          <Text style={b.label}>{label}</Text>
          <Text style={b.pct}>{display}%</Text>
        </View>
        <View style={b.barBg}>
          <Animated.View style={[b.barFill, { width: widthInterp }]}/>
        </View>
      </View>
    </View>
  );
}

const metrics = [
  { label: 'Netteté',       Icon: IconFocus,  target: 92, delay: 0   },
  { label: 'Luminosité',    Icon: IconSun,    target: 88, delay: 300 },
  { label: 'Mise au point', Icon: IconTarget, target: 95, delay: 600 },
];

export default function QualiteScanScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.closeBtn}
          onPress={() => router.push('/preview')}
          activeOpacity={0.7}>
          <IconX/>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Nouvelle analyse</Text>
        <View style={{ width: 40 }}/>
      </View>

      <View style={s.body}>
        <Text style={s.title}>Vérification de la qualité</Text>
        <Text style={s.subtitle}>Analyse de votre image en cours...</Text>

        {/* BARRES */}
        <View style={s.metricsCard}>
          {metrics.map(({ label, Icon, target, delay }, i) => (
            <View key={i}>
              <MetricBar label={label} Icon={Icon} target={target} delay={delay}/>
              {i < metrics.length - 1 && <View style={s.divider}/>}
            </View>
          ))}
        </View>

        {/* SUCCÈS */}
        {ready && (
          <View style={s.successBanner}>
            <IconCheckCircle/>
            <Text style={s.successTxt}>Image de bonne qualité !</Text>
          </View>
        )}
      </View>

      {/* CTA → analysescan.tsx */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btnPrimary, !ready && s.btnDisabled]}
          onPress={() => ready && router.push('/(tabs)/analysescan')}
          activeOpacity={ready ? 0.88 : 1}>
          <IconAI/>
          <Text style={s.btnTxt}>Lancer l'analyse IA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const b = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 6 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#00C6A718', alignItems: 'center', justifyContent: 'center' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  label:    { fontSize: 14, fontWeight: '700', color: '#0D2B22' },
  pct:      { fontSize: 14, fontWeight: '800', color: '#00C6A7' },
  barBg:    { height: 8, backgroundColor: '#EEF5F3', borderRadius: 4, overflow: 'hidden' },
  barFill:  { height: 8, backgroundColor: '#00C6A7', borderRadius: 4 },
});

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  closeBtn:    { width: 40, height: 40, borderRadius: 12, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: C.text },
  body:    { flex: 1, paddingHorizontal: 24, paddingTop: 36 },
  title:   { fontSize: 26, fontWeight: '900', color: C.text, textAlign: 'center', letterSpacing: -0.5, marginBottom: 8 },
  subtitle:{ fontSize: 14, color: C.light, textAlign: 'center', marginBottom: 28 },
  metricsCard: { backgroundColor: C.card, borderRadius: 22, paddingHorizontal: 10, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 5 },
  divider:     { height: 1, backgroundColor: C.border, marginHorizontal: 6 },
  successBanner:{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f0fdfb', borderWidth: 1.5, borderColor: '#00C6A744', borderRadius: 14, padding: 14, marginTop: 20 },
  successTxt:  { fontSize: 14, fontWeight: '700', color: C.text },
  footer:  { paddingHorizontal: 24, paddingBottom: 36 },
  btnPrimary:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.primary, borderRadius: 18, padding: 17, shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 8 },
  btnDisabled: { backgroundColor: '#C5D9D5', shadowOpacity: 0, elevation: 0 },
  btnTxt:      { color: '#fff', fontWeight: '800', fontSize: 15 },
});
