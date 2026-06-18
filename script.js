const cityData = {
  "Northeast": [
    {
      "name": "Boston, MA",
      "abbr": "BOS",
      "station": "KBOS",
      "type": "City"
    },
    {
      "name": "Portland, ME",
      "abbr": "PWM",
      "station": "KPWM",
      "type": "Coastal"
    },
    {
      "name": "Burlington, VT",
      "abbr": "BTV",
      "station": "KBTV",
      "type": "Mountain/Lake"
    },
    {
      "name": "Albany, NY",
      "abbr": "ALB",
      "station": "KALB",
      "type": "City"
    },
    {
      "name": "Providence, RI",
      "abbr": "PVD",
      "station": "KPVD",
      "type": "Coastal"
    },
    {
      "name": "Hartford, CT",
      "abbr": "BDL",
      "station": "KBDL",
      "type": "City"
    },
    {
      "name": "Manchester, NH",
      "abbr": "MHT",
      "station": "KMHT",
      "type": "City"
    },
    {
      "name": "Bangor, ME",
      "abbr": "BGR",
      "station": "KBGR",
      "type": "Forest"
    },
    {
      "name": "Syracuse, NY",
      "abbr": "SYR",
      "station": "KSYR",
      "type": "City"
    },
    {
      "name": "Rochester, NY",
      "abbr": "ROC",
      "station": "KROC",
      "type": "Lake"
    },
    {
      "name": "Worcester, MA",
      "abbr": "ORH",
      "station": "KORH",
      "type": "City"
    },
    {
      "name": "New York, NY",
      "abbr": "NYC",
      "station": "KNYC",
      "type": "Big City"
    }
  ],
  "Mid-Atlantic": [
    {
      "name": "Philadelphia, PA",
      "abbr": "PHL",
      "station": "KPHL",
      "type": "City"
    },
    {
      "name": "Baltimore, MD",
      "abbr": "BAL",
      "station": "KBWI",
      "type": "City"
    },
    {
      "name": "Washington, DC",
      "abbr": "DC",
      "station": "KDCA",
      "type": "City"
    },
    {
      "name": "Richmond, VA",
      "abbr": "RIC",
      "station": "KRIC",
      "type": "City"
    },
    {
      "name": "Norfolk, VA",
      "abbr": "ORF",
      "station": "KORF",
      "type": "Coastal"
    },
    {
      "name": "Atlantic City, NJ",
      "abbr": "ACY",
      "station": "KACY",
      "type": "Beach"
    },
    {
      "name": "Harrisburg, PA",
      "abbr": "MDT",
      "station": "KMDT",
      "type": "River Valley"
    },
    {
      "name": "Allentown, PA",
      "abbr": "ABE",
      "station": "KABE",
      "type": "City"
    },
    {
      "name": "Wilmington, DE",
      "abbr": "ILG",
      "station": "KILG",
      "type": "City"
    },
    {
      "name": "State College, PA",
      "abbr": "UNV",
      "station": "KUNV",
      "type": "College Town"
    }
  ],
  "Southeast": [
    {
      "name": "Miami, FL",
      "abbr": "MIA",
      "station": "KMIA",
      "type": "Beach"
    },
    {
      "name": "Tampa, FL",
      "abbr": "TPA",
      "station": "KTPA",
      "type": "Coastal"
    },
    {
      "name": "Orlando, FL",
      "abbr": "ORL",
      "station": "KMCO",
      "type": "City"
    },
    {
      "name": "Jacksonville, FL",
      "abbr": "JAX",
      "station": "KJAX",
      "type": "Coastal"
    },
    {
      "name": "Charleston, SC",
      "abbr": "CHS",
      "station": "KCHS",
      "type": "Coastal"
    },
    {
      "name": "Savannah, GA",
      "abbr": "SAV",
      "station": "KSAV",
      "type": "Coastal"
    },
    {
      "name": "Asheville, NC",
      "abbr": "AVL",
      "station": "KAVL",
      "type": "Mountain"
    },
    {
      "name": "Atlanta, GA",
      "abbr": "ATL",
      "station": "KATL",
      "type": "City"
    },
    {
      "name": "Nashville, TN",
      "abbr": "BNA",
      "station": "KBNA",
      "type": "City"
    },
    {
      "name": "New Orleans, LA",
      "abbr": "MSY",
      "station": "KMSY",
      "type": "Coastal"
    },
    {
      "name": "Charlotte, NC",
      "abbr": "CLT",
      "station": "KCLT",
      "type": "City"
    },
    {
      "name": "Raleigh, NC",
      "abbr": "RDU",
      "station": "KRDU",
      "type": "City"
    }
  ],
  "Great Lakes": [
    {
      "name": "Chicago, IL",
      "abbr": "CHI",
      "station": "KMDW",
      "type": "Lake/City"
    },
    {
      "name": "Detroit, MI",
      "abbr": "DET",
      "station": "KDTW",
      "type": "City"
    },
    {
      "name": "Cleveland, OH",
      "abbr": "CLE",
      "station": "KCLE",
      "type": "Lake/City"
    },
    {
      "name": "Indianapolis, IN",
      "abbr": "IND",
      "station": "KIND",
      "type": "City"
    },
    {
      "name": "Milwaukee, WI",
      "abbr": "MKE",
      "station": "KMKE",
      "type": "Lake/City"
    },
    {
      "name": "Green Bay, WI",
      "abbr": "GRB",
      "station": "KGRB",
      "type": "Lake"
    },
    {
      "name": "Buffalo, NY",
      "abbr": "BUF",
      "station": "KBUF",
      "type": "Lake"
    },
    {
      "name": "Erie, PA",
      "abbr": "ERI",
      "station": "KERI",
      "type": "Lake"
    },
    {
      "name": "Toledo, OH",
      "abbr": "TOL",
      "station": "KTOL",
      "type": "City"
    },
    {
      "name": "Grand Rapids, MI",
      "abbr": "GRR",
      "station": "KGRR",
      "type": "City"
    },
    {
      "name": "Madison, WI",
      "abbr": "MSN",
      "station": "KMSN",
      "type": "Lake/College"
    },
    {
      "name": "Traverse City, MI",
      "abbr": "TVC",
      "station": "KTVC",
      "type": "Lake"
    }
  ],
  "Great Plains": [
    {
      "name": "Kansas City, MO",
      "abbr": "KC",
      "station": "KMCI",
      "type": "City"
    },
    {
      "name": "Oklahoma City, OK",
      "abbr": "OKC",
      "station": "KOKC",
      "type": "Plains"
    },
    {
      "name": "Wichita, KS",
      "abbr": "ICT",
      "station": "KICT",
      "type": "Plains"
    },
    {
      "name": "Omaha, NE",
      "abbr": "OMA",
      "station": "KOMA",
      "type": "Plains"
    },
    {
      "name": "Amarillo, TX",
      "abbr": "AMA",
      "station": "KAMA",
      "type": "High Plains"
    },
    {
      "name": "Dodge City, KS",
      "abbr": "DDC",
      "station": "KDDC",
      "type": "High Plains"
    },
    {
      "name": "Lubbock, TX",
      "abbr": "LBB",
      "station": "KLBB",
      "type": "High Plains"
    },
    {
      "name": "Fargo, ND",
      "abbr": "FAR",
      "station": "KFAR",
      "type": "Northern Plains"
    },
    {
      "name": "Rapid City, SD",
      "abbr": "RAP",
      "station": "KRAP",
      "type": "High Plains"
    },
    {
      "name": "North Platte, NE",
      "abbr": "LBF",
      "station": "KLBF",
      "type": "Plains"
    },
    {
      "name": "Sioux Falls, SD",
      "abbr": "FSD",
      "station": "KFSD",
      "type": "Plains"
    },
    {
      "name": "Tulsa, OK",
      "abbr": "TUL",
      "station": "KTUL",
      "type": "Plains"
    }
  ],
  "Rockies": [
    {
      "name": "Denver, CO",
      "abbr": "DEN",
      "station": "KDEN",
      "type": "Mountain/City"
    },
    {
      "name": "Colorado Springs, CO",
      "abbr": "COS",
      "station": "KCOS",
      "type": "Mountain"
    },
    {
      "name": "Aspen, CO",
      "abbr": "ASE",
      "station": "KASE",
      "type": "Mountain"
    },
    {
      "name": "Vail, CO",
      "abbr": "EGE",
      "station": "KEGE",
      "type": "Mountain"
    },
    {
      "name": "Bozeman, MT",
      "abbr": "BZN",
      "station": "KBZN",
      "type": "Mountain"
    },
    {
      "name": "Missoula, MT",
      "abbr": "MSO",
      "station": "KMSO",
      "type": "Mountain"
    },
    {
      "name": "Jackson, WY",
      "abbr": "JAC",
      "station": "KJAC",
      "type": "Mountain"
    },
    {
      "name": "Salt Lake City, UT",
      "abbr": "SLC",
      "station": "KSLC",
      "type": "Mountain/City"
    },
    {
      "name": "Cheyenne, WY",
      "abbr": "CYS",
      "station": "KCYS",
      "type": "High Plains"
    },
    {
      "name": "Billings, MT",
      "abbr": "BIL",
      "station": "KBIL",
      "type": "Mountain/Plains"
    },
    {
      "name": "Flagstaff, AZ",
      "abbr": "FLG",
      "station": "KFLG",
      "type": "Mountain"
    },
    {
      "name": "Reno, NV",
      "abbr": "RNO",
      "station": "KRNO",
      "type": "Mountain/Desert"
    }
  ],
  "Southwest": [
    {
      "name": "Phoenix, AZ",
      "abbr": "PHX",
      "station": "KPHX",
      "type": "Desert"
    },
    {
      "name": "Tucson, AZ",
      "abbr": "TUS",
      "station": "KTUS",
      "type": "Desert"
    },
    {
      "name": "Santa Fe, NM",
      "abbr": "SAF",
      "station": "KSAF",
      "type": "Desert/Mountain"
    },
    {
      "name": "Albuquerque, NM",
      "abbr": "ABQ",
      "station": "KABQ",
      "type": "Desert"
    },
    {
      "name": "Las Vegas, NV",
      "abbr": "LAS",
      "station": "KLAS",
      "type": "Desert"
    },
    {
      "name": "Palm Springs, CA",
      "abbr": "PSP",
      "station": "KPSP",
      "type": "Desert"
    },
    {
      "name": "El Paso, TX",
      "abbr": "ELP",
      "station": "KELP",
      "type": "Desert"
    },
    {
      "name": "Sedona, AZ",
      "abbr": "SDX",
      "station": "KSEZ",
      "type": "Desert"
    },
    {
      "name": "Yuma, AZ",
      "abbr": "YUM",
      "station": "KYUM",
      "type": "Desert"
    },
    {
      "name": "Roswell, NM",
      "abbr": "ROW",
      "station": "KROW",
      "type": "Desert"
    },
    {
      "name": "Midland, TX",
      "abbr": "MAF",
      "station": "KMAF",
      "type": "Desert/Plains"
    },
    {
      "name": "San Angelo, TX",
      "abbr": "SJT",
      "station": "KSJT",
      "type": "Desert/Plains"
    }
  ],
  "West Coast": [
    {
      "name": "San Diego, CA",
      "abbr": "SD",
      "station": "KSAN",
      "type": "Beach"
    },
    {
      "name": "Los Angeles, CA",
      "abbr": "LA",
      "station": "KLAX",
      "type": "Coastal/City"
    },
    {
      "name": "Santa Barbara, CA",
      "abbr": "SBA",
      "station": "KSBA",
      "type": "Beach"
    },
    {
      "name": "Monterey, CA",
      "abbr": "MRY",
      "station": "KMRY",
      "type": "Coastal"
    },
    {
      "name": "San Francisco, CA",
      "abbr": "SF",
      "station": "KSFO",
      "type": "Coastal/City"
    },
    {
      "name": "Eureka, CA",
      "abbr": "EKA",
      "station": "KEKA",
      "type": "Coastal"
    },
    {
      "name": "Portland, OR",
      "abbr": "PDX",
      "station": "KPDX",
      "type": "City"
    },
    {
      "name": "Seattle, WA",
      "abbr": "SEA",
      "station": "KSEA",
      "type": "City"
    },
    {
      "name": "Spokane, WA",
      "abbr": "GEG",
      "station": "KGEG",
      "type": "Inland"
    },
    {
      "name": "Medford, OR",
      "abbr": "MFR",
      "station": "KMFR",
      "type": "Valley"
    },
    {
      "name": "Sacramento, CA",
      "abbr": "SAC",
      "station": "KSAC",
      "type": "Valley"
    },
    {
      "name": "Fresno, CA",
      "abbr": "FAT",
      "station": "KFAT",
      "type": "Valley"
    }
  ]
};

