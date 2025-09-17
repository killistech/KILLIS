import { Modal, Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";

export default function SuccessPopUp({
  message = "Success.",
  extraBtn = "dsfdfdgf",
  extraBtnCB = "",
}) {
  const [show, setShow] = useState(true);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={() => {}}
    >
      <View style={styles.modalView}>
        <View style={styles.contentArea}>
          <View
            style={{
              width: 100,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.img}
              source={require("../images/success.gif")}
            />
          </View>
          <View style={styles.messageArea}>
            <Text style={styles.messsage}>{message}</Text>
          </View>
          <View style={styles.buttonsHolder}>
            {extraBtn != "" && (
              <Pressable
                style={styles.extraBtn}
                onPress={() => {
                  extraBtnCB();
                }}
              >
                <Text style={{ color: "white" }}>{extraBtn}</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.okBtn}
              onPress={() => {
                setShow(false);
              }}
            >
              <Text style={{ color: "white" }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: "#b1b1b16b",

    justifyContent: "center",
    alignItems: "center",
  },
  contentArea: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 160,
    height: 160,
  },
  messageArea: {
    marginTop: 10,
    marginBottom: 20,
  },
  messsage: { fontSize: 18 },
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
});
