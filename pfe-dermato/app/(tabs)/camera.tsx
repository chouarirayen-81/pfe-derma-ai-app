// ─── ÉCRAN 2 : camera.tsx — Viewfinder ───────────────────────────────────────
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Dimensions,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: W } = Dimensions.get('window');
const C = { primary: '#00C6A7', bg: '#111' };

const IconX = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth={2.2} strokeLinecap="round"/>
  </Svg>
);
const IconFlash = ({ on }: { on: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke={on ? C.primary : '#fff'} strokeWidth={2}
      fill={on ? C.primary + '44' : 'none'} strokeLinejoin="round"/>
  </Svg>
);
const IconFlip = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6M23 20v-6h-6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"
      stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconGallery = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h6v6H4zM14 4h6v6h-6zM14 14h6v6h-6zM4 14h6v6H4z"
      stroke="#fff" strokeWidth={1.8} strokeLinejoin="round"/>
  </Svg>
);

// Coins du cadre
const Corner = ({ pos }: { pos: 'tl'|'tr'|'bl'|'br' }) => {
  const h = pos.includes('r') ? 'right' : 'left';
  const v = pos.includes('b') ? 'bottom' : 'top';
  return (
    <View style={[frame.corner, { [h]: 0, [v]: 0 }]}>
      <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        {pos === 'tl' && <Path d="M2 20V4a2 2 0 012-2h16" stroke={C.primary} strokeWidth={3} strokeLinecap="round"/>}
        {pos === 'tr' && <Path d="M34 20V4a2 2 0 00-2-2H16" stroke={C.primary} strokeWidth={3} strokeLinecap="round"/>}
        {pos === 'bl' && <Path d="M2 16v16a2 2 0 002 2h16" stroke={C.primary} strokeWidth={3} strokeLinecap="round"/>}
        {pos === 'br' && <Path d="M34 16v16a2 2 0 01-2 2H16" stroke={C.primary} strokeWidth={3} strokeLinecap="round"/>}
      </Svg>
    </View>
  );
};

const frame = StyleSheet.create({
  corner: { position: 'absolute', width: 36, height: 36 },
});

export default function CameraScreen() {
  const router = useRouter();
  const [flash, setFlash] = useState(false);
  const FRAME = W * 0.72;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#111"/>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn}
          onPress={() => router.push('/(tabs)/scan')}
          activeOpacity={0.7}>
          <IconX/>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Nouvelle analyse</Text>
        <TouchableOpacity style={s.iconBtn}
          onPress={() => setFlash(v => !v)}
          activeOpacity={0.7}>
          <IconFlash on={flash}/>
        </TouchableOpacity>
      </View>

      {/* VIEWFINDER */}
      <View style={s.viewfinder}>
        <View style={s.cameraFeed}/>

        {/* Overlays sombres */}
        <View style={[s.overlay, { top: 0, left: 0, right: 0, height: '18%' }]}/>
        <View style={[s.overlay, { bottom: 0, left: 0, right: 0, height: '18%' }]}/>
        <View style={[s.overlay, { top: '18%', bottom: '18%', left: 0, width: '14%' }]}/>
        <View style={[s.overlay, { top: '18%', bottom: '18%', right: 0, width: '14%' }]}/>

        {/* Frame avec coins */}
        <View style={[s.frameBox, { width: FRAME, height: FRAME }]}>
          <Corner pos="tl"/>
          <Corner pos="tr"/>
          <Corner pos="bl"/>
          <Corner pos="br"/>
        </View>

        <Text style={s.hint}>Centrez la zone à analyser</Text>
      </View>

      {/* CONTROLS */}
      <View style={s.controls}>
        {/* Galerie → previewscan.tsx */}
        <TouchableOpacity style={s.sideBtn}
          onPress={() => router.push('/preview')}
          activeOpacity={0.8}>
          <IconGallery/>
        </TouchableOpacity>

        {/* Shutter → previewscan.tsx */}
        <TouchableOpacity style={s.shutterWrap}
          onPress={() => router.push('/preview')}
          activeOpacity={0.85}>
          <View style={s.shutterOuter}>
            <View style={s.shutterInner}/>
          </View>
        </TouchableOpacity>

        {/* Flip caméra */}
        <TouchableOpacity style={s.sideBtn} activeOpacity={0.8}>
          <IconFlip/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#111' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  iconBtn:     { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  viewfinder:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraFeed:  { ...StyleSheet.absoluteFillObject, backgroundColor: '#1a1a2e' },
  overlay:     { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.58)' },
  frameBox:    { position: 'relative' },
  hint:        { position: 'absolute', bottom: -44, color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: '600' },
  controls:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, paddingVertical: 28, backgroundColor: '#111' },
  sideBtn:     { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  shutterWrap: { alignItems: 'center', justifyContent: 'center' },
  shutterOuter:{ width: 74, height: 74, borderRadius: 37, borderWidth: 4, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  shutterInner:{ width: 56, height: 56, borderRadius: 28, backgroundColor: C.primary },
});
