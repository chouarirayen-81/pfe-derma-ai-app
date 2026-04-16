import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import API from '@/backend/src/api/client';

type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';
type ConseilType = 'prevention' | 'traitement' | 'urgence' | 'information';

interface Conseil {
  id: number;
  titre: string;
  contenu: string;
  type: ConseilType;
  ordre: number;
  valeur?: string | null;
  emoji?: string | null;
  pathologieId?: number | null;
  pathologie?: { id?: number; nom: string } | null;
}

interface ConseilGroup {
  type: string;
  icon: string;
  color: string;
  bgColor: string;
  items: Conseil[];
}

interface Stats {
  total: number;
  categories: number;
  parType: Record<string, number>;
}

const C = {
  primary: '#00C6A7',
  primary2: '#00957D',
  secondary: '#FF6B4A',
  bg: '#F0F6F4',
  card: '#FFFFFF',
  text: '#0D2B22',
  textLight: '#7A9E95',
  inactive: '#C5D9D5',
};

const TYPE_CONFIG: Record<
  string,
  { icon: string; color: string; bgColor: string; label: string }
> = {
  prevention: { icon: '🛡️', color: '#6366f1', bgColor: '#eef2ff', label: 'Prévention' },
  traitement: { icon: '💊', color: '#00C6A7', bgColor: '#f0fdfb', label: 'Traitement' },
  urgence: { icon: '🚨', color: '#ef4444', bgColor: '#fee2e2', label: 'Urgence' },
  information: { icon: '💡', color: '#f59e0b', bgColor: '#fffbeb', label: 'Information' },
};

