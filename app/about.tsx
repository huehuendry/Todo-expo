
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen options={{ headerShown: true, title: "About" }} />
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Todo App</Text>
      <Text>Versi demo untuk belajar Expo Router + React Native.</Text>
    </View>
  );
}
