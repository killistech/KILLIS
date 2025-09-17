import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Ionicons } from "@expo/vector-icons";

/************* Created for this Application *************************/
import COLORS from "../global/colors";
import { AppContext, useAppContext } from "../context/AppContext";
import PercentOffTag from "../components/PercentOffTag";
import Cart from "../global/Cart";
import { myAppRSformat } from "../global/functions";
import { useDispatchCart } from "../context/AppContext";
import BottomModal from "./BottomModal";
/********************************************************************/

const PaymentStatus = forwardRef(({}, ref) => {
  const [stateData, setStateData] = useState({ show: true, status: 0 }); //status - 1=Started, 2=Success, 3=Error

  useImperativeHandle(ref, () => ({
    show(status) {
      setStateData({ show: true, status: status });
    },
    hide() {
      setStateData({ show: false, status: 0 });
    },
  }));

  useEffect(() => {});

  return (
    stateData.show &&
    [1, 2, 3].includes(stateData.status) && (
      <BottomModal
        onModalClose={null}
        animationType="fade"
        dismissable={false}
        closeButton={false}
        onOutSidePress={null}
      >
        <View style={{}}>
          {stateData.status === 1 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 12,
                backgroundColor: "tomato",
              }}
            >
              <ActivityIndicator color="#fff" />
              <Text style={{ color: "#fff", marginVertical: 12 }}>
                Payment is in progress. Please Wait!
              </Text>
              <Text style={{ color: "#fff" }}>
                Do not press back button or close the App
              </Text>
            </View>
          )}
          {stateData.status === 2 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 12,
                backgroundColor: "#fff",
              }}
            >
              <Image
                style={{ width: 80, height: 80 }}
                source={require("../images/success.gif")}
              />
            </View>
          )}
          {stateData.status === 3 && <View style={{}}></View>}
        </View>
      </BottomModal>
    )
  );
});

const styles = StyleSheet.create({});

export default PaymentStatus;
