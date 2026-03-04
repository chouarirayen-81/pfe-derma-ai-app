import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Camera,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  ImagePlus,
} from "lucide-react-native";

import { Button } from "../../components/ui/button";
import { BottomNav } from "../../components/ui/layout/BottomNav";

type Severity = "low" | "medium" | "high";

type QuickAction = {
  Icon: any;
  title: string;
  description: string;
  path: string; // expo-router path
  bg: string; // background color
};

type RecentAnalysis = {
  id: number;
  date: string;
  diagnosis: string;
  confidence: number;
  severity: Severity;
  image: string;
};

const C = {
  bg: "#F7FBFC",
  text: "#0F172A",
  muted: "#64748B",
  teal: "#18B7A0",
  tealSoft: "rgba(24,183,160,0.12)",
  orange: "#F26B3A",
  orangeSoft: "rgba(242,107,58,0.12)",
  card: "#FFFFFF",
  border: "rgba(15,23,42,0.06)",
  warnBg: "#F7EAD8",
  warnText: "#6B4E00",
  adviceBg: "#E6F7F3",
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    Icon: Camera,
    title: "Nouvelle\nanalyse",
    description: "Prenez une photo",
    path: "/(tabs)/scan",
    bg: C.teal,
  },
  {
    Icon: ImagePlus,
    title: "Importer",
    description: "Depuis la galerie",
    path: "/(tabs)/scan", // تنجم تبدّلها لـ /import كي تعملها
    bg: C.orange,
  },
];

const RECENT_ANALYSES: RecentAnalysis[] = [
  {
    id: 1,
    date: "2 janvier 2026",
    diagnosis: "Eczéma léger",
    confidence: 87,
    severity: "low",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    date: "28 décembre 2025",
    diagnosis: "Acné modérée",
    confidence: 92,
    severity: "medium",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop",
  },
];

function severityBadge(sev: Severity) {
  if (sev === "low") return { bg: "rgba(24,183,160,0.16)", fg: C.teal };
  if (sev === "medium") return { bg: "rgba(242,107,58,0.16)", fg: C.orange };
  return { bg: "rgba(239,68,68,0.16)", fg: "#EF4444" };
}

function QuickActionCard({
  action,
  onPress,
}: {
  action: QuickAction;
  onPress: () => void;
}) {
  const Icon = action.Icon;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[s.actionCard, { backgroundColor: action.bg }]}
    >
      <View style={s.actionIconWrap}>
        <Icon size={18} color="white" />
      </View>
      <Text style={s.actionTitle}>{action.title}</Text>
      <Text style={s.actionSub}>{action.description}</Text>
    </TouchableOpacity>
  );
}

function RecentCard({
  analysis,
  onOpen,
}: {
  analysis: RecentAnalysis;
  onOpen: () => void;
}) {
  const badge = severityBadge(analysis.severity);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onOpen} style={s.recentCard}>
      <Image source={{ uri: analysis.image }} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.recentDate}>{analysis.date}</Text>
        <Text style={s.recentTitle}>{analysis.diagnosis}</Text>
        <View style={[s.badge, { backgroundColor: badge.bg }]}>
          <Text style={[s.badgeText, { color: badge.fg }]}>
            {analysis.confidence}% confiance
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color="#94A3B8" />
    </TouchableOpacity>
  );
}

export default function Home() {
  const router = useRouter();

  const quickActions = useMemo(() => QUICK_ACTIONS, []);
  const recentAnalyses = useMemo(() => RECENT_ANALYSES, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={s.headerRow}>
            <View>
              <Text style={s.hello}>Bonjour 👋</Text>
              <Text style={s.name}>Jean Dupont</Text>
            </View>
            <View style={s.avatar}>
              <Text style={s.avatarText}>JD</Text>
            </View>
          </View>

          {/* Quick actions */}
          <View style={s.actionsRow}>
            {quickActions.map((a) => (
              <QuickActionCard
                key={a.title}
                action={a}
                onPress={() => router.push(a.path as any)}
              />
            ))}
          </View>

          {/* Warning */}
          <View style={s.warning}>
            <AlertTriangle size={18} color="#F1A93B" />
            <View style={{ flex: 1 }}>
              <Text style={s.warnTitle}>Information importante</Text>
              <Text style={s.warnText}>
                Cette application ne remplace pas un avis médical professionnel.
              </Text>
            </View>
          </View>

          {/* Recent */}
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Analyses récentes</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/history" as any)}
              style={s.seeAllBtn}
            >
              <Text style={s.seeAllText}>Voir tout</Text>
              <ChevronRight size={18} color={C.teal} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10, gap: 10 }}>
            {recentAnalyses.map((a) => (
              <RecentCard
                key={a.id}
                analysis={a}
                onOpen={() => router.push(`/(tabs)/history` as any)}
              />
            ))}
          </View>

          {/* Tips */}
          <Text style={[s.sectionTitle, { marginTop: 18 }]}>Conseils du jour</Text>
          <View style={s.tipCard}>
            <View style={s.tipIcon}>
              <Lightbulb size={18} color={C.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.tipTitle}>Protection solaire</Text>
              <Text style={s.tipText}>
                Appliquez un écran solaire SPF 30+ chaque jour, même par temps nuageux.
              </Text>

              <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
                <Button
                  title="En savoir plus"
                  variant="soft"
                  onPress={() => router.push("/(tabs)/tips" as any)}
                  style={{ height: 42, borderRadius: 14, paddingHorizontal: 14 }}
                  textStyle={{ fontSize: 12 }}
                />
              </View>
            </View>
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Bottom nav */}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hello: { color: C.muted, fontWeight: "700" },
  name: { color: C.text, fontSize: 22, fontWeight: "900", marginTop: 2 },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.tealSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(24,183,160,0.18)",
  },
  avatarText: { color: C.teal, fontWeight: "900" },

  actionsRow: { flexDirection: "row", gap: 12, marginTop: 6 },

  actionCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    minHeight: 112,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionTitle: { color: "white", fontWeight: "900", fontSize: 14, lineHeight: 18 },
  actionSub: { color: "rgba(255,255,255,0.92)", fontWeight: "700", fontSize: 12, marginTop: 6 },

  warning: {
    marginTop: 12,
    backgroundColor: C.warnBg,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  warnTitle: { color: C.text, fontWeight: "900", fontSize: 13 },
  warnText: { color: C.warnText, fontWeight: "700", fontSize: 12, marginTop: 3, lineHeight: 16 },

  sectionRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: C.text, fontWeight: "900", fontSize: 14 },

  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  seeAllText: { color: C.teal, fontWeight: "900", fontSize: 12 },

  recentCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  thumb: { width: 56, height: 56, borderRadius: 14, backgroundColor: "#E9EEF2" },
  recentDate: { color: "#94A3B8", fontWeight: "800", fontSize: 11 },
  recentTitle: { color: C.text, fontWeight: "900", fontSize: 14, marginTop: 3 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, marginTop: 8 },
  badgeText: { fontWeight: "900", fontSize: 11 },

  tipCard: {
    marginTop: 10,
    backgroundColor: C.adviceBg,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: { color: C.text, fontWeight: "900", fontSize: 13 },
  tipText: { color: C.muted, fontWeight: "700", fontSize: 12, lineHeight: 16, marginTop: 4 },
});