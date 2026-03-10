// ─── Dans HistoriqueScreen.tsx ────────────────────────────────────────────────
// 1. Ajouter useLocalSearchParams si besoin, ou passer l'id dans la route

// Dans la liste, remplace le TouchableOpacity de la carte par :

<TouchableOpacity
  style={s.card}
  activeOpacity={0.82}
  onPress={() => router.push(`/historique/${item.id}`)}   // ← route dynamique
>

// ─── Fichier de route : app/historique/[id].tsx ───────────────────────────────
// Crée ce fichier pour capturer le paramètre id :

import { useLocalSearchParams } from 'expo-router';
import AnalysisDetailScreen from '../../screens/AnalysisDetailScreen';

export default function AnalysisDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Passe l'id à ton composant ou récupère les données depuis un store/API
  return <AnalysisDetailScreen analysisId={Number(id)} />;
}

// ─── Dans AnalysisDetailScreen.tsx ───────────────────────────────────────────
// Remplace mockResult par une vraie récupération :

import { useLocalSearchParams } from 'expo-router';

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Option A — données locales (tableau allAnalyses importé)
  const result = allAnalyses.find(a => a.id === Number(id)) ?? mockResult;

  // Option B — API / store Zustand / Redux
  // const result = useAnalysisStore(state => state.getById(Number(id)));

  // ... reste du composant identique
}
