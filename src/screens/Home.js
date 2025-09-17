import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  Alert,
  BackHandler,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

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
import { myAppRSformat, myNavigationHandler } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
/********************************************************************/

import ServerURL from "../context/ServerURL";
import ImageSlider from "../components/ImageSlider";
import VerifyOTP from "./VerifyOTP";
import ShimmerSkeleton from "../components/ShimmerSkeleton";
import PersistentStorage from "../global/PersistentStorage";
import SearchData from "../global/SearchData";

//let p_ids_data = "";
let homePageDataSaved = null;
export default function Home({ navigation, route }) {
  const globalContext = useAppContext();
  const { globalCONSTANTS, setGlobalVariables } = globalContext;

  const [homePageData, setHomePageData] = useState({
    ready: false,
    locations: [],
    categories: [],
    delcSliderImages: [],
    cardsdata: [],
  });

  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("Home XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    if (!isFocused) {
      return () => {};
    }
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXYYYYYYYYYY");

    AppUser.get(navigation).then((userData) => {
      console.log(userData);
      if (userData.activeDelcId == "") {
        navigation.reset({
          index: 0,
          routes: [{ name: "HomePre" }],
        });
        return;
      }
      /* 
      Not required anymore. 
      The below line in Routes on Home screen will take care of NOT remounting it 
      getId={({ params }) => String(params?.id ?? "default")} // this will stop remounting the screen when navigated by pressing footerNav Icon

      if (homePageDataSaved) {
        setHomePageData(homePageDataSaved);
        return;
      } */
      getHomePageData(userData);
    });

    console.log("Home useEffect");

    /* Handling android hardware back button is not required.
      OBSERVED THAT THE BELOW CODE IS EXITING THE APP ON EACH PAGE    
   
    //handling Hardware  Back button click.. Mostly for Android
    
    const backAction = () => {
      if (route.name == "Home" || route.name == "HomePre") {
        BackHandler.exitApp();
        return true;
      } else {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
*/
  }, []);

  const getHomePageData = (userData) => {
    /* Image.getSize(
      `https://beuflix.com/cdn/shop/files/SunsilkHairfallShampoowithOnion_JojobaOil-3_1024x1024.jpg?v=1709740789`,
      (w, h) => {
        console.log(w, h);
      }
    ); */
    console.log(userData.activeDelcId);
    MY_API({
      scriptName: "home_page_data_get",
      data: { delc_id: userData.activeDelcId, get_catogories: "Y" },
      options: { showLoading: true },
    })
      .then(({ status, data }) => {
        console.log(data);
        const {
          home_page_data,
          home_page_slides,
          product_categories_data,
          search_data_server_ts,
        } = data;
        globalContext
          .saveProductCategories(product_categories_data)
          .then(() => {
            handleSearchDataDownload(search_data_server_ts);
            if (home_page_data.length > 0) {
              const home_page_slides_imgs = home_page_slides.map((imgName) => {
                return (
                  globalCONSTANTS.deliveryCentersDir +
                  "/" +
                  userData.activeDelcId +
                  "/homepage_slides/" +
                  imgName
                );
              });
              console.log(home_page_slides_imgs);
              homePageDataSaved = {
                ready: true,
                locations: [],
                categories: product_categories_data,
                delcSliderImages: home_page_slides_imgs,
                cardsdata: [],
              };
              setHomePageData(homePageDataSaved);
            } else {
              homePageDataSaved = {
                ready: true,
                locations: [],
                categories: product_categories_data,
                delcSliderImages: home_page_slides_imgs,
                cardsdata: [],
              };
              setHomePageData(homePageDataSaved);
            }
          });
      })
      .catch(() => {
        // do nothing
      });
  };

  const handleSearchDataDownload = (server_ts) => {
    PersistentStorage.get("searchDataTs").then(async (ts = null) => {
      console.log("server_ts", server_ts);

      const last_downloaded_ts = ts || 0;
      console.log("lastf_downloaded_ts", last_downloaded_ts);
      // const now_ts = Math.floor(new Date().getTime() / 1000);
      if (Number(server_ts) > Number(last_downloaded_ts)) {
        searchDataDownload(server_ts);
        return;
      }
      console.log(Number(last_downloaded_ts));
      const { exists = false, size = 0 } = await SearchData.exists();
      console.log(exists, Number(size));
      if (exists && Number(size) > 0) {
        console.log("dsaadfsdfsdf");
        setGlobalVariables({ searchDataStatus: 2 }); // succes and ready
      }
    });
  };

  const searchDataDownload = (server_ts) => {
    setGlobalVariables({ searchDataStatus: 1 });
    const TARGET_FILE = globalCONSTANTS.searchDataFile + "?" + server_ts;
    console.log(TARGET_FILE);
    fetch(TARGET_FILE)
      .then((response) => {
        if (!response.ok) {
          setGlobalVariables({ searchDataStatus: 3 }); // falied
          return;
        }
        return response.text();
      })
      .then(async (textData) => {
        const saveSuccess = await SearchData.save(textData);
        console.log("saveSucces", saveSuccess);
        PersistentStorage.set("searchDataTs", server_ts);
        setGlobalVariables({ searchDataStatus: 2 }); // succes and ready
      })
      .catch((error) => {
        setGlobalVariables({ searchDataStatus: 3 }); // falied
      });
  };

  //React Native does not support dynamic require() for local images.
  //That means you cannot do require(variable) directly.
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

  const renderCategories = ({ item }) => {
    const { cat_id, cat_name } = item;
    const img_src = "../images/cat_imgs/1/img1.png";
    return (
      <View
        style={{
          //flexDirection: "column",
          alignItems: "center",
          // borderWidth: 1,
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

  const onLocationChange = () => {
    console.log("onLocationChange");
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      scrollingContainer={true}
      screenBlocker={homePageData.ready ? false : true}
      onLocationChange={onLocationChange}
    >
      {homePageData.ready ? (
        <View>
          <View>
            <FlatList
              data={homePageData.categories}
              renderItem={renderCategories}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true} // This prop enables horizontal scrolling
              showsHorizontalScrollIndicator={false} // Optional: Hides the horizontal scroll indicator
              //contentContainerStyle={styles.listContainer} // Optional: Styles for the content container
              style={{
                marginTop: 10,
              }}
              contentContainerStyle={{ gap: 4 }}
            />
          </View>
          {homePageData.delcSliderImages.length > 0 && (
            <View style={styles.slidesArea}>
              <ImageSlider
                images={homePageData.delcSliderImages}
                dotsPosition="onImage"
              />
            </View>
          )}
        </View>
      ) : (
        <Skeletons />
      )}
    </ScreenContainer>
  );
}

const cardShape = "";
const screenWidth = Dimensions.get("window").width;
const cardSpacing = 4;
const nbrCardsPerRow = 2;
const cardItemDescHeight = 30;
const cardCartBtnWidth = 50;

const carouselOverlap = 20;
const cardWidth =
  (screenWidth - nbrCardsPerRow * 2 * cardSpacing) / nbrCardsPerRow -
  carouselOverlap;

const cardImageMaxWidth = cardWidth - cardCartBtnWidth;

const cardHeight =
  cardShape == "SQ" ? cardWidth : cardWidth + cardItemDescHeight;
//console.log(screenWidth, cardWidth);

const GridSections = ({ data, navigation }) => {
  console.log(12345);
  const results = data.map(({ cat_data, p_data }, index) => {
    let { cat_name, delc_id, cat_id, p_ids_json } = cat_data;
    let p_ids = JSON.parse(p_ids_json);

    if (p_ids.length > 0) {
      return (
        <View key={cat_id.toString()} style={{ paddingLeft: 10 }}>
          <Text style={styles.gridSelectionTitle}>{cat_name}</Text>
          <ScrollView horizontal={true} style={styles.cardsHolder}>
            <Cards data={{ p_ids, p_data }} navigation={navigation} />
          </ScrollView>
        </View>
      );
    }
  });

  return results;
};

const Cards = ({ data, navigation }) => {
  const { p_ids, p_data } = data;
  const globalContext = useAppContext();
  const { globalCONSTANTS, globalAppParams } = globalContext;

  const [reload, setReload] = useState(false);
  useEffect(() => {
    console.log("YYYYYYYYYYYYYYYYYYYYYY");
  }, [reload]);

  const openProductDetails = (p_id) => {
    myNavigationHandler(navigation, "ProductDetails", { p_id: p_id });
  };

  const results = p_ids.map((p_id, index) => {
    const this_p_data = p_data[p_id];

    return (
      <Pressable
        style={styles.card}
        key={p_id.toString()}
        onPress={() => {
          openProductDetails(p_id);
        }}
      >
        <ProductGridCard pData={this_p_data} cartButtons={false} />
      </Pressable>
    );
  });

  return results;
};

const Skeletons = () => {
  return (
    <View style={{ flex: 1, gap: 25, padding: 12 }}>
      <View style={{ flexDirection: "row", gap: 16 }}>
        {Array(5)
          .fill(null)
          .map((obj, index) => {
            return (
              <ShimmerSkeleton
                key={index.toString()}
                width={100}
                height={100}
                borderRadius={100}
              />
            );
          })}
      </View>
      <ShimmerSkeleton width="100%" height={200} borderRadius={10} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {Array(6)
          .fill(null)
          .map((obj, index) => {
            return (
              <ShimmerSkeleton
                key={index.toString()}
                width={100}
                height={100}
                borderRadius={0}
              />
            );
          })}
      </View>
      <ShimmerSkeleton flex={1} width="90%" height={120} borderRadius={10} />
    </View>
  );
};

const cardBackGroundColor = "#3e80ac18";
const styles = StyleSheet.create({
  slidesArea: {
    marginTop: 10,
  },
  gridSection: {
    borderBottomWidth: 8,
    borderBottomColor: "#CCCCCC",
  },
  gridSelectionTitle: {
    fontSize: 20,
    paddingTop: 8,
  },
  cardsHolder: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: cardWidth,
    //height: cardHeight,
    margin: cardSpacing,
    backgroundColor: cardBackGroundColor,
    flexGrow: 1,
    padding: 5,
    paddingBottom: 10,
  },
});
