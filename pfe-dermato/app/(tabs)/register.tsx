import React, { useState } from "react";
import {
  View, Text, StyleSheet, Platform, TouchableOpacity,
  SafeAreaView, TextInput, ScrollView, KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { registerUser } from "@/backend/src/api/auth";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  primary:  "#00C6A7",
  primary2: "#00957D",
  bg:       "#F0F6F4",
  card:     "#FFFFFF",
  text:     "#0D2B22",
  light:    "#7A9E95",
  border:   "#E6EEF0",
  inputBg:  "#F3F9F7",
  error:    "#ef4444",
  errorBg:  "#fff5f5",
};

// ─── Types ────────────────────────────────────────────────────────────────────
// ✅ CORRIGÉ : nom + prenom séparés comme dans la DB
interface FormData {
  nom:             string;
  prenom:          string;
  email:           string;
  telephone:       string;
  age:             string;
  password:        string;
  confirmPassword: string;
}

interface FormErrors {
  nom?:             string;
  prenom?:          string;
  email?:           string;
  telephone?:       string;
  age?:             string;
  password?:        string;
  confirmPassword?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────
const validate = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.nom.trim())
    errors.nom = "Le nom est obligatoire";
  else if (data.nom.trim().length < 2)
    errors.nom = "Minimum 2 caractères";

  if (!data.prenom.trim())
    errors.prenom = "Le prénom est obligatoire";
  else if (data.prenom.trim().length < 2)
    errors.prenom = "Minimum 2 caractères";

  if (!data.email.trim())
    errors.email = "L'email est obligatoire";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Email invalide";

  if (!data.telephone.trim())
    errors.telephone = "Le téléphone est obligatoire";
  else if (!/^\+?[\d\s\-]{8,15}$/.test(data.telephone))
    errors.telephone = "Numéro invalide";

  if (!data.age.trim())
    errors.age = "L'âge est obligatoire";
  else if (isNaN(Number(data.age)) || Number(data.age) < 1 || Number(data.age) > 120)
    errors.age = "Âge invalide";

  if (!data.password)
    errors.password = "Le mot de passe est obligatoire";
  else if (data.password.length < 8)
    errors.password = "Minimum 8 caractères";
  else if (!/(?=.*[A-Z])/.test(data.password))
    errors.password = "Au moins une majuscule";
  else if (!/(?=.*\d)/.test(data.password))
    errors.password = "Au moins un chiffre";

  if (!data.confirmPassword)
    errors.confirmPassword = "Confirmez le mot de passe";
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Les mots de passe ne correspondent pas";

  return errors;
};

// ─── Password strength ────────────────────────────────────────────────────────
const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { level: 0, label: "", color: C.border };
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/\d/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))  score++;
  if (pwd.length >= 12)          score++;
  if (score <= 1) return { level: 1, label: "Faible", color: C.error };
  if (score <= 3) return { level: 2, label: "Moyen",  color: "#f59e0b" };
  return              { level: 3, label: "Fort",   color: C.primary };
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconBack = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconUser = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={4} stroke={C.light} strokeWidth={2}/>
    <Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconMail = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={4} width={20} height={16} rx={2} stroke={C.light} strokeWidth={2}/>
    <Path d="M2 7l10 7 10-7" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconPhone = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.1 2.82 2 2 0 012.1 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={C.light} strokeWidth={2}/>
  </Svg>
);
const IconLock = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={11} width={18} height={11} rx={2} stroke={C.light} strokeWidth={2}/>
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconCalendar = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={4} width={18} height={18} rx={2} stroke={C.light} strokeWidth={2}/>
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconEye = ({ show }: { show: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    {show ? (
      <>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={C.light} strokeWidth={2}/>
        <Circle cx={12} cy={12} r={3} stroke={C.light} strokeWidth={2}/>
      </>
    ) : (
      <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke={C.light} strokeWidth={2} strokeLinecap="round"/>
    )}
  </Svg>
);
const IconCheck = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconError = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={C.error} strokeWidth={2}/>
    <Path d="M12 8v4M12 16h.01" stroke={C.error} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);