const slots = [
  "Temperature",
  "Dew Point",
  "Wind Speed",
  "Sky Cover",
  "Visibility",
  "Pressure"
];

let round = 0;
let currentWeather = null;
let currentCity = null;
let currentRegion = null;
let selectedRegion = null;
let selectedCity = null;
let build = {};
let usedSlots = new Set();
let spinning = false;
let regionRespinUsed = false;
let cityRespinUsed = false;
let canRespinCurrent = false;

const els = {
  mode: document.getElementById("mode"),
  roundNum: document.getElementById("roundNum"),
  totalRounds: document.getElementById("totalRounds"),
  slotTitle: document.getElementById("slotTitle"),
  spinBtn: document.getElementById("spinBtn"),
  spinResult: document.getElementById("spinResult"),
  weatherCard: document.getElementById("weatherCard"),
  regionName: document.getElementById("regionName"),
  cityName: document.getElementById("cityName"),
  stationLine: document.getElementById("stationLine"),
  modeBadge: document.getElementById("modeBadge"),
  attributeGrid: document.getElementById("attributeGrid"),
  draftBoard: document.getElementById("draftBoard"),
  finalTitle: document.getElementById("finalTitle"),
  copyBtn: document.getElementById("copyBtn"),
  downloadCardBtn: document.getElementById("downloadCardBtn"),
  resetBtn: document.getElementById("resetBtn"),
  regionWheel: document.getElementById("regionWheel"),
  cityWheel: document.getElementById("cityWheel"),
  regionStatus: document.getElementById("regionStatus"),
  cityStatus: document.getElementById("cityStatus"),
  rawMetar: document.getElementById("rawMetar"),
  regionRespinStatus: document.getElementById("regionRespinStatus"),
  cityRespinStatus: document.getElementById("cityRespinStatus"),
  respinRegionBtn: document.getElementById("respinRegionBtn"),
  respinCityBtn: document.getElementById("respinCityBtn"),
  currentWeatherIcon: document.getElementById("currentWeatherIcon"),
  shareCard: document.getElementById("shareCard"),
  shareCardTitle: document.getElementById("shareCardTitle"),
  shareCardGrid: document.getElementById("shareCardGrid"),
  shareMainIcon: document.getElementById("shareMainIcon"),
  finalModal: document.getElementById("finalModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  modalShareCardMount: document.getElementById("modalShareCardMount"),
  shareLinkInput: document.getElementById("shareLinkInput"),
  copyLinkBtn: document.getElementById("copyLinkBtn"),
  modalDownloadBtn: document.getElementById("modalDownloadBtn"),
  modalCopyBuildBtn: document.getElementById("modalCopyBuildBtn")
};

els.totalRounds.textContent = slots.length;

function rand(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateWheel(element, statusElement, options, finalValue, duration = 1600, label = "Spinning") {
  element.classList.remove("locked");
  element.classList.add("spinning");
  statusElement.textContent = label;

  const start = performance.now();
  let delay = 45;

  while (performance.now() - start < duration) {
    element.textContent = pick(options);
    await wait(delay);
    delay = Math.min(delay + 7, 145);
  }

  element.textContent = finalValue;
  element.classList.remove("spinning");
  element.classList.add("locked");
  statusElement.textContent = "Locked";
}

function valueCtoF(valueObj) {
  const value = valueObj && typeof valueObj === "object" ? valueObj.value : valueObj;
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return Math.round((Number(value) * 9 / 5) + 32);
}

function valueKmHToMph(valueObj) {
  const value = valueObj && typeof valueObj === "object" ? valueObj.value : valueObj;
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return Math.round(Number(value) * 0.621371);
}

function valueMtoMiles(valueObj) {
  const value = valueObj && typeof valueObj === "object" ? valueObj.value : valueObj;
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return Math.round(Number(value) * 0.000621371 * 10) / 10;
}

function valuePatoHpa(valueObj) {
  const value = valueObj && typeof valueObj === "object" ? valueObj.value : valueObj;
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return Math.round(Number(value) / 100);
}

function calcHumidity(tempC, dewC) {
  const t = tempC && typeof tempC === "object" ? tempC.value : tempC;
  const d = dewC && typeof dewC === "object" ? dewC.value : dewC;
  if (t === null || d === null || t === undefined || d === undefined || Number.isNaN(Number(t)) || Number.isNaN(Number(d))) return null;
  const rh = 100 * (Math.exp((17.625 * Number(d)) / (243.04 + Number(d))) / Math.exp((17.625 * Number(t)) / (243.04 + Number(t))));
  return Math.max(1, Math.min(100, Math.round(rh)));
}

function windDirectionText(valueObj) {
  const degrees = valueObj && typeof valueObj === "object" ? valueObj.value : valueObj;
  if (degrees === undefined || degrees === null || degrees === "" || Number.isNaN(Number(degrees))) return "Variable";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(Number(degrees) / 45) % 8];
}

function skyFromCloudLayers(layers) {
  if (!Array.isArray(layers) || layers.length === 0) return "Clear";

  const amounts = layers
    .map(layer => layer.amount || layer.cover || layer.skyCover || "")
    .map(v => String(v).toUpperCase())
    .filter(Boolean);

  if (amounts.includes("OVC")) return "Overcast";
  if (amounts.includes("BKN")) return "Mostly Cloudy";
  if (amounts.includes("SCT")) return "Partly Cloudy";
  if (amounts.includes("FEW")) return "Mostly Sunny";
  if (amounts.includes("CLR") || amounts.includes("SKC")) return "Clear";
  return amounts[0] || "Unknown";
}

function iconForSkyOrWeather(sky, weatherText = "") {
  const text = `${sky || ""} ${weatherText || ""}`.toLowerCase();
  if (text.includes("thunder")) return "⛈️";
  if (text.includes("snow") || text.includes("sleet")) return "❄️";
  if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) return "🌧️";
  if (text.includes("fog") || text.includes("mist") || text.includes("haze")) return "🌫️";
  if (text.includes("overcast")) return "☁️";
  if (text.includes("mostly cloudy")) return "🌥️";
  if (text.includes("partly")) return "⛅";
  if (text.includes("mostly sunny")) return "🌤️";
  if (text.includes("clear") || text.includes("sunny")) return "☀️";
  return "🌤️";
}

