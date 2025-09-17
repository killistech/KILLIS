import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Alert,
  AppState,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useIsFocused } from "@react-navigation/native";
//import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";

/************* Created for this Application *************************/

/********************************************************************/
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

import * as Linking from "expo-linking";

let captureInProgess = false;
export default function CameraPanel({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);

  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const globalContext = useAppContext();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const check = async () => {
    const res = await Camera.getCameraPermissionsAsync();
    console.log("check", res);
    if (res.status === "denied" || !res.granted) {
      setHasPermission(false);
      return;
    }
    if (res.granted) {
      setHasPermission(true);
      return;
    } else {
      if (canAskAgain) {
        ask();
      }
    }
  };

  const ask = async () => {
    const res = await Camera.requestCameraPermissionsAsync();
    console.log("requestCameraPermissionsAsync ->", res);
    if (res.granted) {
      setHasPermission(true);
    }
    if (!res.granted && res.status === "denied") {
      setHasPermission(false);
      return;
    }
    if (!res.granted && res.status === "undetermined") {
      check();
    }
  };

  useEffect(() => {
    check(); // check on mount

    // Listen for app coming back from background
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        check();
      }
    });

    return () => subscription.remove();
  }, []);

  const captureImage = async () => {
    if (captureInProgess) {
      return false;
    }

    captureInProgess = true;

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      allDone(photo.uri);

      captureInProgess = false;
    }
  };

  const allDone = (uri) => {
    globalContext?.callBacks?.onCameraImageTake(uri);

    navigation.goBack();
  };

  const closeButtonPress = () => {
    closeCameraBacktoScreen();
  };

  const closeCameraBacktoScreen = () => {
    navigation.goBack();
  };

  console.log("X", hasPermission);
  if (hasPermission === null) {
    return null;
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Need access to your device Camera</Text>
        <Text style={{ marginVertical: 20 }}>
          Open device settings to provde access
        </Text>
        <Button
          title="Open Settings"
          onPress={() => {
            Linking.openSettings();
          }}
        />
      </View>
    );
  }

  const floatToRatioString = (r) => {
    const ratios = [
      { r: 4 / 3, s: "4:3" },
      { r: 3 / 2, s: "3:2" },
      { r: 16 / 9, s: "16:9" },
      { r: 3 / 4, s: "3:4" },
    ];
    let best = ratios[0];
    let diff = Math.abs(r - best.r);
    for (let i = 1; i < ratios.length; i++) {
      const d = Math.abs(r - ratios[i].r);
      if (d < diff) {
        best = ratios[i];
        diff = d;
      }
    }
    return best.s;
  };

  return (
    <View style={{ width: windowWidth, height: windowHeight }}>
      <CameraView
        ref={cameraRef}
        style={{ width: windowWidth, height: windowHeight }}
        facing="back"
        //ratio={floatToRatioString(windowHeight / windowWidth)}
        //let expo decide the best ratio
      />
      <CameraCloseButton closeCameraFunc={closeButtonPress} />
      <Pressable
        style={[styles.captureBtn, { bottom: insets.bottom + 0 }]}
        onPress={() => {
          captureImage();
        }}
      >
        <View style={styles.captureBtnInner}></View>
      </Pressable>
    </View>
  );
}

const CameraCloseButton = forwardRef(({ closeCameraFunc }, ref) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    func() {},
  }));

  return (
    <Pressable
      style={[styles.camCloseBtn, { top: insets.top + 10 }]}
      onPress={() => {
        closeCameraFunc();
      }}
    >
      <Ionicons
        name="close-circle-sharp"
        size={50}
        color="#777777cb"
      ></Ionicons>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  camCloseBtn: {
    position: "absolute",
    right: 20,
  },
  captureBtn: {
    position: "absolute",

    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },
  captureBtnInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderColor: "#000000FF",
    borderWidth: 2,
  },
});
