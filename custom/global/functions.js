export const isValidMobileNumber = (mobileNumber) => {
  mobileNumber = mobileNumber.trim();
  if (
    mobileNumber == "" ||
    mobileNumber.toString().charAt(0) == "0" ||
    !mobileNumber.match("[0-9]{10}")
  ) {
    return false;
  }

  return true;
};

export const isScreenIsInStack = (screenName, navigation) => {
  const state = navigation.getState();
  const routes = state.routes;

  let screenIndex = -1;

  // Find the index of the screen
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].name === screenName) {
      screenIndex = i;
      break; // Stop when the first match is found
    }
  }

  if (screenIndex !== -1) {
    return { exists: true, index: screenIndex };
  } else {
    return { exists: false, index: screenIndex };
  }
};

export const myNavigationHandler = (
  navigation,
  screenName,
  screenData = {}
) => {
  const state = navigation.getState();
  const index = state.routes.findIndex((route) => route.name === screenName);

  if (index !== -1) {
    // Pop back to that screen
    navigation.pop(state.routes.length - 1 - index);
  } else {
    // Navigate normally
    navigation.navigate(screenName, { screenData: screenData });
  }
};

export const generateRandomHexColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215) // Generates a random integer between 0 and 16777215 (FFFFFF in hex)
    .toString(16) // Converts the integer to a hexadecimal string
    .padStart(6, "0"); // Pads the string with leading zeros if it's less than 6 characters long
  return `#${randomColor}`; // Prepends '#' to form a valid hex color code
};

export const currentTimeSecs = () => {
  const d = new Date();
  const t = d.getTime();
  return Math.floor(t / 1000);
};

export const distanceBetweenLatandLng = (lat1, lng1, lat2, lng2) => {
  //console.log(lat1, lng1, lat2, lng2);
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres

  let dkm = d / 1000;
  dkm = parseFloat(dkm.toFixed(1));
  if (dkm > 10) {
    dkm = Math.ceil(dkm);
  }
  //console.log(dkm);
  return Number(dkm);
};

export const myAppRandomString = () => {
  /* str of length 9 or 10..10 most of the time..observed */
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, "")
    .substring(1, 11);
};

const buski_rupees_currency_format_obj = {
  style: "currency",
  currency: "INR",
  //currencyDisplay: "code", //code displays text - "INR"
  minimumFractionDigits: 0,
  maximumFractionDigits: 2 /* set to 0 to avoid putting decimals (.00) */,
};
const buski_rupees_currency_format_nosymbol_obj = {
  //style: "currency",
  //currency: "INR",
  //currencyDisplay: "code", //code displays text - "INR"
  minimumFractionDigits: 0,
  maximumFractionDigits: 2 /* set to 0 to avoid putting decimals (.00) */,
};
export const myAppRSformat = (in_price, _prefix) => {
  let out_price = Number(in_price).toLocaleString(
    "en-IN",
    buski_rupees_currency_format_obj
  );
  _prefix = typeof _prefix == "undefined" ? "Rs." : _prefix;
  return out_price.replace(/₹/g, _prefix);
};

export const myTextSpacingOnLineBreak = (text) => {
  return text
    .replace(/\s+\n/g, "\n") // remove spaces before line breaks
    .replace(/\s+$/g, "") // remove spaces at the end
    .replace(/\s{2,}/g, " "); // collapse multiple spaces into one;
};

export const myAppUTCtimeStampinAgoText = (in_UTC_timestamp) => {
  in_UTC_timestamp = Number(in_UTC_timestamp);
  const in_mins = Math.round(in_UTC_timestamp / 60);

  const date = new Date();
  const curr_UTC_mins = Math.floor(date.getTime() / 60000);

  const diff_mins = curr_UTC_mins - in_mins;
  if (diff_mins < 1) {
    return "Few Seconds";
  }

  var MINS_IN_HOUR = 60;
  var MINS_IN_DAY = MINS_IN_HOUR * 24;
  var MINS_IN_MONTH = MINS_IN_DAY * 30;
  var MINS_IN_YEAR = MINS_IN_MONTH * 12;

  var return_nbr = "";
  var return_text = "";

  var n_floor = 0;

  if (diff_mins < MINS_IN_HOUR) {
    return_nbr = diff_mins;
    return_text = "minute";
  } else if (diff_mins < MINS_IN_DAY) {
    return_nbr = (diff_mins / MINS_IN_HOUR).toFixed(1);
    n_floor = Math.floor(return_nbr);
    if (return_nbr - n_floor > 0.5) {
      return_nbr = n_floor + 1;
    } else {
      return_nbr = n_floor;
    }
    return_text = "hour";
  } else if (diff_mins < MINS_IN_MONTH) {
    return_nbr = (diff_mins / MINS_IN_DAY).toFixed(1);
    n_floor = Math.floor(return_nbr);
    if (return_nbr - n_floor > 0.5) {
      return_nbr = n_floor + 1;
    } else {
      return_nbr = n_floor;
    }
    return_text = "day";
  } else if (diff_mins < MINS_IN_YEAR) {
    return_nbr = (diff_mins / MINS_IN_MONTH).toFixed(1);
    n_floor = Math.floor(return_nbr);
    if (return_nbr - n_floor > 0.5) {
      return_nbr = n_floor + 1;
    } else {
      return_nbr = n_floor;
    }
    return_text = "month";
  } else {
    return_nbr = (diff_mins / MINS_IN_YEAR).toFixed(1);
    n_floor = Math.floor(return_nbr);
    if (return_nbr - n_floor > 0.5) {
      return_nbr = n_floor + 1;
    } else {
      return_nbr = n_floor;
    }
    return_text = "year";
  }

  if (return_nbr > 1) {
    return_text = return_text + "s";
  }

  return return_nbr + " " + return_text + " " + "ago";
};
