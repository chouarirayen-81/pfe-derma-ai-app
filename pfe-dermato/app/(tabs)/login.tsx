// screens/LoginScreen.tsx
// ✅ Fichier 100% autonome — aucun import externe personnalisé
// npm install react-native-keyboard-aware-scroll-view

import React, { useState, useRef, useCallback, forwardRef } from "react";
import {
  View, Text, StyleSheet, Platform, TouchableOpacity,
  SafeAreaView, TextInput, StatusBar,
  Animated, Easing, Dimensions, ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";



import { loginUser } from '@/backend/src/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



const { height: H } = Dimensions.get("window");

// ─── Palette ──────────────────────────────────────────────────────────────────
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

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconBack = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconMail = ({ active, valid }: { active?: boolean; valid?: boolean }) => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={4} width={20} height={16} rx={2} stroke={valid ? C.success : active ? C.primary : C.light} strokeWidth={2}/>
    <Path d="M2 7l10 7 10-7" stroke={valid ? C.success : active ? C.primary : C.light} strokeWidth={2} strokeLinecap="round"/>
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
const IconGoogle = () => (
  <Svg width={19} height={19} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </Svg>
);
const IconFacebook = () => (
  <Svg width={19} height={19} viewBox="0 0 24 24">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </Svg>
);
const IconBiometric = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C9.38 2 7 3.21 5.5 5.15" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M12 2c2.62 0 5 1.21 6.5 3.15" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M2 9.5C2.77 7.67 4 6.1 5.5 5.15" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M22 9.5c-.77-1.83-2-3.4-3.5-4.35" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M12 8a4 4 0 014 4" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M12 8a4 4 0 00-4 4c0 4 2 6 4 8" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M8.5 10.5A4 4 0 0116 12c0 2-.5 3.5-1.5 5" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M5 13.5C5 11 5.5 9 7 7.5" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
    <Path d="M19 13.5c0-2.5-.5-4.5-2-6" stroke={C.primary} strokeWidth={2} strokeLinecap="round"/>
  </Svg>
);
const IconCheck = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13l4 4L19 7" stroke={C.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const IconSkin = () => (
  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#fff" strokeWidth={1.5} fill="rgba(255,255,255,0.2)"/>
    <Path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="#fff"/>
    <Path d="M12 6v1M12 17v1M6 12h1M17 12h1" stroke="#fff" strokeWidth={1.8} strokeLinecap="round"/>
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

// ─── Composant Field — défini ICI, dans le même fichier ──────────────────────
// ✅ forwardRef permet d'utiliser ref={pwdRef} directement sur <Field>
//    sans prop personnalisée "inputRef" qui causait l'erreur TypeScript

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  secureEntry?: boolean;
  showToggle?: boolean;
  showPwd?: boolean;
  onTogglePwd?: () => void;
  keyboardType?: any;
  valid?: boolean;
  accessibilityLabel?: string;
  returnKeyType?: any;
  onSubmitEditing?: () => void;
}

const Field = forwardRef<TextInput, FieldProps>(({
  label, value, onChange, placeholder, icon, error,
  secureEntry, showToggle, showPwd, onTogglePwd,
  keyboardType, valid, accessibilityLabel,
  returnKeyType, onSubmitEditing,
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
        <View style={fl.iconWrap}>{icon}</View>
        <TextInput
          ref={ref}
          style={fl.input}
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
        />
        {valid && !error && (
          <View style={fl.validBadge}><IconCheck/></View>
        )}
        {showToggle && (
          <TouchableOpacity onPress={onTogglePwd} activeOpacity={0.7} style={fl.eyeBtn}>
            <IconEye show={!!showPwd}/>
          </TouchableOpacity>
        )}
      </Animated.View>
      {!!error && <Text style={fl.errorTxt}>⚠ {error}</Text>}
    </View>
  );
});
Field.displayName = "Field";

const fl = StyleSheet.create({
  label:      { fontSize: 12, fontWeight: "700", color: C.light, letterSpacing: 0.4, marginBottom: 8, marginLeft: 2 },
  row:        { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, height: 54, backgroundColor: C.inputBg, borderRadius: 16, borderWidth: 1.5, borderColor: C.border },
  iconWrap:   { width: 22, alignItems: "center" },
  input:      { flex: 1, fontSize: 15, color: C.text, fontWeight: "600" },
  eyeBtn:     { padding: 8 },
  validBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#e6f9f6", alignItems: "center", justifyContent: "center" },
  errorTxt:   { fontSize: 12, color: C.error, fontWeight: "700", marginTop: 5, marginLeft: 4 },
});