// ─── Field Component ──────────────────────────────────────────────────────────
const Field = ({
  label, icon, value, onChangeText, placeholder, keyboardType,
  secureTextEntry, onToggleSecure, showSecure, error, required = true, hint,
}: {
  label: string; icon: React.ReactNode; value: string;
  onChangeText: (t: string) => void; placeholder: string;
  keyboardType?: any; secureTextEntry?: boolean;
  onToggleSecure?: () => void; showSecure?: boolean;
  error?: string; required?: boolean; hint?: string;
}) => {
  const hasValue = value.length > 0;
  const isValid  = hasValue && !error;

  return (
    <View style={f.wrap}>
      <View style={f.labelRow}>
        <Text style={f.label}>{label}</Text>
        {required && <Text style={f.required}>*</Text>}
      </View>

      <View style={[f.inputRow, error && f.inputError, isValid && f.inputValid]}>
        <View style={f.iconWrap}>{icon}</View>
        <TextInput
          style={f.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aac4bc"
          keyboardType={keyboardType || "default"}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
        {isValid && !onToggleSecure && (
          <View style={f.validIcon}><IconCheck/></View>
        )}
        {onToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure} activeOpacity={0.7} style={f.eyeBtn}>
            <IconEye show={!!showSecure}/>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={f.errorRow}>
          <IconError/>
          <Text style={f.errorTxt}>{error}</Text>
        </View>
      )}
      {hint && !error && <Text style={f.hint}>{hint}</Text>}
    </View>
  );
};

