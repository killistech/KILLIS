import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  ImageBackground,
  Animated,
  Easing,
  Platform,
  StatusBar,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H1Text, H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import Cart from "../global/Cart";
import {
  distanceBetweenLatandLng,
  myAppRSformat,
  myNavigationHandler,
} from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
import ProductsGrid from "../components/ProductsGrid";
import { LinearGradient } from "expo-linear-gradient";
/********************************************************************/

import * as Location from "expo-location";
import * as Linking from "expo-linking";

let dcsDataSaved = [];
let userLocationData = {};
export default function HomePre({ navigation, route }) {
  const isFocused = useIsFocused();
  const globalContext = useAppContext();
  const { globalCONSTANTS } = globalContext;
  const locationPopupRef = useRef();
  const fetchingLocationRef = useRef();
  const [homePrePageData, setHomePrePageData] = useState({
    ready: false,
    categories: [],
    banners: [],
    products: [],
  });

  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }

    getHomePrePageData();
  }, []);

  const getHomePrePageData = (userData) => {
    MY_API({
      scriptName: "home_pre_page_data_get",
      data: { get_all_dcs: "Y" },
      options: { showLoading: true },
    })
      .then(({ status, data }) => {
        const {
          home_pre_page_products,
          home_pre_page_banners,
          product_categories_data,
          all_dcs,
        } = data;
        //console.log(data);
        dcsDataSaved = all_dcs;
        const bannerImgs = home_pre_page_banners.map((imgName) => {
          return globalCONSTANTS.HomePreDir + "/banners/" + imgName;
        });
        setHomePrePageData({
          ready: true,
          categories: product_categories_data,
          banners: bannerImgs,
          products: home_pre_page_products,
        });

        openLocationSelector();
      })
      .catch(() => {
        // do nothing
      });
  };

  const openLocationSelector = () => {
    setTimeout(() => {
      locationPopupRef?.current?.show();
    }, 500);
  };

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setTimeout(() => {
        Alert.alert(
          "Permission needed",
          "Location permission is required for our delivery service. Please enable it in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }, 100);
      return;
    }

    // Location Permissions are given
    fetchingLocationRef?.current?.show();
    setTimeout(() => {
      //for better user experience
      getCurrentLocationAndAddress();
    }, 1500);
  };

  const getCurrentLocationAndAddress = async () => {
    try {
      console.log("getCurrentPositionAsync start");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
      });
      console.log("getCurrentPositionAsync DONE");
      console.log(location);
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      userLocationData.positionCoords = location.coords;
      console.log("reverseGeocodeAsync start");
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      console.log("reverseGeocodeAsync DONE");
      console.log(results);

      const addr = results && results.length > 0 && results[0];
      userLocationData.addressText = `${addr.name || ""} ${
        addr.street || ""
      }, ${addr.city || addr.subregion || ""}, ${addr.region || ""}, ${
        addr.postalCode || ""
      }`;

      let servingDcs = "";
      latlngDelCSearch(
        lat,
        lng,
        globalContext.globalAppParams.maxServeKMsFromDC
      )
        .then((dcs) => {
          servingDcs = dcs;
          console.log(servingDcs);
          weDeliverOrNot(servingDcs);
        })
        .catch(() => {
          //fetchingLocationRef?.current?.hide();
          setTimeout(() => {
            Alert.alert(
              "Location could not be found.",
              "Please search for your location"
            );
          }, 100);
        })
        .finally(() => {
          //sometimes the delc retrival in weDeliverOrNot function is taking some time. so hide the fetching popup after the delc retreaval
          fetchingLocationRef?.current?.hide();
        });
    } catch (err) {
      userLocationData.addressText = "";
      fetchingLocationRef?.current?.hide();
    }
  };

  const weDeliverOrNot = (servingDcs) => {
    // may be user cancelled as it is taking long time
    if (!fetchingLocationRef?.current?.isModalVisible()) {
      return;
    }
    allSuccessTEMP();
    return;
    console.log(servingDcs);
    console.log("weDeliverOrNot");
    //fetchingLocationRef?.current?.hide();
    if (servingDcs.length > 0) {
      userLocationData.delcId = servingDcs[0].delcId;
      userLocationData.areaName = servingDcs[0].areaName;
      setTimeout(() => {
        allSuccess();
      }, 200);
    } else {
      setTimeout(() => {
        Alert.alert(
          "",
          "Unfortunately, We can't find your location with in our serving region. \n\nPlease try to search for your area name again.",
          [
            {
              text: "OK",
              onPress: () => {
                myNavigationHandler(navigation, "LocationSearch", {});
              },
            },
          ]
        );
      }, 100);
    }
  };

  const allSuccessTEMP = () => {
    console.log("allSuccess");
    AppUser.set({
      activeDelcId: 14,
      addressObj: {
        //id: 0, // AppUser.set() will generate
        title: "Home", //Let it set to "Home" initially. User can change it later
        areaName: "Amadalavalasa",
        addressText: "The complete address text",
        lat: 18.416125,
        lng: 83.904004,
        delcId: 14,
        contactNumber: "", //If different from user's mobileNumber
        selected: true,
      },
    })
      .then(() => {
        console.log("GOOOOOOOOO");
        navigation.reset({
          index: 0,
          //routes: [{ name: "HomePreDone" }],
          routes: [{ name: "Home" }],
        });
      })
      .catch((err) => {
        // do nothing
        console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRORX");
        console.log(err);
      });
  };

  const allSuccess = () => {
    console.log("allSuccess");
    AppUser.set({
      activeDelcId: userLocationData?.delcId || "",
      addressObj: {
        //id: 0, // AppUser.set() will generate
        title: "Home", //Let it set to "Home" initially. User can change it later
        areaName: userLocationData?.areaName || "",
        addressText: userLocationData?.addressText || "",
        lat: userLocationData?.positionCoords?.latitude || "",
        lng: userLocationData?.positionCoords?.longitude || "",
        delcId: userLocationData?.delcId || "",
        contactNumber: "", //If different from user's mobileNumber
        selected: true,
      },
    })
      .then(() => {
        console.log("GOOOOOOOOO");
        navigation.reset({
          index: 0,
          //routes: [{ name: "HomePreDone" }],
          routes: [{ name: "Home" }],
        });
      })
      .catch((err) => {
        // do nothing
        console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRORX");
        console.log(err);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer
        navigation={navigation}
        route={route}
        ScreenParams={route.params || {}}
      >
        {homePrePageData.ready ? (
          <View style={{ padding: 0 }}>
            <FlatList
              data={homePrePageData.categories}
              renderItem={renderCategories}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true} // This prop enables horizontal scrolling
              showsHorizontalScrollIndicator={false} // Optional: Hides the horizontal scroll indicator
              //contentContainerStyle={styles.listContainer} // Optional: Styles for the content container
              style={{
                marginTop: 10,
                marginBottom: 2,
              }}
              contentContainerStyle={{ gap: 4 }}
            />
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  color: COLORS.textDarkest,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                Hot deals for you
              </Text>
              <View style={styles.produtsGrid}>
                <ProductsGrid
                  products={homePrePageData.products}
                  numColumns={4}
                  randImageBg={true}
                />
              </View>
            </View>
            {homePrePageData.banners.length > 0 && (
              <View style={styles.slidesArea}>
                <ImageSlider
                  images={homePrePageData.banners}
                  dotsPosition="onImage"
                />
              </View>
            )}
            <View style={{ marginVertical: 20 }}></View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        )}
      </ScreenContainer>
      <LocationPopup
        ref={locationPopupRef}
        navigation={navigation}
        fetchCurrentLocation={fetchCurrentLocation}
      />
      <FetchingLocation ref={fetchingLocationRef} navigation={navigation} />
    </View>
  );
}

