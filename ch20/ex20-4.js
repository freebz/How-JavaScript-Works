// Parseq

parseq.sequence(
  requestor_array,
  milliseconds
)

parseq.parallel(
  required_array,
  optional_array,
  milliseconds,
  time_option,
  throttle
)

parseq.fallback(
  requestor_array,
  milliseconds
)

parseq.race(
  requestor_array,
  milliseconds,
  throttle
)



let getWeather = parseq.fallback([
  fetch("weather", localCache),
  fetch("weather", localDB),
  fetch("weather", remoteDB)
]);

let getAds = parseq.race([
  getAd(adnet.klikHaus),
  getAd(adnet.inUFace),
  getAd(adnet.trackPipe)
]);

let getNav = parseq.sequence([
  getUserRecord,
  getPreference,
  getCustomNav
]);

let getStuff = parseq.parallel(
  [getNav, getAds, getMessageOfTheDay],
  [getWeather, getHoroscope, getGossip],
  500,
  true
);
