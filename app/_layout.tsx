import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      {/* Status bar adaptif */}
      <StatusBar style="dark" />


      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="about" options={{ headerShown: true, title: "About" }} />
        <Stack.Screen name="(tabs)" />  {/* render grup tabs */}
      </Stack>
    </>
  );
}
