import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StatusBar, Text } from "react-native";

/************* Created for this Application *************************/
import AppContextProvider, { AppContext } from "./src/context/AppContext";
import MyRoutes from "./src/Routing/MyRoutes";
import ReDirecting from "./src/screens/ReDirecting";
import PersistentStorage from "./src/global/PersistentStorage";
import { AppUser } from "./src/global/AppUser";
import COLORS from "./src/global/colors";
import { LoadingProvider } from "./src/context/LoadingContext";
/********************************************************************/

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

// per ChatGPT, Don't use this as console.log() will still be in production bundle which is not good. Insted, remove all console.log( entries)
//console.log = () => null;

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    //StatusBar.setBackgroundColor(COLORS.primary); //Not required to set the bgcolor as the bgcolor of the header with paddingTop set to height of the statusbar will take care of this
    //StatusBar.setBackgroundColor("red");
    //AppUser.clear();
    //AppUser.updateMobileNumber(1234567890);
    preLoadIcons();
    return () => {
      // clean up function before above code executes when useEffect takes effect from second time onwards
      // Note: Second time execution of useEffect happens when dependency is given in the dependency array
      // USE THIS to do such as unsbscribr/cleartimeouts
    };
  }, []);

  async function hiedSplashScreen() {
    await SplashScreen.hideAsync();
  }

  async function preLoadIcons() {
    // this will ensure that slow network will not delay the Icons load later on screens
    try {
      // load Ionicons font once at startup
      await Font.loadAsync(Ionicons.font);
      // load other fonts if needed
      // await Font.loadAsync(MaterialIcons.font);
    } catch (err) {
      //console.warn(err);
    } finally {
      hiedSplashScreen();
      checkUserLocation();
    }
  }

  const checkUserLocation = () => {
    AppUser.get().then((userData) => {
      if (!userData) {
        setInitialRoute("FirstLaunch");
        return;
      }
      if (
        userData?.mobileNumber &&
        userData.mobileNumber != "" &&
        userData.accessToken != ""
      ) {
        if (userData.activeDelcId != "") {
          setInitialRoute("Home");
        } else {
          setInitialRoute("HomePre");
        }
      } else {
        setInitialRoute("FirstLaunch");
      }
    });
  };

  return initialRoute ? (
    <AppContextProvider>
      <MyRoutes initialRoute={initialRoute} />
    </AppContextProvider>
  ) : (
    <ActivityIndicator />
  );
}
