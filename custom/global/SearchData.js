// searchStorage.modern.js
import { File, Paths } from "expo-file-system";
import Fuse from "fuse.js";

// choose Paths.cache or Paths.document depending on earlier decision
const FILE = new File(Paths.cache, "searchData.json");

const SearchData = {
  data: null,
  save: async (text) => {
    console.log("SAVING", text);
    try {
      //const text = JSON.stringify(obj);
      // File.create() may throw if already exists, so ignore that error
      try {
        FILE.create();
      } catch (err) {
        // ignore "already exists" errors
      }
      // write() replaces file contents
      FILE.write(text);
      // Optionally you can call FILE.info() to check properties
      return true;
    } catch (e) {
      //console.error("saveSearchIndexModern failed", e);
      return false;
    }
  },

  exists: async () => {
    try {
      const info = FILE.info(); // FileInfo-like object
      console.log(info);
      return info;
    } catch (e) {
      //console.error("readSearchIndexModern failed", e);
      return null;
    }
  },

  get: async () => {
    try {
      const info = FILE.info(); // FileInfo-like object
      if (!info?.exists) return null;

      // Prefer synchronous text read if available (docs show textSync()),
      // otherwise read bytes and decode them.
      if (typeof FILE.textSync === "function") {
        const txt = FILE.textSync();
        return JSON.parse(txt);
      } else {
        // async bytes -> decode
        const u8 = await FILE.bytes(); // returns Uint8Array
        const txt = new TextDecoder().decode(u8);
        return JSON.parse(txt);
      }
    } catch (e) {
      //console.error("readSearchIndexModern failed", e);
      return null;
    }
  },

  fuse: null,

  search: async (str) => {
    let match_len = Math.floor(str.length / 2);
    match_len = match_len < 3 ? 3 : match_len;
    const options = {
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      // threshold: 0.6,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      includeScore: false,
      shouldSort: true, // result sorted by score in asc order
      //minMatchCharLength: 3,
      ignoreFieldNorm: false,
      ignoreLocation: true,
      useExtendedSearch: false,
      findAllMatches: false,
      tokenize: true,
      threshold: 0.45,
      ignoreLocation: true,
      //distance: 100,

      //includeMatches: true,
      keys: [
        //{ name: "pit", weight: 0.8 },
        //{ name: "ix", weight: 0.4 },
        { name: "pit", weight: 0.3 },
        { name: "ix", weight: 0.7 },
      ],
    };

    console.log(111111);
    if (!SearchData.data) {
      console.log("GETTTINGGGGGGGGGGGGG");
      SearchData.data = await SearchData.get();
    }
    console.log(22222);

    if (!SearchData.fuse) {
      console.log("CREATING FUSE");
      SearchData.fuse = new Fuse(SearchData.data, options);
    }
    const results = SearchData.perform(str, options);
    console.log(3333);
    // console.log(results);
    return results;
  },

  perform: (str, options) => {
    console.log("PERFORM - START");
    const st = performance.now();
    const fresults = SearchData.fuse.search(str, { limit: 10 });
    const ed = performance.now();
    console.log(
      "PERFORM - ENDDDDDDD",
      fresults.length,
      " time: ",
      (ed - st) / 1000
    );
    //console.log(fresults);
    return fresults;
  },

  delete: async () => {
    try {
      FILE.delete(); // deletes the file (void)
    } catch (e) {
      //console.log("deleteSearchIndexModern failed (may not exist)", e);
    }
  },
};

export default SearchData;
