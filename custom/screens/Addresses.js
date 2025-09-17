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
  Modal,
  TextInput,
  Alert,
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
  InputField,
  RadioButton,
} from "../global/elements";
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
/********************************************************************/

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomModal from "../components/BottomModal";

let addressToEdit = "";
export default function Addresses({ navigation, route }) {
  const [userData, setUserData] = useState(null);
  const AddressEditRef = useRef();
  const isFocused = useIsFocused();
  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }

    fetchAddresses();
  }, []);

  const globalContext = useAppContext();

  const fetchAddresses = () => {
    AppUser.get().then((data) => {
      const selectedAddrFirst = data.addresses.sort(
        (a, b) => (b.selected ? 1 : 0) - (a.selected ? 1 : 0)
      );
      data.addresses = selectedAddrFirst;
      setUserData(data);
      console.log("YYYYYYYYYYYYYYYYYYYYYYYY");
      const callBack = globalContext?.callBacks?.addressSelection ?? null;
      if (callBack) {
        callBack();
      }
    });
  };

  const removeAddressConfirm = () => {
    Alert.alert(
      "", // Title
      "Sure you want to delete this address?", // Message
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            removeAddress();
          },
        },
      ],
      { cancelable: false } // prevents dismissing by tapping outside
    );
  };

  const removeAddress = () => {
    const d = new Date();
    const t = d.getTime();
    console.log(Math.floor(t / 1000));
  };

  const goToLocationSearch = () => {
    myNavigationHandler(navigation, "LocationSearch", {});
  };

  const renderAddress = (addressObj, index) => {
    const {
      title,
      areaName,
      addressText,
      positionCoords,
      delcId,
      contactNumber,
      selected,
    } = addressObj;
    return (
      <View key={index.toString()}>
        {index === 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Delivers to below address
            </Text>
            {userData.addresses.length > 1 ? (
              <Pressable
                style={styles.addButton}
                onPress={() => {
                  goToLocationSearch();
                }}
              >
                <Ionicons name="add" size={20} color="#FFFFFF"></Ionicons>
                <Text style={{ color: "#fff", marginLeft: 4 }}>
                  ADD ADDRESS
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : index === 1 ? (
          <Text style={styles.addressHeading}>Other Addresses</Text>
        ) : null}
        <View
          style={[
            styles.addressCard,
            index === 0 ? styles.activeAddressCard : null,
          ]}
        >
          <Pressable onPress={() => {}}></Pressable>
          <View style={{ flexWrap: "wrap" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "bold", flexShrink: 1 }}>
                {title && title != "" ? title + " in " : ""}
                {areaName}
              </Text>
              <Pressable
                style={{ padding: 4 }}
                onPress={() => {
                  addressToEdit = addressObj;
                  AddressEditRef.current.open();
                }}
              >
                <AntDesign name="edit" size={24} color={COLORS.primaryDark} />
              </Pressable>
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={{}}>{addressText}.</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="call-outline"
                size={12}
                color="#797878ff"
                style={{ marginRight: 4 }}
              />
              <Text>
                {!contactNumber || contactNumber == ""
                  ? userData.mobileNumber
                  : contactNumber}
              </Text>
            </View>
          </View>
          {index === 0 ? (
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Ionicons name="checkbox" color="#03971bff" size={16} />
              <Text style={{ color: "#03971bff", marginLeft: 4, fontSize: 12 }}>
                Your orders will be delivered to this address
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                onPress={() => {
                  removeAddressConfirm();
                }}
              >
                <Text style={{ color: "#fa3a33ff" }}>Delete</Text>
              </Pressable>
              <Pressable style={styles.usethisAddrBtn}>
                <Text style={{ color: "#1b44caff" }}>
                  Deliver to this address
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
    >
      <View style={{ flex: 1, backgroundColor: "#ffffffff", padding: 10 }}>
        {userData ? (
          userData.addresses.length === 0 ? (
            <View style={{ padding: 20 }}>
              <Text
                style={{ letterSpacing: 0.6, fontSize: 16, marginBottom: 20 }}
              >
                You have not set any address. Please add an address for delivery
                service.
              </Text>
              <Pressable
                style={styles.addButton}
                onPress={() => {
                  goToLocationSearch();
                }}
              >
                <Ionicons name="add" size={30} color="#FFFFFF"></Ionicons>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16,
                    color: "white",
                    marginLeft: 8,
                  }}
                >
                  ADD ADDRESS
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{}}>
              <View style={styles.addressCards}>
                {userData.addresses.map((addressObj, index) => {
                  return renderAddress(addressObj, index);
                })}
              </View>
              {userData.addresses.length === 1 ? (
                <Pressable
                  style={styles.addButton}
                  onPress={() => {
                    goToLocationSearch();
                  }}
                >
                  <Ionicons name="add" size={30} color="#FFFFFF"></Ionicons>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 16,
                      color: "white",
                      marginLeft: 8,
                    }}
                  >
                    ADD ADDRESS
                  </Text>
                </Pressable>
              ) : null}
            </View>
          )
        ) : null}
      </View>
      <AddressEdit ref={AddressEditRef} userData={userData} />
    </ScreenContainer>
  );
}

const AddressEdit = forwardRef(({ userData }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setShow(true);
    },
    close() {
      setShow(false);
    },
  }));

  const {
    title,
    areaName,
    address,
    positionCoords,
    delcId,
    contactNumber,
    selected,
  } = addressToEdit;
  console.log(addressToEdit);
  const onModalClose = () => {
    setShow(false);
  };
  return (
    show && (
      <BottomModal onModalClose={onModalClose}>
        <View style={{ padding: 12, paddingVertical: 20 }}>
          <Text style={{}}>{areaName}</Text>
          <Text>Address</Text>
          <TextInput
            value={address}
            multiline={true}
            numberOfLines={4}
            style={[GlobalStyles.textInput, { textAlignVertical: "top" }]}
          />
          <Text style={{ marginTop: 12 }}>Contact Number for this address</Text>
          <TextInput
            value={
              address?.contactNumber && address?.contactNumber != ""
                ? address.contactNumber
                : userData.mobileNumber
            }
            style={GlobalStyles.textInput}
          />
        </View>
      </BottomModal>
    )
  );
});

const styles = StyleSheet.create({
  addressHeading: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  addressCards: {
    flex: 1,
  },
  addressCard: {
    padding: 10,

    backgroundColor: "#f1f1f1d3",
    marginBottom: 14,
    borderRadius: 10,
  },

  activeAddressCard: {
    backgroundColor: "#fff",
    marginTop: 10,
    borderWidth: 0.5,
  },
  usethisAddrBtn: {
    padding: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: COLORS.sharpButton,
    alignSelf: "center",
    padding: 8,
    borderRadius: 4,
    flexDirection: "row",
  },
});
