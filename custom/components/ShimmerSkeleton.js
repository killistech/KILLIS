import { Animated, StyleSheet, View } from "react-native";
import React, { useEffect, useReducer, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

/************* Created for this Application *************************/

/********************************************************************/

export default function ShimmerSkeleton({
  width = "100%",
  height = 100,
  borderRadius = 0,
  darkMode = false,
  flex = 0,
}) {
  const translateX = useRef(new Animated.Value(-200)).current;
  const colors = darkMode
    ? ["#2c2c2cff", "#313131ff", "#2c2c2cff"]
    : ["#E6E8EB", "#F4F6F8", "#E6E8EB"];
  const backgroundColor = darkMode ? "#2c2c2cff" : "#E6E8EB";
  useEffect(() => {
    const loop = () =>
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 200,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -200,
          duration: 0,
          useNativeDriver: true,
        }),
      ]);
    const anim = Animated.loop(loop());
    anim.start();
    return () => {
      anim.stop();
      console.log("SHIMMER SKELETON ANIMATION STOPPED");
    };
  }, [translateX]);

  return (
    <View
      style={[
        styles.container,
        { flex, backgroundColor: backgroundColor, width, height, borderRadius },
      ]}
    >
      <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={colors}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",

    alignSelf: "center",
  },
  shimmer: { width: 200, height: "100%" },
});
