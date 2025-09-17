import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H1Text, H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import Cart from "../global/Cart";
import { myAppRSformat } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
import OtpInput from "../components/OtpInput";
/********************************************************************/

export default function VerifyOTP({ navigation, route }) {
  const submitButtonRef = useRef();
  const OtpInputRef = useRef();

  const isFocused = useIsFocused();
  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }
  }, []);

  const resendOtp = () => {
    closeAndGoBack();
  };

  var enteredOTP = "";
  const readEnteredOtp = (val) => {
    enteredOTP = val;
  };

  const prepareSubmitOTP = () => {
    enteredOTP = enteredOTP.trim();
    if (
      enteredOTP == "" ||
      enteredOTP.toString().charAt(0) == "0" ||
      !enteredOTP.match("[0-9]{5}")
    ) {
      Alert.alert("", "Please enter 5 digit OTP sent to your mobile number");
      return false;
    }

    submitOTP(enteredOTP);
  };

  const submitOTP = (otp) => {
    submitButtonRef.current.setVerifying(true);

    MY_API({
      scriptName: "otp_verify",
      data: {
        mobile_number: route.params.screenData.mobileNumber,
        otp: otp,
        user_id: "",
      },
      options: { errorResponseCallBack: onWrongOtp },
    })
      .then(({ status, data }) => {
        //submitButtonRef?.current.setVerifying(false);
        setAppUser(data);
      })
      .catch((error) => {
        submitButtonRef?.current.setVerifying(false);
      })
      .finally(() => {});
  };

  const onWrongOtp = () => {
    OtpInputRef.current.clearOtpInput();
  };

  const closeAndGoBack = () => {
    navigation.pop();
  };

  const setAppUser = (data) => {
    AppUser.set({
      mobileNumber: data.mobile_number.toString(),
      userId: data.user_id,
      accessToken: data.access_token,
    })
      .then(() => {
        console.log("Set Done");
        clearRoutesStackAndGoHome();
      })
      .catch(() => {
        submitButtonRef?.current.setVerifying(false);
      })
      .finally(() => {
        console.log("finally");
      });
  };

  const clearRoutesStackAndGoHome = () => {
    const goTo = "HomePre"; // location will be set in HomePre
    navigation.reset({
      index: 0,
      routes: [{ name: goTo }],
    });
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
    >
      <View style={styles.verifyOtpHolder}>
        <Text
          style={{ color: COLORS.textMedium, fontSize: 13, marginBottom: 10 }}
        >
          Please check your messages for the OTP sent to
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={styles.mobileInVerify}>
            {route.params.screenData.mobileNumber}
          </Text>
          <Pressable
            onPress={() => {
              closeAndGoBack();
            }}
            style={{
              width: 80,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.ChangeMobileLink}>Change</Text>
          </Pressable>
        </View>
        <Text style={GlobalStyles.inputLabel}>Enter OTP</Text>
        <OtpInput
          count={5}
          sendValueCallBack={readEnteredOtp}
          autoFocus={true}
          showResendOtp={true}
          resendOtpCallBack={resendOtp}
          submitFunction={prepareSubmitOTP}
          ref={OtpInputRef}
        />
        <SubmitOtpButton callBack={prepareSubmitOTP} ref={submitButtonRef} />
      </View>
    </ScreenContainer>
  );
}

const SubmitOtpButton = forwardRef(({ callBack }, ref) => {
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    setVerifying(bool) {
      setVerifyingOtp(bool);
    },
  }));

  return (
    <Pressable
      style={[
        styles.SubmitOtpButton,
        {
          backgroundColor: verifyingOtp ? "#999999E6" : COLORS.sharpButton,
        },
      ]}
      disabled={verifyingOtp ? true : false}
      onPress={() => {
        callBack();
      }}
    >
      <Text style={{ color: "white" }}>
        {verifyingOtp ? "Please Wait . . ." : "Submit OTP"}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  verifyOtpHolder: {
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 30,
    /*     maxWidth:
      Dimensions.get("window").width > 500
        ? 500
        : Dimensions.get("window").width, */
    //backgroundColor: "#EEEEEE",
  },
  SubmitOtpButton: {
    width: "100%",
    //paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 20,
    alignItems: "center",

    borderRadius: 4,
  },
  mobileInVerify: {
    fontSize: 18,
  },
  ChangeMobileLink: {
    //marginLeft: 10,
    fontSize: 10,
    color: COLORS.primaryDark,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: COLORS.primaryDark,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
