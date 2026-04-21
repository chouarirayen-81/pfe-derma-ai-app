// screens/ForgotPasswordScreen.tsx
// ✅ Fichier autonome — 3 étapes : Email → Code OTP → Nouveau mot de passe
// npm install react-native-keyboard-aware-scroll-view

import React, { useState, useRef, useCallback, useEffect,forwardRef} from "react";
import {
  View, Text, StyleSheet, Platform, TouchableOpacity,
  SafeAreaView, TextInput, StatusBar,
  Animated, Easing, Dimensions, ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, Polyline } from "react-native-svg";
import {
  forgotPassword,
  verifyResetCode,
  resetForgottenPassword,
} from "@/backend/src/api/client";

const { height: H } = Dimensions.get("window");

// ─── Palette (identique au LoginScreen) ──────────────────────────────────────
const C = {
  primary:    "#00C6A7",
  primary2:   "#00957D",
  primaryDim: "#e6f9f6",
  bg:         "#F2F7F5",
  card:       "#FFFFFF",
  text:       "#0D2B22",
  light:      "#7A9E95",
  border:     "#DFF0EB",
  inputBg:    "#F3FAF8",
  error:      "#e53935",
  errorBg:    "#fff5f5",
  errorBorder:"#fca5a5",
  success:    "#00C6A7",
  warn:       "#f59e0b",
};

// ─── Types d'étapes ───────────────────────────────────────────────────────────
type Step = "email" | "otp" | "newpassword" | "success";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconBack = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconMail = ({ active }: { active?: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={4} width={20} height={16} rx={2} stroke={active ? C.primary : C.light} strokeWidth={2}/>
    <Path d="M2 7l10 7 10-7" stroke={active ? C.primary : C.light} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconLock = ({ active }: { active?: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={11} width={18} height={11} rx={2} stroke={active ? C.primary : C.light} strokeWidth={2}/>
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={active ? C.primary : C.light} strokeWidth={2} strokeLinecap="round"/>
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
const IconSkin = () => (
  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#fff" strokeWidth={1.5} fill="rgba(255,255,255,0.2)"/>
    <Path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="#fff"/>
    <Path d="M12 6v1M12 17v1M6 12h1M17 12h1" stroke="#fff" strokeWidth={1.8} strokeLinecap="round"/>
  </Svg>
);
const IconShield = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#fff" strokeWidth={1.8} fill="rgba(255,255,255,0.2)" strokeLinejoin="round"/>
    <Path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconKey = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Circle cx={8} cy={15} r={5} stroke="#fff" strokeWidth={1.8} fill="rgba(255,255,255,0.2)"/>
    <Path d="M13 10l8 8M17 14l2 2" stroke="#fff" strokeWidth={1.8} strokeLinecap="round"/>
  </Svg>
);
const IconCheckCircle = () => (
  <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} fill={C.primaryDim} stroke={C.primary} strokeWidth={1.5}/>
    <Path d="M8 12l3 3 5-6" stroke={C.primary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// ─── Barre de force du mot de passe ──────────────────────────────────────────
function getStrength(pwd: string) {
  if (!pwd) return { score: 0, label: "", color: C.border };
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd))  score++;
  const map = [
    { label: "Très faible", color: C.error },
    { label: "Faible",      color: "#f97316" },
    { label: "Moyen",       color: C.warn },
    { label: "Fort",        color: C.success },
    { label: "Très fort",   color: C.primary2 },
  ];
  return { score, ...map[score] };
}

const StrengthBar = ({ password }: { password: string }) => {
  const st = getStrength(password);
  if (!password) return null;
  return (
    <View style={pw.container}>
      <View style={pw.bars}>
        {[1,2,3,4].map(i => (
          <View key={i} style={[pw.bar, { backgroundColor: i <= st.score ? st.color : C.border }]}/>
        ))}
      </View>
      <Text style={[pw.label, { color: st.color }]}>{st.label}</Text>
    </View>
  );
};
const pw = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6, marginLeft: 2 },
  bars:      { flexDirection: "row", gap: 4, flex: 1 },
  bar:       { flex: 1, height: 3, borderRadius: 2 },
  label:     { fontSize: 11, fontWeight: "700", minWidth: 60, textAlign: "right" },
});

