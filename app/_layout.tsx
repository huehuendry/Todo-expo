import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppBootstrap } from "../components/AppBootstrap";
import { TodosProvider } from "../context/TodosContext";

export default function RootLayout() {
  return (
    <AppBootstrap>
      <TodosProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(modals)/task/[id]"
            options={{
              presentation: "transparentModal",
              headerTitle: "Task Detail",
              animation: "fade",
            }}
          />
        </Stack>
      </TodosProvider>
    </AppBootstrap>
  );
}