function iconForAttribute(label, item) {
  if (label === "Temperature") return "🌡️";
  if (label === "Feels Like") return "🤔";
  if (label === "Dew Point") return "💧";
  if (label === "Humidity") return "💦";
  if (label === "Wind Speed") return "💨";
  if (label === "Wind Direction") return "🧭";
  if (label === "Sky Cover") return iconForSkyOrWeather(item?.value || "");
  if (label === "Visibility") return "👁️";
  if (label === "Pressure") return "📈";
  if (label === "Sunset") return "🌅";
  return "🌤️";
}

function relativeObsAge(timestamp) {
  if (!timestamp) return "Observation age unavailable";
  const obsDate = new Date(timestamp);
  if (Number.isNaN(obsDate.getTime())) return "Observation age unavailable";

  const mins = Math.round((Date.now() - obsDate.getTime()) / 60000);
  if (mins < 0) return "Observed just now";
  if (mins < 60) return `Observed ${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `Observed ${hrs} hr ${rem} min ago` : `Observed ${hrs} hr ago`;
}

function stateFromCityName(name) {
  const parts = String(name).split(",");
  return parts.length > 1 ? parts[1].trim() : "";
}

function timezoneForCity(cityObj) {
  if (cityObj.timezone) return cityObj.timezone;

  const state = stateFromCityName(cityObj.name);
  const eastern = new Set(["ME","NH","VT","MA","RI","CT","NY","NJ","PA","DE","MD","DC","VA","NC","SC","GA","FL","OH","MI","IN"]);
  const central = new Set(["AL","MS","TN","KY","WI","IL","MO","IA","MN","LA","AR","OK","KS","NE","SD","ND","TX"]);
  const mountain = new Set(["MT","WY","CO","NM","UT","AZ"]);
  const pacific = new Set(["CA","OR","WA","NV"]);

  if (cityObj.name.includes("El Paso")) return "America/Denver";
  if (cityObj.name.includes("Reno") || cityObj.name.includes("Las Vegas")) return "America/Los_Angeles";
  if (cityObj.name.includes("Tucson") || cityObj.name.includes("Phoenix") || cityObj.name.includes("Yuma") || cityObj.name.includes("Flagstaff") || cityObj.name.includes("Sedona")) return "America/Phoenix";

  if (eastern.has(state)) return "America/New_York";
  if (central.has(state)) return "America/Chicago";
  if (mountain.has(state)) return "America/Denver";
  if (pacific.has(state)) return "America/Los_Angeles";
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
}

function dayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  return Math.floor(diff / 86400000);
}

function getTimezoneOffsetHours(timezone, date = new Date()) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const parts = Object.fromEntries(dtf.formatToParts(date).map(p => [p.type, p.value]));
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return (asUTC - date.getTime()) / 3600000;
}

function localSunsetTime(lat, lon, timezone) {
  if (lat === null || lon === null || lat === undefined || lon === undefined || Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) {
    return "Unavailable";
  }

  const now = new Date();
  const N = dayOfYear(now);
  const lngHour = Number(lon) / 15;
  const t = N + ((18 - lngHour) / 24);
  const M = (0.9856 * t) - 3.289;

  let L = M + (1.916 * Math.sin(M * Math.PI / 180)) + (0.020 * Math.sin(2 * M * Math.PI / 180)) + 282.634;
  L = ((L % 360) + 360) % 360;

  let RA = Math.atan(0.91764 * Math.tan(L * Math.PI / 180)) * 180 / Math.PI;
  RA = ((RA % 360) + 360) % 360;

  const Lquadrant  = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = RA + (Lquadrant - RAquadrant);
  RA = RA / 15;

  const sinDec = 0.39782 * Math.sin(L * Math.PI / 180);
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH = (Math.cos(90.833 * Math.PI / 180) - (sinDec * Math.sin(Number(lat) * Math.PI / 180))) / (cosDec * Math.cos(Number(lat) * Math.PI / 180));

  if (cosH > 1 || cosH < -1) return "Unavailable";

  let H = Math.acos(cosH) * 180 / Math.PI;
  H = H / 15;

  const T = H + RA - (0.06571 * t) - 6.622;
  let UT = T - lngHour;
  UT = ((UT % 24) + 24) % 24;

  const offset = getTimezoneOffsetHours(timezone, now);
  let local = UT + offset;
  local = ((local % 24) + 24) % 24;

  let hour = Math.floor(local);
  let minute = Math.round((local - hour) * 60);
  if (minute === 60) {
    hour += 1;
    minute = 0;
  }

  const displayDate = new Date();
  displayDate.setHours(hour, minute, 0, 0);

  return displayDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}


function isBrokenObservation(weather) {
  if (!weather || weather.source !== "Live NWS" || !weather.values) return true;

  const critical = ["Temperature", "Dew Point", "Wind Speed", "Sky Cover"];
  const missingCritical = critical.filter(slot => !weather.values[slot] || weather.values[slot].value === "Missing").length;

  // Automatically reject if most core values are missing.
  return missingCritical >= 2;
}

function buildCityFailureMessage(cityObj, reason = "observation unavailable") {
  return `<p><strong>${cityObj.name}</strong> was skipped because the latest observation was broken or missing.<br/>Automatic re-spin triggered. Reason: ${reason}</p>`;
}


async function fetchNwsWeather(cityObj) {
  const url = `/api/nws/${cityObj.station}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`NWS request failed: ${response.status}`);

    const payload = await response.json();
    return normalizeNwsObservation(payload, cityObj, url);
  } catch (error) {
    console.warn("Using fallback data because NWS failed:", error);
    return {
      city: cityObj,
      raw: `LIVE NWS OBSERVATION FAILED — FALLBACK DEMO DATA SHOWN\n\nStation: ${cityObj.station}\nLocal proxy URL: ${url}\nError: ${error.message}`,
      source: "Fallback demo data",
      obsAge: "Fallback data",
      values: generateFallbackWeather(cityObj)
    };
  }
}