// ─── Composant Field avec forwardRef ─────────────────────────────────────────
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
  secureEntry?: boolean;
  showToggle?: boolean;
  showPwd?: boolean;
  onTogglePwd?: () => void;
  keyboardType?: any;
  accessibilityLabel?: string;
  returnKeyType?: any;
  onSubmitEditing?: () => void;
  maxLength?: number;
}

const Field = forwardRef<TextInput, FieldProps>(({
  label, value, onChange, placeholder, icon, error, hint,
  secureEntry, showToggle, showPwd, onTogglePwd,
  keyboardType, accessibilityLabel, returnKeyType, onSubmitEditing, maxLength,
}, ref) => {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? C.errorBorder : C.border, error ? C.error : C.primary],
  });

  return (
    <View>
      <Text style={fl.label}>{label}</Text>
      <Animated.View style={[
        fl.row,
        { borderColor },
        error   ? { backgroundColor: C.errorBg } : {},
        focused ? { backgroundColor: "#f0fdfb"  } : {},
      ]}>
        {icon && <View style={fl.iconWrap}>{icon}</View>}
        <TextInput
          ref={ref}
          style={[fl.input, !icon && { paddingLeft: 4 }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#b0cec8"
          secureTextEntry={secureEntry && !showPwd}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onFocus={onFocus}
          onBlur={onBlur}
          accessibilityLabel={accessibilityLabel ?? label}
          returnKeyType={returnKeyType ?? "done"}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={false}
          maxLength={maxLength}
        />
        {showToggle && (
          <TouchableOpacity onPress={onTogglePwd} activeOpacity={0.7} style={fl.eyeBtn}>
            <IconEye show={!!showPwd}/>
          </TouchableOpacity>
        )}
      </Animated.View>
      {!!error && <Text style={fl.errorTxt}>⚠ {error}</Text>}
      {!!hint && !error && <Text style={fl.hintTxt}>{hint}</Text>}
    </View>
  );
});
Field.displayName = "Field";

const fl = StyleSheet.create({
  label:    { fontSize: 12, fontWeight: "700", color: C.light, letterSpacing: 0.4, marginBottom: 8, marginLeft: 2 },
  row:      { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, height: 54, backgroundColor: C.inputBg, borderRadius: 16, borderWidth: 1.5, borderColor: C.border },
  iconWrap: { width: 22, alignItems: "center" },
  input:    { flex: 1, fontSize: 15, color: C.text, fontWeight: "600" },
  eyeBtn:   { padding: 8 },
  errorTxt: { fontSize: 12, color: C.error, fontWeight: "700", marginTop: 5, marginLeft: 4 },
  hintTxt:  { fontSize: 11, color: C.light, marginTop: 5, marginLeft: 4, lineHeight: 16 },
});

