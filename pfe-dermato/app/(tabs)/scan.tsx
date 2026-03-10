// ─── ÉCRAN 1 : scan.tsx — Conseils pour une bonne photo ──────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const C = {
  primary: '#00C6A7', bg: '#F8FDFB', card: '#FFFFFF',
  text: '#0D2B22', light: '#7A9E95', border: '#EEF5F3',
};

const IconX = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={C.text} strokeWidth={2.2} strokeLinecap="round"/>
  </Svg>
);
const IconSun = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={5} stroke={C.primary} strokeWidth={2}/>
    <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconFrame = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"
      stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Circle cx={12} cy={12} r={3} stroke={C.primary} strokeWidth={2}/>
  </Svg>
);
const IconFocus = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3} stroke={C.primary} strokeWidth={2}/>
    <Circle cx={12} cy={12} r={7} stroke={C.primary} strokeWidth={2} strokeDasharray="3 3"/>
  </Svg>
);
const IconCamera = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
      stroke="#fff" strokeWidth={2} strokeLinejoin="round"/>
    <Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={2}/>
  </Svg>
);

const tips = [
  { Icon: IconSun,   title: 'Bonne luminosité',   sub: 'Utilisez la lumière naturelle si possible' },
  { Icon: IconFrame, title: 'Zone bien cadrée',    sub: 'Centrez la lésion dans le cadre' },
  { Icon: IconFocus, title: 'Image nette',         sub: "Maintenez l'appareil stable" },
];

export default function ScanTipsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.closeBtn}
           onPress={() => router.back()} activeOpacity={0.7}>
          <IconX/>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Nouvelle analyse</Text>
        <View style={{ width: 40 }}/>
      </View>

      {/* BODY */}
      <View style={s.body}>
        <Text style={s.title}>Conseils pour une bonne photo</Text>
        <Text style={s.subtitle}>Suivez ces conseils pour obtenir une analyse précise</Text>

        <View style={s.tipsWrap}>
          {tips.map(({ Icon, title, sub }, i) => (
            <View key={i} style={s.tipCard}>
              <View style={s.tipIconWrap}><Icon/></View>
              <View style={{ flex: 1 }}>
                <Text style={s.tipTitle}>{title}</Text>
                <Text style={s.tipSub}>{sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* FOOTER */}
      <View style={s.footer}>
        {/* ✅ Route vers camera.tsx */}
        <TouchableOpacity style={s.btnPrimary}
          onPress={() => router.push('/(tabs)/camera')}
          activeOpacity={0.88}>
          <IconCamera/>
          <Text style={s.btnPrimaryTxt}>Prendre une photo</Text>
        </TouchableOpacity>

        {/* ✅ Route vers previewscan.tsx */}
        <TouchableOpacity style={s.btnSecondary}
          onPress={() => router.push('/preview')}
          activeOpacity={0.88}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Rect x={3}  y={3}  width={7} height={7} rx={1} stroke={C.primary} strokeWidth={2}/>
            <Rect x={14} y={3}  width={7} height={7} rx={1} stroke={C.primary} strokeWidth={2}/>
            <Rect x={14} y={14} width={7} height={7} rx={1} stroke={C.primary} strokeWidth={2}/>
            <Rect x={3}  y={14} width={7} height={7} rx={1} stroke={C.primary} strokeWidth={2}/>
          </Svg>
          <Text style={s.btnSecondaryTxt}>Choisir depuis la galerie</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  closeBtn:    { width: 40, height: 40, borderRadius: 12, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: C.text },
  body:    { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  title:   { fontSize: 26, fontWeight: '900', color: C.text, textAlign: 'center', letterSpacing: -0.6, marginBottom: 10 },
  subtitle:{ fontSize: 14, color: C.light, textAlign: 'center', lineHeight: 20, marginBottom: 36 },
  tipsWrap:{ gap: 14 },
  tipCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.card, borderRadius: 18, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  tipIconWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.primary + '18', alignItems: 'center', justifyContent: 'center' },
  tipTitle:{ fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 3 },
  tipSub:  { fontSize: 13, color: C.light, lineHeight: 18 },
  footer:  { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  btnPrimary:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.primary, borderRadius: 18, padding: 17, shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 8 },
  btnPrimaryTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnSecondary:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 2, borderColor: C.primary },
  btnSecondaryTxt:{ color: C.primary, fontWeight: '800', fontSize: 15 },
});
