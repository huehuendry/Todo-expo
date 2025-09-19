import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {/* Ikon besar di atas */}
      <Ionicons name="information-circle-outline" size={64} color="#4c9dff" style={{ marginBottom: 16 }} />

      {/* Judul */}
      <Text style={styles.title}>About This App</Text>

      {/* Deskripsi singkat */}
      <View style={styles.card}>
        <Text style={styles.text}>
          ✅ Todo App sederhana dibuat dengan React Native + Expo Router.
        </Text>
        <Text style={styles.text}>
          🎯 Tujuan: belajar navigasi, state management, dan UI dasar.
        </Text>
        <Text style={styles.text}>
          🚀 Dikembangkan oleh Hendry, 2025.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  // konten ke tengah
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // untuk Android
    width: "100%",
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
});