// ─── Screen principal ─────────────────────────────────────────────────────────
export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPwd, setShowPwd]       = useState(false);
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const pwdRef    = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.back(1.5)) }),
    ]).start();
  }, []);

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleEmailChange = (v: string) => { setEmail(v); if (emailError) setEmailError(""); };
  const handlePwdChange   = (v: string) => { setPassword(v); if (pwdError) setPwdError(""); };

const onLogin = useCallback(async () => {
  let hasError = false;

  if (!email.trim()) {
    setEmailError("L'email est requis");
    hasError = true;
  } else if (!isEmailValid) {
    setEmailError("Format d'email invalide");
    hasError = true;
  }

  if (!password) {
    setPwdError("Le mot de passe est requis");
    hasError = true;
  } else if (password.length < 6) {
    setPwdError("Minimum 6 caractères");
    hasError = true;
  }

  if (hasError) {
    shake();
    return;
  }

  setLoading(true);

  try {
    const response = await loginUser(email.trim().toLowerCase(), password);

    const accessToken =
      response?.accessToken ||
      response?.token ||
      response?.data?.accessToken ||
      response?.data?.token;

    if (!accessToken) {
      throw new Error("Token JWT introuvable dans la réponse de login");
    }

    await AsyncStorage.setItem('accessToken', accessToken);

    router.replace('/acceuil');
  } catch (err: any) {
    shake();

    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (status === 401) {
      setPwdError("Email ou mot de passe incorrect");
    } else if (status === 404) {
      setEmailError("Aucun compte trouvé avec cet email");
    } else if (status === 429) {
      setPwdError("Trop de tentatives, réessayez dans 5 minutes");
    } else if (!err.response) {
      setPwdError("Impossible de contacter le serveur");
    } else {
      setPwdError(message || "Une erreur est survenue");
    }
  } finally {
    setLoading(false);
  }
}, [email, password, isEmailValid, shake, router]);
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
  onPress={() => router.replace('/login')}
  style={s.back}
  activeOpacity={0.7}
  accessibilityLabel="Retour"
>
  <IconBack />
</TouchableOpacity>
          <Animated.View style={[s.heroContent, { opacity: fadeAnim }]}>
            <View style={s.logoCircle}><IconSkin/></View>
            <Text style={s.heroTitle}>DermaScan</Text>
            <Text style={s.heroSub}>Votre assistant dermatologique IA</Text>
          </Animated.View>
        </View>

        {/* ── Card ── */}
        <Animated.View style={[s.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

          <Text style={s.title}>Connexion</Text>
          <Text style={s.sub}>Heureux de vous revoir 👋</Text>

          {/* Boutons sociaux */}
          <View style={s.socialRow}>
            <TouchableOpacity style={s.socialBtn} activeOpacity={0.82} accessibilityLabel="Google">
              <IconGoogle/><Text style={s.socialTxt}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.socialBtn} activeOpacity={0.82} accessibilityLabel="Facebook">
              <IconFacebook/><Text style={s.socialTxt}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Séparateur */}
          <View style={s.divRow}>
            <View style={s.div}/>
            <Text style={s.divTxt}>ou avec email</Text>
            <View style={s.div}/>
          </View>

          {/* Champs avec shake */}
          <Animated.View style={{ transform: [{ translateX: shakeAnim }], gap: 14 }}>

            {/* ✅ Champ Email — pas de ref nécessaire */}
            <Field
              label="Email"
              value={email}
              onChange={handleEmailChange}
              placeholder="votre@email.com"
              icon={<IconMail active={!!email} valid={isEmailValid && !!email}/>}
              error={emailError}
              keyboardType="email-address"
              valid={isEmailValid && !!email}
              accessibilityLabel="Champ email"
              returnKeyType="next"
              onSubmitEditing={() => pwdRef.current?.focus()}
            />

            {/* ✅ Champ Mot de passe — ref={pwdRef} grâce à forwardRef */}
            <View>
              <Field
                ref={pwdRef}
                label="Mot de passe"
                value={password}
                onChange={handlePwdChange}
                placeholder="••••••••"
                icon={<IconLock active={!!password}/>}
                error={pwdError}
                secureEntry
                showToggle
                showPwd={showPwd}
                onTogglePwd={() => setShowPwd(v => !v)}
                accessibilityLabel="Champ mot de passe"
                returnKeyType="done"
                onSubmitEditing={onLogin}
              />
              <StrengthBar password={password}/>
            </View>

          </Animated.View>

          {/* Options */}
          <View style={s.optRow}>
            <TouchableOpacity style={s.rememberRow} onPress={() => setRememberMe(v => !v)} activeOpacity={0.7}>
              <View style={[s.checkbox, rememberMe && s.checkboxOn]}>
                {rememberMe && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.rememberTxt}>Se souvenir</Text>
            </TouchableOpacity>
            <TouchableOpacity  
              activeOpacity={0.9}
              onPress={() => router.push("/mdpoublie")}   // Dans LoginScreen, sur le bouton "Mot de passe oublié ?"