function normalizeNwsObservation(payload, cityObj, apiUrl) {
  const props = payload.properties || {};
  const tempF = valueCtoF(props.temperature);
  const dewF = valueCtoF(props.dewpoint);
  const windMph = valueKmHToMph(props.windSpeed);
  const gustMph = valueKmHToMph(props.windGust);
  const windDir = props.windDirection?.value;
  const vis = valueMtoMiles(props.visibility);
  const pressureHpa = valuePatoHpa(props.barometricPressure);
  const humidity = props.relativeHumidity?.value !== null && props.relativeHumidity?.value !== undefined
    ? Math.round(props.relativeHumidity.value)
    : calcHumidity(props.temperature, props.dewpoint);

  const heatIndexF = valueCtoF(props.heatIndex);
  const windChillF = valueCtoF(props.windChill);

  let feelsValue = tempF;
  let feelsNote = "Actual Temp";
  if (heatIndexF !== null) {
    feelsValue = heatIndexF;
    feelsNote = "NWS Heat Index";
  } else if (windChillF !== null) {
    feelsValue = windChillF;
    feelsNote = "NWS Wind Chill";
  }

  const sky = skyFromCloudLayers(props.cloudLayers);
  const weatherText = Array.isArray(props.presentWeather) && props.presentWeather.length
    ? props.presentWeather.map(w => w.weather || w.rawString || w.intensity || "").filter(Boolean).join(", ")
    : "";

  const timezone = timezoneForCity(cityObj);
  const coords = payload.geometry?.coordinates;
  const lon = cityObj.lon ?? (Array.isArray(coords) ? coords[0] : null);
  const lat = cityObj.lat ?? (Array.isArray(coords) ? coords[1] : null);
  const sunset = localSunsetTime(lat, lon, timezone);

  const obsAge = relativeObsAge(props.timestamp);
  const windValue = windMph !== null
    ? `${windMph} mph${gustMph !== null ? ` G${gustMph}` : ""}`
    : "Missing";

  return {
    city: cityObj,
    raw: `LIVE NWS OBSERVATION LOADED\nStation: ${cityObj.station}\nObservation time: ${props.timestamp || "time unavailable"}\n${obsAge}\nAPI URL: ${apiUrl}\n\nDecoded JSON:\n${JSON.stringify(payload, null, 2)}`,
    source: "Live NWS",
    obsAge,
    values: {
      "Temperature": { value: tempF !== null ? `${tempF}°F` : "Missing", note: "Live NWS", icon: "🌡️" },
      "Feels Like": { value: feelsValue !== null ? `${feelsValue}°F` : "Missing", note: feelsNote, icon: "🤔" },
      "Dew Point": { value: dewF !== null ? `${dewF}°F` : "Missing", note: "Live NWS", icon: "💧" },
      "Humidity": { value: humidity !== null ? `${humidity}%` : "Missing", note: props.relativeHumidity?.value ? "Live NWS" : "Calculated from temp/dewpoint", icon: "💦" },
      "Wind Speed": { value: windValue, note: gustMph !== null ? "Live NWS · includes gust" : "Live NWS", icon: "💨" },
      "Wind Direction": { value: windDirectionText(windDir), note: windDir !== undefined && windDir !== null ? `${windDir}° · Live NWS` : "Live NWS", icon: "🧭" },
      "Sky Cover": { value: weatherText ? `${sky} · ${weatherText}` : sky, note: "Live NWS clouds/weather", icon: iconForSkyOrWeather(sky, weatherText) },
      "Visibility": { value: vis !== null ? `${vis} mi` : "Missing", note: "Live NWS", icon: "👁️" },
      "Pressure": { value: pressureHpa !== null ? `${pressureHpa} hPa` : "Missing", note: "Live NWS", icon: "📈" },
      "Sunset": { value: sunset, note: `Calculated local time · ${timezone.replace("America/", "")}`, icon: "🌅" }
    }
  };
}