const latlngDelCSearch = (lat, lng, maxServeKMsFromDC) => {
  return new Promise((resolve, reject) => {
    try {
      let results = dcsDataSaved.filter(({ delc_lat, delc_lng }) => {
        let _dist = distanceBetweenLatandLng(lat, lng, delc_lat, delc_lng);
        return _dist <= maxServeKMsFromDC;
      });

      results = results.map((delC, index) => {
        let distance = distanceBetweenLatandLng(
          lat,
          lng,
          delC.delc_lat,
          delC.delc_lng
        );
        return {
          distance: distance,
          areaName: delC.ct_name,
          delcId: delC.delc_id,
        };
      });

      if (results.length > 0) {
        results.sort((a, b) => {
          return a.distance - b.distance;
        });
      }

      resolve(results);
    } catch (err) {
      reject();
    }
  });

  console.log(results);
};

const renderCategories = ({ item }) => {
  const { cat_id, cat_name } = item;
  const img_src = "../images/cat_imgs/1/img1.png";
  return (
    <View
      style={{
        //flexDirection: "column",
        alignItems: "center",
        //borderWidth: 1,
        //borderColor: "red",
      }}
    >
      <Image
        source={imageMap[cat_id]}
        style={{
          width: 70,
          height: 70,
          borderRadius: 20,
          borderColor: COLORS.primaryDark,
          //borderWidth: 1,
          backgroundColor: "#a1e91b60",
        }}
      />
      <View
        style={{
          // backgroundColor: COLORS.primaryDark,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            width: 100,
            flexDirection: "row", // Important for flexWrap to work as expected
            flexWrap: "wrap",
            textAlign: "center",
            marginTop: 4,
            fontSize: 10,
          }}
        >
          {cat_name}
        </Text>
      </View>
    </View>
  );
};

