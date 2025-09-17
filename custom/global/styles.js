import { Dimensions, Platform, StatusBar } from "react-native";
import { ScreenStackHeaderSubview } from "react-native-screens";
import COLORS from "./colors";

const windowWidth = Dimensions.get("window").width;
//const screenWidth = Dimensions.get("screen").width;
//console.log(windowWidth, screenWidth);
const GlobalStyles = {
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    //paddingTop: StatusBar.currentHeight,
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  shadedBackgroundPanel: {
    flex: 1,
    backgroundColor: "#DDDDDDA6",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.sharpButton,
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16,
    padding: 6,
    borderRadius: 50,
  },
  primaryButtonText: {
    color: "white",
    fontSize: windowWidth < 400 ? 16 : 20,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CCC",
    padding: 10,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 50,
  },
  iconButtonText: {
    color: "#444",
    fontSize: windowWidth < 400 ? 16 : 20,
    marginLeft: 10,
  },
  linkButton: {
    padding: 6,
    color: "blue",
    backgroundColor: "#DDD",
  },
  linkButtonText: {
    color: "blue",
    textTransform: "uppercase",
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 12,
    paddingBottom: 6,
  },
  textInput: {
    borderWidth: 0.8,
    borderColor: "#666666ff",
    padding: 6,
  },
};

export default GlobalStyles;