function generateFallbackWeather(cityObj) {
  const regionalBias = {
    "Northeast": [58, 82],
    "Mid-Atlantic": [62, 88],
    "Southeast": [72, 94],
    "Great Lakes": [58, 84],
    "Great Plains": [64, 94],
    "Rockies": [48, 82],
    "Southwest": [78, 106],
    "West Coast": [58, 78]
  };

  const [lo, hi] = regionalBias[cityObj.region] || [55, 85];
  const temp = rand(lo, hi);
  const dew = rand(Math.max(20, temp - 42), Math.min(temp - 4, 76));
  const humidity = Math.max(15, Math.min(96, rand(35, 90) - Math.round((temp - dew) * 1.2)));
  const wind = rand(0, 22);
  const gust = wind > 8 ? wind + rand(5, 18) : null;
  const pressure = rand(990, 1030);
  const visibility = wind > 18 ? rand(7, 10) : 10;
  const sunset = localSunsetTime(40, -75, timezoneForCity(cityObj));
  const sky = pick(["Sunny", "Mostly Sunny", "Partly Cloudy", "Mostly Cloudy", "Overcast", "Light Rain", "Clear"]);

  return {
    "Temperature": { value: `${temp}°F`, detail: `Feels like ${temp}°F · Actual Temp`, note: "Fallback demo data", icon: "🌡️" },
    "Dew Point": { value: `${dew}°F`, detail: `RH ${humidity}%`, note: "Calculated fallback", icon: "💧" },
    "Wind Speed": { value: `${wind} mph${gust !== null ? ` G${gust}` : ""}`, note: gust !== null ? "Fallback · includes gust" : "Fallback demo data", icon: "💨" },
    "Wind Direction": { value: pick(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]), note: "Fallback demo data", icon: "🧭" },
    "Sky Cover": { value: sky, note: "Fallback demo data", icon: iconForSkyOrWeather(sky) },
    "Visibility": { value: `${visibility} mi`, note: "Fallback demo data", icon: "👁️" },
    "Pressure": { value: `${pressure} hPa`, note: "Fallback demo data", icon: "📈" }
  };
}


function buildSharePayload() {
  return { mode: els.mode.value, createdAt: new Date().toISOString(), build };
}
function encodeSharePayload(payload) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))); } catch { return ""; }
}
function makeShareLink() {
  const payload = encodeSharePayload(buildSharePayload());
  const cleanUrl = window.location.href.split("#")[0];
  return payload ? `${cleanUrl}#build=${payload}` : cleanUrl;
}
function hydrateBuildFromHash() {
  const hash = window.location.hash || "";
  if (!hash.startsWith("#build=")) return;
  try {
    const encoded = hash.replace("#build=", "");
    const payload = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    if (payload && payload.build) {
      build = payload.build;
      usedSlots = new Set(Object.keys(build));
      round = Object.keys(build).length;
      if (payload.mode) els.mode.value = payload.mode;
      renderBoard();
      updateRoundText();
      if (slots.every(slot => build[slot])) openFinalModal();
    }
  } catch (error) { console.warn("Could not load shared build:", error); }
}
function openFinalModal() {
  renderShareCard();
  if (!els.finalModal) return;
  els.modalShareCardMount.innerHTML = "";
  const clone = els.shareCard.cloneNode(true);
  clone.classList.remove("hidden-share");
  els.modalShareCardMount.appendChild(clone);
  if (els.shareLinkInput) els.shareLinkInput.value = makeShareLink();
  els.finalModal.classList.remove("hidden-modal");
}
function closeFinalModal() {
  if (els.finalModal) els.finalModal.classList.add("hidden-modal");
}


function makePlayableValues(values) {
  const output = {};

  if (values["Temperature"]) {
    const temp = { ...values["Temperature"] };
    const feels = values["Feels Like"];
    if (feels && feels.value && feels.value !== "Missing") {
      temp.detail = `Feels like ${feels.value}${feels.note ? ` · ${feels.note}` : ""}`;
    }
    output["Temperature"] = temp;
  }

  if (values["Dew Point"]) {
    const dew = { ...values["Dew Point"] };
    const humidity = values["Humidity"];
    if (humidity && humidity.value && humidity.value !== "Missing") {
      dew.detail = `RH ${humidity.value}`;
    }
    output["Dew Point"] = dew;
  }

  ["Wind Speed", "Sky Cover", "Visibility", "Pressure"].forEach(key => {
    if (values[key]) output[key] = values[key];
  });

  return output;
}

function numericValue(text) {
  const match = String(text || "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function scoreRange(value, bands, fallback = 0) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return fallback;
  for (const band of bands) {
    if (value >= band.min && value <= band.max) return band.points;
  }
  return fallback;
}

function scoreSky(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("thunder") || text.includes("rain") || text.includes("snow") || text.includes("fog") || text.includes("mist") || text.includes("haze")) return 0;
  if (text.includes("clear") || text.includes("sunny")) return 15;
  if (text.includes("few")) return 14;
  if (text.includes("mostly sunny")) return 13;
  if (text.includes("partly")) return 11;
  if (text.includes("mostly cloudy") || text.includes("broken")) return 7;
  if (text.includes("overcast")) return 2;
  return 8;
}

function scoreVisibility(value) {
  const text = String(value || "").toLowerCase();
  const vis = numericValue(text);
  if (text.includes("+") || vis >= 10) return 15;
  return scoreRange(vis, [
    { min: 8, max: 9.99, points: 13 },
    { min: 6, max: 7.99, points: 10 },
    { min: 4, max: 5.99, points: 6 },
    { min: 2, max: 3.99, points: 3 },
    { min: 0, max: 1.99, points: 0 }
  ]);
}

