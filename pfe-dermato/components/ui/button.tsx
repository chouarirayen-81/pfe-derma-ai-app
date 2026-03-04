import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "soft" | "ghost";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

const COLORS = {
  teal: "#18B7A0",
  tealSoft: "rgba(24,183,160,0.14)",
  text: "#0F172A",
  muted: "#64748B",
};

export function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "soft" && styles.soft,
        variant === "ghost" && styles.ghost,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text
        style={[
          styles.baseText,
          variant === "primary" && styles.primaryText,
          variant !== "primary" && styles.otherText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  baseText: {
    fontSize: 15,
    fontWeight: "900",
  },
  primary: {
    backgroundColor: COLORS.teal,
    shadowColor: COLORS.teal,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  primaryText: { color: "white" },
  soft: {
    backgroundColor: COLORS.tealSoft,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  otherText: { color: COLORS.teal },
});