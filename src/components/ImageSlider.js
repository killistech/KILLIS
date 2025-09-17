import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export default function ImageSlider({
  images,
  dots = true,
  dotsPosition = "below",
  thumbs = false,
  onChange = () => {},
}) {
  console.log("AGAIN");
  const dotsRef = useRef();

  const nbrOfImages = images.length;

  let prevActiveIndex = 0;
  const onChangeSlide = (nativeEvent) => {
    const slidedToIndex = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (prevActiveIndex == slidedToIndex) {
      //return false;
    }
    prevActiveIndex = slidedToIndex;
    dotsRef.current.set(slidedToIndex);
    onChange(slidedToIndex);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        contentContainerStyle={{ width: `${100 * nbrOfImages}%` }}
        onMomentumScrollEnd={({ nativeEvent }) => {
          //onScroll={({ nativeEvent }) => {
          onChangeSlide(nativeEvent);
        }}
        scrollEventThrottle={10}
      >
        {images.map((imageURL, index) => (
          <Image
            resizeMode={"contain"}
            style={[styles.image, { backgroundColor: "transparent" }]}
            source={{
              uri: imageURL,
            }}
            key={index.toString()}
          />
        ))}
      </ScrollView>

      {dots && nbrOfImages > 1 && (
        <Dots ref={dotsRef} images={images} dotsPosition={dotsPosition} />
      )}
    </View>
  );
}

const Dots = forwardRef(({ images, dotsPosition }, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useImperativeHandle(ref, () => ({
    set(idx) {
      setActiveIndex(idx);
    },
  }));

  const posStyle =
    dotsPosition == "onImage"
      ? {
          position: "absolute",
          bottom: 3,
          alignSelf: "center",
          //backgroundColor: "#ffffffb6",
          //paddingHorizontal: 1,
          //borderRadius: 100,
        }
      : {};

  return (
    <View style={[styles.dotsThumbsHolder, posStyle]}>
      {images.map((imageURL, index) => (
        <Text
          key={index.toString()}
          style={index == activeIndex ? styles.dotActive : styles.dot}
        >
          &#x25cf;
        </Text>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    //maxWidth: cardImageMaxWidth,
    flexGrow: 1,
    aspectRatio: 16 / 9,
    /* always ensure that your banners are created in 16 / 9 rartio. preferred dimetions are 800 / 450 */
  },

  dotsThumbsHolder: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    marginHorizontal: 1,
    fontSize: 12,
    color: "#BBBBBB",
  },
  dotActive: {
    marginHorizontal: 1,
    fontSize: 12,
    color: "#000000ff",
  },
});