const LocationPopup = forwardRef(
  ({ navigation, fetchCurrentLocation }, ref) => {
    const [showLocationSelector, setShowLocationSelector] = useState(false);

    useEffect(() => {
      // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    }, []);

    useImperativeHandle(ref, () => ({
      show() {
        setShowLocationSelector(true);
        animateStart();
      },
      hide() {
        setShowLocationSelector(false);
      },
    }));

    const opacity = useRef(new Animated.Value(0)).current;
    const animateStart = () => {
      Animated.timing(opacity, {
        toValue: 1, // Fully visible
        duration: 600, // 1 second
        useNativeDriver: true,
      }).start();
    };

    const triggerCurrentLocation = () => {
      fetchCurrentLocation();
    };

    const goToLocationSearch = () => {
      myNavigationHandler(navigation, "LocationSearch", {});
    };

    return (
      showLocationSelector && (
        <Animated.View style={[styles.blocker, { opacity: opacity }]}>
          <View style={styles.container}>
            <View
              style={{
                flex: 1,

                flexDirection: "row",
                alignItems: "center",
                //padding: 20,
              }}
            >
              <Image
                style={{
                  width: 150,
                  height: undefined,
                  //width: "50%",
                  //maxHeight: 150,
                  aspectRatio: 675 / 450,
                  //margin: 30,
                }}
                source={require("../images/location_selector.png")}
              />

              <Text
                style={{
                  flexShrink: 1,
                  fontSize: 20,
                  color: COLORS.textDarkest,
                  letterSpacing: 1,
                }}
              >
                Set your location for our delivery services
              </Text>
            </View>

            <LinearGradient
              style={{ marginVertical: 20, marginBottom: 10 }}
              colors={["#0d9adbff", "#0da7eeff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Pressable
                style={styles.useCurrentLocationButton}
                onPress={() => {
                  triggerCurrentLocation();
                }}
              >
                <Ionicons name="locate-sharp" size={24} color={"white"} />
                <Text style={{ marginLeft: 6, color: "white" }}>
                  Use My Current Location
                </Text>
              </Pressable>
            </LinearGradient>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 5,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 1,
                  borderTopColor: "#313131ff",
                  borderTopWidth: 1,
                  marginRight: 2,
                }}
              ></View>
              <Text style={{ fontSize: 12 }}>OR</Text>
              <View
                style={{
                  width: 6,
                  height: 1,
                  borderTopColor: "#313131ff",
                  borderTopWidth: 1,
                  marginLeft: 2,
                }}
              ></View>
            </View>
            <Pressable
              style={styles.locationSearch}
              onPress={() => {
                goToLocationSearch();
              }}
            >
              <Ionicons name="search" size={24} color="#858585ff" />
              <Text style={{ marginLeft: 6, fontSize: 14, color: "#7a7a7aff" }}>
                Search for a Location/Area
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )
    );
  }
);

let takigLongerTimer = ""; // this needs to be defined outside FetchingLocation for clearTimeOut to work correctly

const FetchingLocation = forwardRef(({ navigation }, ref) => {
  const [visible, setVisible] = useState(false);
  const [takigLonger, setTakingLonger] = useState(false);

  useEffect(() => {
    // clear the timer when component unmouts
    return () => {
      clearTimer();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    show() {
      clearTimer();
      takigLongerTimer = setTimeout(() => {
        setTakingLonger(true);
      }, 20000);
      setVisible(true);
    },
    hide() {
      clearTimer();
      setVisible(false);
      setTakingLonger(false);
    },
    isModalVisible() {
      return visible;
    },
    startTimer() {},
  }));

  const clearTimer = () => {
    try {
      clearTimeout(takigLongerTimer);
    } catch (err) {}
  };

  const cancelFetching = () => {
    clearTimer();
    setVisible(false);
    setTakingLonger(false);
    Alert.alert(
      "",
      "Location fetching cancelled. Please try again or search for location",
      [
        {
          text: "Search Location",
          onPress: () => {
            myNavigationHandler(navigation, "LocationSearch", {});
          },
          style: "cancel", // For iOS only, sets the button style
        },
        {
          text: "Close",
          onPress: () => {}, // This is the callback for the "OK" button
        },
      ]
    );
  };

  return (
    visible && (
      <Modal
        visible={true}
        transparent={true}
        statusBarTranslucent={true} // places the Modal on top of statusbar
        //animationType="slide"
        onRequestClose={() => {
          return false;
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#88888899",
          }}
        >
          <View style={styles.modalContent}>
            <Text>
              Finding your current location for the delivery address.{"\n"}
            </Text>
            {takigLonger && (
              <View>
                <Text style={{ color: "#ca4444ff" }}>
                  Location finding is taking little longer. {"\n\n"}Your netork
                  might be slow. Please wait.
                </Text>
              </View>
            )}
            <ActivityIndicator
              size="small"
              color={COLORS.primaryDark}
              style={{ marginTop: 12 }}
            />
            {takigLonger ? (
              <Pressable
                style={{ alignItems: "flex-end", paddingVertical: 8 }}
                onPress={() => {
                  cancelFetching();
                }}
              >
                <Text style={{ color: "#0868f8ff" }}>Cancel</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    )
  );
});

const styles = StyleSheet.create({
  produtsGrid: {
    // backgroundColor: "#5d8dc427",
    //padding: 12,
    //margin: 10,
    //borderRadius: 8,
  },

  // Location popup styles
  blocker: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000096",
  },
  container: {
    position: "absolute",
    bottom: 0,
    flex: 1,
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },

  useCurrentLocationButton: {
    // width: "100%",
    height: 42,
    // backgroundColor: "#e4e4e4ff",
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 8,
  },

  locationSearch: {
    height: 40,
    borderWidth: 0.8,
    borderColor: "#353535ff",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
    paddingLeft: 10,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    width: "80%",
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.05,
    elevation: 4,
  },
});

const imageMap = {
  1: require("../images/cat_imgs/1/img1.png"),
  2: require("../images/cat_imgs/2/img1.png"),
  3: require("../images/cat_imgs/3/img1.png"),
  4: require("../images/cat_imgs/4/img1.png"),
  5: require("../images/cat_imgs/5/img1.png"),
  6: require("../images/cat_imgs/6/img1.png"),
  7: require("../images/cat_imgs/7/img1.png"),
  //8: require("../images/cat_imgs/8/img1.png"),
  9: require("../images/cat_imgs/9/img1.png"),
  10: require("../images/cat_imgs/10/img1.png"),
  11: require("../images/cat_imgs/11/img1.png"),
  12: require("../images/cat_imgs/12/img1.png"),
};
