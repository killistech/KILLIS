import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { myAppRSformat, myNavigationHandler } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
import ServerURL from "../context/ServerURL";
import PersistentStorage from "../global/PersistentStorage";
import MyText from "../components/MyText";

/********************************************************************/

const serachInputHeight = 50;
const serachInputPaddingVertical = 5;

const historyGridColumns = 3;
const historyGridGap = 10;
const historyGridBoxWidth =
  (Dimensions.get("window").width - historyGridColumns * historyGridGap * 2) /
  historyGridColumns;

console.log(historyGridBoxWidth);
export default function Search({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const searchResultsRef = useRef();
  const historyRef = useRef();
  const historyBlockerRef = useRef();
  const SearchBarRef = useRef();

  const isFocused = useIsFocused();

  const globalContext = useAppContext();
  const { setGlobalVariables, getGlobalVariables } = globalContext;

  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }
    showHistory();
  }, []);

  const showHistory = () => {
    historyRef?.current?.show();
  };

  const handleFocus = () => {
    const { searchInoutCurrentText = "" } = getGlobalVariables();
    console.log(searchInoutCurrentText);
    startSearch(searchInoutCurrentText);
  };

  const startSearch = (str) => {
    str = str.replace(/[^a-zA-Z0-9 ]/g, ""); /*only chars,numbers and space*/
    str = str.replace(
      / +(?= )/g,
      ""
    ); /* Replaces multi spaces and space at the beg/end */
    str = str.trim();

    if (str == "") {
      clearSearchResults();
    }

    if (str.length < 3) {
      return false;
    }

    searchProductItemsinDB(str);
  };

  const searchProductItemsinDB = (str) => {
    MY_API({ scriptName: "product_search", data: { str: str } })
      .then(({ status, data }) => {
        console.log(data);

        searchResultsRef?.current?.update(data);
      })
      .catch(() => {
        // do nothing
      });
  };

  const clearSearchResults = () => {
    searchResultsRef?.current?.update([]);
  };

  const resultsHiddenByPressBlocker = () => {
    SearchBarRef?.current?.blur();
    clearSearchResults();
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
      scrollingContainer={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={{
            padding: 10,
            paddingLeft: 5,
            //paddingHorizontal: 10,
            // backgroundColor: "red",
            // width: 30,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <SearchBar
          ref={SearchBarRef}
          onChange={startSearch}
          onFocus={handleFocus}
          onClear={clearSearchResults}
        />
      </View>
      <View style={{ flex: 1 }}>
        <History ref={historyRef} navigation={navigation} />
        <HistoryBlocker ref={historyBlockerRef} />
        <SearchResults
          ref={searchResultsRef}
          onHide={resultsHiddenByPressBlocker}
        />
      </View>
    </ScreenContainer>
  );
}

const SearchBar = forwardRef(({ onChange, onFocus, onClear }, ref) => {
  const textInputRef = useRef();

  const globalContext = useAppContext();
  const { setGlobalVariables, getGlobalVariables } = globalContext;

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    blur() {
      console.log(123466);
      textInputRef.current.blur();
    },
  }));

  const { searchInoutCurrentText = "" } = getGlobalVariables();

  return (
    <View style={styles.searchInputHolder}>
      <Ionicons
        name="search"
        size={22}
        color={"#888"}
        style={{ marginHorizontal: 8 }}
      />
      <TextInput
        ref={textInputRef}
        autoFocus={true}
        defaultValue={searchInoutCurrentText}
        placeholder={"Search for products"}
        style={{
          flex: 1,
          paddingRight: 20,

          paddingVertical: 5,
        }}
        onFocus={(e) => {
          onFocus();
        }}
        //onBlur={(val) => {
        //  onBlur(val);
        //}}
        onChangeText={(val) => {
          setGlobalVariables({ searchInoutCurrentText: val });
          onChange(val);
        }}
      />
      <Pressable
        style={{
          height: "100%",
          width: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          textInputRef.current.clear();
          setGlobalVariables({ searchInoutCurrentText: "" });
          //textInputRef.current.blur();
          onClear();
        }}
      >
        <Ionicons name="close" size={16} color="#888"></Ionicons>
      </Pressable>
    </View>
  );
});

const HistoryBlocker = forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true);
    },
    hide() {
      setShow(false);
    },
  }));

  return (
    show && (
      <Pressable
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></Pressable>
    )
  );
});

