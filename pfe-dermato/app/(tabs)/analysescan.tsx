// app/(tabs)/analysescan.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';
import API from '@/backend/src/api/client';

const BACKEND_BASE_URL = 'http://192.168.1.107:3000';

const C = {
  primary: '#00C6A7',
  bg: '#F0F6F4',
  card: '#FFFFFF',
  text: '#0D2B22',
  light: '#7A9E95',
  inactive: '#C5D9D5',
  border: '#EEF5F3',
  orange: '#f59e0b',
  red: '#ef4444',
};

type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconBack = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconCalendar = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={4} width={18} height={18} rx={2} stroke={C.light} strokeWidth={2} />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={C.light} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconClock2 = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={C.light} strokeWidth={2} />
    <Path d="M12 7v5l3 3" stroke={C.light} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconAlert = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke="#d97706"
      strokeWidth={2}
      fill="#fef3c7"
      strokeLinejoin="round"
    />
    <Path d="M12 9v4M12 17h.01" stroke="#d97706" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconHome = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12L12 3l9 9v9H15v-5H9v5H3v-9z"
      stroke={active ? C.primary : C.inactive}
      strokeWidth={2}
      strokeLinejoin="round"
      fill={active ? C.primary + '22' : 'none'}
    />
  </Svg>
);

const IconClockNav = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={active ? C.primary : C.inactive} strokeWidth={2} />
    <Path d="M12 7v5l3.5 3.5" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconBulb = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2a7 7 0 00-3.5 13.07V17a1 1 0 001 1h5a1 1 0 001-1v-1.93A7 7 0 0012 2z"
      stroke={active ? C.primary : C.inactive}
      strokeWidth={2}
      fill={active ? C.primary + '22' : 'none'}
    />
    <Path d="M10 21h4" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const IconUser = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={8}
      r={4}
      stroke={active ? C.primary : C.inactive}
      strokeWidth={2}
      fill={active ? C.primary + '22' : 'none'}
    />
    <Path
      d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7"
      stroke={active ? C.primary : C.inactive}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const IconCamera = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
      stroke="#fff"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={2} />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getColor = (urgence?: string) =>
  urgence === 'urgence' ? C.red : urgence === 'consulter' ? C.orange : '#10b981';

const getTag = (urgence?: string) =>
  urgence === 'urgence' ? '⚠ Urgence' : urgence === 'consulter' ? 'Suivi conseillé' : 'Faible risque';

const getRecoIcon = (urgence?: string) =>
  urgence === 'urgence' ? '🚨' : urgence === 'consulter' ? '👨‍⚕️' : '🏠';

const getRecoTitle = (urgence?: string) =>
  urgence === 'urgence'
    ? 'Consultez immédiatement un médecin'
    : urgence === 'consulter'
      ? 'Consultation recommandée'
      : 'Suivi à domicile recommandé';

const getRecoBody = (urgence?: string) =>
  urgence === 'urgence'
    ? 'Cette condition nécessite une attention médicale urgente.'
    : urgence === 'consulter'
      ? 'Consultez un dermatologue dans les prochains jours.'
      : 'Cette condition peut être gérée avec des soins appropriés à domicile.';

