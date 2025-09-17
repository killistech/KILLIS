import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const closeButtonOffest = 4;
const closeBarColor = "#797979c2";
export default function BottomModal({
  children,
  onModalClose,
  animationType = "fade",
  dismissable = true,
  closeButton = true,
  onOutSidePress = null,
}) {
  const [visible, setVisible] = useState(true);

  const closeButtonPress = () => {
    onModalClose();
  };
  return (
    <Modal
      animationType={animationType}
      transparent={true}
      statusBarTranslucent={
        true
      } /* Keeps the Modal on the status bar thus showing the transparent backgroum from the top of the screen. Makes it look good */
      visible={true}
      onRequestClose={() => {
        if (!dismissable) {
          return false;
        }
        onModalClose();
      }}
      onDismiss={() => {
        console.log(3456);
      }}
    >
      <Pressable
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#0000007c",
        }}
        onPress={() => {
          if (onOutSidePress) {
            onOutSidePress();
          }
        }}
      >
        <KeyboardAvoidingView>
          <View
            style={[
              styles.container,
              //{ paddingTop: closeButton ? closeButtonOffest : 0 },
            ]}
          >
            {closeButton && (
              <Pressable
                style={styles.close}
                onPress={() => {
                  closeButtonPress();
                }}
              >
                <View style={styles.closeBar}></View>

                <Ionicons
                  name="caret-down-sharp"
                  size={14}
                  color={closeBarColor}
                  style={{ padding: 0, lineHeight: 4 }}
                ></Ionicons>
              </Pressable>
            )}
            {children}
            {/*  {closeButton && (
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                closeButtonPress();
              }}
            >
              <Ionicons
                name="close-circle-sharp"
                size={closeButtonOffest * 2}
                color="#4b4b4bff"
              ></Ionicons>
            </Pressable>
          )} */}
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /*   blocker: {
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "#000000b0",
  },
 */
  container: {
    //position: "absolute", //justifyContent: "flex-end" on parent does the job,
    //bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
  close: { paddingTop: 6, paddingBottom: 20, alignItems: "center" },
  closeBar: {
    width: 42,
    height: 6,
    backgroundColor: closeBarColor,

    borderRadius: 4,
  },
  closeButton: {
    position: "absolute",
    top: -1 * closeButtonOffest,
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 100,
  },
});
