// components/Field.tsx
import React, { useState, useRef, forwardRef } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Animated,
} from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

const C = {
  primary:     "#00C6A7",
  light:       "#7A9E95",
  border:      "#DFF0EB",
  inputBg:     "#F3FAF8",
  error:       "#e53935",
  errorBg:     "#fff5f5",
  errorBorder: "#fca5a5",
  success:     "#00C6A7",
  text:        "#0D2B22",
};

// ─── Icons internes ───────────────────────────────────────────────────────────
const IconEye = ({ show }: { show: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    {show ? (
      <>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={C.light} strokeWidth={2}/>
        <Circle cx={12} cy={12} r={3} stroke={C.light} strokeWidth={2}/>
      </>
    ) : (
      <Path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"
        stroke={C.light} strokeWidth={2} strokeLinecap="round"
      />
    )}
  </Svg>
);

const IconCheck = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13l4 4L19 7" stroke={C.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FieldProps {
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

// ─── Field avec forwardRef (corrige l'erreur inputRef) ────────────────────────
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
      <Text style={s.label}>{label}</Text>
      <Animated.View style={[
        s.row,
        { borderColor },
        error   ? { backgroundColor: C.errorBg } : {},
        focused ? { backgroundColor: "#f0fdfb"  } : {},
      ]}>
        <View style={s.iconWrap}>{icon}</View>
        <TextInput
          ref={ref}                          // ✅ forwardRef — plus d'erreur inputRef
          style={s.input}
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
          <View style={s.validBadge}><IconCheck/></View>
        )}
        {showToggle && (
          <TouchableOpacity onPress={onTogglePwd} activeOpacity={0.7} style={s.eyeBtn}>
            <IconEye show={!!showPwd}/>
          </TouchableOpacity>
        )}
      </Animated.View>
      {!!error && <Text style={s.errorTxt}>⚠ {error}</Text>}
    </View>
  );
});

Field.displayName = "Field";
export default Field;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  label:      { fontSize: 12, fontWeight: "700", color: C.light, letterSpacing: 0.4, marginBottom: 8, marginLeft: 2 },
  row:        { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, height: 54, backgroundColor: C.inputBg, borderRadius: 16, borderWidth: 1.5, borderColor: C.border },
  iconWrap:   { width: 22, alignItems: "center" },
  input:      { flex: 1, fontSize: 15, color: C.text, fontWeight: "600" },
  eyeBtn:     { padding: 8 },
  validBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#e6f9f6", alignItems: "center", justifyContent: "center" },
  errorTxt:   { fontSize: 12, color: C.error, fontWeight: "700", marginTop: 5, marginLeft: 4 },
});