const f = StyleSheet.create({
  wrap:       { marginBottom: 14 },
  labelRow:   { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 7 },
  label:      { fontSize: 13, fontWeight: "700", color: C.light },
  required:   { fontSize: 13, fontWeight: "900", color: C.error },
  inputRow:   { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, height: 54, backgroundColor: C.inputBg, borderRadius: 16, borderWidth: 1.5, borderColor: C.border },
  inputError: { borderColor: C.error, backgroundColor: C.errorBg },
  inputValid: { borderColor: C.primary + "66", backgroundColor: "#f0fdfb" },
  iconWrap:   { width: 24, alignItems: "center" },
  input:      { flex: 1, fontSize: 14, color: C.text, fontWeight: "600" },
  validIcon:  { width: 24, alignItems: "center" },
  eyeBtn:     { padding: 4 },
  errorRow:   { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  errorTxt:   { fontSize: 12, color: C.error, fontWeight: "600", flex: 1 },
  hint:       { fontSize: 11, color: C.light, marginTop: 4, marginLeft: 2 },
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const router = useRouter();

  // ✅ CORRIGÉ : état avec nom + prenom séparés
  const [formData, setFormData] = useState<FormData>({
    nom: "", prenom: "", email: "", telephone: "", age: "",
    password: "", confirmPassword: "",
  });
  const [errors, setErrors]           = useState<FormErrors>({});
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);

  const update = (key: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (submitted) {
      const newErrors = validate({ ...formData, [key]: value });
      setErrors(prev => ({ ...prev, [key]: newErrors[key] }));
    }
  };

  const strength = getPasswordStrength(formData.password);

  const onRegister = async () => {
    setSubmitted(true);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      // ✅ CORRIGÉ : payload correspond exactement aux colonnes de la DB
      const payload = {
        nom:       formData.nom.trim(),
        prenom:    formData.prenom.trim(),
        email:     formData.email.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        age:       Number(formData.age),
        password:  formData.password,
      };

      await registerUser(payload);
      router.replace("/login");

    } catch (err: any) {
      const status  = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409) {
        setErrors(prev => ({ ...prev, email: "Cet email est déjà utilisé" }));
      } else if (status === 400) {
        setErrors(prev => ({ ...prev, email: message || "Données invalides" }));
      } else if (!err.response) {
        setErrors(prev => ({ ...prev, email: err?.message || "Erreur frontend" }));
      } else {
        setErrors(prev => ({ ...prev, email: message || "Erreur inscription" }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.container}>

            {/* Back */}
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
              <IconBack/>
            </TouchableOpacity>

            {/* Logo */}
            <View style={s.logoRow}>
              <View style={s.logoCircle}>
                <Text style={s.logoIcon}>✦</Text>
              </View>
              <Text style={s.brand}>DermaScan</Text>
            </View>

            <Text style={s.title}>Créer un compte</Text>
            <Text style={s.subtitle}>
              Tous les champs marqués <Text style={{ color: C.error }}>*</Text> sont obligatoires
            </Text>

            {/* ── CHAMPS NOM + PRENOM CÔTE À CÔTE ── */}
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Nom" icon={<IconUser/>}
                  value={formData.nom} onChangeText={update("nom")}
                  placeholder="Dupont" error={errors.nom}
                />
              </View>
              <View style={{ width: 10 }}/>
              <View style={{ flex: 1 }}>
                <Field
                  label="Prénom" icon={<IconUser/>}
                  value={formData.prenom} onChangeText={update("prenom")}
                  placeholder="Jean" error={errors.prenom}
                />
              </View>
            </View>

            {/* ── EMAIL ── */}
            <Field
              label="Email" icon={<IconMail/>}
              value={formData.email} onChangeText={update("email")}
              placeholder="jean@email.com" keyboardType="email-address"
              error={errors.email}
            />

            {/* ── TELEPHONE ── */}
            <Field
              label="Téléphone" icon={<IconPhone/>}
              value={formData.telephone} onChangeText={update("telephone")}
              placeholder="+216 20 123 456" keyboardType="phone-pad"
              error={errors.telephone} hint="Format international recommandé"
            />

            {/* ── AGE ── */}
            <Field
              label="Âge" icon={<IconCalendar/>}
              value={formData.age} onChangeText={update("age")}
              placeholder="Ex: 25" keyboardType="numeric"
              error={errors.age}
            />

            {/* ── MOT DE PASSE ── */}
            <Field
              label="Mot de passe" icon={<IconLock/>}
              value={formData.password} onChangeText={update("password")}
              placeholder="Min. 8 caractères" secureTextEntry={!showPwd}
              onToggleSecure={() => setShowPwd(v => !v)} showSecure={showPwd}
              error={errors.password}
              hint="8+ caractères, 1 majuscule, 1 chiffre"
            />

            {/* Barre de force du mot de passe */}
            {formData.password.length > 0 && (
              <View style={s.strengthWrap}>
                <View style={s.strengthBars}>
                  {[1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[s.strengthBar, { backgroundColor: i <= strength.level ? strength.color : C.border }]}
                    />
                  ))}
                </View>
                <Text style={[s.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}

            {/* ── CONFIRMER MOT DE PASSE ── */}
            <Field
              label="Confirmer le mot de passe" icon={<IconLock/>}
              value={formData.confirmPassword} onChangeText={update("confirmPassword")}
              placeholder="Répétez le mot de passe" secureTextEntry={!showConfirm}
              onToggleSecure={() => setShowConfirm(v => !v)} showSecure={showConfirm}
              error={errors.confirmPassword}
            />

            {/* Erreur globale */}
            {submitted && Object.keys(errors).length > 0 && (
              <View style={s.globalError}>
                <IconError/>
                <Text style={s.globalErrorTxt}>
                  Corrigez les {Object.keys(errors).length} erreur(s) avant de continuer
                </Text>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity
              style={[s.cta, loading && s.ctaLoading]}
              onPress={onRegister}
              activeOpacity={0.88}
              disabled={loading}
            >
              <Text style={s.ctaText}>
                {loading ? "Création en cours..." : "Créer mon compte"}
              </Text>
            </TouchableOpacity>

            {/* Login link */}
            <TouchableOpacity
              style={s.loginRow}
              onPress={() => router.replace("/login")}
              activeOpacity={0.7}
            >
              <Text style={s.loginTxt}>Déjà un compte ? </Text>
              <Text style={s.loginLink}>Se connecter</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: C.card },
  scrollContent: { paddingBottom: 40 },
  container:     { paddingHorizontal: 22, paddingTop: 10 },

  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", marginBottom: 12 },

  logoRow:    { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  logoCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  logoIcon:   { color: "#fff", fontSize: 18, fontWeight: "900" },
  brand:      { fontSize: 17, fontWeight: "900", color: C.text },

  title:    { fontSize: 28, fontWeight: "900", color: C.text, marginTop: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: C.light, marginTop: 6, marginBottom: 20, lineHeight: 18 },

  // ✅ Ligne côte à côte pour Nom + Prénom
  row: { flexDirection: "row", alignItems: "flex-start" },

  strengthWrap:  { flexDirection: "row", alignItems: "center", gap: 8, marginTop: -8, marginBottom: 12 },
  strengthBars:  { flexDirection: "row", gap: 5, flex: 1 },
  strengthBar:   { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: "700", minWidth: 40 },

  globalError:    { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.errorBg, borderWidth: 1, borderColor: "#fecaca", borderRadius: 12, padding: 12, marginBottom: 14 },
  globalErrorTxt: { fontSize: 13, color: C.error, fontWeight: "600", flex: 1 },

  cta:       { height: 54, borderRadius: 18, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", marginTop: 6, shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
  ctaLoading:{ backgroundColor: C.primary + "99" },
  ctaText:   { color: "#fff", fontSize: 16, fontWeight: "900" },

  loginRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 },
  loginTxt: { fontSize: 14, color: C.light },
  loginLink:{ fontSize: 14, color: C.primary, fontWeight: "800" },
});
