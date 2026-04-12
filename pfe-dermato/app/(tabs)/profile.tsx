import React, { useEffect, useState, useRef } from 'react';
import { logoutUser } from '@/backend/src/api/auth';
import { useRouter, usePathname } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Switch, Alert, Animated,
  ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/backend/src/api/client';

const C = {
  primary:'#00C6A7', primary2:'#00957D', secondary:'#FF6B4A',
  bg:'#F0F6F4', card:'#FFFFFF', text:'#0D2B22',
  light:'#7A9E95', inactive:'#C5D9D5', border:'#EEF5F3',
  red:'#ef4444', orange:'#f59e0b', verified:'#3b82f6',
};

type TabId = 'accueil' | 'historique' | 'scan' | 'conseils' | 'profil';

// ─── Icons (identiques à l'original) ────────────────────────────────────────
const IconBack    = () => (<Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={C.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);
const IconEdit    = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/><Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);
const IconChevron = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M9 18l6-6-6-6" stroke={C.inactive} strokeWidth={2.2} strokeLinecap="round"/></Svg>);
const IconVerified= () => (<Svg width={14} height={14} viewBox="0 0 24 24" fill="none"><Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={C.verified} strokeWidth={2.2} strokeLinecap="round"/><Path d="M22 4L12 14.01l-3-3" stroke={C.verified} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);
const IconUser2   = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={8} r={4} stroke={C.light} strokeWidth={2}/><Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={C.light} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconMail    = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Rect x={2} y={4} width={20} height={16} rx={2} stroke={C.light} strokeWidth={2}/><Path d="M2 7l10 7 10-7" stroke={C.light} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconPhone   = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.1 2.82 2 2 0 012.1 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={C.light} strokeWidth={2} strokeLinejoin="round"/></Svg>);
const IconShield  = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={C.light} strokeWidth={2} strokeLinejoin="round"/></Svg>);
const IconBell    = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={C.light} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);
const IconHelpCircle=()=>(<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={12} r={10} stroke={C.light} strokeWidth={2}/><Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke={C.light} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconFileText= () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={C.light} strokeWidth={2} strokeLinejoin="round"/><Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={C.light} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconLock    = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Rect x={3} y={11} width={18} height={11} rx={2} stroke={C.light} strokeWidth={2}/><Path d="M7 11V7a5 5 0 0110 0v4" stroke={C.light} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconLogOut  = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={C.red} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);
const IconStar    = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={C.orange} strokeWidth={2} fill={C.orange+'33'} strokeLinejoin="round"/></Svg>);
const IconActivity= () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={C.light} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);
const IconTrend   = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={C.light} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/><Polyline points="17 6 23 6 23 12" stroke={C.light} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);
const IconCalendar= () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Rect x={3} y={4} width={18} height={18} rx={2} stroke={C.light} strokeWidth={2}/><Path d="M16 2v4M8 2v4M3 10h18" stroke={C.light} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconClose   = () => (<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M18 6L6 18M6 6l12 12" stroke={C.text} strokeWidth={2.2} strokeLinecap="round"/></Svg>);
const IconKey     = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Circle cx={8} cy={15} r={5} stroke={C.light} strokeWidth={2}/><Path d="M13 10l8 8M17 14l2 2" stroke={C.light} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconSend    = () => (<Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></Svg>);

// Navbar icons
const IconHome    = ({ active }: { active: boolean }) => (<Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Path d="M3 12L12 3l9 9v9H15v-5H9v5H3v-9z" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinejoin="round" fill={active ? C.primary+'22' : 'none'}/></Svg>);
const IconClock   = ({ active }: { active: boolean }) => (<Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={12} r={9} stroke={active ? C.primary : C.inactive} strokeWidth={2}/><Path d="M12 7v5l3.5 3.5" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconBulb    = ({ active }: { active: boolean }) => (<Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Path d="M12 2a7 7 0 00-3.5 13.07V17a1 1 0 001 1h5a1 1 0 001-1v-1.93A7 7 0 0012 2z" stroke={active ? C.primary : C.inactive} strokeWidth={2} fill={active ? C.primary+'22' : 'none'}/><Path d="M10 21h4" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconUserNav = ({ active }: { active: boolean }) => (<Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={8} r={4} stroke={active ? C.primary : C.inactive} strokeWidth={2} fill={active ? C.primary+'22' : 'none'}/><Path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={active ? C.primary : C.inactive} strokeWidth={2} strokeLinecap="round"/></Svg>);
const IconCamera  = () => (<Svg width={26} height={26} viewBox="0 0 24 24" fill="none"><Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#fff" strokeWidth={2} strokeLinejoin="round"/><Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={2}/></Svg>);

// ─── Animated Score Bar ───────────────────────────────────────────────────────
function AnimatedScoreBar({ score }: { score: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: score, duration: 1200, useNativeDriver: false }).start();
  }, [score]);
  const width      = anim.interpolate({ inputRange:[0,100], outputRange:['0%','100%'] });
  const scoreColor = score >= 80 ? C.primary : score >= 60 ? C.orange : C.red;
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : 'À améliorer';
  return (
    <>
      <View style={s.scoreBarBg}>
        <Animated.View style={[s.scoreBarFill, { width, backgroundColor: scoreColor }]}/>
      </View>
      <Text style={[s.scoreNote, { color: scoreColor }]}>{scoreLabel} • Continuez vos bonnes habitudes 💚</Text>
    </>
  );
}

// ─── Composants Row ───────────────────────────────────────────────────────────
const Row = ({ icon, label, value, onPress, danger=false }: {
  icon: React.ReactNode; label: string; value?: string; onPress?: () => void; danger?: boolean;
}) => (
  <TouchableOpacity style={r.row} onPress={onPress} activeOpacity={0.7}>
    <View style={r.rowIcon}>{icon}</View>
    <View style={{ flex:1 }}>
      <Text style={[r.rowLabel, danger && { color:C.red }]}>{label}</Text>
      {value ? <Text style={r.rowValue}>{value}</Text> : null}
    </View>
    <IconChevron/>
  </TouchableOpacity>
);

const ToggleRow = ({ icon, label, value, onToggle }: {
  icon: React.ReactNode; label: string; value: boolean; onToggle: () => void;
}) => (
  <View style={r.row}>
    <View style={r.rowIcon}>{icon}</View>
    <Text style={[r.rowLabel, { flex:1 }]}>{label}</Text>
    <Switch value={value} onValueChange={onToggle}
      trackColor={{ false:C.inactive, true:C.primary }}
      thumbColor={C.card} ios_backgroundColor={C.inactive}/>
  </View>
);

// ─── Modal Edit Profil ────────────────────────────────────────────────────────
function ModalEditProfil({ visible, user, onClose, onSave }: {
  visible: boolean; user: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form,    setForm]    = useState({ nom:'', prenom:'', telephone:'', age:'', sexe:'', allergies:'' });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (user) setForm({
      nom:       user.nom       || '',
      prenom:    user.prenom    || '',
      telephone: user.telephone || '',
      age:       user.age       ? String(user.age) : '',
      sexe:      user.sexe      || '',
      allergies: user.allergies || '',
    });
  }, [user, visible]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        nom:       form.nom.trim(),
        prenom:    form.prenom.trim(),
        telephone: form.telephone.trim(),
        age:       form.age ? parseInt(form.age) : undefined,
        sexe:      form.sexe.trim() || undefined,
        allergies: form.allergies.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      Alert.alert('Erreur', err?.response?.data?.message || 'Impossible de modifier le profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex:1 }}>
        <View style={m.overlay}>
          <View style={m.sheet}>
            {/* Header */}
            <View style={m.header}>
              <Text style={m.title}>Modifier le profil</Text>
              <TouchableOpacity onPress={onClose} style={m.closeBtn}><IconClose/></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Champs */}
              {[
                { key:'prenom',    label:'Prénom',    placeholder:'Jean',            keyboard:'default'  as any },
                { key:'nom',       label:'Nom',       placeholder:'Dupont',          keyboard:'default'  as any },
                { key:'telephone', label:'Téléphone', placeholder:'0612345678',      keyboard:'phone-pad' as any },
                { key:'age',       label:'Âge',       placeholder:'25',              keyboard:'number-pad' as any },
                { key:'sexe',      label:'Sexe',      placeholder:'homme / femme',   keyboard:'default'  as any },
                { key:'allergies', label:'Allergies', placeholder:'Nickel, latex...', keyboard:'default' as any },
              ].map(({ key, label, placeholder, keyboard }) => (
                <View key={key} style={m.fieldWrap}>
                  <Text style={m.fieldLabel}>{label}</Text>
                  <TextInput
                    style={m.input}
                    value={(form as any)[key]}
                    onChangeText={v => setForm(f => ({ ...f, [key]: v }))}
                    placeholder={placeholder}
                    placeholderTextColor="#b0cec8"
                    keyboardType={keyboard}
                    autoCapitalize={key === 'nom' || key === 'prenom' ? 'words' : 'none'}
                  />
                </View>
              ))}
            </ScrollView>

            {/* Bouton save */}
            <TouchableOpacity style={[m.saveBtn, saving && { opacity:0.7 }]} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
              {saving
                ? <ActivityIndicator color="#fff" size="small"/>
                : <Text style={m.saveTxt}>Enregistrer les modifications</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Modal Changer Mot de Passe (avec OTP email) ──────────────────────────────
function ModalChangerMDP({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  // 3 étapes : ancien mdp → envoyer code → nouveau mdp + code
  const [step,        setStep]        = useState<1|2|3>(1);
  const [ancienMdp,   setAncienMdp]   = useState('');
  const [code,        setCode]        = useState('');
  const [nouveauMdp,  setNouveauMdp]  = useState('');
  const [confirmMdp,  setConfirmMdp]  = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showAncien,  setShowAncien]  = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [msgCode,     setMsgCode]     = useState('');

  const reset = () => { setStep(1); setAncienMdp(''); setCode(''); setNouveauMdp(''); setConfirmMdp(''); setMsgCode(''); };
  const handleClose = () => { reset(); onClose(); };

  // Étape 1 : vérifier ancien MDP et envoyer code
  const handleSendCode = async () => {
    if (!ancienMdp.trim()) { Alert.alert('Requis', 'Entrez votre ancien mot de passe'); return; }
    setLoading(true);
    try {
      // Envoyer code OTP → backend : POST /utilisateurs/send-verification-code
      const res = await API.post('/utilisateurs/send-verification-code');
      setMsgCode(res.data?.message || 'Code envoyé !');
      setStep(2);
    } catch (err: any) {
      Alert.alert('Erreur', err?.response?.data?.message || 'Impossible d\'envoyer le code');
    } finally { setLoading(false); }
  };

  // Étape 2 : vérifier le code saisi
  const handleVerifyCode = () => {
    if (code.length !== 6) { Alert.alert('Requis', 'Le code doit contenir 6 chiffres'); return; }
    setStep(3);
  };

  // Étape 3 : changer le mot de passe
  const handleChangeMDP = async () => {
    if (!nouveauMdp || nouveauMdp.length < 8) { Alert.alert('Erreur', 'Minimum 8 caractères'); return; }
    if (!/[A-Z]/.test(nouveauMdp)) { Alert.alert('Erreur', 'Au moins une majuscule'); return; }
    if (!/[0-9]/.test(nouveauMdp)) { Alert.alert('Erreur', 'Au moins un chiffre'); return; }
    if (nouveauMdp !== confirmMdp) { Alert.alert('Erreur', 'Les mots de passe ne correspondent pas'); return; }
    setLoading(true);
    try {
      await API.put('/utilisateurs/password', {
        ancienMotDePasse:  ancienMdp,
        nouveauMotDePasse: nouveauMdp,
        codeVerification:  code,
      });
      Alert.alert('✅ Succès', 'Mot de passe modifié avec succès !', [{ text:'OK', onPress: handleClose }]);
    } catch (err: any) {
      Alert.alert('Erreur', err?.response?.data?.message || 'Code ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex:1 }}>
        <View style={m.overlay}>
          <View style={m.sheet}>
            {/* Header */}
            <View style={m.header}>
              <Text style={m.title}>🔒 Changer le mot de passe</Text>
              <TouchableOpacity onPress={handleClose} style={m.closeBtn}><IconClose/></TouchableOpacity>
            </View>

            {/* Indicateur d'étapes */}
            <View style={m.stepsRow}>
              {[1,2,3].map(i => (
                <View key={i} style={{ flexDirection:'row', alignItems:'center' }}>
                  <View style={[m.stepDot, step >= i && m.stepDotActive, step > i && m.stepDotDone]}>
                    <Text style={[m.stepTxt, step >= i && m.stepTxtActive]}>
                      {step > i ? '✓' : i}
                    </Text>
                  </View>
                  {i < 3 && <View style={[m.stepLine, step > i && m.stepLineActive]}/>}
                </View>
              ))}
            </View>

            {/* ── ÉTAPE 1 : Ancien mot de passe ── */}
            {step === 1 && (
              <View style={{ marginTop:8 }}>
                <Text style={m.stepTitle}>Étape 1 — Vérification</Text>
                <Text style={m.stepSub}>Entrez votre mot de passe actuel pour confirmer votre identité.</Text>
                <View style={m.fieldWrap}>
                  <Text style={m.fieldLabel}>Mot de passe actuel</Text>
                  <View style={m.inputRow}>
                    <TextInput
                      style={[m.input, { flex:1, marginBottom:0 }]}
                      value={ancienMdp}
                      onChangeText={setAncienMdp}
                      placeholder="••••••••"
                      placeholderTextColor="#b0cec8"
                      secureTextEntry={!showAncien}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowAncien(v => !v)} style={m.eyeBtn}>
                      <Text style={{ fontSize:16 }}>{showAncien ? '🙈' : '👁'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={m.infoBox}>
                  <Text style={m.infoTxt}>📧 Un code de vérification sera envoyé à votre adresse email.</Text>
                </View>
                <TouchableOpacity style={[m.saveBtn, loading && { opacity:0.7 }]} onPress={handleSendCode} disabled={loading} activeOpacity={0.85}>
                  {loading
                    ? <ActivityIndicator color="#fff" size="small"/>
                    : <><Text style={m.saveTxt}>Envoyer le code </Text><IconSend/></>
                  }
                </TouchableOpacity>
              </View>
            )}

            {/* ── ÉTAPE 2 : Code OTP ── */}
            {step === 2 && (
              <View style={{ marginTop:8 }}>
                <Text style={m.stepTitle}>Étape 2 — Code de vérification</Text>
                <Text style={m.stepSub}>{msgCode || 'Consultez votre boîte email et entrez le code à 6 chiffres.'}</Text>
                <View style={m.fieldWrap}>
                  <Text style={m.fieldLabel}>Code reçu par email</Text>
                  <TextInput
                    style={[m.input, { textAlign:'center', fontSize:24, fontWeight:'900', letterSpacing:8 }]}
                    value={code}
                    onChangeText={v => setCode(v.replace(/[^0-9]/g,'').slice(0,6))}
                    placeholder="000000"
                    placeholderTextColor="#b0cec8"
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <TouchableOpacity style={m.resendBtn} onPress={handleSendCode}>
                  <Text style={m.resendTxt}>Renvoyer le code</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[m.saveBtn, (loading || code.length < 6) && { opacity:0.6 }]}
                  onPress={handleVerifyCode} disabled={code.length < 6} activeOpacity={0.85}>
                  <Text style={m.saveTxt}>Vérifier le code →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── ÉTAPE 3 : Nouveau mot de passe ── */}
            {step === 3 && (
              <View style={{ marginTop:8 }}>
                <Text style={m.stepTitle}>Étape 3 — Nouveau mot de passe</Text>
                <Text style={m.stepSub}>Choisissez un mot de passe fort (min. 8 car., 1 majuscule, 1 chiffre).</Text>
                <View style={m.fieldWrap}>
                  <Text style={m.fieldLabel}>Nouveau mot de passe</Text>
                  <View style={m.inputRow}>
                    <TextInput
                      style={[m.input, { flex:1, marginBottom:0 }]}
                      value={nouveauMdp}
                      onChangeText={setNouveauMdp}
                      placeholder="••••••••"
                      placeholderTextColor="#b0cec8"
                      secureTextEntry={!showNew}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowNew(v => !v)} style={m.eyeBtn}>
                      <Text style={{ fontSize:16 }}>{showNew ? '🙈' : '👁'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={m.fieldWrap}>
                  <Text style={m.fieldLabel}>Confirmer le mot de passe</Text>
                  <TextInput
                    style={m.input}
                    value={confirmMdp}
                    onChangeText={setConfirmMdp}
                    placeholder="••••••••"
                    placeholderTextColor="#b0cec8"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  {confirmMdp.length > 0 && (
                    <Text style={{ fontSize:12, marginTop:4, color: nouveauMdp === confirmMdp ? C.primary : C.red, fontWeight:'600' }}>
                      {nouveauMdp === confirmMdp ? '✅ Les mots de passe correspondent' : '❌ Ne correspondent pas'}
                    </Text>
                  )}
                </View>
                <TouchableOpacity style={[m.saveBtn, loading && { opacity:0.7 }]} onPress={handleChangeMDP} disabled={loading} activeOpacity={0.85}>
                  {loading
                    ? <ActivityIndicator color="#fff" size="small"/>
                    : <Text style={m.saveTxt}>Confirmer le changement</Text>
                  }
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Modal Support / FAQ ──────────────────────────────────────────────────────
function ModalSupport({ visible, onClose, type }: {
  visible: boolean; onClose: () => void;
  type: 'faq' | 'cgu' | 'confidentialite';
}) {
  const content = {
    faq: {
      title: '❓ Aide et FAQ',
      items: [
        { q: "Comment fonctionne l'analyse ?", a: "Prenez une photo de votre lésion cutanée. Notre IA analyse l'image et retourne un diagnostic probable avec un score de confiance." },
        { q: "Mes données sont-elles sécurisées ?", a: "Oui. Toutes les images sont chiffrées et les métadonnées EXIF sont supprimées avant l'envoi." },
        { q: "Le diagnostic est-il fiable à 100% ?", a: "Non. DermaScan est un outil d'aide à la décision. Consultez toujours un dermatologue pour un diagnostic officiel." },
        { q: "Comment modifier mon profil ?", a: "Appuyez sur l'icône ✏️ en haut à droite, ou cliquez sur vos informations personnelles." },
        { q: "Comment supprimer mon historique ?", a: "Allez dans Historique → sélectionnez une analyse → Supprimer." },
        { q: "J'ai oublié mon mot de passe, que faire ?", a: "Sur l'écran de connexion, appuyez sur 'Mot de passe oublié' pour recevoir un code de réinitialisation par email." },
      ],
    },
    cgu: {
      title: "📄 Conditions d'utilisation",
      items: [
        { q: "1. Objet", a: "DermaScan est une application mobile d'aide à l'analyse dermatologique par intelligence artificielle, à titre informatif uniquement." },
        { q: "2. Utilisateurs", a: "L'application est réservée aux personnes de 18 ans et plus. L'inscription requiert un email valide." },
        { q: "3. Responsabilité", a: "DermaScan ne se substitue pas à une consultation médicale. Les résultats sont indicatifs et non constitutifs d'un diagnostic médical." },
        { q: "4. Propriété intellectuelle", a: "Tous les contenus (algorithmes, interfaces, conseils) sont la propriété exclusive de DermaScan." },
        { q: "5. Modification", a: "Nous nous réservons le droit de modifier ces conditions à tout moment. L'utilisation continue vaut acceptation." },
      ],
    },
    confidentialite: {
      title: "🔒 Politique de confidentialité",
      items: [
        { q: "Données collectées", a: "Nom, email, téléphone, âge, sexe, allergies, et images soumises pour analyse." },
        { q: "Utilisation des données", a: "Vos données sont utilisées pour l'analyse IA, l'amélioration du service et la sécurité de votre compte." },
        { q: "Stockage", a: "Les données sont stockées de manière chiffrée sur des serveurs sécurisés. Les images sont anonymisées avant analyse." },
        { q: "Partage", a: "Nous ne vendons ni ne partageons vos données personnelles avec des tiers, sauf obligation légale." },
        { q: "Suppression", a: "Vous pouvez demander la suppression de votre compte et de toutes vos données depuis l'écran Profil." },
        { q: "Contact", a: "Pour toute question : privacy@dermascan.app" },
      ],
    },
  };

  const { title, items } = content[type];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={m.overlay}>
        <View style={[m.sheet, { maxHeight:'90%' }]}>
          <View style={m.header}>
            <Text style={m.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={m.closeBtn}><IconClose/></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item, i) => (
              <View key={i} style={m.faqItem}>
                <Text style={m.faqQ}>{item.q}</Text>
                <Text style={m.faqA}>{item.a}</Text>
              </View>
            ))}
            <View style={{ height:20 }}/>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main ProfileScreen ───────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,          setUser]         = useState<any>(null);
  const [stats,         setStats]        = useState({ total:0, ceMois:0, scoreSante:0, serie:0 });
  const [loading,       setLoading]      = useState(true);
  const [twoFA,         setTwoFA]        = useState(false);
  const [notifications, setNotifs]       = useState(true);
  const [emailAlerts,   setEmailAlerts]  = useState(false);

  // Modals
  const [showEditProfil, setShowEditProfil] = useState(false);
  const [showMDP,        setShowMDP]        = useState(false);
  const [showSupport,    setShowSupport]    = useState<null|'faq'|'cgu'|'confidentialite'>(null);

  const isActive = (tabId: TabId) => {
    if (tabId === 'accueil')    return pathname === '/(tabs)' || pathname === '/(tabs)/acceuil';
    if (tabId === 'historique') return pathname.startsWith('/(tabs)/historique');
    if (tabId === 'scan')       return pathname.startsWith('/(tabs)/scan');
    if (tabId === 'conseils')   return pathname.startsWith('/(tabs)/conseil');
    if (tabId === 'profil')     return pathname.startsWith('/(tabs)/profile');
    return false;
  };

  const goTab = (tabId: TabId) => {
    const routes: Record<TabId, string> = {
      accueil:'/(tabs)/acceuil', historique:'/(tabs)/historique',
      scan:'/(tabs)/scan', conseils:'/(tabs)/conseil', profil:'/(tabs)/profile',
    };
    router.replace(routes[tabId] as any);
  };

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));

      const [profileRes, dashRes] = await Promise.all([
        API.get('/utilisateurs/profil'),
        API.get('/utilisateurs/dashboard').catch(() => ({ data: {} })),
      ]);

      const profile = profileRes.data;
      setUser(profile);
      await AsyncStorage.setItem('user', JSON.stringify(profile));
      setTwoFA(profile.doubleAuthActive || false);

      const dash = dashRes.data;
      setStats({
        total:      dash.totalAnalyses  || 0,
        ceMois:     dash.analysesCeMois || 0,
        scoreSante: dash.scoreSante     || 0,
        serie:      dash.serie          || 0,
      });
    } catch (err: any) {
      console.log('Erreur profil:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Sauvegarder modifications profil ─────────────────────────────
  const handleSaveProfil = async (data: any) => {
    const res = await API.patch('/utilisateurs/me', data);
    const updated = res.data;
    setUser(updated);
    await AsyncStorage.setItem('user', JSON.stringify(updated));
  };

  // ── Helpers ──────────────────────────────────────────────────────
  const displayName = user ? `${user.prenom||''} ${user.nom||''}`.trim() || 'Utilisateur' : 'Utilisateur';

  const getInitials = () => {
    const p = user?.prenom?.trim()||''; const n = user?.nom?.trim()||'';
    if (p && n) return `${p[0]}${n[0]}`.toUpperCase();
    if (p) return p[0].toUpperCase();
    if (n) return n[0].toUpperCase();
    return 'U';
  };

  const getMemberSince = () => {
    if (!user?.tempCreation) return 'Membre récent';
    return `Membre depuis ${new Date(user.tempCreation).toLocaleDateString('fr-FR', { month:'long', year:'numeric' })}`;
  };

  const handleToggle2FA = async () => {
    const newVal = !twoFA; setTwoFA(newVal);
    try { await API.patch('/utilisateurs/me', { doubleAuthActive: newVal }); }
    catch { setTwoFA(!newVal); }
  };

  const handleLogout = () => {
    Alert.alert('Se déconnecter', 'Voulez-vous vraiment vous déconnecter ?', [
      { text:'Annuler', style:'cancel' },
      { text:'Déconnecter', style:'destructive', onPress: async () => {
        try { await logoutUser(); } finally { router.replace('/login'); }
      }},
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Supprimer le compte', 'Cette action est irréversible. Toutes vos données seront supprimées définitivement.', [
      { text:'Annuler', style:'cancel' },
      { text:'Supprimer', style:'destructive', onPress: async () => {
        try {
          await API.delete('/utilisateurs/compte');
          await logoutUser();
          router.replace('/login');
        } catch { Alert.alert('Erreur', 'Impossible de supprimer le compte'); }
      }},
    ]);
  };

  if (loading) return (
    <SafeAreaView style={[s.safe, { justifyContent:'center', alignItems:'center' }]}>
      <ActivityIndicator size="large" color={C.primary}/>
      <Text style={{ color:C.light, marginTop:12, fontWeight:'600' }}>Chargement...</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card}/>

      {/* Modals */}
      <ModalEditProfil
        visible={showEditProfil}
        user={user}
        onClose={() => setShowEditProfil(false)}
        onSave={handleSaveProfil}
      />
      <ModalChangerMDP
        visible={showMDP}
        onClose={() => setShowMDP(false)}
      />
      {showSupport && (
        <ModalSupport
          visible={!!showSupport}
          type={showSupport}
          onClose={() => setShowSupport(null)}
        />
      )}

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/acceuil')}
          activeOpacity={0.7}><IconBack/></TouchableOpacity>
        <Text style={s.headerTitle}>Mon profil</Text>
        {/* ✅ Icône édition → ouvre le modal */}
        <TouchableOpacity style={s.headerBtn} activeOpacity={0.7}
          onPress={() => setShowEditProfil(true)}><IconEdit/></TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={s.heroCard}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}><Text style={s.avatarTxt}>{getInitials()}</Text></View>
            <TouchableOpacity style={s.avatarEditBtn} onPress={() => setShowEditProfil(true)} activeOpacity={0.8}>
              <IconEdit/>
            </TouchableOpacity>
          </View>
          <Text style={s.heroName}>{displayName}</Text>
          <View style={s.verifiedBadge}>
            <IconVerified/>
            <Text style={s.verifiedTxt}>{user?.emailVerifie ? 'Compte vérifié' : 'Email non vérifié'}</Text>
          </View>
          <Text style={s.heroSince}>{getMemberSince()}</Text>
          <View style={s.statsRow}>
            {[
              { value: String(stats.total),  label:'Analyses', icon:'🔬' },
              { value: String(stats.ceMois), label:'Ce mois',  icon:'📅' },
              { value: `${stats.serie}j`,    label:'Série',    icon:'🔥' },
            ].map((st, i) => (
              <View key={i} style={[s.statItem, i < 2 && s.statBorder]}>
                <Text style={s.statEmoji}>{st.icon}</Text>
                <Text style={s.statValue}>{st.value}</Text>
                <Text style={s.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── SCORE SANTÉ ── */}
        <View style={s.scoreCard}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' }}>
            <View style={{ flex:1 }}>
              <Text style={s.scoreTitle}>Score santé</Text>
              <Text style={s.scoreSub}>Basé sur vos {stats.total} analyses</Text>
            </View>
            <View style={{ flexDirection:'row', alignItems:'flex-end', gap:2 }}>
              <Text style={[s.scoreValue, { color: stats.scoreSante >= 80 ? C.primary : stats.scoreSante >= 60 ? C.orange : C.red }]}>{stats.scoreSante}</Text>
              <Text style={s.scoreUnit}>/100</Text>
            </View>
          </View>
          <AnimatedScoreBar score={stats.scoreSante}/>
        </View>

        {/* ── STATISTIQUES ── */}
        <Text style={s.groupLabel}>STATISTIQUES</Text>
        <View style={s.statsDetailCard}>
          {[
            { icon:<IconActivity/>, label:'Total analyses', value: String(stats.total),      color:C.primary },
            { icon:<IconCalendar/>, label:'Ce mois',        value: String(stats.ceMois),     color:'#6366f1' },
            { icon:<IconTrend/>,    label:'Score santé',    value:`${stats.scoreSante}/100`, color:C.orange  },
          ].map(({ icon, label, value, color }, i) => (
            <View key={i} style={[s.statsDetailRow, i < 2 && { borderBottomWidth:1, borderBottomColor:C.border }]}>
              <View style={[s.statsDetailIcon, { backgroundColor: color+'18' }]}>{icon}</View>
              <Text style={s.statsDetailLabel}>{label}</Text>
              <Text style={[s.statsDetailValue, { color }]}>{value}</Text>
            </View>
          ))}
        </View>

        {/* ── COMPTE ── */}
        <Text style={s.groupLabel}>COMPTE</Text>
        <View style={s.card}>
          {/* ✅ Clic → ouvre modal édition */}
          <Row icon={<IconUser2/>}    label="Informations personnelles" onPress={() => setShowEditProfil(true)}/>
          <View style={s.divider}/>
          <Row icon={<IconMail/>}     label="Email"     value={user?.email     || '—'} onPress={() => setShowEditProfil(true)}/>
          <View style={s.divider}/>
          <Row icon={<IconPhone/>}    label="Téléphone" value={user?.telephone || '—'} onPress={() => setShowEditProfil(true)}/>
          <View style={s.divider}/>
          <Row icon={<IconActivity/>} label="Historique médical" onPress={() => router.replace('/(tabs)/historique')}/>
        </View>

        {/* ── INFOS MÉDICALES ── */}
        <Text style={s.groupLabel}>INFORMATIONS MÉDICALES</Text>
        <View style={s.card}>
          <Row icon={<IconUser2/>}    label="Âge"         value={user?.age       ? `${user.age} ans`         : '—'} onPress={() => setShowEditProfil(true)}/>
          <View style={s.divider}/>
          <Row icon={<IconUser2/>}    label="Sexe"        value={user?.sexe                                   || '—'} onPress={() => setShowEditProfil(true)}/>
          <View style={s.divider}/>
          <Row icon={<IconFileText/>} label="Antécédents" value={user?.antecedents ? '✅ Renseigné' : '⚠ Non renseigné'} onPress={() => setShowEditProfil(true)}/>
          <View style={s.divider}/>
          <Row icon={<IconFileText/>} label="Allergies"   value={user?.allergies   ? '✅ Renseigné' : '—'}           onPress={() => setShowEditProfil(true)}/>
        </View>

        {/* ── SÉCURITÉ ── */}
        <Text style={s.groupLabel}>SÉCURITÉ</Text>
        <View style={s.card}>
          <ToggleRow icon={<IconShield/>} label="Double authentification" value={twoFA}         onToggle={handleToggle2FA}/>
          <View style={s.divider}/>
          <ToggleRow icon={<IconBell/>}   label="Notifications push"      value={notifications} onToggle={() => setNotifs(v => !v)}/>
          <View style={s.divider}/>
          <ToggleRow icon={<IconMail/>}   label="Alertes par email"       value={emailAlerts}   onToggle={() => setEmailAlerts(v => !v)}/>
          <View style={s.divider}/>
          {/* ✅ Clic → ouvre modal changement MDP avec OTP email */}
          <Row icon={<IconKey/>} label="Changer le mot de passe" value="Vérification par email" onPress={() => setShowMDP(true)}/>
        </View>

        {/* ── ABONNEMENT ── */}
        <Text style={s.groupLabel}>ABONNEMENT</Text>
        <TouchableOpacity style={s.proCard} activeOpacity={0.88}>
          <View style={s.proLeft}>
            <View style={s.proBadge}><Text style={s.proBadgeTxt}>GRATUIT</Text></View>
            <Text style={s.proTitle}>Passer à DermaPro+</Text>
            <Text style={s.proSub}>Analyses illimitées, rapport PDF, priorité médecin</Text>
          </View>
          <View style={s.proStars}><IconStar/></View>
        </TouchableOpacity>

        {/* ── SUPPORT ── */}
        <Text style={s.groupLabel}>SUPPORT</Text>
        <View style={s.card}>
          {/* ✅ Chaque ligne ouvre un modal avec contenu complet */}
          <Row icon={<IconHelpCircle/>} label="Aide et FAQ"                  onPress={() => setShowSupport('faq')}/>
          <View style={s.divider}/>
          <Row icon={<IconFileText/>}   label="Conditions d'utilisation"     onPress={() => setShowSupport('cgu')}/>
          <View style={s.divider}/>
          <Row icon={<IconLock/>}       label="Politique de confidentialité" onPress={() => setShowSupport('confidentialite')}/>
        </View>

        {/* ── ZONE DANGEREUSE ── */}
        <Text style={s.groupLabel}>ZONE DANGEREUSE</Text>
        <View style={s.card}>
          <TouchableOpacity style={s.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={[s.rowIcon, { backgroundColor:'#fff5f5' }]}><IconLogOut/></View>
            <Text style={s.rowLabelDanger}>Se déconnecter</Text>
          </TouchableOpacity>
          <View style={s.divider}/>
          <TouchableOpacity style={s.logoutRow} onPress={handleDeleteAccount} activeOpacity={0.7}>
            <View style={[s.rowIcon, { backgroundColor:'#fff5f5' }]}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke={C.red} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </View>
            <Text style={s.rowLabelDanger}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.versionTxt}>DermaScan v1.0.0</Text>
      </ScrollView>

      {/* ── BOTTOM NAVBAR ── */}
      <View style={s.navbar}>
        {([
          { id:'accueil',    label:'Accueil',    Icon:IconHome    },
          { id:'historique', label:'Historique', Icon:IconClock   },
          { id:'scan',       label:'',           Icon:null, fab:true },
          { id:'conseils',   label:'Conseils',   Icon:IconBulb    },
          { id:'profil',     label:'Profil',     Icon:IconUserNav },
        ] as any[]).map(tab => {
          const active = isActive(tab.id);
          if (tab.fab) return (
            <View key="scan" style={s.fabWrap}>
              <TouchableOpacity style={s.fab} onPress={() => goTab('scan')} activeOpacity={0.85}><IconCamera/></TouchableOpacity>
            </View>
          );
          const Icon = tab.Icon;
          return (
            <TouchableOpacity key={tab.id} style={s.tabItem} onPress={() => goTab(tab.id as TabId)} activeOpacity={0.7}>
              {active && <View style={s.tabActiveBg}/>}
              <Icon active={active}/>
              <Text style={[s.tabLabel, active && s.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles Modal ─────────────────────────────────────────────────────────────
const m = StyleSheet.create({
  overlay:       { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  sheet:         { backgroundColor:C.card, borderTopLeftRadius:28, borderTopRightRadius:28, padding:24, maxHeight:'85%' },
  header:        { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  title:         { fontSize:18, fontWeight:'900', color:C.text },
  closeBtn:      { width:36, height:36, borderRadius:10, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  fieldWrap:     { marginBottom:16 },
  fieldLabel:    { fontSize:12, fontWeight:'700', color:C.light, letterSpacing:0.4, marginBottom:8 },
  input:         { backgroundColor:C.bg, borderRadius:14, borderWidth:1.5, borderColor:C.border, paddingHorizontal:14, paddingVertical:12, fontSize:15, color:C.text, fontWeight:'600', marginBottom:0 },
  inputRow:      { flexDirection:'row', alignItems:'center', backgroundColor:C.bg, borderRadius:14, borderWidth:1.5, borderColor:C.border, overflow:'hidden' },
  eyeBtn:        { padding:12 },
  saveBtn:       { backgroundColor:C.primary, borderRadius:16, height:52, alignItems:'center', justifyContent:'center', flexDirection:'row', gap:8, marginTop:16, shadowColor:C.primary, shadowOffset:{width:0,height:6}, shadowOpacity:0.3, shadowRadius:12, elevation:6 },
  saveTxt:       { color:'#fff', fontSize:15, fontWeight:'900' },
  stepsRow:      { flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:20 },
  stepDot:       { width:30, height:30, borderRadius:15, borderWidth:2, borderColor:C.border, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
stepDotActive: {
  borderColor: C.primary,
  backgroundColor: '#e6f9f6',
},
  stepDotDone:   { backgroundColor:C.primary, borderColor:C.primary },
  stepTxt:       { fontSize:12, fontWeight:'700', color:C.light },
  stepTxtActive: { color:C.primary },
  stepLine:      { width:40, height:2, backgroundColor:C.border, marginHorizontal:4 },
  stepLineActive:{ backgroundColor:C.primary },
  stepTitle:     { fontSize:16, fontWeight:'800', color:C.text, marginBottom:6 },
  stepSub:       { fontSize:13, color:C.light, marginBottom:16, lineHeight:19 },
  resendBtn:     { alignItems:'center', marginTop:8, marginBottom:4 },
  resendTxt:     { fontSize:13, color:C.primary, fontWeight:'700' },
  infoBox:       { backgroundColor:'#fffbeb', borderWidth:1.5, borderColor:'#fde68a', borderRadius:12, padding:12, marginBottom:12 },
  infoTxt:       { fontSize:12, color:'#92400e', lineHeight:18 },
  faqItem:       { marginBottom:18, backgroundColor:C.bg, borderRadius:14, padding:14 },
  faqQ:          { fontSize:14, fontWeight:'800', color:C.text, marginBottom:6 },
  faqA:          { fontSize:13, color:C.light, lineHeight:19 },
});

// ─── Styles principal ─────────────────────────────────────────────────────────
const r = StyleSheet.create({
  row:      { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:13, paddingHorizontal:16 },
  rowIcon:  { width:36, height:36, borderRadius:10, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  rowLabel: { fontSize:14, fontWeight:'600', color:C.text },
  rowValue: { fontSize:12, color:C.light, marginTop:2, fontWeight:'500' },
});

const s = StyleSheet.create({
  safe:             { flex:1, backgroundColor:C.bg },
  scroll:           { flex:1 },
  scrollContent:    { paddingBottom:32 },
  header:           { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:C.card, paddingHorizontal:18, paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border },
  headerBtn:        { width:40, height:40, borderRadius:12, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  headerTitle:      { fontSize:17, fontWeight:'800', color:C.text, letterSpacing:-0.3 },
  heroCard:         { backgroundColor:C.card, marginHorizontal:18, marginTop:18, borderRadius:24, padding:22, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.08, shadowRadius:14, elevation:5 },
  avatarWrap:       { position:'relative', marginBottom:14 },
  avatar:           { width:80, height:80, borderRadius:24, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', shadowColor:C.primary, shadowOffset:{width:0,height:6}, shadowOpacity:0.35, shadowRadius:12, elevation:8 },
  avatarTxt:        { color:'#fff', fontWeight:'900', fontSize:26, letterSpacing:1 },
  avatarEditBtn:    { position:'absolute', bottom:-6, right:-6, width:28, height:28, borderRadius:9, backgroundColor:C.card, borderWidth:2, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  heroName:         { fontSize:22, fontWeight:'900', color:C.text, letterSpacing:-0.5, marginBottom:6 },
  verifiedBadge:    { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'#eff6ff', borderRadius:10, paddingHorizontal:10, paddingVertical:5, marginBottom:5 },
  verifiedTxt:      { fontSize:12, fontWeight:'700', color:C.verified },
  heroSince:        { fontSize:12, color:C.light, marginBottom:18, fontWeight:'500' },
  statsRow:         { flexDirection:'row', width:'100%', backgroundColor:C.bg, borderRadius:16, overflow:'hidden' },
  statItem:         { flex:1, alignItems:'center', paddingVertical:12 },
  statBorder:       { borderRightWidth:1, borderRightColor:C.border },
  statEmoji:        { fontSize:16, marginBottom:4 },
  statValue:        { fontSize:18, fontWeight:'900', color:C.text },
  statLabel:        { fontSize:10, color:C.light, marginTop:2, fontWeight:'600' },
  scoreCard:        { backgroundColor:C.card, marginHorizontal:18, marginTop:14, borderRadius:20, padding:18, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.06, shadowRadius:10, elevation:4 },
  scoreValue:       { fontSize:36, fontWeight:'900', lineHeight:40 },
  scoreUnit:        { fontSize:14, color:C.light, fontWeight:'700', marginBottom:4 },
  scoreTitle:       { fontSize:16, fontWeight:'800', color:C.text, marginBottom:2 },
  scoreSub:         { fontSize:12, color:C.light, marginBottom:4 },
  scoreBarBg:       { height:8, backgroundColor:C.border, borderRadius:4, overflow:'hidden', marginTop:10, marginBottom:8 },
  scoreBarFill:     { height:8, borderRadius:4 },
  scoreNote:        { fontSize:12, fontWeight:'600' },
  statsDetailCard:  { backgroundColor:C.card, marginHorizontal:18, borderRadius:20, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.06, shadowRadius:10, elevation:4 },
  statsDetailRow:   { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:14, paddingHorizontal:16 },
  statsDetailIcon:  { width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center' },
  statsDetailLabel: { flex:1, fontSize:14, fontWeight:'600', color:C.text },
  statsDetailValue: { fontSize:15, fontWeight:'900' },
  groupLabel:       { fontSize:11, fontWeight:'800', color:C.light, marginHorizontal:18, marginTop:22, marginBottom:10, letterSpacing:1.2, textTransform:'uppercase' },
  card:             { backgroundColor:C.card, marginHorizontal:18, borderRadius:20, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.06, shadowRadius:10, elevation:4 },
  divider:          { height:1, backgroundColor:C.border, marginHorizontal:16 },
  rowIcon:          { width:36, height:36, borderRadius:10, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' },
  rowLabelDanger:   { fontSize:14, fontWeight:'700', color:C.red, flex:1 },
  logoutRow:        { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:13, paddingHorizontal:16 },
  proCard:          { marginHorizontal:18, borderRadius:20, padding:18, backgroundColor:'#0D2B22', flexDirection:'row', alignItems:'center', shadowColor:'#0D2B22', shadowOffset:{width:0,height:8}, shadowOpacity:0.3, shadowRadius:16, elevation:8 },
  proLeft:          { flex:1 },
  proBadge:         { backgroundColor:C.primary+'33', borderRadius:6, paddingHorizontal:8, paddingVertical:3, alignSelf:'flex-start', marginBottom:8 },
  proBadgeTxt:      { fontSize:10, fontWeight:'800', color:C.primary, letterSpacing:1 },
  proTitle:         { fontSize:15, fontWeight:'800', color:'#fff', marginBottom:4 },
  proSub:           { fontSize:12, color:C.inactive, lineHeight:17 },
  proStars:         { width:44, height:44, borderRadius:14, backgroundColor:C.primary+'22', alignItems:'center', justifyContent:'center' },
  versionTxt:       { textAlign:'center', fontSize:12, color:C.inactive, marginTop:24, marginBottom:4, fontWeight:'500' },
  navbar:           { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderTopWidth:1, borderTopColor:C.border, height:74, paddingHorizontal:8, shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.07, shadowRadius:14, elevation:14 },
  tabItem:          { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:6, gap:4, position:'relative' },
  tabActiveBg:      { position:'absolute', top:4, width:44, height:32, borderRadius:12, backgroundColor:C.primary+'18' },
  tabLabel:         { fontSize:10, fontWeight:'600', color:C.inactive },
  tabLabelActive:   { color:C.primary },
  fabWrap:          { flex:1, alignItems:'center', justifyContent:'center', marginTop:-26 },
  fab:              { width:62, height:62, borderRadius:31, backgroundColor:C.primary, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:C.card, shadowColor:C.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:14, elevation:12 },
});