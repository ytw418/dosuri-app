import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { BackHandler, PanResponder } from "react-native";
import { WebViewNativeEvent } from "react-native-webview/lib/WebViewTypes";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
const Home = () => {
  const ref = useRef<WebView>(null);
  const [navState, setNavState] = useState<WebViewNativeEvent>();

  /** Android 뒤로가기 버튼 기능 */
  useEffect(() => {
    const canGoBack = navState?.canGoBack;

    const onPress = () => {
      console.log("hardwareBackPress 실행");
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

  /** IOS 뒤로가기 스와이프 구현 */
  const panResponder = PanResponder.create({
    //https://reactnative.dev/docs/panresponder 참고
    onStartShouldSetPanResponder: () => true,
    onPanResponderEnd: (_, gestureState) => {
      if (gestureState.dx > 150) {
        // 오른쪽으로 스와이프하여 이전 페이지로 이동
        ref.current.goBack();
      }
    },
  });

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  console.log("text :>> ", text);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: "https://dosuri.site" }}
          ref={ref}
          onNavigationStateChange={(e) => setNavState(e)}
          {...panResponder.panHandlers}
        />
      </SafeAreaView>
    </>
  );
};
export default Home;
