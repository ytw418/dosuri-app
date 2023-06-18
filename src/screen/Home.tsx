import React, { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";
import { BackHandler, PanResponder } from "react-native";
import { WebViewNativeEvent } from "react-native-webview/lib/WebViewTypes";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Platform } from "react-native";
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
      if (Platform.OS === "ios" && gestureState.dx > 150) {
        // 오른쪽으로 스와이프하여 이전 페이지로 이동
        ref.current.goBack();
      }
    },
  });

  useEffect(() => {
    (async () => {
      const location = await Location.requestForegroundPermissionsAsync();
      console.log("location :>> ", location);
    })();
  }, []);

  /** 웹뷰 통신받기 */
  const onMessage = (e) => {
    // const data = e.nativeEvent.data; // 위치 정보
    // Alert.alert(data); // RN은 Alert객체가 따로 있어서 'Alert.alert()' 사용
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: "https://dosuri.site" }}
          ref={ref}
          onMessage={onMessage}
          onNavigationStateChange={(e) => setNavState(e)}
          {...panResponder.panHandlers}
        />
      </SafeAreaView>
    </>
  );
};
export default Home;