const formatLabel = (value?: string) => {
  if (!value) return 'Analyse dermatologique';
  return value
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// ─── Animated confidence bar ──────────────────────────────────────────────────
function ConfidenceBar({ value, color }: { value: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={s.confBarBg}>
      <Animated.View style={[s.confBarFill, { width, backgroundColor: color }]} />
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AnalysisDetailScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const params = useLocalSearchParams<{ analyseId?: string | string[] }>();
  const analyseId = Array.isArray(params.analyseId) ? params.analyseId[0] : params.analyseId;

  const [analyse, setAnalyse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isActive = (tabId: TabId): boolean => {
    if (tabId === 'accueil') return pathname === '/(tabs)' || pathname === '/(tabs)/acceuil';
    if (tabId === 'historique') return pathname.startsWith('/(tabs)/historique');
    if (tabId === 'scan') return pathname.startsWith('/(tabs)/scan');
    if (tabId === 'conseils') return pathname.startsWith('/(tabs)/conseil');
    if (tabId === 'profil') return pathname.startsWith('/(tabs)/profile');
    return false;
  };

  const goTab = (tabId: TabId) => {
    if (pollRef.current) clearInterval(pollRef.current);

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

  useEffect(() => {
    if (!analyseId || isNaN(Number(analyseId))) {
      setError('Analyse invalide');
      setLoading(false);
      return;
    }

    chargerStatut();

    pollRef.current = setInterval(async () => {
      await chargerStatut();
    }, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [analyseId]);

  const chargerStatut = async () => {
    try {
      const res = await API.get(`/analyses/${analyseId}/statut`);
      const data = res.data;

      if (data.statut === 'termine') {
        if (pollRef.current) clearInterval(pollRef.current);
        const detailRes = await API.get(`/analyses/${analyseId}`);
        setAnalyse(detailRes.data);
        setLoading(false);
      } else if (data.statut === 'erreur') {
        if (pollRef.current) clearInterval(pollRef.current);
        setError(data.messageErreur || 'Analyse échouée');
        setLoading(false);
      }
    } catch (err: any) {
      console.log('Erreur polling:', err?.response?.data || err?.message);
    }
  };

  const confidenceColor = analyse ? getColor(analyse.niveauUrgence) : C.primary;

  const conditions = analyse?.resultatsComplets
    ? Object.entries(analyse.resultatsComplets as Record<string, number>)
        .sort(([, a], [, b]) => Number(b) - Number(a))
        .slice(0, 4)
        .map(([label, percent], i) => ({
          label,
          percent: Math.round(Number(percent)),
          color: i === 0 ? confidenceColor : i === 1 ? C.orange : C.light,
        }))
    : [];

  const conseilsList = analyse?.conseils
    ? String(analyse.conseils)
        .split('.')
        .filter((c: string) => c.trim().length > 5)
        .map((c: string) => c.trim() + '.')
    : [];

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: 'center', alignItems: 'center', gap: 16 }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>Analyse en cours...</Text>
        <Text style={{ fontSize: 13, color: C.light }}>Le modèle IA analyse votre image</Text>
        <View style={s.progressDots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[s.dot, { backgroundColor: i === 0 ? C.primary : C.border }]} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

 

  if (error) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 8 }}>Analyse impossible</Text>
        <Text style={{ fontSize: 14, color: C.light, textAlign: 'center', marginBottom: 24 }}>{error}</Text>
        <TouchableOpacity style={s.retryBtn} onPress={() => router.push('/(tabs)/scan')} activeOpacity={0.88}>
          <Text style={s.retryTxt}>Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
const rawImage =
  analyse?.imageMiniature ||
  analyse?.imagePath ||
  '';

const imageUrl = rawImage
  ? `${BACKEND_BASE_URL}/${String(rawImage).replace(/^\.?\//, '')}`
  : '';

console.log('analyse detail =', analyse);
console.log('rawImage =', rawImage);
console.log('imageUrl =', imageUrl);
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card} />

      <View style={s.header}>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => {
            if (pollRef.current) clearInterval(pollRef.current);
            router.replace('/(tabs)/historique');
          }}
          activeOpacity={0.7}
        >
          <IconBack />
        </TouchableOpacity>

        <Text style={s.headerTitle}>Résultat de l'analyse</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.heroCard}>
          <View style={s.heroMeta}>
            <View style={s.metaItem}>
              <IconCalendar />
              <Text style={s.metaTxt}>
                {new Date(analyse.creeLe).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View style={s.metaItem}>
              <IconClock2 />
              <Text style={s.metaTxt}>{analyse.dureeInferenceMs ? `${analyse.dureeInferenceMs}ms` : '--'}</Text>
            </View>
          </View>

          <View style={s.heroBody}>
  {imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={s.heroImg}
      resizeMode="cover"
    />
  ) : (
    <View style={[s.heroImg, { backgroundColor: C.border, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: 24 }}>🔬</Text>
    </View>
  )}

  <View style={{ flex: 1 }}>
    <Text style={s.heroTitle}>{formatLabel(analyse.classePredite)}</Text>
    <Text style={s.heroSubTitle}>Résultat principal détecté par le modèle IA</Text>

    <View style={[s.statusBadge, { backgroundColor: confidenceColor + '20' }]}>
      <View style={[s.statusDot, { backgroundColor: confidenceColor }]} />
      <Text style={[s.statusTxt, { color: confidenceColor }]}>
        {getTag(analyse.niveauUrgence)}
      </Text>
    </View>
  </View>
</View>

          <View style={s.confRow}>
            <Text style={s.confLabel}>Niveau de confiance</Text>
            <Text style={[s.confPct, { color: confidenceColor }]}>{Math.round(analyse.scoreConfiance || 0)}%</Text>
          </View>

          <ConfidenceBar value={analyse.scoreConfiance || 0} color={confidenceColor} />

          <View style={s.summaryCard}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Classe prédite</Text>
              <Text style={s.summaryValue}>{formatLabel(analyse.classePredite)}</Text>
            </View>

            <View style={s.summaryDivider} />

            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Confiance</Text>
              <Text style={[s.summaryValue, { color: confidenceColor }]}>
                {Math.round(analyse.scoreConfiance || 0)}%
              </Text>
            </View>

            <View style={s.summaryDivider} />

            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Niveau</Text>
              <Text style={[s.summaryValue, { color: confidenceColor }]}>
                {getTag(analyse.niveauUrgence)}
              </Text>
            </View>
          </View>

          <Text style={s.modeleTxt}>Modèle : {analyse.modeleVersion || 'EfficientNet B3'}</Text>
        </View>

        {conditions.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Conditions possibles</Text>
            <View style={s.condCard}>
              {conditions.map((cond, i) => (
                <View key={i} style={s.condRow}>
                  <View style={s.condLabelWrap}>
                    <View style={[s.condDot, { backgroundColor: cond.color }]} />
                    <Text style={s.condLabel}>{formatLabel(cond.label)}</Text>
                  </View>
                  <View style={s.condBarBg}>
                    <View
                      style={[
                        s.condBarFill,
                        { width: `${cond.percent}%` as any, backgroundColor: cond.color },
                      ]}
                    />
                  </View>
                  <Text style={[s.condPct, { color: cond.color }]}>{cond.percent}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.section}>
          <View style={s.recoCard}>
            <View style={s.recoIconWrap}>
              <Text style={{ fontSize: 22 }}>{getRecoIcon(analyse.niveauUrgence)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.recoTitle}>{getRecoTitle(analyse.niveauUrgence)}</Text>
              <Text style={s.recoBody}>{getRecoBody(analyse.niveauUrgence)}</Text>
            </View>
          </View>
        </View>

        {conseilsList.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Conseils personnalisés</Text>
            <View style={s.conseilsCard}>
              {conseilsList.map((tip: string, i: number) => (
                <View key={i} style={[s.conseilRow, i < conseilsList.length - 1 && s.conseilBorder]}>
                  <View style={s.conseilBullet}>
                    <Text style={s.conseilBulletTxt}>{i + 1}</Text>
                  </View>
                  <Text style={s.conseilTxt}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.alertBox}>
          <IconAlert />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.alertTitle}>Avertissement</Text>
            <Text style={s.alertText}>
              Cette analyse est fournie à titre informatif et ne remplace pas un diagnostic médical professionnel.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={s.navbar}>
        {([
          { id: 'accueil', label: 'Accueil', Icon: IconHome },
          { id: 'historique', label: 'Historique', Icon: IconClockNav },
          { id: 'scan', label: '', Icon: null, fab: true },
          { id: 'conseils', label: 'Conseils', Icon: IconBulb },
          { id: 'profil', label: 'Profil', Icon: IconUser },
        ] as any[]).map((tab) => {
          const active = isActive(tab.id);

          if (tab.fab) {
            return (
              <View key="scan" style={s.fabWrap}>
                <TouchableOpacity style={s.fab} onPress={() => goTab('scan')} activeOpacity={0.85}>
                  <IconCamera />
                </TouchableOpacity>
              </View>
            );
          }

          const Icon = tab.Icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={s.tabItem}
              onPress={() => goTab(tab.id as TabId)}
              activeOpacity={0.7}
            >
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

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },

  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  heroCard: {
    backgroundColor: C.card,
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaTxt: {
    fontSize: 12,
    color: C.light,
    fontWeight: '500',
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  heroImg: {
    width: 82,
    height: 82,
    borderRadius: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: C.text,
    marginBottom: 4,
    letterSpacing: -0.6,
  },
  heroSubTitle: {
    fontSize: 12,
    color: C.light,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
  confRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confLabel: {
    fontSize: 13,
    color: C.light,
    fontWeight: '600',
  },
  confPct: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  confBarBg: {
    height: 8,
    backgroundColor: C.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  confBarFill: {
    height: 8,
    borderRadius: 4,
  },

  summaryCard: {
    marginTop: 14,
    backgroundColor: '#F8FCFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: C.light,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 13,
    color: C.text,
    fontWeight: '800',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 12,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 10,
  },

  modeleTxt: {
    fontSize: 11,
    color: C.light,
    marginTop: 8,
    textAlign: 'right',
  },

  section: {
    marginHorizontal: 18,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  condCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  condRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  condLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 120,
  },
  condDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  condLabel: {
    fontSize: 12,
    color: C.text,
    fontWeight: '600',
    flexShrink: 1,
  },
  condBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: C.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  condBarFill: {
    height: 6,
    borderRadius: 3,
  },
  condPct: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 34,
    textAlign: 'right',
  },

  recoCard: {
    backgroundColor: '#f0fdfb',
    borderWidth: 1.5,
    borderColor: C.primary + '44',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  recoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
    marginBottom: 5,
  },
  recoBody: {
    fontSize: 13,
    color: C.light,
    lineHeight: 19,
  },

  conseilsCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  conseilRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  conseilBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  conseilBullet: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: C.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  conseilBulletTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: C.primary,
  },
  conseilTxt: {
    flex: 1,
    fontSize: 13,
    color: C.text,
    lineHeight: 20,
  },

  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
    borderColor: '#fde68a',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 18,
    marginTop: 20,
  },
  alertTitle: {
    fontWeight: '700',
    fontSize: 13,
    color: '#92400e',
    marginBottom: 3,
  },
  alertText: {
    fontSize: 12,
    color: '#b45309',
    lineHeight: 17,
  },

  retryBtn: {
    backgroundColor: C.primary,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  retryTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
    height: 74,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 4,
    position: 'relative',
  },
  tabActiveBg: {
    position: 'absolute',
    top: 4,
    width: 44,
    height: 32,
    borderRadius: 12,
    backgroundColor: C.primary + '18',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.inactive,
  },
  tabLabelActive: {
    color: C.primary,
  },
  fabWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
  },
  fab: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: C.card,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 12,
  },
});