import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ShieldCheck, Sparkles, Clock3 } from "lucide-react-native";

const GREEN = "#18B7A0";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const BG = "#F7FBFC";

type IconType = React.ComponentType<{ size?: number; color?: string }>;

function FeatureCard({
  Icon,
  title,
  description,
}: {
  Icon: IconType;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Icon size={20} color={GREEN} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* ===== TOP ===== */}
          <View>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>✦</Text>
              </View>
              <Text style={styles.brand}>DermaScan</Text>
            </View>

            {/* Title */}
            <Text style={styles.h1}>
              Analysez votre{"\n"}peau{"\n"}
              <Text style={styles.h1Accent}>en un instant</Text>
            </Text>

            <Text style={styles.lead}>
              Une aide intelligente pour identifier les problèmes cutanés et obtenir
              des conseils personnalisés.
            </Text>

            {/* Features */}
            <View style={styles.cardsWrap}>
              <FeatureCard
                Icon={ShieldCheck}
                title="Analyse sécurisée"
                description="Vos données sont chiffrées et protégées"
              />
              <FeatureCard
                Icon={Sparkles}
                title="IA avancée"
                description="Modèles de vision par ordinateur performants"
              />
              <FeatureCard
                Icon={Clock3}
                title="Résultats rapides"
                description="Obtenez une analyse en moins de 5 secondes"
              />
            </View>
          </View>

          
          <View style={styles.bottomArea}>
            <TouchableOpacity
              style={styles.cta}
              activeOpacity={0.9}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.ctaText}>Commencer gratuitement</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/login")}>
              <Text style={styles.link}>J'ai déjà un compte</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              ⚠️ Cette application n’a pas de valeur de diagnostic médical.
              Consultez un professionnel de santé pour tout avis médical.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  //  باش الصفحة توصل للآخر
  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    justifyContent: "space-between",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  logoIcon: { color: "white", fontSize: 18, fontWeight: "900" },
  brand: { fontSize: 16, fontWeight: "900", color: TEXT },

  h1: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    color: TEXT,
    marginTop: 8,
  },
  h1Accent: {
    color: GREEN,
    fontWeight: "900",
  },

  lead: {
    marginTop: 10,
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },

  cardsWrap: {
    marginTop: 20,
    gap: 14,
  },

  
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(24,183,160,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: { color: TEXT, fontSize: 14, fontWeight: "900" },
  cardDesc: { color: MUTED, fontSize: 12, marginTop: 3, lineHeight: 16, fontWeight: "600" },

  bottomArea: {
    paddingBottom: 18,
  },

  cta: {
    marginTop: 18,
    height: 56,
    borderRadius: 18,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  ctaText: { color: "white", fontSize: 15, fontWeight: "900" },

  link: {
    textAlign: "center",
    marginTop: 14,
    color: MUTED,
    fontWeight: "800",
  },

  disclaimer: {
    marginTop: 18,
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});