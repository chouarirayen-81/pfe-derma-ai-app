import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

const GREEN = "#18B7A0";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const BG = "#F7FBFC";

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>✦</Text>
          </View>
          <Text style={styles.brand}>DermaScan</Text>
        </View>

        {/* Title */}
        <Text style={styles.h1}>
          Analysez votre peau{"\n"}
          <Text style={{ color: GREEN }}>en un instant</Text>
        </Text>
        <Text style={styles.lead}>
          Une aide intelligente pour identifier les problèmes cutanés et obtenir
          des conseils personnalisés.
        </Text>

        {/* Features */}
        <View style={{ marginTop: 18, gap: 14 }}>
          <FeatureCard
            title="Analyse sécurisée"
            description="Vos données sont chiffrées et protégées"
          />
          <FeatureCard
            title="IA avancée"
            description="Modèles de vision par ordinateur performants"
          />
          <FeatureCard
            title="Résultats rapides"
            description="Obtenez une analyse en moins de 5 secondes"
          />
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.9}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.ctaText}>Commencer gratuitement</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.link}>J'ai déjà un compte</Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          ⚠️ Cette application n’a pas de valeur de diagnostic médical.
          Consultez un professionnel de santé pour tout avis médical.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: { color: "white", fontSize: 18, fontWeight: "800" },
  brand: { fontSize: 16, fontWeight: "800", color: TEXT },

  h1: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    color: TEXT,
    marginTop: 8,
  },
  lead: {
    marginTop: 10,
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E9FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { color: GREEN, fontSize: 18, fontWeight: "900" },
  cardTitle: { color: TEXT, fontSize: 14, fontWeight: "800" },
  cardDesc: { color: MUTED, fontSize: 12, marginTop: 2 },

  cta: {
    marginTop: 20,
    height: 54,
    borderRadius: 16,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  ctaText: { color: "white", fontSize: 15, fontWeight: "800" },
  link: {
    textAlign: "center",
    marginTop: 14,
    color: MUTED,
    fontWeight: "700",
  },
  disclaimer: {
    marginTop: 18,
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});