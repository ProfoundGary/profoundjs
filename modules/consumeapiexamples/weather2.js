function weather(city,result,resultDS){
   pjs.define("city", { type: 'char', length: 50, refParm: city })
   pjs.define("result", { type: 'char', length: 50, refParm: result })
  pjs.define("resultDS", { type: 'data structure', qualified: true, elements: {
      "temp": { type: 'char', length: 50 },
      "feels_like": { type: 'char', length:50},
      "humidity": {type: 'char',length: 50}
    }, refParm: resultDS})

  var _data = pjs.httpRequest({
    method: "GET",
    uri: `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=5a91aab869e6a728330050260c99e999&q=` + city,
    json: true
  });
  
  result = _data.weather[0].description + ", " + _data.main.temp + " degrees, wind is " + _data.wind.speed + " mph";

  for(let prop in _data.main) {
    try {
      pjs.set("resultDS."+prop, jsonObj[prop])
    }
    catch(err) {}
  }

  resultDS.descript = _data.weather[0].description;
  resultDS.temp = _data.main.temp;
  resultDS.feelslike = _data.main.feels_like;
  resultDS.windspeed = _data.wind.speed + " mph";
}

exports.run = weather

exports.parms = [
  { type: 'char', length: 50 },
  { type: 'char', length: 50 },
  { type: 'data structure', elements: {
       "temp": { type: 'char', length: 50 },
      "feels_like": { type: 'char', length:50},
      "humidity": {type: 'char',length: 50}
    }}
]