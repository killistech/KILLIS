import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
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
  TextInput,
  Alert,
  Platform,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import {
  H1Text,
  H2Text,
  H3Text,
  MyActivityIndicator,
} from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import Cart from "../global/Cart";
import { isValidMobileNumber, myAppRSformat } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
/********************************************************************/
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import OtpInput from "../components/OtpInput";
import ScrollAnchor from "../components/ScrollAnchor";

//let p_ids_data = "";
export default function UpdateNameMobile({ navigation, route }) {
  const [userData, setUserData] = useState({ fetched: false, data: {} });

  const globalContext = useAppContext();
  const inputsSectionRef = useRef();
  const OTPSectionRef = useRef();
  const scrollViewRef = useRef();
  const scrollAnchorRef = useRef();

  const isFocused = useIsFocused();
  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }

    AppUser.get(navigation).then((data) => {
      console.log(data);
      setUserData({ fetched: true, data: data });
    });
  }, []);

  const triggerUpdates = (enteredName, enteredNumber) => {
    console.log(enteredName, enteredNumber);

    AppUser.updateUserName(enteredName).then(() => {
      // AppUser.updateUserName always resolves
      mobileNumberUpdate(enteredNumber);
    });
  };

  const mobileNumberUpdate = (enteredNumber) => {
    if (enteredNumber != userData.data.mobileNumber) {
      sendOTP(enteredNumber);
    } else {
      allDone();
    }
  };

  const sendOTP = (mobileNumber) => {
    console.log("sendOTP");
    inputsSectionRef?.current?.showWait();
    MY_API({
      scriptName: "otp_send",
      data: {
        mobile_number: mobileNumber,
        device_platform: Platform.OS === "android" ? "A" : "I",
      },
      options: {},
    })
      .then(({ status, data }) => {
        //inputsSectionRef?.current?.hide();
        scrollToOTP(mobileNumber);
      })
      .catch((error) => {})
      .finally(() => {
        setTimeout(() => {
          inputsSectionRef?.current?.showButton();
        }, 300);
      });
  };

  const scrollToOTP = (mobileNumber) => {
    OTPSectionRef?.current?.show(mobileNumber);
    //scrollViewRef.current.scrollTo({ y: 300, animated: true });
    try {
      scrollAnchorRef.current.scrollTo(scrollViewRef, 0);
    } catch (err) {
      console.log(err);
    }
  };

  const closeOTPSection = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

  const allDone = () => {
    try {
      const callback = globalContext?.callBacks?.onNameNumberUpdate ?? null;
      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
    }
    console.log("allDone");
    navigation.goBack();
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
      scrollingContainer={false}
    >
      {userData.fetched ? (
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
        >
          <InputsSection
            ref={inputsSectionRef}
            userData={userData}
            triggerUpdates={triggerUpdates}
          />
          <ScrollAnchor ref={scrollAnchorRef} />
          <OTPSection
            ref={OTPSectionRef}
            closeCB={closeOTPSection}
            successCB={allDone}
          />
          <View style={{ height: 600 }}></View>
        </ScrollView>
      ) : (
        <MyActivityIndicator />
      )}
    </ScreenContainer>
  );
}

const InputsSection = forwardRef(({ userData, triggerUpdates }, ref) => {
  const updateButtonRef = useRef();
  const nameInputRef = useRef();
  const mobileNumberInputRef = useRef();
  const [show, setShow] = useState(true);

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true);
    },
    hide() {
      setShow(false);
    },
    showButton() {
      updateButtonRef?.current?.showButton();
    },
    showWait() {
      updateButtonRef?.current?.showWait();
    },
  }));

  const updateButtonCB = () => {
    console.log(nameInputRef.current);
    const enteredName = nameInputRef?.current?.getName().trim();
    const enteredNumber = mobileNumberInputRef?.current?.getNumber().trim();

    if (!isValidMobileNumber(enteredNumber)) {
      Alert.alert("", "Please enter a valid 10 digit mobile number");
      return false;
    }

    triggerUpdates(enteredName, enteredNumber);
  };

  return (
    show && (
      <View style={styles.container}>
        <Text style={GlobalStyles.inputLabel}>Name</Text>
        <NameInput ref={nameInputRef} userName={userData.data.userName} />
        <View style={{ height: 20 }}></View>
        <MobileNumberInput
          ref={mobileNumberInputRef}
          mobileNumber={userData.data.mobileNumber}
        />
        <UpdateButton ref={updateButtonRef} updateButtonCB={updateButtonCB} />
      </View>
    )
  );
});

