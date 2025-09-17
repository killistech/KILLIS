import { Animated } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const FakeCaret = forwardRef(({ left = 10 }, ref) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    anim.start();
  }, []);

  useImperativeHandle(ref, () => ({
    stopAnim() {
      anim.stop();
    },
    remove() {
      anim.stop();
      setShow(false);
    },
  }));

  let opacity = useRef(new Animated.Value(1)).current;
  let anim;
  anim = Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ])
  );

  return (
    show && (
      <Animated.View
        style={{
          opacity: opacity,
          position: "absolute",
          width: 2,
          height: 20,
          left: left,
          // Vertically centering
          top: "50%",
          transform: [{ translateY: -10 }], // -height/2
          backgroundColor: "blue",
          // animate opacity for blink...
        }}
      />
    )
  );
});

export default FakeCaret;
