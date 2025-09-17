import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  Alert,
  Pressable,
  BackHandler,
  Modal,
  Linking,
  Button,
  Keyboard,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import MY_API from "../global/API";
import {
  distanceBetweenLatandLng,
  isValidMobileNumber,
  myAppRandomString,
  myNavigationHandler,
} from "../global/functions";
/********************************************************************/

import { Ionicons } from "@expo/vector-icons";
import FakeCaret from "../components/FakeCaret";

var enteredMobileNumberSave = "";
var onVerificationPanel = false;
export default function FirstLaunch({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef();
  const sendButtonRef = useRef();
  const modalRef = useRef();
  const weDeliverRef = useRef();
  const globalContext = useAppContext();
  const { globalCONSTANTS, globalAppParams } = globalContext;
  const isFocused = useIsFocused();
  useEffect(() => {
    //mobileNumber = "";
    if (!isFocused) {
      return () => {};
    }
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
  }, []);

  const prepareSendOTP = () => {
    let mobileNumber = inputRef.current.getEnteredMobileNumber();

    if (!isValidMobileNumber(mobileNumber)) {
      Alert.alert("", "Please enter a valid 10 digit mobile number");
      inputRef.current.focusMobileNumberInput();
      return false;
    }

    sendOTP(mobileNumber);
  };

  const sendOTP = (mobileNumber) => {
    enteredMobileNumberSave = mobileNumber;
    sendButtonRef.current.setSending(true);
    console.log(mobileNumber);
    MY_API({
      scriptName: "otp_send",
      data: {
        mobile_number: mobileNumber,
        device_platform: Platform.OS === "android" ? "A" : "I",
      },
      options: {},
    })
      .then(({ status, data }) => {
        myNavigationHandler(navigation, "VerifyOTP", {
          mobileNumber: mobileNumber,
        });
      })
      .catch((error) => {
        sendButtonRef?.current?.setSending(false);
        //sendButtonRef?.current?.setSending(false);
      })
      .finally(() => {
        setTimeout(() => {
          sendButtonRef?.current?.setSending(false);
        }, 300);

        //loadingBlock(false);
      });
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", paddingBottom: insets.bottom }}
    >
      <LinearGradient
        style={{
          flex: 1,
          paddingTop: insets.top,

          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        //colors={["#a03b13e5", "#dd5019e5"]}
        colors={[COLORS.primaryDark, COLORS.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={{
            width: "100%",
            height: 220,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 160,
              width: undefined,
              aspectRatio: 1,
              backgroundColor: "white",
              borderRadius: 500,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                borderRadius: 1024,
                borderWidth: 2,
                borderColor: "#fff",
              }}
              source={require("../images/icon_1024.png")}
            />
          </View>
          <Text style={{ fontSize: 16, color: "white", marginTop: 8 }}>
            Home needs delivery in minutes
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            overflow: "hidden",

            backgroundColor: "#ffffffff",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,

            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center" }}
          >
            Sign Up
          </Text>
          <View style={{ padding: 20, paddingTop: 16 }}>
            <MobileNumberInput
              ref={inputRef}
              autoFocus={false}
              sendOtpButtonFunction={prepareSendOTP}
            />
            <SendOtpButton callBack={prepareSendOTP} ref={sendButtonRef} />
          </View>
          <ScrollView>
            <View style={styles.benifitsHolder}>
              <View style={styles.benifitsRow}>
                <Image
                  style={{
                    width: 90,
                    height: undefined,
                    aspectRatio: 172 / 103,
                  }}
                  source={require("../images/fastDelivery.png")}
                />
                <Text style={styles.benifitText}>
                  Get your order before you are done watching few shorts on
                  YouTube.
                </Text>
              </View>
              <View style={styles.benifitsRow}>
                <Text style={styles.benifitText}>
                  Guaranteed low prices. We price match for a better price you
                  find.
                </Text>
                <Image
                  style={{
                    width: 90,
                    height: undefined,
                    aspectRatio: 150 / 112,
                  }}
                  source={require("../images/low_price2.png")}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: undefined,
                    aspectRatio: 120 / 118,
                    marginHorizontal: 10,
                  }}
                  source={require("../images/quality2.png")}
                />
                <Image
                  style={{
                    width: 100,
                    height: undefined,
                    aspectRatio: 200 / 78,
                  }}
                  source={require("../images/cod2.png")}
                />
                <Text
                  style={{ fontSize: 12, color: "#353535ff", marginLeft: 12 }}
                >
                  and more . . .
                </Text>
              </View>
            </View>
          </ScrollView>
          <Pressable
            style={{ justifyContent: "flex-End" }}
            onPress={() => {
              try {
                inputRef.current.focusMobileNumberInput();
              } catch (err) {
                console.log(err);
              }
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                marginTop: 15,
                marginBottom: 10,
                fontSize: 18,
                fontWeight: "bold",
                color: "#5c5c5cff",
              }}
            >
              Try {globalAppParams.appName}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const MobileNumberInput = forwardRef(
  ({ autoFocus, sendOtpButtonFunction }, ref) => {
    const [mobileNumber, setMobileNumber] = useState("");
    const [fakeCaret, setFakeCaret] = useState(true);
    const inputRef = useRef();
    const fakeCaretRef = useRef();
    useImperativeHandle(ref, () => ({
      getEnteredMobileNumber() {
        return mobileNumber;
      },
      focusMobileNumberInput() {
        inputRef.current.focus();
      },
    }));

    useEffect(() => {
      if (enteredMobileNumberSave != "") {
        setMobileNumber(enteredMobileNumberSave);
      }
    }, []);

    return (
      <LinearGradient
        style={{
          marginBottom: 6,
          borderWidth: 0.2,
          borderColor: "#383838b7",
          backgroundColor: "#eeeeeeff",
          borderRadius: 100,
        }}
        colors={["#e7e7e7ff", "#eeeeeeff", "#e7e7e7ff"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <TextInput
          ref={inputRef}
          autoFocus={autoFocus}
          defaultValue={enteredMobileNumberSave}
          maxLength={10}
          placeholder={"10 digit Mobile Number"}
          keyboardType={"number-pad"}
          //autoFocus={autoFocusSearchInput}
          //clearButtonMode="always"
          //ref={textInputRef}
          style={{
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          //onFocus={(e) => {
          //  onFocus(e);
          //}}
          //onBlur={(val) => {
          //  onBlur(val);
          //}}
          onFocus={() => {
            fakeCaretRef?.current?.remove();
          }}
          onChangeText={(val) => {
            setMobileNumber(val);
            // mobileNumber = val;
          }}
          onSubmitEditing={() => {
            sendOtpButtonFunction();
          }}
        />
        <FakeCaret ref={fakeCaretRef} />
      </LinearGradient>
    );
  }
);

const SendOtpButton = forwardRef(({ callBack }, ref) => {
  const [sendingOtp, setSendingOtp] = useState(false);

  useEffect(() => {}, [sendingOtp]);

  useImperativeHandle(ref, () => ({
    setSending(bool) {
      setSendingOtp(bool);
    },
  }));

  return (
    <Pressable
      style={[
        styles.getOTPButton,
        {
          backgroundColor: sendingOtp ? "#999999E6" : COLORS.sharpButton,
        },
      ]}
      disabled={sendingOtp ? true : false}
      onPress={() => {
        callBack();
      }}
    >
      <Text style={{ color: "white" }}>
        {sendingOtp ? "Sending OTP . . ." : "Send OTP"}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  getOTPButton: {
    width: "100%",
    //paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: "center",

    borderRadius: 100,
  },

  appName: {
    fontSize: 20,
    color: COLORS.primaryDark,
    fontWeight: "600",
  },

  benifitsHolder: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#cfcfcf4d",
    borderRadius: 15,
  },
  benifitsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,

    //backgroundColor: "#f1f1f1b9",
    //borderradius: 10,
  },
  benifitText: {
    flexShrink: 1,
    fontSize: 12,
    color: "#383838ff",
  },
});