const OTPSection = forwardRef(({ closeCB, successCB }, ref) => {
  const [stateObj, setStateObj] = useState({ show: false, mobileNumber: "" });

  const OtpInputRef = useRef();
  const submitButtonRef = useRef();

  useImperativeHandle(ref, () => ({
    show(mobileNumber) {
      setStateObj({ show: true, mobileNumber: mobileNumber });
    },
    hide() {
      setStateObj({ ...stateObj, show: false });
    },
  }));

  let enteredOTP = "";
  const readEnteredOtp = (val) => {
    enteredOTP = val;
  };

  const resendOtp = () => {
    setStateObj({ ...stateObj, show: false });
    closeCB();
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
        mobile_number: stateObj.mobileNumber,
        otp: otp,
        user_id: "",
      },
      options: { errorResponseCallBack: onWrongOtp },
    })
      .then(({}) => {
        AppUser.updateMobileNumber(stateObj.mobileNumber)
          .then()
          .finally(() => {
            successCB();
          });
      })
      .catch((error) => {
        submitButtonRef?.current.setVerifying(false);
      })
      .finally(() => {});
  };

  const onWrongOtp = () => {
    enteredOTP = "";
    OtpInputRef?.current?.clearOtpInput();
  };

  return (
    stateObj.show &&
    stateObj.mobileNumber &&
    stateObj.mobileNumber != "" && (
      <View style={styles.container}>
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
          <Text style={styles.mobileInVerify}>{stateObj.mobileNumber}</Text>
          <Pressable
            onPress={() => {
              resendOtp();
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
    )
  );
});

const NameInput = forwardRef(({ userName }, ref) => {
  const [name, setName] = useState(userName);

  useImperativeHandle(ref, () => ({
    getName() {
      return name;
    },
  }));

  return (
    <TextInput
      value={name}
      style={GlobalStyles.textInput}
      maxLength={30}
      placeholder="Enter your name"
      onChangeText={(val) => {
        setName(val);
      }}
    />
  );
});

const MobileNumberInput = forwardRef(({ mobileNumber }, ref) => {
  const [nbr, setNbr] = useState(mobileNumber);
  const [show, setShow] = useState(1);

  const textInputRef = useRef();

  useImperativeHandle(ref, () => ({
    getNumber() {
      return nbr;
    },
  }));

  return show === 1 ? (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 12 }}
    >
      <Ionicons
        name="call-outline"
        size={16}
        color="#797878ff"
        style={{ marginRight: 4 }}
      />
      <Text style={{ flex: 1, fontSize: 16 }}>
        {nbr.substr(0, 5) + " " + nbr.substr(5)}
      </Text>
      <Pressable
        style={{ padding: 6 }}
        onPress={() => {
          setShow(2);
        }}
      >
        <AntDesign name="edit" size={20} color={COLORS.primaryDark} />
      </Pressable>
    </View>
  ) : (
    <View style={{}}>
      <Text style={GlobalStyles.inputLabel}>MobileNumber</Text>
      <TextInput
        onLayout={() => {
          textInputRef?.current?.focus();
        }}
        ref={textInputRef}
        value={nbr}
        style={GlobalStyles.textInput}
        maxLength={10}
        keyboardType={"number-pad"}
        onChangeText={(val) => {
          setNbr(val);
        }}
      />
      <Text style={styles.note}>
        Note: Changing mobile number requires OTP verification.
      </Text>
    </View>
  );
});

const UpdateButton = forwardRef(({ updateButtonCB }, ref) => {
  const [show, setShow] = useState(1);

  useImperativeHandle(ref, () => ({
    showButton() {
      setShow(1);
    },
    showWait() {
      setShow(2);
    },
  }));

  return (
    <View style={{ marginVertical: 30 }}>
      {show === 1 ? (
        <Button
          title="Update"
          onPress={() => {
            updateButtonCB();
          }}
        />
      ) : (
        <Button title="Sending OTP . . ." disabled={true} />
      )}
    </View>
  );
});

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
  container: { paddingHorizontal: 20 },
  note: {
    fontSize: 12,
    color: "#414040ff",
    marginTop: 8,
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
