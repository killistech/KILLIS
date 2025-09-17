import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import AppContext from "../context/AppContext";
import React from "react";
import Screens from "../screens";

const Stack = createNativeStackNavigator();

export default function MyRoutes(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={props.initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="FirstLaunch"
          component={Screens.FirstLaunch}
          initialParams={{
            header: false,
          }}
        />
        <Stack.Screen
          name="VerifyOTP"
          component={Screens.VerifyOTP}
          //getId={() => "VerifyOTP"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "Verify Mobile Number",
              searchIcon: false,
            },
          }}
        />
        <Stack.Screen
          name="LocationSearch"
          component={Screens.LocationSearch}
          options={{ title: "Location Search", animation: "none" }}
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "Location Search",
              searchIcon: false,
            },
            footerNav: false,
          }}
        />
        <Stack.Screen
          name="HomePre"
          component={Screens.HomePre}
          options={{ title: "HomePre" }}
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "KiLLis",
            },
            footerNav: true,
          }}
        />
        <Stack.Screen
          name="HomePreDone"
          component={Screens.HomePreDone}
          options={{ title: "HomePreDone", animation: "none" }}
          initialParams={{
            header: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Screens.Home}
          options={{ title: "Home", animation: "fade" }}
          getId={({ params }) => String(params?.id ?? "default")} // this will stop remounting the screen when navigated by pressing footerNav Icon
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "KiLLis",

              deliveryLocation: true,
            },
            footerNav: true,
          }}
        />
        <Stack.Screen
          name="Search"
          component={Screens.Search}
          options={{ title: "Search", animation: "none" }}
          //getId={() => "Search"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: false,
          }}
        />
        <Stack.Screen
          name="ProductsList"
          component={Screens.ProductsList}
          options={{ title: "ProductsList" }}
          // getId={() => "ProductsList"} // this prevents adding multiple instances in the router stack...Observed and fixed.

          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "KiLLis",
              searchIcon: true,
            },
            footerNav: true,
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={Screens.ProductDetails}
          options={{ title: "Product Details" }}
          // getId={() => "ProductDetails"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "KiLLis",
              searchIcon: true,
            },
          }}
        />
        <Stack.Screen
          name="ListOrder"
          component={Screens.ListOrder}
          options={{ title: "ListOrder", animation: "fade" }}
          //getId={() => "ListOrder-singleton"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "Shopping List",
              searchIcon: true,
            },
            footerNav: true,
          }}
        />
        <Stack.Screen
          name="CartSummary"
          component={Screens.CartSummary}
          options={{ title: "Cart", animation: "fade" }}
          // getId={() => "CartSummary"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "KiLLis Cart",
              searchIcon: true,
            },
            footerNav: false,
          }}
        />
        <Stack.Screen
          name="Account"
          component={Screens.Account}
          options={{ title: "Account", animation: "fade" }}
          //getId={() => "Account-singleton"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "Account",
              searchIcon: true,
            },
            footerNav: true,
          }}
        />
        <Stack.Screen
          name="MyOrders"
          component={Screens.MyOrders}
          options={{ title: "MyOrders", animation: "simple_push" }}
          //getId={() => "MyOrders"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "My Orders",
              searchIcon: true,
            },
            footerNav: true,
          }}
        />
        <Stack.Screen
          name="Addresses"
          component={Screens.Addresses}
          options={{ title: "Addresses", animation: "simple_push" }}
          //getId={() => "Addresses"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "My Adresses",
              searchIcon: false,
            },
            footerNav: false,
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={Screens.Checkout}
          options={{ title: "Checkout", animation: "simple_push" }}
          //getId={() => "Checkout"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "KiLLis Checkout",
              searchIcon: false,
            },
            footerNav: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Screens.Profile}
          options={{ title: "Profile" }}
          //getId={() => "Profile"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "Your Profile",
              searchIcon: true,
            },
          }}
        />
        <Stack.Screen
          name="UpdateNameMobile"
          component={Screens.UpdateNameMobile}
          options={{
            title: "Update Name and Mobile",
            animation: "simple_push",
          }}
          //getId={() => "UpdateName"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "Update Name & Mobile",
              searchIcon: false,
            },
            footerNav: false,
          }}
        />
        <Stack.Screen
          name="WalletRecharge"
          component={Screens.WalletRecharge}
          options={{ title: "Your Wallet" }}
          // getId={() => "WalletRecharge"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: true,
            headerOptions: {
              headerTitle: "Recharge Wallet",
              searchIcon: false,
            },
            footerNav: false,
          }}
        />
        <Stack.Screen
          name="CameraPanel"
          component={Screens.CameraPanel}
          options={{ title: "", animation: "none" }}
          //getId={() => "CameraPanel"} // this prevents adding multiple instances in the router stack...Observed and fixed.
          initialParams={{
            header: false,
            headerOptions: {
              headerTitle: "",
              searchIcon: false,
            },
            footerNav: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//const styles = StyleSheet.create({});