function calculateEverydayScore() {
  const breakdown = {};

  const temp = numericValue(build["Temperature"]?.value);
  breakdown["Temperature"] = scoreRange(temp, [
    { min: 70, max: 72, points: 20 },
    { min: 68, max: 74, points: 18 },
    { min: 65, max: 77, points: 15 },
    { min: 60, max: 82, points: 10 },
    { min: 55, max: 87, points: 5 }
  ]);

  const dew = numericValue(build["Dew Point"]?.value);
  breakdown["Dew Point"] = scoreRange(dew, [
    { min: 53, max: 55, points: 20 },
    { min: 50, max: 58, points: 18 },
    { min: 47, max: 61, points: 15 },
    { min: 44, max: 64, points: 10 },
    { min: 40, max: 68, points: 5 }
  ]);

  const wind = numericValue(build["Wind Speed"]?.value);
  breakdown["Wind Speed"] = scoreRange(wind, [
    { min: 5, max: 8, points: 20 },
    { min: 3, max: 10, points: 18 },
    { min: 1, max: 13, points: 15 },
    { min: 14, max: 18, points: 10 },
    { min: 19, max: 25, points: 5 }
  ]);

  breakdown["Sky Cover"] = scoreSky(build["Sky Cover"]?.value);
  breakdown["Visibility"] = scoreVisibility(build["Visibility"]?.value);

  const pressure = numericValue(build["Pressure"]?.value);
  breakdown["Pressure"] = scoreRange(pressure, [
    { min: 1012, max: 1014, points: 10 },
    { min: 1010, max: 1016, points: 8 },
    { min: 1008, max: 1018, points: 6 },
    { min: 1005, max: 1021, points: 3 }
  ]);

  const total = Object.values(breakdown).reduce((sum, points) => sum + points, 0);

  let tier = "Rough Day";
  if (total >= 95) tier = "Perfect Day";
  else if (total >= 90) tier = "Elite";
  else if (total >= 80) tier = "Great";
  else if (total >= 70) tier = "Solid";
  else if (total >= 60) tier = "Meh";

  return { total, tier, breakdown };
}



function renderBoard() {
  els.draftBoard.innerHTML = "";
  slots.forEach(slot => {
    const item = build[slot];
    const div = document.createElement("div");
    div.className = "draft-slot" + (item ? " complete" : "");

    div.innerHTML = `
      <span class="slot">${item ? item.icon : ""} ${slot}</span>
      <span class="pick">
        ${item ? item.value : "—"}
        ${item && item.detail ? `<span class="source">${item.detail}</span>` : ""}
        ${item ? `<span class="source">${item.abbr} · ${item.station}</span>` : ""}
        ${item ? `<span class="source">${item.note}</span>` : ""}
      </span>
    `;
    els.draftBoard.appendChild(div);
  });

  els.finalTitle.textContent = `${els.mode.value} Build`;
  renderShareCard();
}

function renderShareCard() {
  const complete = slots.every(slot => build[slot]);
  if (!complete) {
    els.shareCard.classList.add("hidden-share");
    return;
  }
  els.shareCard.classList.remove("hidden-share");
  els.shareCardTitle.textContent = `${els.mode.value} Build`;
  els.shareCardGrid.innerHTML = "";

  const skyItem = build["Sky Cover"];
  els.shareMainIcon.textContent = skyItem ? (skyItem.icon || iconForSkyOrWeather(skyItem.value)) : "🌤️";

  const score = calculateEverydayScore();
  const scoreBlock = document.createElement("div");
  scoreBlock.className = "score-block";
  scoreBlock.innerHTML = `
    <div class="score-main">${score.total}<span>/100</span></div>
    <div>
      <div class="score-tier">${score.tier}</div>
      <div class="score-sub">Everyday Score</div>
    </div>
  `;
  els.shareCardGrid.appendChild(scoreBlock);

  slots.forEach(slot => {
    const item = build[slot];
    const row = document.createElement("div");
    row.className = "share-card-item";
    row.innerHTML = `
      <div>${item ? item.icon : iconForAttribute(slot, item)}</div>
      <div>
        <div class="share-label">${slot}</div>
        <div class="share-value">${item ? item.value : "—"}</div>
        ${item && item.detail ? `<div class="share-detail">${item.detail}</div>` : ""}
      </div>
      <div class="share-source">${item ? `${item.abbr} · ${item.station}` : ""}</div>
    `;
    els.shareCardGrid.appendChild(row);
  });
}

function updateRespinUI() {
  els.regionRespinStatus.textContent = regionRespinUsed ? "Used" : "Available";
  els.cityRespinStatus.textContent = cityRespinUsed ? "Used" : "Available";

  els.respinRegionBtn.disabled = spinning || !canRespinCurrent || regionRespinUsed || round >= slots.length || !selectedRegion;
  els.respinCityBtn.disabled = spinning || !canRespinCurrent || cityRespinUsed || round >= slots.length || !selectedCity;

  els.respinRegionBtn.textContent = regionRespinUsed ? "Region Re-spin Used" : "Re-spin Region";
  els.respinCityBtn.textContent = cityRespinUsed ? "City Re-spin Used" : "Re-spin City";
}

function updateRoundText() {
  els.roundNum.textContent = Math.min(round + 1, slots.length);
  els.slotTitle.textContent = round < slots.length ? "Draft any available attribute" : "Your Perfect Day is complete";
  els.spinBtn.disabled = round >= slots.length || spinning || canRespinCurrent;
  els.spinBtn.textContent = round >= slots.length ? "Complete" : spinning ? "Spinning..." : "Spin";
  updateRespinUI();
}

async function runSelection(region, city, options = {}) {
  const attempted = options.attempted || new Set();
  const maxAttempts = options.maxAttempts || 8;

  selectedRegion = region;
  selectedCity = city;
  currentRegion = region;

  els.spinResult.innerHTML = `<p>Loading live NWS observation from <strong>${city.station}</strong>...</p>`;
  currentCity = {...city, region};
  currentWeather = await fetchNwsWeather(currentCity);
  currentWeather.values = makePlayableValues(currentWeather.values);

  const attemptKey = `${region}:${city.name}`;
  attempted.add(attemptKey);

  if (isBrokenObservation(currentWeather) && attempted.size < maxAttempts) {
    els.weatherCard.classList.add("hidden");
    els.spinResult.innerHTML = buildCityFailureMessage(city, currentWeather.source || "missing data");

    await wait(850);

    const cityPool = cityData[region].filter(c => !attempted.has(`${region}:${c.name}`));
    let nextRegion = region;
    let nextCity;

    if (cityPool.length > 0) {
      nextCity = pick(cityPool);
      await animateWheel(
        els.cityWheel,
        els.cityStatus,
        cityData[region].map(c => c.name),
        nextCity.name,
        1100,
        "Auto re-spinning city"
      );
    } else {
      const availableRegions = Object.keys(cityData).filter(r =>
        cityData[r].some(c => !attempted.has(`${r}:${c.name}`))
      );
      nextRegion = availableRegions.length ? pick(availableRegions) : pick(Object.keys(cityData));
      nextCity = pick(cityData[nextRegion]);

      await animateWheel(
        els.regionWheel,
        els.regionStatus,
        Object.keys(cityData),
        nextRegion,
        1100,
        "Auto re-spinning region"
      );

      await wait(250);

      await animateWheel(
        els.cityWheel,
        els.cityStatus,
        cityData[nextRegion].map(c => c.name),
        nextCity.name,
        1100,
        "Auto re-spinning city"
      );
    }

    return runSelection(nextRegion, nextCity, { attempted, maxAttempts });
  }

  if (isBrokenObservation(currentWeather)) {
    els.spinResult.innerHTML = `<p><strong>Warning:</strong> Several observations failed. Showing the best available card.</p>`;
  } else {
    els.spinResult.innerHTML = `<p>🎡 Region: <strong>${region}</strong><br/>📍 City: <strong>${city.name}</strong><br/>🛫 Station: <strong>${city.station}</strong></p>`;
  }

  els.weatherCard.classList.remove("hidden");
  els.regionName.textContent = region;
  els.cityName.textContent = city.name;
  els.stationLine.innerHTML = `${city.abbr} · ${city.station} · <span class="source ${currentWeather.source === "Live NWS" ? "live" : "fallback"}">${currentWeather.source}</span><div class="observation-age">${currentWeather.obsAge || ""}</div>`;
  els.modeBadge.textContent = els.mode.value;
  els.rawMetar.textContent = currentWeather.raw;

  const skyValue = currentWeather.values["Sky Cover"]?.value || "";
  els.currentWeatherIcon.textContent = currentWeather.values["Sky Cover"]?.icon || iconForSkyOrWeather(skyValue);

  canRespinCurrent = true;
  renderAttributes();
}