// ─── Composant OTP — 6 cases ──────────────────────────────────────────────────
const OTPInput = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) => {
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  return (
    <View>
      <Text style={fl.label}>Code de vérification</Text>
      <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()} style={otp.wrapper}>
        {digits.map((d, i) => {
          const active = value.length === i || (value.length === 6 && i === 5);
          const filled = i < value.length;
          return (
            <View
              key={i}
              style={[
                otp.box,
                filled && otp.boxFilled,
                active && otp.boxActive,
                !!error && otp.boxError,
              ]}
            >
              <Text style={[otp.digit, filled && otp.digitFilled]}>
                {filled ? d : ""}
              </Text>
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={v => onChange(v.replace(/[^0-9]/g, "").slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          style={otp.hidden}
          caretHidden
          autoFocus
        />
      </TouchableOpacity>
      {!!error && <Text style={fl.errorTxt}>⚠ {error}</Text>}
    </View>
  );
};

const otp = StyleSheet.create({
  wrapper:    { flexDirection: "row", gap: 10, justifyContent: "center", position: "relative" },
  box:        { width: 46, height: 56, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.inputBg, alignItems: "center", justifyContent: "center" },
  boxFilled:  { backgroundColor: C.primaryDim, borderColor: C.primary },
  boxActive:  { borderColor: C.primary, borderWidth: 2, shadowColor: C.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  boxError:   { borderColor: C.error, backgroundColor: C.errorBg },
  digit:      { fontSize: 22, fontWeight: "700", color: C.light },
  digitFilled:{ color: C.primary },
  hidden:     { position: "absolute", width: 1, height: 1, opacity: 0 },
});

// ─── Indicateur d'étapes ──────────────────────────────────────────────────────
const StepIndicator = ({ current }: { current: number }) => (
  <View style={si.row}>
    {[1, 2, 3].map(i => (
      <View key={i} style={si.item}>
        <View style={[si.dot, i <= current && si.dotActive, i < current && si.dotDone]}>
          {i < current
            ? <Text style={si.check}>✓</Text>
            : <Text style={[si.num, i === current && si.numActive]}>{i}</Text>
          }
        </View>
        {i < 3 && <View style={[si.line, i < current && si.lineActive]}/>}
      </View>
    ))}
  </View>
);
const si = StyleSheet.create({
  row:        { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 28 },
  item:       { flexDirection: "row", alignItems: "center" },
  dot:        { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: C.border, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" },
  dotActive:  { borderColor: C.primary, backgroundColor: C.primaryDim },
  dotDone:    { borderColor: C.primary, backgroundColor: C.primary },
  num:        { fontSize: 12, fontWeight: "700", color: C.light },
  numActive:  { color: C.primary },
  check:      { fontSize: 12, fontWeight: "900", color: "#fff" },
  line:       { width: 40, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
  lineActive: { backgroundColor: C.primary },
});

// ─── Compte à rebours pour le renvoi du code ─────────────────────────────────
const useCountdown = (initial: number) => {
  const [count, setCount] = useState(initial);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    if (count <= 0) { setActive(false); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, active]);

  const restart = () => { setCount(initial); setActive(true); };
  return { count, canResend: !active, restart };
};

// ─── Screen principal ─────────────────────────────────────────────────────────
export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep]           = useState<Step>("email");
  const [email, setEmail]         = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp]             = useState("");
  const [otpError, setOtpError]   = useState("");
  const [newPwd, setNewPwd]       = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError]   = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading]     = useState(false);

  const confirmRef = useRef<TextInput>(null);
  const shakeAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.97)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const { count, canResend, restart } = useCountdown(60);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 450, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 450, useNativeDriver: true, easing: Easing.out(Easing.back(1.5)) }),
    ]).start();
  }, [step]);

  // Reset animations lors du changement d'étape
  const goToStep = (next: Step) => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.97);
    setStep(next);
  };

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ── Étape 1 : envoi email ──
  const handleSendEmail = useCallback(async () => {
  if (!email.trim()) {
    setEmailError("L'email est requis");
    shake();
    return;
  }

  if (!isEmailValid) {
    setEmailError("Format d'email invalide");
    shake();
    return;
  }

  setEmailError("");
  setLoading(true);

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await forgotPassword(normalizedEmail);

    console.log('forgotPassword =', res);

    restart();
    setOtp("");
    setOtpError("");
    goToStep("otp");
  } catch (err: any) {
    console.log(
      'Erreur forgotPassword =',
      err?.response?.status,
      err?.response?.data,
      err?.message,
    );

    setEmailError(
      err?.response?.data?.message || "Impossible d'envoyer le code",
    );
    shake();
  } finally {
    setLoading(false);
  }
}, [email, isEmailValid, shake, restart]);

  // ── Étape 2 : vérification OTP ──
 const handleVerifyOtp = useCallback(async () => {
  if (otp.length < 6) {
    setOtpError("Entrez les 6 chiffres du code");
    shake();
    return;
  }

  setOtpError("");
  setLoading(true);

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await verifyResetCode(normalizedEmail, otp);

    console.log('verifyResetCode =', res);

    goToStep("newpassword");
  } catch (err: any) {
    console.log(
      'Erreur verifyResetCode =',
      err?.response?.status,
      err?.response?.data,
      err?.message,
    );

    setOtpError(
      err?.response?.data?.message || "Code de vérification incorrect",
    );
    shake();
  } finally {
    setLoading(false);
  }
}, [otp, email, shake]);

  // ── Étape 3 : nouveau mot de passe ──
