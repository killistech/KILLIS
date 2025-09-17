import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ScrollView,
  Keyboard,
  Image,
  ImageBackground,
} from "react-native";
import React, {
  useEffect,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
  memo,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import MY_API from "../global/API";
import { AppContext, useAppContext } from "../context/AppContext";
import PersistentStorage from "../global/PersistentStorage";
import COLORS from "../global/colors";
import { useLoading } from "../context/LoadingContext";

const screenHeight = Dimensions.get("window").height;

let productCategories = {};
let globalCONSTANTS = {};

let searchString = "";

const MyAppSearch = ({ navigation, autoFocusSearchInput = false }) => {
  const inputRef = useRef();
  const [showClear, setShowClear] = useState(true);
  const [searchContentType, setSearchContentType] = useState("");
  const [searchResultsData, setSearchResultsData] = useState([]);
  /* H = Search History, R = Search Results, N = No Results, blank = Hide Search Content */

  const globalContext = useAppContext();
  globalCONSTANTS = globalContext.globalCONSTANTS;

  const { globalDBData } = globalContext;
  productCategories = globalDBData.productCategories;

  useEffect(() => {
    /*  return () => {
      showSubscription.remove();
      //hideSubscription.remove();
    }; */
  }, []);

  const unFocusTextInput = () => {
    inputRef.current.unFocusTextInput();
  };

  const performSearchFromHistory = (histStr) => {
    inputRef.current.performSearchFromHistory(histStr);
  };

  return (
    <View>
      <View style={styles.holder}>
        <View style={styles.searchIcon}>
          <Ionicons name="search" size={20} color="#888"></Ionicons>
        </View>

        <SearchTextInput
          ref={inputRef}
          autoFocusSearchInput={autoFocusSearchInput}
          setSearchContentType={setSearchContentType}
          setSearchResultsData={setSearchResultsData}
        />
        {showClear ? (
          <Pressable
            style={styles.clearButton}
            onPress={() => {
              inputRef.current.clearTextInput();
            }}
          >
            <Ionicons
              name="close-circle-outline"
              size={16}
              color="#888"
            ></Ionicons>
          </Pressable>
        ) : (
          <View style={styles.clearButton}></View>
        )}
      </View>
      {searchContentType != "" && (
        ///<TouchableWithoutFeedback style={styles.SearchResultsBlockerLayer} onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          style={styles.SearchResultsBlockerLayer}
          onStartShouldSetResponder={(event) => true}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={styles.SearchContentLayer}>
            <SearchContent
              navigation={navigation}
              contentType={searchContentType}
              searchResultsData={searchResultsData}
              unFocusTextInput={unFocusTextInput}
              performSearchFromHistory={performSearchFromHistory}
              setSearchContentType={setSearchContentType}
            />
          </View>
        </ScrollView>
        // </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const SearchTextInput = forwardRef(
  (
    { autoFocusSearchInput, setSearchContentType, setSearchResultsData },
    ref
  ) => {
    //let [searchInputValue, setSearchInputValue] = useState("");
    //const globalContext = useAppContext();
    //const { globalSearchString, saveGlobalSearchString } = globalContext;
    useEffect(() => {
      textInputRef.current.value = 123;
      /*       if (searchString != "" && searchString != searchInputValue) {
        setSearchInputValue(searchString);
        onchange(searchString);
      } */
    }, []);

    useImperativeHandle(ref, () => ({
      clearTextInput() {
        textInputRef.current.clear();
        searchString = "";
        //setSearchInputValue("");
        console.log("Histr");
        setSearchContentType("H");
        //textInputRef.current.focus();
        //onchange("");
      },
      unFocusTextInput() {
        textInputRef.current.blur();
      },
      performSearchFromHistory(histStr) {
        //setSearchInputValue(histStr);
        onchange(histStr);
      },
    }));

    const onFocus = (e) => {
      /*     Keyboard.removeAllListeners("keyboardDidShow");
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      console.log(e);
      const keyBoardY = e.endCoordinates.screenY - searchContentY;
      if (searchString == "") {
        setSearchContentType("H");
      } else {
        perform_search();
      }
    }); */

      //searchString = searchInputValue.trim() != "" ? searchInputValue.trim() : searchString;
      //console.log(searchInputValue);

      /*       if (searchString != "" && searchString != searchInputValue) {
        //setSearchInputValue(searchString);
        onchange(searchString);
      } */

      if (searchString == "") {
        setSearchContentType("H");
      } else {
        perform_search();
      }
    };
    const onBlur = () => {
      setSearchContentType("");
      //_blur_close_timeout = setTimeout(function(){close_search();},320);
    };

    const onchange = (val) => {
      //saveGlobalSearchString(val);
      console.log("X" + val + "Y", "setting to history");
      if (val == "") {
        setSearchContentType("H");
        return;
      }
      searchString = val.trim();
      timed_perform_search_on_input();
    };

    var _ajax_schedule_ms = 400;
    var _triger_timeout = "";
    var timed_perform_search_on_input = () => {
      clearTimeout(_triger_timeout);
      var str = searchString.replace(
        /[^a-zA-Z0-9 ]/g,
        ""
      ); /*only chars,numbers and space*/
      str = str.replace(
        / +(?= )/g,
        ""
      ); /* Replaces multi spaces and space at the beg/end */
      str = str.trim();
      if (str == "") {
        // this is required as clear search input will trigger onInput event
        perform_search();
        return false;
      }

      _triger_timeout = setTimeout(function () {
        perform_search();
      }, _ajax_schedule_ms);
    };

    //var _search_str = "";
    //var _prev_sent_search_str = "";
    //var previous_search_results = "";

    const perform_search = () => {
      var str = searchString.replace(
        /[^a-zA-Z0-9 ]/g,
        ""
      ); /*only chars,numbers and space*/
      str = str.replace(
        / +(?= )/g,
        ""
      ); /* Replaces multi spaces and space at the beg/end */
      str = str.trim();
      var str_len = str.length;
      if (str_len <= 2) {
        //_prev_sent_search_str = "";
        setSearchContentType("H"); //esc key clears input search
        return false;
      }
      /*
      _search_str = str;
      if (_prev_sent_search_str == _search_str) {
        render_search_results(previous_search_results);
        return false;
      }
      */
      getSerachResults(str);
    };

    const loadingContext = useLoading();
    const getSerachResults = (str) => {
      MY_API({
        scriptName: "product_search",
        data: { str: str },
      })
        .then(({ status, data }) => {
          if (data?.length) {
            setSearchContentType("R");
            setSearchResultsData(data);
          } else {
            setSearchContentType("N");
            setSearchResultsData([]);
          }
        })
        .catch(() => {
          // do nothing
        });
    };

    const textInputRef = useRef();
    return (
      <TextInput
        defaultValue={searchString}
        maxLength={20}
        //inputMode="search"
        // inlineImageLeft={"search_icon"}
        placeholder={"Serach for products"}
        //keyboardType={"number-pad"}
        autoFocus={autoFocusSearchInput}
        //clearButtonMode="always"
        ref={textInputRef}
        style={styles.textInput}
        onFocus={(e) => {
          onFocus(e);
        }}
        onBlur={(val) => {
          onBlur(val);
        }}
        onChangeText={(val) => {
          onchange(val);
        }}
      />
    );
  }
);

const SearchContent = ({
  navigation,
  contentType,
  searchResultsData,
  unFocusTextInput,
  performSearchFromHistory,
  setSearchContentType,
}) => {
  console.log(12345);
  const [history, setHistory] = useState({ fetched: false, data: [] });
  useEffect(() => {
    console.log(contentType);
    if (contentType == "H") {
      PersistentStorage.get("SearchHistory").then((data) => {
        data = data || [];
        setHistory({ fetched: true, data: data });
      });
    }

    return () => {
      // clean up function before an above code executes when useEffect takes effect from second time onwards
      // Note: Second time execution of useEffect happens when dependency is given in the dependency array
      // USE THIS to do such as unsbscribr/cleartimeouts
    };
  }, [contentType]);

  if (contentType == "R") {
    return (
      <SerachResultsRows
        navigation={navigation}
        searchResultsData={searchResultsData}
        unFocusTextInput={unFocusTextInput}
        setSearchContentType={setSearchContentType}
      />
    );
  } else if (contentType == "H") {
    if (history.fetched && history.data.length > 0) {
      return (
        <View>
          <Text style={{ color: "#444", fontSize: 16, padding: 6 }}>
            Search again for
          </Text>
          <View style={styles.searchHistoryBlocks}>
            <SearchHistoryBlocks
              data={history.data}
              performSearchFromHistory={performSearchFromHistory}
            />
          </View>
        </View>
      );
    } else {
      return null;
    }
  } else if (contentType == "N") {
    return (
      <View
        style={{ padding: 40, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#555555", fontSize: 14 }}>
          No products found
        </Text>
        <Text style={{ color: "#555555", fontSize: 16, marginTop: 8 }}>
          Try searching again
        </Text>
      </View>
    );
  } else {
    return null;
  }
};

const SearchHistoryBlocks = ({ data, performSearchFromHistory }) => {
  const selectHistoryItem = (item) => {
    performSearchFromHistory(item);
  };

  return data.map((item, index) => {
    return (
      <Pressable
        style={styles.searchHistoryBlock}
        key={index.toString()}
        onPress={() => {
          selectHistoryItem(item);
        }}
      >
        <Text>{item}</Text>
      </Pressable>
    );
  });
};

const SerachResultsRows = ({
  navigation,
  searchResultsData,
  unFocusTextInput,
  setSearchContentType,
}) => {
  searchResultsData = searchResultsData.map(({ item }) => {
    return item;
  });

  var prev_cat_item_id = "";
  var show_cat_items = [];
  var max_nbr_show = 2;
  searchResultsData.forEach((item) => {
    let cat_item_id = item.c + "_" + item.i;
    if (prev_cat_item_id != cat_item_id) {
      if (show_cat_items.length < max_nbr_show) {
        show_cat_items.push(item);
      }
      prev_cat_item_id = cat_item_id;
    }
  });

  //const finalData = [...show_cat_items, ...searchResultsData];
  //console.log(finalData);

  let categoryRows = show_cat_items.map(({ c, i, n }) => {
    return (
      <View style={styles.searchResultsRow} key={(c + "_" + i).toString()}>
        <Ionicons name="list" size={22} color={COLORS.primary}></Ionicons>
        <Text numberOfLines={1} style={{ marginLeft: 10 }}>
          <Text style={{ color: "blue" }}>{n}</Text>
          <Text> in {productCategories[c]}</Text>
        </Text>
      </View>
    );
  });

  let productRows = searchResultsData.map((item, index) => {
    const pi_id = typeof item.pi == "undefined" ? "" : item.pi;
    return (
      <TouchableOpacity
        style={styles.searchResultsRow}
        key={item.pi.toString()}
        onPress={() => {
          searchResultRowPressed(pi_id);
        }}
      >
        <ImageBackground
          style={styles.SearchResultsRowImage}
          source={require("../images/noimage.png")}
          resizeMode="stretch"
        >
          <Image
            style={styles.SearchResultsRowImage}
            defaultSource={require("../images/noimage.png")}
            source={{
              uri:
                globalCONSTANTS.productItemsDir + "/" + pi_id + "/pi_img.jpeg",
            }}
          />
        </ImageBackground>

        <Text numberOfLines={1} style={{ marginLeft: 10 }}>
          {item.pit}
        </Text>
      </TouchableOpacity>
    );
  });

  const searchResultRowPressed = (pi_id) => {
    setSearchContentType("");
    saveSearchHistory().then(() => {
      unFocusTextInput();

      navigation.push("ProductsList", { screenData: { pi_id: pi_id } });
    });
  };

  const saveSearchHistory = () => {
    return new Promise((resolve, reject) => {
      const maxHistory = 15;
      PersistentStorage.get("SearchHistory").then((data) => {
        if (data == null) {
          data = [];
        }
        let finalData = data.filter((item) => {
          return item.toLowerCase() != searchString.toLowerCase();
        });
        finalData = [searchString, ...finalData].slice(0, maxHistory);
        PersistentStorage.set("SearchHistory", finalData)
          .then(() => {
            resolve();
          })
          .catch(() => {
            resolve();
          });
      });
    });
  };

  return [...categoryRows, ...productRows];
};

const holderHeight = 50;
const styles = StyleSheet.create({
  holder: {
    width: "100%",
    height: holderHeight,
    flexDirection: "row",
    padding: 10,
    paddingTop: 0,
  },
  searchIcon: {
    width: 40,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },

  textInput: {
    flex: 1,
    backgroundColor: "white",
  },
  clearButton: {
    width: 40,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },

  SearchResultsBlockerLayer: {
    flex: 1,
    position: "absolute",
    top: holderHeight - 6,
    zIndex: 99998,
    width: "100%",
    height: screenHeight,
    backgroundColor: "#666666c7",
  },
  SearchContentLayer: {
    flex: 1,
    position: "absolute",
    top: 0,
    width: "100%",
    //maxHeight: -80 + screenHeight / 2,
    backgroundColor: "white",
    zIndex: 99999,
  },
  searchResultsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.6,
    borderBottomColor: "#999999",
    padding: 6,
  },
  SearchResultsRowImage: {
    aspectRatio: 1 / 1,
    width: 26,
    height: 26,
    borderRadius: 4,
  },

  searchHistoryBlocks: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  searchHistoryBlock: {
    padding: 4,
    paddingHorizontal: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: "#AAAAAA",
  },
});

export default memo(MyAppSearch);
