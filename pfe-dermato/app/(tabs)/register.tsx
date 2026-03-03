import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
   Platform,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
 
KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";

const GREEN = "#18B7A0";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const BG = "#FFFFFF";
const INPUT_BG = "#F3F6F7";
const BORDER = "#E6EEF0";

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const onRegister = () => {
    // ✅ Plus tard: appel API register
    // Pour l’instant: navigation vers tabs (ou vers login)
    router.replace("/login");
  };

   return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={12}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Back */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>✦</Text>
              </View>
              <Text style={styles.brand}>DermaScan</Text>
            </View>

            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez DermaScan pour commencer votre analyse cutanée.
            </Text>

            {/* ====== FORM (نفس inputs متاعك) ====== */}
            {/* Nom complet */}
            <Text style={styles.label}>Nom complet</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Jean Dupont"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Mot de passe */}
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 8 caractères"
                placeholderTextColor="#94A3B8"
                secureTextEntry={hidePassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setHidePassword(!hidePassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.eye}>{hidePassword ? "👁️" : "🙈"}</Text>
              </TouchableOpacity>
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={styles.cta}
              activeOpacity={0.9}
              onPress={onRegister}
            >
              <Text style={styles.ctaText}>Créer mon compte</Text>
            </TouchableOpacity>

            {/* ... بقية social + terms + login نفس كودك ... */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  scrollContent: {
    paddingBottom: 28,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F2F4F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  backIcon: { fontSize: 18, color: TEXT, fontWeight: "800" },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: { color: "white", fontSize: 18, fontWeight: "900" },
  brand: { fontSize: 16, fontWeight: "900", color: TEXT },

  title: { marginTop: 14, fontSize: 30, fontWeight: "900", color: TEXT },
  subtitle: { marginTop: 6, fontSize: 13, lineHeight: 18, color: MUTED, maxWidth: 320 },

  label: { marginTop: 8, color: MUTED, fontSize: 12, fontWeight: "700" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: INPUT_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  inputIcon: { fontSize: 14 },
  input: { flex: 1, fontSize: 14, color: TEXT, fontWeight: "600" },
  eye: { fontSize: 16, paddingLeft: 6 },

  cta: {
    marginTop: 14,
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
  ctaText: { color: "white", fontSize: 15, fontWeight: "900" },

  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 18 },
  divider: { flex: 1, height: 1, backgroundColor: "#E6EEF0" },
  dividerText: { color: "#94A3B8", fontSize: 11, fontWeight: "800" },

  socialRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  socialBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialIcon: { fontSize: 16, fontWeight: "900", color: TEXT },
  socialText: { fontSize: 13, fontWeight: "800", color: TEXT },

  terms: { marginTop: 14, fontSize: 11, lineHeight: 16, color: MUTED, textAlign: "center" },
  link: { color: GREEN, fontWeight: "700" },

  loginRow: { marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" },
});