import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppBootstrap } from "../components/AppBootstrap";

export default function RootLayout() {
  return (
    <AppBootstrap>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppBootstrap>
  );
}
