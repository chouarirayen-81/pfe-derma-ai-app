import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

const GREEN = "#18B7A0";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const BG = "#FFFFFF";
const INPUT_BG = "#F3F6F7";
const BORDER = "#E6EEF0";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const onLogin = () => {
    // ✅ Plus tard: appel API login
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safe}>
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

        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>
          Heureux de vous revoir ! Connectez-vous pour continuer.
        </Text>

        {/* Form */}
        <View style={{ marginTop: 18, gap: 12 }}>
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

          {/* Password */}
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
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

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => router.push("/")}
            activeOpacity={0.8}
            style={styles.forgotRow}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* CTA */}
          <TouchableOpacity style={styles.cta} activeOpacity={0.9} onPress={onLogin}>
            <Text style={styles.ctaText}>Se connecter</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OU CONTINUER AVEC</Text>
            <View style={styles.divider} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Text style={styles.socialIcon}>f</Text>
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Register */}
          <View style={styles.registerRow}>
            <Text style={{ color: MUTED, fontWeight: "600" }}>
              Pas encore de compte ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/register")} activeOpacity={0.8}>
              <Text style={[styles.link, { fontWeight: "900" }]}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 10 },

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

  forgotRow: { alignItems: "flex-end", marginTop: 2 },
  forgotText: { color: GREEN, fontSize: 12, fontWeight: "800" },

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

  registerRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: { color: GREEN, fontWeight: "700" },
});