async function spin() {
  if (round >= slots.length || spinning || canRespinCurrent) return;

  spinning = true;
  canRespinCurrent = false;
  updateRoundText();

  els.weatherCard.classList.add("hidden");
  els.spinResult.classList.remove("empty");
  els.spinResult.innerHTML = `<p>The wheels are spinning...</p>`;

  els.regionWheel.classList.remove("locked");
  els.cityWheel.classList.remove("locked");
  els.cityWheel.textContent = "—";
  els.cityStatus.textContent = "Waiting";

  const regionOptions = Object.keys(cityData);
  const region = pick(regionOptions);

  await animateWheel(els.regionWheel, els.regionStatus, regionOptions, region, 1500, "Spinning region");

  await wait(350);

  const cityOptions = cityData[region];
  const city = pick(cityOptions);

  await animateWheel(
    els.cityWheel,
    els.cityStatus,
    cityOptions.map(c => c.name),
    city.name,
    1700,
    "Spinning city"
  );

  await runSelection(region, city);

  spinning = false;
  updateRoundText();
}

async function respinRegion() {
  if (spinning || regionRespinUsed || !canRespinCurrent || round >= slots.length) return;

  regionRespinUsed = true;
  spinning = true;
  updateRoundText();

  els.weatherCard.classList.add("hidden");
  els.spinResult.innerHTML = `<p>Using your one region re-spin...</p>`;

  const regionOptions = Object.keys(cityData).filter(r => r !== selectedRegion);
  const region = pick(regionOptions);
  await animateWheel(els.regionWheel, els.regionStatus, Object.keys(cityData), region, 1500, "Re-spinning region");

  await wait(350);

  const cityOptions = cityData[region];
  const city = pick(cityOptions);
  await animateWheel(
    els.cityWheel,
    els.cityStatus,
    cityOptions.map(c => c.name),
    city.name,
    1500,
    "Spinning new city"
  );

  await runSelection(region, city);

  spinning = false;
  updateRoundText();
}

async function respinCity() {
  if (spinning || cityRespinUsed || !canRespinCurrent || !selectedRegion || round >= slots.length) return;

  cityRespinUsed = true;
  spinning = true;
  updateRoundText();

  els.weatherCard.classList.add("hidden");
  els.spinResult.innerHTML = `<p>Using your one city re-spin...</p>`;

  const cityOptions = cityData[selectedRegion].filter(c => c.name !== selectedCity.name);
  const city = pick(cityOptions.length ? cityOptions : cityData[selectedRegion]);
  await animateWheel(
    els.cityWheel,
    els.cityStatus,
    cityData[selectedRegion].map(c => c.name),
    city.name,
    1600,
    "Re-spinning city"
  );

  await runSelection(selectedRegion, city);

  spinning = false;
  updateRoundText();
}

function renderAttributes() {
  els.attributeGrid.innerHTML = "";
  Object.entries(currentWeather.values).forEach(([label, item]) => {
    const div = document.createElement("div");
    const alreadyUsed = usedSlots.has(label);
    const missing = item.value === "Missing";
    div.className = "attribute" + (alreadyUsed ? " locked-out" : "") + ((alreadyUsed || missing) ? " disabled" : "");

    const noteClass = item.note && (item.note.toLowerCase().includes("calculated") || item.note.toLowerCase().includes("actual"))
      ? "calculated"
      : (currentWeather.source === "Live NWS" ? "live" : "fallback");

    const icon = item.icon || iconForAttribute(label, item);

    div.innerHTML = `
      <div class="label">${label}</div>
      <div class="icon-line">
        <span class="attr-icon">${icon}</span>
        <span class="value">${item.value}</span>
      </div>
      ${item.detail ? `<div class="combo-detail">${item.detail}</div>` : ""}
      <div class="source ${noteClass}">${currentCity.abbr} · ${currentCity.station}</div>
      <div class="note">${item.note || ""}</div>
    `;

    if (!alreadyUsed && !missing) {
      div.addEventListener("click", () => draft(label, item));
    }

    els.attributeGrid.appendChild(div);
  });
}

function draft(label, item) {
  if (usedSlots.has(label) || round >= slots.length || spinning) return;

  build[label] = {
    value: item.value,
    note: item.note,
    detail: item.detail,
    icon: item.icon || iconForAttribute(label, item),
    abbr: currentCity.abbr,
    city: currentCity.name,
    station: currentCity.station,
    obsAge: currentWeather.obsAge
  };
  usedSlots.add(label);
  round++;

  canRespinCurrent = false;
  selectedRegion = null;
  selectedCity = null;

  renderBoard();
  updateRoundText();

  els.weatherCard.classList.add("hidden");
  if (round >= slots.length) {
    els.spinResult.innerHTML = `<p><strong>Perfect Day complete.</strong><br/>Your final card is ready.</p>`;
    openFinalModal();
  } else {
    els.spinResult.innerHTML = `<p>Drafted <strong>${label}: ${item.value} · ${currentCity.abbr}</strong>.<br/>Spin again for the next round.</p>`;
  }

  els.regionWheel.textContent = "—";
  els.cityWheel.textContent = "—";
  els.regionWheel.classList.remove("locked");
  els.cityWheel.classList.remove("locked");
  els.regionStatus.textContent = "Waiting";
  els.cityStatus.textContent = "Waiting";
}

function copyBuild() {
  const score = slots.every(slot => build[slot]) ? calculateEverydayScore() : null;
  const lines = [`${els.mode.value}: My Perfect Day`];
  if (score) lines.push(`Score: ${score.total}/100 — ${score.tier}`);
  slots.forEach(slot => {
    const item = build[slot];
    lines.push(item ? `${item.icon || ""} ${slot}: ${item.value}${item.detail ? ` (${item.detail})` : ""} · ${item.abbr} (${item.station}) — ${item.note}` : `${slot}: —`);
  });

  navigator.clipboard.writeText(lines.join("\n")).then(() => {
    els.copyBtn.textContent = "Copied!";
    setTimeout(() => els.copyBtn.textContent = "Copy Build", 1200);
  }).catch(() => {
    alert(lines.join("\n"));
  });
}

