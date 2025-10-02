import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { PropsWithChildren, useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export function AppBootstrap({ children }: PropsWithChildren) {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <>{children}</>;
}
