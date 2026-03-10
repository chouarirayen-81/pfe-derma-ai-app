import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: any; 
};



export default function OnboardingScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const goToTabs = () => {
    router.replace("/welcome");
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const onNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex((prev) => prev + 1);
    } else {
      goToTabs();
    }
  };
  const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Analyse cutanée\nintelligente",
    subtitle:
      "Prenez en photo vos lésions cutanées et obtenez une aide à l’analyse en quelques secondes grâce à l’IA.",
    image: require("../../assets/images/1.png"),
  },
  {
    id: "2",
    title: "Résultats détaillés\net fiables",
    subtitle:
      "Score de confiance, catégories probables et conseils personnalisés pour chaque analyse.",
    image: require("../../assets/images/2.png"),
  },
  {
    id: "3",
    title: "Vos données \nprotégées",
    subtitle:
      "Chiffrement de bout en bout et anonymisation. Vos données médicales restent confidentielles.",
    image: require("../../assets/images/3.jpg"),
  },
];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToTabs} style={styles.skipBtn} activeOpacity={0.7}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageWrap}>
  <View style={styles.imageCard}>
    <Image source={item.image} style={styles.image} resizeMode="cover" />
  </View>
</View>

            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom area: dots + next button + disclaimer */}
      <View style={styles.bottom}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
          
        <TouchableOpacity onPress={onNext} style={styles.nextBtn} activeOpacity={0.85}>
          <Text style={styles.nextArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.disclaimerRow}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.disclaimerText}>
            Cette application n’a pas valeur de diagnostic médical. Consultez un
            professionnel de santé.
          </Text>
        </View>
      </View>
    </View>
  );
}

const GREEN = "#18B7A0";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const BG = "#FFFFFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  skipBtn: {
    position: "absolute",
    top: 16,
    right: 18,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  skipText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
  },

  slide: {
    width,
    paddingTop: 56,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  imageWrap: {
  width: "100%",
  height: height * 0.45,
  alignItems: "center",
  justifyContent: "center",
},

imageCard: {
  width: "86%",
  height: "90%",
  borderRadius: 26,     // ✅ هنا تتحكم في round
  overflow: "hidden",   // ✅ ضروري باش القص يعمل
  backgroundColor: "#F2F6F7",
},

image: {
  width: "100%",
  height: "100%",
},
  textWrap: {
    width: "100%",
    marginTop: 10,
  },
  title: {
    color: TEXT,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    maxWidth: 320,
  },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
    paddingHorizontal: 22,
    paddingBottom: 10,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    height: 6,
    borderRadius: 999,
  },
  dotActive: {
    width: 22,
    backgroundColor: GREEN,
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#D8E2E8",
  },

  nextBtn: {
    position: "absolute",
    right: 22,
    bottom: 48,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  nextArrow: {
    color: "white",
    fontSize: 34,
    lineHeight: 34,
    fontWeight: "700",
    marginTop: -2,
  },

  disclaimerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  warningIcon: {
    fontSize: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: "#94A3B8",
  },
});