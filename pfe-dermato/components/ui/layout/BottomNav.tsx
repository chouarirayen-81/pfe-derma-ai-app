import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Home, History, Camera, Lightbulb, User } from "lucide-react-native";

const C = {
  bg: "#FFFFFF",
  border: "rgba(15,23,42,0.08)",
  teal: "#18B7A0",
  muted: "#94A3B8",
  text: "#0F172A",
};

type TabItem = {
  label: string;
  path: string;
  Icon: any;
};

const TABS: TabItem[] = [
  { label: "Accueil", path: "/(tabs)/acceuil", Icon: Home },
  { label: "Historique", path: "/(tabs)/historique", Icon: History },
  { label: "Scan", path: "/(tabs)/scan", Icon: Camera },
  { label: "Conseils", path: "/(tabs)/conseil", Icon: Lightbulb },
  { label: "Profil", path: "/(tabs)/profile", Icon: User },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {TABS.map((t) => {
          const active = pathname === t.path || (t.path === "/(tabs)" && pathname === "/(tabs)/index");
          const isCenter = t.label === "Scan";
          const color = active ? C.teal : C.muted;

          return (
            <TouchableOpacity
              key={t.label}
              activeOpacity={0.85}
              onPress={() => router.push(t.path as any)}
              style={[styles.item, isCenter && styles.centerItem]}
            >
              {isCenter ? (
                <View style={styles.centerButton}>
                  <t.Icon size={22} color="white" />
                </View>
              ) : (
                <>
                  <t.Icon size={20} color={color} />
                  <Text style={[styles.label, { color }]}>{t.label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  bar: {
    height: 72,
    backgroundColor: C.bg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  item: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
  },
  centerItem: {
    width: 82,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.teal,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -26,
    shadowColor: C.teal,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
});