const SearchResults = forwardRef(({ onHide }, ref) => {
  const [data, setData] = useState([]);

  const globalContext = useAppContext();
  const { setGlobalVariables, getGlobalVariables, productItemsDir } =
    globalContext;

  useEffect(() => {}, [data]);
  useImperativeHandle(ref, () => ({
    update(results) {
      setData(results);
    },
  }));

  const saveSearchHistory = (pi_item) => {
    const maxHistory = 15;
    PersistentStorage.get("SearchHistory").then((data) => {
      console.log(data);

      let finalData = data.filter((item) => {
        return item.pi != pi_item.pi;
      });

      finalData = [pi_item, ...finalData].slice(0, maxHistory);
      PersistentStorage.set("SearchHistory", finalData);
    });
  };

  return (
    data.length > 0 && (
      <View
        style={[
          styles.container,
          {
            maxHeight: "80%",

            borderBottomWidth: 1,
            borderBottomColor: "#555",
          },
        ]}
      >
        {data.map(({ item }, index) => {
          return (
            <Pressable
              style={styles.searchResultsRow}
              key={index}
              onPress={() => {
                saveSearchHistory(item);
              }}
            >
              <Image
                source={{
                  uri: `${ServerURL}/public_product_items/${item.pi}/images/small.png`,
                }}
                // resizeMode={"contain"}
                style={{
                  width: 50,
                  height: undefined,
                  aspectRatio: 1,
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: "black",
                  flex: 1,
                  width: "100%",
                  marginLeft: 10,
                }}
              >
                {item.pit}
              </Text>
            </Pressable>
          );
        })}
      </View>
    )
  );
});

const History = forwardRef(({ navigation }, ref) => {
  const [history, setHistory] = useState([]);

  const globalContext = useAppContext();
  const { productItemsDir } = globalContext;

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    show() {
      PersistentStorage.get("SearchHistory").then((data) => {
        const sw = Dimensions.get("window").width;
        const columns = 3;
        const gap = 20;

        if (data.length > 0) {
          console.log("data", data);

          for (let i = 0; i < 20; i++) {
            let d = {
              c: "9",
              i: "1",
              ix: "",
              n: "Shampoo",
              pi: i + 20,
              pit: "Clinic all clear Shampoo - Blue",
            };
            data.push(d);
          }
          setHistory(data);
        }
      });
    },
  }));

  return (
    history.length > 0 && (
      <View style={styles.container}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginVertical: 10,
            marginLeft: 10,
          }}
        >
          Are you looking again for?
        </Text>
        <ScrollView style={{ flexShrink: 1 }}>
          <View style={styles.historyHolder}>
            {history.map((item, index) => {
              return (
                <Pressable
                  style={styles.historyItem}
                  key={item.pi}
                  onPress={() => {
                    myNavigationHandler(navigation, "ProductsList", {
                      pi_id: item.pi,
                    });
                  }}
                >
                  <Image
                    source={{
                      uri: `${ServerURL}/public_product_items/${item.pi}/images/medium.png`,
                    }}
                    // resizeMode={"contain"}
                    style={{
                      width: "90%",
                      height: undefined,
                      aspectRatio: 1,
                      alignSelf: "center",
                      //backgroundColor: "red",
                    }}
                  />
                  <Text
                    style={{ marginTop: 10, fontSize: 12 }}
                    numberOfLines={0}
                  >
                    {item.pit}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    )
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    paddingVertical: 10,
    paddingRight: 10,
    paddingTop: StatusBar.currentHeight + 8,
  },
  container: {
    // flexShrink: 1,
    position: "absolute",
    top: 0,
    left: 0,
  },
  searchInputHolder: {
    flex: 1,
    height: 45,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 3,
    borderRadius: 5,
  },
  searchResultsHolder: {
    position: "absolute",
    flex: 1,
    width: "100%",
    backgroundColor: "#CCCCCC" + COLORS.opacs[40],
  },
  searchResultsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#888",
    borderBottomWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  historyHolder: {
    //position: "absolute",
    width: "100%",
    flexDirection: "row",
    //justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  historyItem: {
    width: historyGridBoxWidth,
    height: undefined, // works as auto
    backgroundColor: "#DDDDDD" + COLORS.opacs[50],

    margin: historyGridGap,
    padding: 8,
    // marginBottom: 10,
  },
});
