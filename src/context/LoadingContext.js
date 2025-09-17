import React, { createContext, useState, useContext } from "react";
import { BackHandler, View, Text } from "react-native";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  let backListener;
  const showLoadingContext = () => {
    setIsLoading(true);
    backListener = BackHandler.addEventListener(
      "hardwareBackPress",
      backPressWhenOn
    );
  };
  const hideLoadingContext = () => {
    backListener.remove();
    setIsLoading(false);
    //BackHandler.addEventListener("hardwareBackPress", backPressWhenOff);
  };

  const backPressWhenOn = () => {
    // Return true to disable the default back button behavior (i.e., prevent navigation back)
    return true;
  };

  const backPressWhenOff = () => {
    // Return false to allow the default back button behavior
    // backListener.remove();
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, showLoadingContext, hideLoadingContext }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