const handleResetPassword = useCallback(async () => {
  let hasError = false;

  if (!newPwd) {
    setPwdError("Le mot de passe est requis");
    hasError = true;
  } else if (newPwd.length < 8) {
    setPwdError("Minimum 8 caractères");
    hasError = true;
  } else if (!/[A-Z]/.test(newPwd)) {
    setPwdError("Ajoutez au moins une majuscule");
    hasError = true;
  } else if (!/[0-9]/.test(newPwd)) {
    setPwdError("Ajoutez au moins un chiffre");
    hasError = true;
  }

  if (!confirmPwd) {
    setConfirmError("Confirmez le mot de passe");
    hasError = true;
  } else if (newPwd !== confirmPwd) {
    setConfirmError("Les mots de passe ne correspondent pas");
    hasError = true;
  }

  if (hasError) {
    shake();
    return;
  }

  setPwdError("");
  setConfirmError("");
  setLoading(true);

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await resetForgottenPassword(normalizedEmail, otp, newPwd);

    console.log('resetForgottenPassword =', res);

    goToStep("success");

    setTimeout(() => {
      router.replace("/login");
    }, 1500);
  } catch (err: any) {
    console.log(
      'Erreur resetForgottenPassword =',
      err?.response?.status,
      err?.response?.data,
      err?.message,
    );

    const msg =
      err?.response?.data?.message ||
      "Impossible de réinitialiser le mot de passe";

    if (
      msg.toLowerCase().includes('code') ||
      msg.toLowerCase().includes('expir')
    ) {
      setOtpError(msg);
      goToStep("otp");
    } else {
      setPwdError(msg);
    }

    shake();
  } finally {
    setLoading(false);
  }
}, [email, otp, newPwd, confirmPwd, shake, router]);

  const stepNumber = step === "email" ? 1 : step === "otp" ? 2 : step === "newpassword" ? 3 : 3;

  // Hero icon selon l'étape
  const HeroIcon = step === "otp" ? IconShield : step === "newpassword" ? IconKey : IconSkin;

  const heroTitles: Record<Step, string> = {
    email:       "DermaScan",
    otp:         "Vérification",
    newpassword: "Nouveau mot de passe",
    success:     "Terminé !",
  };
  const heroSubs: Record<Step, string> = {
    email:       "Réinitialisation du mot de passe",
    otp:         "Code envoyé par email",
    newpassword: "Choisissez un mot de passe sécurisé",
    success:     "Mot de passe réinitialisé avec succès",
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary2}/>

      <KeyboardAwareScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={24}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.blob1} pointerEvents="none"/>
          <View style={s.blob2} pointerEvents="none"/>

          <TouchableOpacity
            onPress={() => step === "email" ? router.back() : goToStep(step === "otp" ? "email" : step === "newpassword" ? "otp" : "email")}
            style={s.back}
            activeOpacity={0.7}
            accessibilityLabel="Retour"
          >
            <IconBack/>
          </TouchableOpacity>

          <Animated.View style={[s.heroContent, { opacity: fadeAnim }]}>
            <View style={s.logoCircle}><HeroIcon/></View>
            <Text style={s.heroTitle}>{heroTitles[step]}</Text>
            <Text style={s.heroSub}>{heroSubs[step]}</Text>
          </Animated.View>
        </View>

        {/* ── Card ── */}
        <Animated.View style={[s.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

          {/* ════ ÉTAPE 1 — Email ════ */}
          {step === "email" && (
            <>
              <StepIndicator current={1}/>
              <Text style={s.cardTitle}>Mot de passe oublié ?</Text>
              <Text style={s.cardSub}>
                Entrez votre email et nous vous enverrons un code de vérification à 6 chiffres.
              </Text>

              <Animated.View style={{ transform: [{ translateX: shakeAnim }], gap: 14, marginTop: 8 }}>
                <Field
                  label="Adresse email"
                  value={email}
                  onChange={v => { setEmail(v); if (emailError) setEmailError(""); }}
                  placeholder="votre@email.com"
                  icon={<IconMail active={!!email}/>}
                  error={emailError}
                  keyboardType="email-address"
                  accessibilityLabel="Champ email"
                  returnKeyType="done"
                  onSubmitEditing={handleSendEmail}
                />
              </Animated.View>

              <TouchableOpacity
                style={[s.cta, loading && { opacity: 0.75 }]}
                onPress={handleSendEmail}
                activeOpacity={0.86}
                disabled={loading}
                accessibilityRole="button"
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small"/>
                  : <Text style={s.ctaTxt}>Envoyer le code</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity style={s.linkRow} onPress={() => router.back()} activeOpacity={0.7}>
                <Text style={s.linkTxt}>← Retour à la connexion</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ════ ÉTAPE 2 — OTP ════ */}
          {step === "otp" && (
            <>
              <StepIndicator current={2}/>
              <Text style={s.cardTitle}>Entrez le code</Text>
              <Text style={s.cardSub}>
                Nous avons envoyé un code à 6 chiffres à{"\n"}
                <Text style={{ color: C.primary, fontWeight: "700" }}>{email}</Text>
              </Text>

              <Animated.View style={{ transform: [{ translateX: shakeAnim }], marginTop: 8 }}>
                <OTPInput
                  value={otp}
                  onChange={v => { setOtp(v); if (otpError) setOtpError(""); }}
                  error={otpError}
                />
              </Animated.View>

              {/* Renvoi du code */}
              <View style={s.resendRow}>
                {canResend ? (
  <TouchableOpacity onPress={handleSendEmail} activeOpacity={0.7}>
    <Text style={s.resendLink}>Renvoyer le code</Text>
  </TouchableOpacity>
) : (
  <Text style={s.resendTimer}>
    Renvoyer dans{" "}
    <Text style={{ color: C.primary, fontWeight: "700" }}>{count}s</Text>
  </Text>
)}
              </View>

              <TouchableOpacity
                style={[s.cta, (loading || otp.length < 6) && { opacity: 0.65 }]}
                onPress={handleVerifyOtp}
                activeOpacity={0.86}
                disabled={loading || otp.length < 6}
                accessibilityRole="button"
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small"/>
                  : <Text style={s.ctaTxt}>Vérifier le code</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity style={s.linkRow} onPress={() => goToStep("email")} activeOpacity={0.7}>
                <Text style={s.linkTxt}>← Changer l'adresse email</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ════ ÉTAPE 3 — Nouveau mot de passe ════ */}
          {step === "newpassword" && (
            <>
              <StepIndicator current={3}/>
              <Text style={s.cardTitle}>Nouveau mot de passe</Text>
              <Text style={s.cardSub}>
                Choisissez un mot de passe fort d'au moins 8 caractères.
              </Text>

              <Animated.View style={{ transform: [{ translateX: shakeAnim }], gap: 14, marginTop: 8 }}>
                <View>
                  <Field
                    label="Nouveau mot de passe"
                    value={newPwd}
                    onChange={v => { setNewPwd(v); if (pwdError) setPwdError(""); }}
                    placeholder="••••••••"
                    icon={<IconLock active={!!newPwd}/>}
                    error={pwdError}
                    secureEntry
                    showToggle
                    showPwd={showNew}
                    onTogglePwd={() => setShowNew(v => !v)}
                    accessibilityLabel="Nouveau mot de passe"
                    returnKeyType="next"
                    onSubmitEditing={() => confirmRef.current?.focus()}
                    hint="Minimum 8 caractères, 1 majuscule, 1 chiffre"
                  />
                  <StrengthBar password={newPwd}/>
                </View>

                <Field
                  ref={confirmRef}
                  label="Confirmer le mot de passe"
                  value={confirmPwd}
                  onChange={v => { setConfirmPwd(v); if (confirmError) setConfirmError(""); }}
                  placeholder="••••••••"
                  icon={<IconLock active={!!confirmPwd}/>}
                  error={confirmError}
                  secureEntry
                  showToggle
                  showPwd={showConfirm}
                  onTogglePwd={() => setShowConfirm(v => !v)}
                  accessibilityLabel="Confirmer le mot de passe"
                  returnKeyType="done"
                  onSubmitEditing={handleResetPassword}
                />
              </Animated.View>

              <TouchableOpacity
                style={[s.cta, loading && { opacity: 0.75 }]}
                onPress={handleResetPassword}
                activeOpacity={0.86}
                disabled={loading}
                accessibilityRole="button"
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small"/>
                  : <Text style={s.ctaTxt}>Réinitialiser le mot de passe</Text>
                }
              </TouchableOpacity>
            </>
          )}

          {/* ════ SUCCÈS ════ */}
          {step === "success" && (
            <View style={s.successContainer}>
              <View style={s.successIcon}>
                <IconCheckCircle/>
              </View>
              <Text style={s.successTitle}>Mot de passe réinitialisé !</Text>
              <Text style={s.successSub}>
                Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </Text>

              <TouchableOpacity
                style={s.cta}
                onPress={() => router.replace("/login")}
                activeOpacity={0.86}
                accessibilityRole="button"
              >
                <Text style={s.ctaTxt}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          )}

        </Animated.View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: C.primary },
  scroll:        { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Hero
  hero: {
    height: H * 0.27,
    backgroundColor: C.primary,
    paddingHorizontal: 22,
    paddingTop: 10,
    justifyContent: "flex-end",
    paddingBottom: 30,
    overflow: "hidden",
  },
  blob1:       { position: "absolute", top: -80, right: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.09)" },
  blob2:       { position: "absolute", top: 40,  left: -60,  width: 160, height: 160, borderRadius: 80,  backgroundColor: "rgba(255,255,255,0.06)" },
  back:        { position: "absolute", top: 14, left: 22, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },
  heroContent: { alignItems: "center", paddingBottom: 4 },
  logoCircle:  { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.4)", marginBottom: 10 },
  heroTitle:   { fontSize: 24, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
  heroSub:     { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4, fontWeight: "500" },

  // Card
  card: {
    backgroundColor: C.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -22,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 44,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },

  cardTitle: { fontSize: 22, fontWeight: "900", color: C.text, letterSpacing: -0.5, marginBottom: 8 },
  cardSub:   { fontSize: 13, color: C.light, lineHeight: 20, marginBottom: 20 },

  // CTA
  cta: {
    height: 56, borderRadius: 18, backgroundColor: C.primary,
    alignItems: "center", justifyContent: "center", marginTop: 24,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38, shadowRadius: 18, elevation: 10,
  },
  ctaTxt: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 0.3 },

  // Lien retour
  linkRow: { alignItems: "center", marginTop: 20 },
  linkTxt: { fontSize: 13, color: C.light, fontWeight: "600" },

  // Renvoi OTP
  resendRow:   { alignItems: "center", marginTop: 18 },
  resendTimer: { fontSize: 13, color: C.light },
  resendLink:  { fontSize: 13, color: C.primary, fontWeight: "800" },

  // Succès
  successContainer: { alignItems: "center", paddingTop: 20 },
  successIcon:      { marginBottom: 24 },
  successTitle:     { fontSize: 22, fontWeight: "900", color: C.text, letterSpacing: -0.5, marginBottom: 12, textAlign: "center" },
  successSub:       { fontSize: 14, color: C.light, textAlign: "center", lineHeight: 22, paddingHorizontal: 8, marginBottom: 8 },
});
