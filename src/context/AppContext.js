import React, { useState, createContext, useContext, useReducer } from "react";

import ServerURL from "../context/ServerURL";

export const AppContext = createContext();
const CartStateContext = createContext();
const CartDispatchContext = createContext();

export const AppContextConsumer = AppContext.Consumer;

const reducer = (state, count) => {
  return count;
};

export const AppContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, 0);
  //const [deliveryCenters, setDeliveryCenters] = useState({});

  const globalAppParams = {
    appName: "KiLLiS",
    maxServeKMsFromDC: 6,
    maxOrderCount: 6,
  };
  const globalCONSTANTS = {
    productItemsDir: ServerURL + "/public_product_items",
    productsDir: ServerURL + "/public_products",
    deliveryCentersDir: ServerURL + "/delivery_centers",
    HomePreDir: ServerURL + "/HomePre",
    searchDataFile: ServerURL + "/search_data/search_data.json",
  };

  const PaymentAppNames = { pp: "PhonePe", gp: "GooglePay", pt: "Paytm" };

  let callBacks = {
    addressSelection: null,
    onAddessChange: null,
    onCameraImageTake: null,
    onNameNumberUpdate: null,
    onWalletRechargeSuccess: null,
  };

  let globalDBData = {
    productCategories: {},
  };

  let listOrderImageURI = null;

  let globalSearchString = "";

  const saveProductCategories = (data) => {
    return new Promise((resolve, reject) => {
      console.log("Saving", data);
      globalDBData.productCategories = data;
      resolve();
    });
  };

  /*   const saveGlobalSearchString = (str) => {
    globalSearchString = str;
  }; */

  let globalVariables = {};
  const setGlobalVariables = (obj) => {
    globalVariables = { ...globalVariables, ...obj };

    //searchDataStatus ; //1==fetching in progress, 2=success/ready, 3=download failed/error (fall back to server search)
  };
  const getGlobalVariables = () => {
    return globalVariables;
  };

  return (
    <AppContext.Provider
      value={{
        //globalSearchString,
        //saveGlobalSearchString,
        globalAppParams,
        globalCONSTANTS,
        globalDBData,
        listOrderImageURI,
        PaymentAppNames,
        callBacks,
        saveProductCategories,
        setGlobalVariables,
        getGlobalVariables,
        //deliveryCenters,
        // setDeliveryCenters,
      }}
    >
      <CartDispatchContext.Provider value={dispatch}>
        <CartStateContext.Provider value={state}>
          {props.children}
        </CartStateContext.Provider>
      </CartDispatchContext.Provider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);

export default AppContextProvider;
