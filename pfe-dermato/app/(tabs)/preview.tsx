import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Image, Dimensions,
} from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';

const { width: W } = Dimensions.get('window');
const C = { primary: '#00C6A7' };

const IconX = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth={2.2} strokeLinecap="round"/>
  </Svg>
);
const IconCheck = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconRefresh = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M23 4v6h-6M1 20v-6h6" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
      stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);

export default function PreviewScanScreen() {
  const router = useRouter();

  // ✅ Reçoit imageUri + analyseId depuis scan.tsx
  const { imageUri, imageUrl, analyseId, source } = useLocalSearchParams<{
    imageUri:  string;
    imageUrl?: string;
    analyseId: string;
    source:    string;
  }>();

  // ✅ Affiche l'image locale en priorité (plus rapide)
  const displayUri = imageUri || imageUrl || '';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117"/>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn}
          onPress={() => router.push('/(tabs)/scan')}
          activeOpacity={0.7}>
          <IconX/>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Nouvelle analyse</Text>
        <View style={{ width: 40 }}/>
      </View>

      {/* ✅ IMAGE depuis URI locale ou URL backend */}
      <View style={s.previewWrap}>
        {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={[s.previewImg, { height: W - 48 }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[s.previewImg, { height: W - 48, justifyContent:'center', alignItems:'center' }]}>
            <Text style={{ color:'#fff', fontSize:14 }}>Aucune image</Text>
          </View>
        )}

        {/* Badge statut */}
        <View style={s.qualityBadge}>
          <View style={s.qualityDot}/>
          <Text style={s.qualityTxt}>
            {source === 'camera' ? '📷 Photo capturée' : '🖼️ Image importée'}
          </Text>
        </View>

        {/* ✅ Badge DB si enregistrée */}
        {analyseId && analyseId !== '0' && (
          <View style={s.dbBadge}>
            <Text style={s.dbTxt}>✅ Enregistrée #{analyseId}</Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}/>

      {/* FOOTER */}
      <View style={s.footer}>
        {/* ✅ → qualite.tsx avec analyseId */}
        <TouchableOpacity style={s.btnPrimary}
          onPress={() => router.push({
            pathname: '/(tabs)/qualite',
            params: { imageUri: displayUri, analyseId },
          })}
          activeOpacity={0.88}>
          <IconCheck/>
          <Text style={s.btnPrimaryTxt}>Vérifier la qualité</Text>
        </TouchableOpacity>

        {/* Reprendre → retour scan */}
        <TouchableOpacity style={s.btnSecondary}
          onPress={() => router.push('/(tabs)/scan')}
          activeOpacity={0.88}>
          <IconRefresh/>
          <Text style={s.btnSecondaryTxt}>Reprendre la photo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#0D1117' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  iconBtn:     { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  previewWrap: { marginHorizontal: 24, marginTop: 16, borderRadius: 28, overflow: 'hidden', position: 'relative' },
  previewImg:  { width: '100%', borderRadius: 28, backgroundColor: '#1a1a2e' },
  qualityBadge:{ position: 'absolute', top: 14, left: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  qualityDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C6A7' },
  qualityTxt:  { fontSize: 12, color: '#fff', fontWeight: '700' },
  dbBadge:     { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(0,198,167,0.85)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  dbTxt:       { fontSize: 11, color: '#fff', fontWeight: '800' },
  footer:      { paddingHorizontal: 24, paddingBottom: 36, gap: 12 },
  btnPrimary:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#00C6A7', borderRadius: 18, padding: 17, shadowColor: '#00C6A7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 8 },
  btnPrimaryTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnSecondary:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: 'rgba(0,198,167,0.4)' },
  btnSecondaryTxt:{ color: '#00C6A7', fontWeight: '800', fontSize: 15 },
});