async function downloadShareCard() {
  const complete = slots.every(slot => build[slot]);
  if (!complete) {
    alert("Finish all picks before downloading your final card.");
    return;
  }

  const scale = 2;
  const width = 900;
  const height = 1180;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const radius = 36;

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawText(text, x, y, opts = {}) {
    ctx.fillStyle = opts.color || "#122033";
    ctx.font = `${opts.weight || 800} ${opts.size || 24}px ${opts.family || "Arial, sans-serif"}`;
    ctx.textAlign = opts.align || "left";
    ctx.textBaseline = opts.baseline || "alphabetic";
    ctx.fillText(text, x, y);
  }

  function wrapText(text, x, y, maxWidth, lineHeight, opts = {}) {
    const words = String(text || "").split(" ");
    let line = "";
    let currentY = y;
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        drawText(line, x, currentY, opts);
        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) drawText(line, x, currentY, opts);
    return currentY;
  }

  // Background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#f8fbff");
  bg.addColorStop(1, "#dcefff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Soft sun circle
  ctx.beginPath();
  ctx.arc(765, 115, 150, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 220, 120, 0.65)";
  ctx.fill();

  // Main card
  ctx.shadowColor = "rgba(20, 45, 80, 0.18)";
  ctx.shadowBlur = 38;
  ctx.shadowOffsetY = 18;
  roundRect(60, 60, width - 120, height - 120, radius);
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Header
  drawText("PERFECT DAY", 100, 125, { size: 22, weight: 950, color: "#164eb8" });
  drawText(`${els.mode.value} Build`, 100, 180, { size: 46, weight: 950 });

  const skyItem = build["Sky Cover"];
  const mainIcon = skyItem ? (skyItem.icon || iconForSkyOrWeather(skyItem.value)) : "🌤️";
  drawText(mainIcon, 740, 165, { size: 70, weight: 900, align: "center" });

  // Divider
  ctx.strokeStyle = "#dbe6f3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 218);
  ctx.lineTo(800, 218);
  ctx.stroke();

  const score = calculateEverydayScore();
  roundRect(100, 245, 700, 105, 24);
  ctx.fillStyle = "#eaf2ff";
  ctx.fill();
  drawText(`${score.total}`, 145, 315, { size: 58, weight: 950, color: "#164eb8" });
  drawText("/100", 228, 315, { size: 26, weight: 950, color: "#164eb8" });
  drawText(score.tier.toUpperCase(), 330, 292, { size: 25, weight: 950, color: "#122033" });
  drawText("Everyday Score", 330, 322, { size: 18, weight: 850, color: "#68768a" });

  // Rows
  let y = 275;
  const rowH = 112;
  slots.forEach((slot, index) => {
    const item = build[slot];
    const x = index % 2 === 0 ? 100 : 462;
    const rowY = 385 + Math.floor(index / 2) * rowH;

    roundRect(x, rowY, 338, 88, 20);
    ctx.fillStyle = "#f5f9ff";
    ctx.fill();
    ctx.strokeStyle = "#dbe6f3";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawText(item?.icon || iconForAttribute(slot, item), x + 22, rowY + 52, { size: 30 });
    drawText(slot.toUpperCase(), x + 66, rowY + 30, { size: 14, weight: 950, color: "#68768a" });
    drawText(item?.value || "—", x + 66, rowY + 58, { size: 25, weight: 950 });
    if (item?.detail) {
      drawText(item.detail, x + 66, rowY + 78, { size: 13, weight: 800, color: "#68768a" });
    }
    drawText(item ? `${item.abbr} · ${item.station}` : "", x + 316, rowY + 58, { size: 13, weight: 950, color: "#164eb8", align: "right" });
  });

  const footerY = 1030;
  ctx.strokeStyle = "#dbe6f3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, footerY - 35);
  ctx.lineTo(800, footerY - 35);
  ctx.stroke();

  drawText("Built from live NWS airport observations", 450, footerY, { size: 19, weight: 850, color: "#68768a", align: "center" });
  drawText("perfect-day", 450, footerY + 38, { size: 18, weight: 950, color: "#276ef1", align: "center" });

  canvas.toBlob(async (blob) => {
    if (!blob) {
      alert("Could not create image. Try taking a screenshot instead.");
      return;
    }

    const file = new File([blob], "perfect-day-card.png", { type: "image/png" });

    // On phones, this opens the native share sheet, which can save to Photos/Camera Roll.
    if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
      try {
        await navigator.share({
          files: [file],
          title: "My Perfect Day",
          text: "Check out my Perfect Day weather draft."
        });
        return;
      } catch (error) {
        // If user cancels share, fall through to download.
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "perfect-day-card.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

function reset() {
  round = 0;
  currentWeather = null;
  currentCity = null;
  currentRegion = null;
  selectedRegion = null;
  selectedCity = null;
  build = {};
  usedSlots = new Set();
  spinning = false;
  regionRespinUsed = false;
  cityRespinUsed = false;
  canRespinCurrent = false;

  els.weatherCard.classList.add("hidden");
  els.spinResult.classList.add("empty");
  els.spinResult.innerHTML = `<p>Spin the region and city wheels to reveal a live weather card.</p>`;

  els.regionWheel.textContent = "—";
  els.cityWheel.textContent = "—";
  els.regionWheel.classList.remove("locked", "spinning");
  els.cityWheel.classList.remove("locked", "spinning");
  els.regionStatus.textContent = "Waiting";
  els.cityStatus.textContent = "Waiting";
  els.rawMetar.textContent = "No observation loaded yet.";
  els.currentWeatherIcon.textContent = "☀️";
  closeFinalModal();
  if (window.location.hash.startsWith("#build=")) {
    history.replaceState(null, "", window.location.href.split("#")[0]);
  }

  renderBoard();
  updateRoundText();
}

els.spinBtn.addEventListener("click", spin);
els.respinRegionBtn.addEventListener("click", respinRegion);
els.respinCityBtn.addEventListener("click", respinCity);
els.copyBtn.addEventListener("click", copyBuild);
els.downloadCardBtn.addEventListener("click", downloadShareCard);
if (els.closeModalBtn) els.closeModalBtn.addEventListener("click", closeFinalModal);
if (els.modalDownloadBtn) els.modalDownloadBtn.addEventListener("click", downloadShareCard);
if (els.modalCopyBuildBtn) els.modalCopyBuildBtn.addEventListener("click", copyBuild);
if (els.copyLinkBtn) els.copyLinkBtn.addEventListener("click", () => {
  const link = makeShareLink();
  if (els.shareLinkInput) els.shareLinkInput.value = link;
  navigator.clipboard.writeText(link).then(() => {
    els.copyLinkBtn.textContent = "Copied!";
    setTimeout(() => els.copyLinkBtn.textContent = "Copy Link", 1200);
  });
});
els.resetBtn.addEventListener("click", reset);
els.mode.addEventListener("change", () => {
  els.modeBadge.textContent = els.mode.value;
  renderBoard();
});

renderBoard();
updateRoundText();
hydrateBuildFromHash();
