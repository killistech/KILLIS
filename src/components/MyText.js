import { Text } from "react-native";
import React, { useEffect, useState } from "react";

export default function MyText({ text, style, numberOfLines }) {
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
}
