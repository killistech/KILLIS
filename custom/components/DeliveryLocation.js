import { Pressable, StyleSheet, Text, View } from "react-native";
import { React, useState, useEffect } from "react";
import { AppUser } from "../global/AppUser";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../global/colors";
import { myNavigationHandler } from "../global/functions";

export default function DeliveryLocation({
  navigation,
  onLocationChange = null,
}) {
  const [deliveryLocation, setDeliveryLocation] = useState("");
  useEffect(() => {
    console.log(434343);
    AppUser.getActiveArea().then((areaName) => {
      console.log(areaName);
      if (areaName) {
        console.log(areaName);
        setDeliveryLocation(areaName);
      }
    });
  }, []);

  return (
    deliveryLocation != "" && (
      <Pressable
        style={styles.container}
        onPress={() => {
          myNavigationHandler(navigation, "Addresses", {});
        }}
      >
        <View style={styles.flashTime}>
          <View
            style={{
              backgroundColor: "#ffffff" + COLORS.opacs[10],
              borderRadius: 9,
            }}
          >
            <Ionicons
              name={"flash"}
              size={15}
              color={"#665d5dff"}
              style={{ marginRight: 2 }}
            />
          </View>
          <Text style={{ marginLeft: 4, fontSize: 12 }}>10 minutes</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text numberOfLines={1} style={{ fontSize: 14, color: "#000" }}>
            Delivery in {deliveryLocation}
          </Text>
        </View>
        <View>
          <Ionicons
            name={"chevron-down"}
            size={15}
            color={"#161616ff"}
            style={{ marginLeft: 10 }}
          />
        </View>
      </Pressable>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    backgroundColor: COLORS.primary + COLORS.opacs[60],
  },

  flashTime: {
    flexDirection: "row",
    paddingRight: 8,
    paddingLeft: 2,
    paddingVertical: 2,
    backgroundColor: COLORS.primary + COLORS.opacs[50],
    borderRadius: 20,
    marginRight: 6,
  },
});