>
              <Text style={s.forgotTxt}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {/* Bouton Se connecter */}
          <TouchableOpacity
            style={[s.cta, loading && { opacity: 0.75 }]}
            onPress={onLogin}
            activeOpacity={0.86}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Se connecter"
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small"/>
              : <Text style={s.ctaTxt}>Se connecter</Text>
            }
          </TouchableOpacity>

          {/* Biométrie */}
          <TouchableOpacity style={s.biometricBtn} activeOpacity={0.75} accessibilityLabel="Connexion biométrique">
            <IconBiometric/>
            <Text style={s.biometricTxt}>Connexion biométrique</Text>
          </TouchableOpacity>

          {/* Inscription */}
          <TouchableOpacity style={s.regRow} onPress={() => router.push("/register")} activeOpacity={0.7}>
            <Text style={s.regTxt}>Pas encore de compte ? </Text>
            <Text style={s.regLink}>S'inscrire</Text>
          </TouchableOpacity>

          <Text style={s.legal}>
            En continuant, vous acceptez nos{" "}
            <Text style={s.legalLink}>CGU</Text>
            {" "}et notre{" "}
            <Text style={s.legalLink}>Politique de confidentialité</Text>.
          </Text>

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
  heroTitle:   { fontSize: 27, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
  heroSub:     { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4, fontWeight: "500" },

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

  title: { fontSize: 25, fontWeight: "900", color: C.text, letterSpacing: -0.5 },
  sub:   { fontSize: 13, color: C.light, marginTop: 4, marginBottom: 22 },

  socialRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  socialBtn: {
    flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.card, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  socialTxt: { fontSize: 14, fontWeight: "800", color: C.text },

  divRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  div:    { flex: 1, height: 1, backgroundColor: C.border },
  divTxt: { fontSize: 12, color: C.light, fontWeight: "700" },

  optRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 4 },
  rememberRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox:    { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" },
  checkboxOn:  { backgroundColor: C.primary, borderColor: C.primary },
  checkmark:   { color: "#fff", fontSize: 11, fontWeight: "900", lineHeight: 14 },
  rememberTxt: { fontSize: 13, color: C.light, fontWeight: "600" },
  forgotTxt:   { fontSize: 13, color: C.primary, fontWeight: "800" },

  cta: {
    height: 56, borderRadius: 18, backgroundColor: C.primary,
    alignItems: "center", justifyContent: "center", marginTop: 20,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38, shadowRadius: 18, elevation: 10,
  },
  ctaTxt: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 0.3 },

  biometricBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, marginTop: 14, paddingVertical: 12, borderRadius: 14,
    backgroundColor: C.primaryDim, borderWidth: 1, borderColor: C.border,
  },
  biometricTxt: { fontSize: 13, fontWeight: "700", color: C.primary },

  regRow:  { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  regTxt:  { fontSize: 14, color: C.light },
  regLink: { fontSize: 14, color: C.primary, fontWeight: "800" },

  legal:     { fontSize: 10.5, color: C.light, textAlign: "center", marginTop: 16, lineHeight: 16, paddingHorizontal: 8 },
  legalLink: { color: C.primary, fontWeight: "700" },
});
