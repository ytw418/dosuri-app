import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { BackHandler } from "react-native";
import { WebViewNativeEvent } from "react-native-webview/lib/WebViewTypes";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const ref = useRef<WebView>(null);
  const [navState, setNavState] = useState<WebViewNativeEvent>();

  useEffect(() => {
    const canGoBack = navState?.canGoBack;

    const onPress = () => {
      if (canGoBack) {
        ref?.current?.goBack();
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", onPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onPress);
    };
  }, [navState?.canGoBack]);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: "https://dosuri.site" }}
          ref={ref}
          onNavigationStateChange={(e) => setNavState(e)}
        />
      </SafeAreaView>
    </>
  );
};
export default Home;