const CONSEILS_FIXES = [
  {
    id: 'hydratation',
    titre: 'Hydratation',
    contenu: 'Buvez suffisamment d’eau chaque jour pour aider votre peau à rester bien hydratée.',
    icon: '💧',
    color: '#06b6d4',
    bgColor: '#ecfeff',
  },
  {
    id: 'alimentation',
    titre: 'Alimentation',
    contenu: 'Privilégiez une alimentation équilibrée riche en fruits, légumes et vitamines.',
    icon: '🥗',
    color: '#22c55e',
    bgColor: '#f0fdf4',
  },
  {
    id: 'sommeil',
    titre: 'Sommeil',
    contenu: 'Dormez entre 7 et 9 heures par nuit pour favoriser la régénération de la peau.',
    icon: '😴',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
];

// ─── Icons ───────────────────────────────────────────────────────────────────
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

const IconClock = ({ active }: { active: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={active ? C.primary : C.inactive} strokeWidth={2} />
    <Path
      d="M12 7v5l3.5 3.5"
      stroke={active ? C.primary : C.inactive}
      strokeWidth={2}
      strokeLinecap="round"
    />
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
    <Path
      d="M10 21h4"
      stroke={active ? C.primary : C.inactive}
      strokeWidth={2}
      strokeLinecap="round"
    />
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

const IconBack = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12l7-7M5 12l7 7"
      stroke={C.text}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Cartes fixes ────────────────────────────────────────────────────────────
function EssentialCard({
  titre,
  contenu,
  icon,
  color,
  bgColor,
}: {
  titre: string;
  contenu: string;
  icon: string;
  color: string;
  bgColor: string;
}) {
  return (
    <View style={s.essentialCard}>
      <View style={[s.essentialIconWrap, { backgroundColor: bgColor }]}>
        <Text style={s.essentialIcon}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.essentialTitle, { color }]}>{titre}</Text>
        <Text style={s.essentialText}>{contenu}</Text>
      </View>
    </View>
  );
}

// ─── Carte groupe DB ─────────────────────────────────────────────────────────
function ConseilGroupCard({ groupe }: { groupe: ConseilGroup }) {
  const [expanded, setExpanded] = useState(true);
  const cfg = TYPE_CONFIG[groupe.type] || TYPE_CONFIG.information;

  return (
    <TouchableOpacity
      style={s.conseilCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.9}
    >
      <View style={s.conseilHeader}>
        <View style={[s.conseilIconWrap, { backgroundColor: cfg.bgColor }]}>
          <Text style={s.conseilEmoji}>{cfg.icon}</Text>
        </View>

        <Text style={[s.conseilTitle, { color: cfg.color }]}>{cfg.label}</Text>

        <Text style={s.groupCount}>
          {groupe.items.length} conseil{groupe.items.length > 1 ? 's' : ''}
        </Text>

        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d={expanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
            stroke={C.textLight}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {expanded && (
        <>
          <View style={[s.divider, { backgroundColor: cfg.color + '30' }]} />
          <View style={s.tipsList}>
            {groupe.items.map((conseil, i) => (
              <View key={conseil.id} style={s.tipRow}>
                <View style={[s.tipNum, { backgroundColor: cfg.color + '18' }]}>
                  <Text style={[s.tipNumTxt, { color: cfg.color }]}>{i + 1}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.tipTitle}>{conseil.titre}</Text>
                  <Text style={s.tipText}>{conseil.contenu}</Text>

                  {conseil.pathologie?.nom ? (
                    <View style={[s.pathoBadge, { backgroundColor: cfg.bgColor }]}>
                      <Text style={[s.pathoTxt, { color: cfg.color }]}>
                        🔬 {conseil.pathologie.nom}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

function SkeletonCard() {
  return (
    <View style={[s.conseilCard, { opacity: 0.4 }]}>
      <View style={s.conseilHeader}>
        <View style={[s.conseilIconWrap, { backgroundColor: '#e5e7eb' }]} />
        <View style={{ flex: 1, height: 16, backgroundColor: '#e5e7eb', borderRadius: 8 }} />
      </View>
      <View style={{ marginTop: 14, gap: 10 }}>
        {[1, 2, 3].map((j) => (
          <View
            key={j}
            style={{
              height: 12,
              backgroundColor: '#e5e7eb',
              borderRadius: 6,
              width: j === 2 ? '80%' : '95%',
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default function ConseilsScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { pathologieId } = useLocalSearchParams<{ pathologieId?: string }>();

  const [groupes, setGroupes] = useState<ConseilGroup[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, categories: 0, parType: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const numericPathologieId = useMemo(() => {
    if (!pathologieId) return undefined;
    const n = Number(pathologieId);
    return Number.isNaN(n) ? undefined : n;
  }, [pathologieId]);

  const isActive = (tabId: TabId): boolean => {
    if (tabId === 'accueil') return pathname === '/(tabs)' || pathname === '/(tabs)/acceuil';
    if (tabId === 'historique') return pathname.startsWith('/(tabs)/historique');
    if (tabId === 'scan') return pathname.startsWith('/(tabs)/scan');
    if (tabId === 'conseils') return pathname.startsWith('/(tabs)/conseil');
    if (tabId === 'profil') return pathname.startsWith('/(tabs)/profile');
    return false;
  };

  const goTab = (tabId: TabId) => {
    const routes: Record<TabId, string> = {
      accueil: '/(tabs)/acceuil',
      historique: '/(tabs)/historique',
      scan: '/(tabs)/scan',
      conseils: '/(tabs)/conseil',
      profil: '/(tabs)/profile',
    };

    router.replace(routes[tabId] as any);
  };

  const loadConseils = async () => {
  try {
    setLoading(true);
    setError(false);

    const hasPathologie =
      numericPathologieId !== null &&
      numericPathologieId !== undefined &&
      !isNaN(Number(numericPathologieId));

    const conseilsUrl = hasPathologie
      ? `/conseils/pathologie/${Number(numericPathologieId)}`
      : '/conseils';

    const statsUrl = hasPathologie
      ? `/conseils/stats?pathologieId=${Number(numericPathologieId)}`
      : '/conseils/stats';

    // ✅ On charge d'abord les conseils
    const resConseils = await API.get(conseilsUrl);

    const rawConseils = resConseils.data?.data ?? resConseils.data ?? [];
    const data: Conseil[] = Array.isArray(rawConseils) ? rawConseils : [];

    // ✅ On essaie de charger les stats, mais si ça échoue on garde l'écran fonctionnel
    let statsData: Stats = {
      total: data.length,
      categories: new Set(data.map((c) => c.type || 'information')).size,
      parType: {},
    };

    try {
      const resStats = await API.get(statsUrl);
      statsData = resStats.data ?? statsData;
    } catch (statsErr: any) {
      console.log(
        'Erreur chargement stats conseils:',
        statsErr?.response?.data || statsErr?.message
      );
    }

    setStats(statsData);

    const grouped: Record<string, Conseil[]> = {};
    data.forEach((c) => {
      const type = c.type || 'information';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(c);
    });

    const typeOrder = ['prevention', 'traitement', 'information', 'urgence'];

    const groupesResult: ConseilGroup[] = Object.entries(grouped)
      .map(([type, items]) => ({
        type,
        icon: TYPE_CONFIG[type]?.icon || '💡',
        color: TYPE_CONFIG[type]?.color || '#00C6A7',
        bgColor: TYPE_CONFIG[type]?.bgColor || '#f0fdfb',
        items: items.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)),
      }))
      .sort((a, b) => {
        const ia = typeOrder.indexOf(a.type);
        const ib = typeOrder.indexOf(b.type);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });

    setGroupes(groupesResult);
  } catch (err: any) {
    console.log(
      'Erreur chargement conseils:',
      err?.response?.data || err?.message
    );
    setGroupes([]);
    setStats({
      total: 0,
      categories: 0,
      parType: {},
    });
    setError(true);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadConseils();
  }, [numericPathologieId]);

  const tabs = [
    { id: 'accueil', label: 'Accueil', Icon: IconHome },
    { id: 'historique', label: 'Historique', Icon: IconClock },
    { id: 'scan', label: '', Icon: null, fab: true },
    { id: 'conseils', label: 'Conseils', Icon: IconBulb },
    { id: 'profil', label: 'Profil', Icon: IconUser },
  ] as any[];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card} />

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/(tabs)/acceuil')
          }
          activeOpacity={0.7}
        >
          <IconBack />
        </TouchableOpacity>

        <Text style={s.headerTitle}>Conseils prévention</Text>

        <TouchableOpacity style={s.headerBtn} onPress={loadConseils} activeOpacity={0.7}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
              stroke={C.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={s.heroBanner}>
          <View style={s.heroCircle1} />
          <View style={s.heroCircle2} />
          <Text style={s.heroTitle}>Prenez soin de{'\n'}votre peau</Text>
          <Text style={s.heroSub}>
            Découvrez nos conseils d'experts pour maintenir une peau saine au quotidien.
          </Text>
        </View>

        {/* STATS DB */}
        <View style={s.quickStats}>
          <View style={s.quickStatItem}>
            <Text style={s.quickStatIcon}>📋</Text>
            <Text style={s.quickStatLabel}>
              {loading ? '...' : `${stats.categories} catégorie${stats.categories > 1 ? 's' : ''}`}
            </Text>
          </View>

          <View style={s.quickStatDivider} />

          <View style={s.quickStatItem}>
            <Text style={s.quickStatIcon}>✅</Text>
            <Text style={s.quickStatLabel}>
              {loading ? '...' : `${stats.total} conseil${stats.total > 1 ? 's' : ''}`}
            </Text>
          </View>

          <View style={s.quickStatDivider} />

          <View style={s.quickStatItem}>
            <Text style={s.quickStatIcon}>👨‍⚕️</Text>
            <Text style={s.quickStatLabel}>Validés experts</Text>
          </View>
        </View>

        {/* CONSEILS FIXES */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Conseils essentiels</Text>
        </View>

        <View style={s.essentialsWrap}>
          {CONSEILS_FIXES.map((item) => (
            <EssentialCard
              key={item.id}
              titre={item.titre}
              contenu={item.contenu}
              icon={item.icon}
              color={item.color}
              bgColor={item.bgColor}
            />
          ))}
        </View>

        {/* CONSEILS DB */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>
            {numericPathologieId ? 'Conseils personnalisés' : 'Tous les conseils'}
          </Text>

          {!loading && (
            <Text style={s.sectionCount}>
              {stats.total} au total
            </Text>
          )}
        </View>

        {loading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : error ? (
          <View style={s.errorWrap}>
            <Text style={s.errorEmoji}>⚠️</Text>
            <Text style={s.errorText}>Impossible de charger les conseils</Text>
            <TouchableOpacity style={s.retryBtn} onPress={loadConseils} activeOpacity={0.8}>
              <Text style={s.retryTxt}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : groupes.length === 0 ? (
          <View style={s.errorWrap}>
            <Text style={s.errorEmoji}>📋</Text>
            <Text style={s.errorText}>Aucun conseil trouvé dans la base</Text>
          </View>
        ) : (
          groupes.map((g) => <ConseilGroupCard key={g.type} groupe={g} />)
        )}

        {!loading && !error && (
          <View style={s.disclaimer}>
            <Text style={s.disclaimerIcon}>⚠️</Text>
            <Text style={s.disclaimerText}>
              Ces conseils sont fournis à titre informatif. Pour des recommandations personnalisées,
              consultez un dermatologue.
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* NAVBAR */}
      <View style={s.navbar}>
        {tabs.map((tab) => {
          const active = isActive(tab.id);

          if (tab.fab) {
            return (
              <View key="scan" style={s.fabWrap}>
                <TouchableOpacity
                  style={s.fab}
                  onPress={() => goTab('scan')}
                  activeOpacity={0.85}
                >
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
  scrollContent: { paddingBottom: 30 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF5F3',
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

  heroBanner: {
    margin: 18,
    borderRadius: 24,
    backgroundColor: C.primary,
    padding: 24,
    overflow: 'hidden',
    minHeight: 130,
  },
  heroCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -40,
    right: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
  },

  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 4,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  quickStatIcon: {
    fontSize: 22,
  },
  quickStatLabel: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#EEF5F3',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
  },
  sectionCount: {
    fontSize: 13,
    color: C.textLight,
    fontWeight: '600',
  },

  essentialsWrap: {
    marginHorizontal: 18,
    gap: 12,
    marginBottom: 4,
  },
  essentialCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  essentialIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  essentialIcon: {
    fontSize: 22,
  },
  essentialTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  essentialText: {
    fontSize: 13,
    color: C.textLight,
    lineHeight: 19,
    fontWeight: '500',
  },

  conseilCard: {
    marginHorizontal: 18,
    marginBottom: 12,
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  conseilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  conseilIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conseilEmoji: {
    fontSize: 22,
  },
  conseilTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  groupCount: {
    fontSize: 12,
    color: C.textLight,
    fontWeight: '600',
    marginRight: 8,
  },
  divider: {
    height: 1.5,
    borderRadius: 1,
    marginVertical: 14,
  },
  tipsList: {
    gap: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipNum: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  tipNumTxt: {
    fontSize: 12,
    fontWeight: '800',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
    marginBottom: 3,
  },
  tipText: {
    fontSize: 13,
    color: C.textLight,
    lineHeight: 19,
    fontWeight: '500',
  },
  pathoBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  pathoTxt: {
    fontSize: 11,
    fontWeight: '700',
  },

  errorWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: C.textLight,
    fontWeight: '600',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 18,
    marginTop: 8,
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
    borderColor: '#fde68a',
    borderRadius: 16,
    padding: 16,
  },
  disclaimerIcon: {
    fontSize: 18,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
    fontWeight: '500',
  },

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: '#EEF5F3',
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