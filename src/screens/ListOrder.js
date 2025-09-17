import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
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
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
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
import {
  isScreenIsInStack,
  myAppRSformat,
  myNavigationHandler,
} from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
import SuccessPopUp from "../components/SuccessPopUp";
/********************************************************************/

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;
export default function ListOrder({ navigation, route }) {
  const isFocused = useIsFocused();

  const screenContainerRef = useRef();

  const initContentRef = useRef();
  const reviewSubmitRef = useRef();
  const orderPlacedRef = useRef();

  const globalContext = useAppContext();

  useEffect(() => {
    setInit();

    // the below is very important to avoid running any API calls here after this screen is navigated to another screen

    return () => {};
  }, []);

  const setInit = () => {
    reviewSubmitRef?.current?.hide();
    orderPlacedRef?.current?.hide();
    initContentRef?.current?.show();
  };

  const showSubmit = (uri) => {
    initContentRef?.current?.hide();
    orderPlacedRef?.current?.hide();
    reviewSubmitRef?.current?.show(uri);
  };

  const reloadAddress = () => {
    //globalContext.callBacks.onAddessChange = null;
    console.log("reloadAddressreloadAddressreloadAddreloadAddress");
    try {
      const { exists, index } = isScreenIsInStack("ListOrder", navigation);
      if (exists) {
        reviewSubmitRef?.current.reloadAddress();
      }
    } catch (err) {}
  };

  const onSubmit = () => {
    console.log("gottt here");
    const imageUri = reviewSubmitRef?.current.getImageUri();

    AppUser.get(navigation, true).then((userData) => {
      console.log(44444556);
      console.log(userData);
      if (userData.activeDelcId == "") {
        navigation.reset({
          index: 0,
          routes: [{ name: "HomePre" }],
        });
        return;
      }

      if (!userData.selectedAddress) {
        Alert.alert("", "Please select a delivery adress");
        globalContext.callBacks.onAddessChange = reloadAddress;
        myNavigationHandler(navigation, "Addresses", {});
        return;
      }

      submitOrder(userData, imageUri);
    });
  };

  const submitOrder = ({ userId, accessToken }, imageUri) => {
    screenContainerRef?.current?.showActivityIndicator(
      "Creating Order. Please Wait . . ."
    );
    const filename = imageUri.split("/").pop();
    MY_API({
      scriptName: "listorder_create",
      data: {
        user_id: userId,
        access_token: accessToken,
        list_order_photo: {
          uri: imageUri,
          name: filename,
          type: "image/jpeg",
        },
      },
      options: {
        uploadingImage: true,
      },
    })
      .then(({ status, data }) => {
        console.log(status, data);
        if (status != "success") {
          Alert.alert(
            "",
            "Order not placed. Please check your network and try again"
          );
          return;
        }

        submitSuccess();
      })
      .catch((error) => {})
      .finally(() => {
        screenContainerRef?.current?.hideActivityIndicator();
      });
  };

  const submitSuccess = () => {
    initContentRef?.current?.hide();
    reviewSubmitRef?.current?.hide();
    orderPlacedRef?.current?.show();
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
      ref={screenContainerRef}
    >
      <InitContent
        ref={initContentRef}
        navigation={navigation}
        showSubmit={showSubmit}
      />
      <ReviewSubmit
        ref={reviewSubmitRef}
        navigation={navigation}
        setInit={setInit}
        reloadAddress={reloadAddress}
        onSubmit={onSubmit}
      />
      <OrderPlaced
        ref={orderPlacedRef}
        navigation={navigation}
        setInit={setInit}
      />
    </ScreenContainer>
  );
}

