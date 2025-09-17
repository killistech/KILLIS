import AsyncStorage from "@react-native-async-storage/async-storage";

const PersistentStorage = {
  set: (key, data) => {
    return new Promise(async (resolve, reject) => {
      AsyncStorage.setItem(key, JSON.stringify(data))
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },

  get: async (key) => {
    return new Promise(async (resolve, reject) => {
      let data;
      data = await AsyncStorage.getItem(key);

      if (data != null) {
        resolve(JSON.parse(data));
      } else {
        resolve(null);
      }
    });
  },

  remove: (key) => {
    return new Promise(async (resolve, reject) => {
      AsyncStorage.removeItem(key)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
};

export default PersistentStorage;
