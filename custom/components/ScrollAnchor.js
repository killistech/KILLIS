// components/ScrollAnchor.js
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { View } from "react-native";

const ScrollAnchor = forwardRef(({ style = {} }, ref) => {
  const layoutRef = useRef(null);
  const position = useRef(0);

  useImperativeHandle(ref, () => ({
    // expose scrollTo method
    scrollTo: (scrollViewRef, offset = 0) => {
      if (scrollViewRef?.current) {
        scrollViewRef.current.scrollTo({
          y: position.current - offset,
          animated: true,
        });
      }
    },
    // also expose raw position if needed
    getY: () => position.current,
  }));

  return (
    <View
      ref={layoutRef}
      style={[{ height: 0, width: "100%" }, style]}
      onLayout={(e) => {
        position.current = e.nativeEvent.layout.y;
      }}
    />
  );
});

export default ScrollAnchor;
