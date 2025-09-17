/*MY_API usage - example */
/*
MY_API({
  scriptName: "home_page_data_get",
  data: { delcId: data.delcId, get_catogories: "Y" },
  options: {errorResponseCallBack = null, errorAlerts = true},
})
  .then((data) => {
    
    const { home_page_data, product_categories_data } = data;
    globalContext.saveProductCategories(product_categories_data).then(() => {
      setCardsData(home_page_data);
    });
  })
  .catch(() => {
    // do nothing
  });
*/

import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import ServerURL from "../context/ServerURL";

const AJAXurl = ServerURL + "/apps_out_root/app-main/ajax_call.php";
const AJAX_JSON_parse_error_msg = "Oops!. Please try again later";
const AJAX_status_no_success_no_error_msg = "Oops!. Please try again later";
const AJAX_on_error_alert_msg =
  "Please check your network connection and try again.";

const MY_API = ({ method = "POST", scriptName, data = {}, options = {} }) => {
  const { uploadingImage = false } = options;
  const sendHeaders = uploadingImage
    ? {
        "Content-Type": "multipart/form-data",
      }
    : null;
  let formData = new FormData();
  formData.append("script_name", scriptName);

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const { errorResponseCallBack = null, errorAlerts = true } = options;

  return new Promise((resolve, reject) => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        Alert.alert("", "Please make sure that are connected to the internet");
        if (errorResponseCallBack !== null) {
          errorResponseCallBack();
        }
        reject("No Internet");
        return;
      }
      let resClone = "";
      console.log("RUNNING API " + AJAXurl + " script " + scriptName);
      fetch(AJAXurl, {
        method: "POST",
        body: formData,
        //headers: sendHeaders,
      })
        .then((res) => {
          resClone = res.clone(); //REMOVE before deployment to PROD
          if (res.ok) {
            return res.json();
          } else {
            if (errorAlerts) {
              Alert.alert("Oops!", AJAX_JSON_parse_error_msg);
            }
            reject();
          }
        })
        .then((apiData) => {
          const { status, data } = apiData;
          if (status == "success") {
            resolve(apiData);
          } else {
            if (errorAlerts);
            {
              Alert.alert(
                "",
                data.toString(),
                // casting to string is required when php sends any numberic (int,double) response
                // that will end up in error - "value for message cannot be cast from double to string" - "OBSERVED AND FIXED"
                [
                  {
                    text: "OK",
                    onPress: () => {
                      if (errorResponseCallBack !== null) {
                        errorResponseCallBack();
                      }
                    },
                  },
                ],
                { cancelable: false }
              );
            }
            reject();
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err); //REMOVE before deployment to PROD
          try {
            return resClone.text().then((txt) => console.log(txt)); //REMOVE before deployment to PROD
          } catch (err) {}
          if (errorAlerts);
          {
            Alert.alert("Oops!", AJAX_on_error_alert_msg);
          }
          reject(err);
        });
    });
  });
};

/*

const MY_API = ({ method = "POST", scriptName, data = {}, options = {} }) => {
  const { showLoading = false, showLoadingStateSetter = () => {} } = options;
  if (showLoading) {
    eval(showLoadingStateSetter)(true);
  }

  let formData = new FormData();
  formData.append("script_name", scriptName);

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  let requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  return new Promise((resolve, reject) => {
    fetch(AJAXurl, requestOptions)
      .then((response) => {
        //const resp = response;
        
         try {
          return response.json();
        } catch (err) {
          Alert.alert(
            "Oops!",
            "Please check your network connect and try again"
          );
          reject(err);
        } 
      })
      .then(({ status, data }) => {
        
        resolve(data);
      })
      .catch((error) => {
        //
        Alert.alert(
          "Oops!",
          "Please check your network connection and try again"
        );
        reject(error);
      })
      .finally(() => {});
  });
};

*/
export default MY_API;
