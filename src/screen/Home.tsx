import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { BackHandler } from "react-native";
import { WebViewNativeEvent } from "react-native-webview/lib/WebViewTypes";
import { StatusBar } from "expo-status-bar";
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
      <StatusBar style="auto" />
      <WebView
        style={{ marginTop: 25 }}
        source={{ uri: "https://dosuri.site" }}
        ref={ref}
        onNavigationStateChange={(e) => setNavState(e)}
      />
    </>
  );
};
export default Home;
