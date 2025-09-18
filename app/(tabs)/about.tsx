import { Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>About</Text>
      <Text>Demo Expo Router Tabs (Home & About).</Text>
    </View>
  );
}