const InitContent = forwardRef(({ navigation, showSubmit }, ref) => {
  const globalContext = useAppContext();

  const [show, setShow] = useState(false);
  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true);
    },
    hide() {
      setShow(false);
    },
  }));

  const openCameraPanel = () => {
    globalContext.callBacks.onCameraImageTake = fromCameraPanel;
    myNavigationHandler(navigation, "CameraPanel", {});
  };

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        //allowsEditing: true,
        //aspect: [4, 3],
        quality: 1,
      });

      // console.log(result);

      if (!result.canceled) {
        showSubmit(result.assets[0].uri);
      } else showSubmit("");
    } catch (err) {
      showSubmit("");
    }
  };

  const fromCameraPanel = (uri) => {
    console.log("fromCameraPanel", uri);
    globalContext.callBacks.onCameraImageTake = "";
    showSubmit(uri);
  };

  return (
    show && (
      <View
        style={{
          flex: 1,
          padding: 20,
          paddingTop: 0,
        }}
      >
        <LinearGradient
          style={{ padding: 20, borderRadius: 15, marginBottom: 15 }}
          colors={["#e6e6e6ff", "#eeeeeeff", "#e6e6e6ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.instructionNbr}>1.</Text>
            <Text style={styles.instruction}>
              Upload or Take a picture of your Shopping List and submit
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.instructionNbr}>2.</Text>
            <Text style={styles.instruction}>
              We'll prepare the order items for you and deliver.
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.instructionNbr}>3.</Text>
            <Text style={styles.instruction}>
              No payment required now. You can Pay on Delivery
            </Text>
          </View>
        </LinearGradient>
        <View
          style={{
            padding: 8,
            backgroundColor: "#818181ad",
            borderRadius: 20,
          }}
        >
          <Pressable
            style={{
              marginBottom: 8,
              flexDirection: "row",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              overflow: "hidden", // is required to get the borderradius on the inner content
            }}
            onPress={() => {
              openCameraPanel();
            }}
          >
            <Image
              style={{ width: "50%", height: undefined, aspectRatio: 1 }}
              source={require("../images/take_image.png")}
            />

            <LinearGradient
              style={{ flex: 1 }}
              colors={["#e6e6e6ff", "#eeeeeeff", "#e6e6e6ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="camera-sharp"
                  size={36}
                  color="#3a3a3aff"
                ></Ionicons>
                <Text style={{ fontWeight: "bold" }}>TAKE IMAGE</Text>
                <Text style={{ fontSize: 12, color: "#727272ff" }}>
                  Using Camera
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={{
              flexDirection: "row",
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              overflow: "hidden", // is required to get the borderradius on the inner content
            }}
            onPress={() => {
              pickImage();
            }}
          >
            <LinearGradient
              style={{ flex: 1 }}
              colors={["#f3f3f3ff", "#e6e6e6ff", "#f3f3f3ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="image-sharp"
                  size={36}
                  color="#3a3a3aff"
                ></Ionicons>
                <Text style={{ fontWeight: "bold" }}>PICK IMAGE</Text>
                <Text style={{ fontSize: 12, color: "#727272ff" }}>
                  From Gallery
                </Text>
              </View>
            </LinearGradient>

            <Image
              style={{ width: "50%", height: undefined, aspectRatio: 1 }}
              source={require("../images/upload_image.png")}
            />
          </Pressable>
        </View>
        <Text
          style={{
            alignSelf: "center",
            marginTop: 20,
            color: "#313131ff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Easy as pie. Give it a try.
        </Text>
      </View>
    )
  );
});

const ReviewSubmit = forwardRef(
  ({ navigation, setInit, reloadAddress, onSubmit }, ref) => {
    const [image, setImage] = useState({ show: false, uri: "" });
    useEffect(() => {}, []);

    const globalContext = useAppContext();
    const deliveryAddressRef = useRef();

    useImperativeHandle(ref, () => ({
      async show(uri) {
        console.log("uri", uri);
        if (uri == "") {
          setInit();
          return;
        }
        const resizedUri = await resizeImage(uri); // if somethig goes wrong in resizeImage, the original uri will be rertruned
        console.log("resizedUri", resizedUri);
        setImage({ show: true, uri: resizedUri });
      },
      hide() {
        setImage({ show: false, uri: "" });
      },
      reloadAddress() {
        deliveryAddressRef?.current?.reLoad();
      },
      getImageUri() {
        return image.uri || null;
      },
    }));

    const resizeImage = async (uri) => {
      let resizedUri = uri;
      try {
        /*****************
         When moved to EAS build, Try below ImageManipulator.useImageManipulator(); -- which is latest in Expo
         ******************/
        /* if (typeof ImageManipulator.useImageManipulator === "function") {
          console.log(222222222222);
          // ✅ Works in dev/prod builds
          const manipulator = ImageManipulator.useImageManipulator();
          const resized = await manipulator
            .resize({ width: 1000 })
            .compress(0.7)
            .format("jpeg")
            .renderAsync(uri);
        } */
        // Resize with max width 1000
        const resized = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log("resized");
        console.log(resized);
        resizedUri = resized.uri;
      } catch (err) {
        console.log("resized error");
        resizedUri = uri;
      }

      return resizedUri;
      // ------------
    };

    return (
      image.show && (
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingTop: 10,
              // backgroundColor: "#615f5fff",
            }}
          >
            <ImagePreview uri={image.uri} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 32,
              }}
            >
              <Pressable
                style={{ padding: 8 }}
                onPress={() => {
                  setInit();
                }}
              >
                <Text style={{ textDecorationLine: "underline", color: "red" }}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={{
                  padding: 6,
                  marginTop: 4,
                  backgroundColor: "#7e7e7eff",
                  borderRadius: 4,
                  alignSelf: "center",
                }}
                onPress={() => {
                  setInit();
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 10,
                    color: "#ffffffff",
                  }}
                >
                  Change
                </Text>
              </Pressable>
            </View>
          </View>
          <DeliveryAddress
            ref={deliveryAddressRef}
            navigation={navigation}
            setInit={setInit}
            reloadAddress={reloadAddress}
          />
          <Pressable
            style={{
              backgroundColor: COLORS.sharpButton,
              alignSelf: "center",
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 20,
            }}
            onPress={() => {
              onSubmit();
            }}
          >
            <Ionicons
              name="checkmark-circle-sharp"
              size={32}
              color="#FFFFFF"
            ></Ionicons>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                color: "white",
                marginLeft: 8,
              }}
            >
              Submit Order
            </Text>
          </Pressable>
        </View>
      )
    );
  }
);

