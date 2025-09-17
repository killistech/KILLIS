import MY_API from "./API";
import Cart from "./Cart";
import { currentTimeSecs } from "./functions";
import PersistentStorage from "./PersistentStorage";

let userDataDefault = {
  activeDelcId: "",
  addresses: [
    /*
    {
      id: 0, //timestamp To read back for edits
      title:"", //E.g. Home
      areaName: "",
      addressText: "",
      positionCoords: { lat: "", lng: "" },
      delcId: "",
      contactNumber: "", //If different from user's mobileNumber
      selected: false,
    },
    */
  ] /* addresses is an array of objects within */,
  userId: "",
  mobileNumber: "",
  accessToken: "",
  userName: "",
  walletBalance: 0,
  primeCustomer: false,
};

export const AppUser = {
  /*   init: () => {
    return new Promise((resolve, reject) => {
      PersistentStorage.set("userData", JSON.stringify(userDataDefault)).then(() => {
        resolve();
      });
    });
  }, */
  get: (navigation = null, getSelectedAdrress = false) => {
    return new Promise((resolve, reject) => {
      PersistentStorage.get("userData")
        .then((data) => {
          if (data == null) {
            if (navigation) {
              navigation.reset({
                index: 0,
                routes: [{ name: "FirstLaunch" }],
              });
            } else {
              resolve(null);
            }
          } else {
            const userData = JSON.parse(data);
            userData.selectedAddress = null;
            if (getSelectedAdrress) {
              AppUser.getSelectedAdrress()
                .then((selectedAddress) => {
                  userData.selectedAddress = selectedAddress;

                  resolve(userData);
                })
                .catch(() => {
                  resolve(userData);
                });
            } else {
              resolve(userData);
            }
          }
        })
        .catch(() => {
          resolve(null);
        });
    });
  },
  set: (setData, uploadToDB = true) => {
    console.log("XXX4");
    console.log(setData);
    return new Promise((resolve, reject) => {
      AppUser.get().then((currentData) => {
        const contactNumber =
          setData?.addressObj?.contactNumber &&
          setData?.addressObj?.contactNumber != ""
            ? setData.addressObj.contactNumber
            : currentData?.mobileNumber
            ? currentData?.mobileNumber
            : "";
        console.log("contactNumber", contactNumber);

        const addressObjSet = setData.addressObj ? setData.addressObj : null;
        try {
          delete setData.addressObj;
        } catch (err) {}

        // set "selected" flag on all existing addresses to false
        if (
          addressObjSet &&
          addressObjSet?.selected &&
          addressObjSet?.selected === true
        ) {
          let newArr = currentData.addresses.map((thisAddressObj) => {
            return { ...thisAddressObj, selected: false };
          });
          currentData.addresses = newArr;
        }
        console.log(currentData);
        console.log(setData);
        console.log(addressObjSet);
        console.log(currentData != null);
        const newData = addressObjSet
          ? currentData
            ? {
                ...currentData,
                ...setData,
                addresses: addressObjSet
                  ? [
                      ...currentData.addresses,
                      {
                        ...addressObjSet,
                        id: currentTimeSecs(),
                        contactNumber: contactNumber,
                      },
                    ]
                  : [...userDataDefault.addresses],
              }
            : {
                ...userDataDefault,
                ...setData,
              }
          : currentData
          ? {
              ...currentData,
              ...setData,
            }
          : {
              ...userDataDefault,
              ...setData,
            };

        console.log("newData");
        console.log(newData);

        PersistentStorage.set("userData", JSON.stringify(newData)).then(() => {
          console.log("PersistentStorage SUCCESSSSSSSSSS");
          if (uploadToDB) {
            saveUserDatainDB(newData)
              .then(() => {
                console.log("YESSS");
              })
              .catch(() => {
                console.log("NOOOO");
              })
              .finally(() => {
                //resolve(newData);
              });
          } else {
            //resolve(newData);
          }
          resolve(newData);
        });
      });
    });
  },
  getActiveArea: () => {
    return new Promise((resolve, reject) => {
      AppUser.get().then((currentData) => {
        // console.log(currentData);
        const selectedAddress = currentData.addresses.find(
          (addressObj) => addressObj.selected === true
        );
        console.log(selectedAddress);
        resolve(selectedAddress ? selectedAddress.areaName : "");
      });
    });
  },

  getSelectedAdrress: () => {
    return new Promise((resolve, reject) => {
      AppUser.get().then((currentData) => {
        // console.log(currentData);
        const selectedAddress = currentData.addresses.find(
          (addressObj) => addressObj.selected === true
        );
        resolve(selectedAddress);
      });
    });
  },

  updateMobileNumber: (mobileNumber) => {
    mobileNumber = mobileNumber.toString();
    return new Promise((resolve, reject) => {
      AppUser.set({ mobileNumber: mobileNumber }, false /*for UploadtoDB */)
        .then(() => {})
        .finally(() => {
          resolve(true); // always resolve // no need to handle User Name update errors
        });
    });
  },

  updateUserName: (enteredName) => {
    return new Promise((resolve, reject) => {
      AppUser.set({ userName: enteredName }, false /*for UploadtoDB */)
        .then(() => {})
        .finally(() => {
          resolve(true); // always resolve // no need to handle User Name update errors
        });
    });
  },

  getWalletBalance: () => {
    return new Promise((resolve, reject) => {
      AppUser.get().then((currentData) => {
        resolve(currentData.walletBalance);
      });
    });
  },

  addToWallet: (amount) => {
    return new Promise((resolve, reject) => {
      AppUser.getWalletBalance().then((balance) => {
        const setBalance = Number(balance) + Number(amount);
        AppUser.set({ walletBalance: setBalance }, true /*for UploadtoDB */)
          .then(() => {})
          .finally(() => {
            resolve(true); // always resolve // no need to handle User Name update errors
          });
      });
    });
  },

  deductFromWallet: (amount) => {
    return new Promise((resolve, reject) => {
      AppUser.getWalletBalance().then((balance) => {
        const setBalance = Number(balance) - Number(amount);
        AppUser.set({ walletBalance: setBalance }, true /*for UploadtoDB */)
          .then(() => {})
          .finally(() => {
            resolve(true); // always resolve // no need to handle User Name update errors
          });
      });
    });
  },

  clear: () => {
    return new Promise((resolve, reject) => {
      PersistentStorage.set("userData", JSON.stringify(userDataDefault)).then(
        () => {
          Cart.empty();
          resolve();
        }
      );
    });
  },

  logout: () => {
    return new Promise((resolve, reject) => {
      AppUser.clear().then(() => {
        resolve();
      });
    });
  },
};

const saveUserDatainDB = (data) => {
  return new Promise((resolve, reject) => {
    MY_API({
      scriptName: "user_data_set",
      data: { user_id: data.userId, user_data: JSON.stringify(data) },
      options: { errorAlerts: false },
    })
      .then(({ status, data }) => {
        console.log("saveUserDatainDB Response");
        console.log(status, data);
      })
      .catch(() => {
        // do nothing
        console.log("saveUserDatainDB ERRRRRRRRRRRRR");
      })
      .finally(() => {
        resolve();
      });
  });
};
