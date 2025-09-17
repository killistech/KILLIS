import { StyleSheet, Text, TextInput, View } from "react-native";
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

/************* Created for this Application *************************/
import COLORS from "../global/colors";

/********************************************************************/

const boxWH = 40;
const DigitFontSize = 16;
var digitX = 0;
var inputLetterSpacing = 0;
const OtpInput = (
  {
    count,
    sendValueCallBack,
    autoFocus = true,
    showResendOtp = false,
    resendOtpCallBack = null,
    submitFunction,
  },
  ref
) => {
  const boxesRef = useRef();
  const inputRef = useRef();

  const [width, setWidth] = useState(0);
  const [onlyNumberValue, setOnlyNumberValue] = useState();
  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    clearOtpInput() {
      clearOtp();
    },
  }));

  const clearOtp = () => {
    inputRef.current.clear();
    handleChange("");
    inputRef.current.focus();
  };

  const disgits = [];

  let currentNumericValue = "";
  const handleChange = (val) => {
    let setVal = val.replace(/[^0-9]/g, "");
    //inputRef.current.value = setVal;
    setOnlyNumberValue(setVal);
    sendValueCallBack(setVal);
    const newDigitsArray = Array.from(String(setVal), Number);

    boxesRef.current.updateBoxes(newDigitsArray);
  };
  return (
    <View>
      <View style={styles.container}>
        {width > 0 ? (
          <Boxes count={count} totalWidth={width} ref={boxesRef} />
        ) : null}
        <TextInput
          caretHidden={true}
          keyboardType={"numeric"}
          maxLength={count}
          autoFocus={autoFocus}
          ref={inputRef}
          style={[styles.input]}
          value={onlyNumberValue}
          onChangeText={(val) => {
            handleChange(val);
          }}
          onSubmitEditing={() => {
            submitFunction();
          }}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setWidth(width);
          }}
        />
      </View>
      <View style={styles.linksContainer}>
        {showResendOtp ? (
          <Text
            style={{
              paddingVertical: 10,
              fontSize: 12,
              color: "#333333",
              textDecorationLine: "underline",
            }}
            onPress={() => {
              resendOtpCallBack();
            }}
          >
            Resend OTP
          </Text>
        ) : (
          <View></View>
        )}
        <Text
          style={{ paddingVertical: 10, color: "#888888" }}
          onPress={() => {
            clearOtp();

            //boxesRef.current.clearBoxes();
          }}
        >
          Clear
        </Text>
      </View>
    </View>
  );
};

const Boxes = forwardRef(({ count, totalWidth }, ref) => {
  const [nowDigits, setNowDigits] = useState([]);

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    updateBoxes(newDigitsArray) {
      setNowDigits(newDigitsArray);
    },
    clearBoxes() {
      setNowDigits([]);
    },
  }));

  let boxesArray = [];
  const renderBoxes = () => {
    const nbrGaps = count - 1;
    const gapWidth = (totalWidth - boxWH * count) / nbrGaps;

    digitX = (boxWH - DigitFontSize) / 2;

    inputLetterSpacing = gapWidth + boxWH;

    //const boxView = <BoxWithNumber value={""}></BoxWithNumber>;
    const gapView = (
      <View style={[styles.gapView, { width: gapWidth }]}>
        <Text style={styles.gapText}>-</Text>
      </View>
    );
    for (let i = 0; i < count; i++) {
      boxesArray.push(
        <View key={i} style={{ flexDirection: "row" }}>
          <View key={i} style={styles.box}>
            <Text style={styles.boxText}>
              {typeof nowDigits[i] != "undefined" ? nowDigits[i] : ""}
            </Text>
          </View>
          {i < count - 1 ? gapView : null}
        </View>
      );
    }
  };

  renderBoxes();

  return <View style={styles.boxesContainer}>{boxesArray}</View>;
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  boxesHolder: {
    position: "absolute",
  },
  input: {
    position: "absolute",
    borderColor: "transparent",
    backgroundColor: "transparent",
    color: "transparent",
    width: "100%",
    height: boxWH,
    fontSize: DigitFontSize,
    borderWidth: 0,
    color: "#ffffff00",
  },

  boxesContainer: {
    flexDirection: "row",
  },

  box: {
    alignItems: "center",
    justifyContent: "center",
    width: boxWH,
    height: boxWH,
    backgroundColor: "#fff",
    borderColor: "#666666",
    borderWidth: 1.5,
    borderRadius: 4,
  },
  boxText: {
    fontWeight: "bold",
    fontSize: 24,
  },
  gapView: {
    justifyContent: "center",
    alignItems: "center",
  },
  gapText: {
    color: "#AAAAAA",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default forwardRef(OtpInput);