const DeliveryAddress = forwardRef(
  ({ navigation, setInit, reloadAddress }, ref) => {
    const [address, setAddress] = useState(null);
    const globalContext = useAppContext();
    useEffect(() => {
      getAddress();
    }, []);

    useImperativeHandle(ref, () => ({
      reLoad() {
        getAddress();
      },
      hide() {
        setShow(false);
      },
      get() {
        return address;
      },
    }));

    const getAddress = () => {
      console.log("XXXXXXXXXXXXXX getAddress");

      AppUser.getSelectedAdrress().then((address) => {
        console.log("GET ADDRESS", address);
        /*       if (!address) {
        setInit();
        openAddressPage();
        return;
      } */
        setAddress(address);
      });
    };

    const triggerAddressChange = () => {
      Alert.alert(
        "", // Title
        "Address change may effect the item availabilty and price, and needs re-creation of the order.", // Message
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Continue",
            onPress: () => {
              openAddressPage();
            },
          },
        ],
        { cancelable: false } // prevents dismissing by tapping outside
      );
    };

    const openAddressPage = () => {
      globalContext.callBacks.onAddessChange = reloadAddress;
      myNavigationHandler(navigation, "Addresses", {});
      return;
    };

    return (
      address && (
        <View
          style={{
            flexDirection: "row",
            margin: 20,
            backgroundColor: "#ecececff",
            padding: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: "#474747ff" }}>
            Deliver To:{" "}
            <Text style={{ fontSize: 13, color: "#202020ff" }}>
              {address.addressText}
              {"  "}
              <Text
                style={{
                  alignSelf: "center",
                  color: "blue",
                  textDecorationLine: "underline",
                  fontSize: 12,
                }}
                onPress={() => {
                  triggerAddressChange();
                }}
              >
                Change
              </Text>
            </Text>
          </Text>
        </View>
      )
    );
  }
);

const ImagePreview = forwardRef(({ uri }, ref) => {
  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    func() {},
  }));

  return (
    <Image
      source={{ uri: uri }}
      resizeMode={"contain"}
      style={styles.previewImg} // Optional: define image dimensions
    />
  );
});

const OrderPlaced = forwardRef(({ navigation, setInit }, ref) => {
  const [show, setShow] = useState(false);
  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true);
    },
    hide() {
      setShow(false);
    },
  }));

  const goToMyOrders = () => {
    setShow(false);
    myNavigationHandler(navigation, "MyOrders", {});
  };

  const goToHome = () => {
    setShow(false);
    myNavigationHandler(navigation, "Home", {});
  };

  const createAnotherOrder = () => {
    setInit();
  };

  return (
    show && (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 12,
        }}
      >
        <View>
          <Image
            resizeMode={"cover"}
            style={styles.successImg}
            source={require("../images/success.gif")}
          />
        </View>
        <View style={styles.messageArea}>
          <Text style={styles.messsage}>Your order has been created.</Text>
          <Text style={[styles.noteText, { fintSize: 14, marginVertical: 20 }]}>
            The order will be prepared and delivered to you.
          </Text>
          <Text style={[styles.noteText, { fontSize: 24 }]}>
            You can pay on delivery.
          </Text>
        </View>
        <View style={styles.buttonsHolder}>
          <Pressable
            style={styles.extraBtn}
            onPress={() => {
              goToMyOrders();
            }}
          >
            <Text style={{ color: "white" }}>My Orders</Text>
          </Pressable>

          <Pressable
            style={styles.okBtn}
            onPress={() => {
              goToHome();
            }}
          >
            <Text style={{ color: "white", paddingHorizontal: 10 }}>OK</Text>
          </Pressable>
        </View>
        <Pressable
          style={{
            marginVertical: 16,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            createAnotherOrder();
          }}
        >
          <Ionicons name="add" size={16} color={COLORS.primaryDark}></Ionicons>

          <Text
            style={{ color: COLORS.primaryDark, fontSize: 16, marginLeft: 6 }}
          >
            Create Another Order
          </Text>
        </Pressable>
      </View>
    )
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionNbr: {
    fontSize: 16,
    marginRight: 4,
  },
  instruction: {
    fontSize: 14,
    marginBottom: 10,
  },
  takePicBtn: {
    width: 60,
    heihgt: 60,
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
  previewImg: {
    flexGrow: 1,
  },
  noteText: {
    alignSelf: "center",
    color: "#07021fff",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  // success panel styling
  successImg: {
    width: "80%",
    height: undefined,
    aspectRatio: 4 / 3,
  },
  messageArea: {
    marginTop: 10,
    marginBottom: 30,
  },
  messsage: { fontSize: 20, alignSelf: "center" },
  buttonsHolder: {
    flexDirection: "row",
  },
  okBtn: {
    padding: 12,
    backgroundColor: "#25ac2bff",
  },
  extraBtn: {
    marginRight: 20,
    padding: 12,
    backgroundColor: "#156bb1ff",
  },

  modalView: {
    flex: 1,
    backgroundColor: "#b1b1b113",

    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
