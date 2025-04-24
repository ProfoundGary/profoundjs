function weather(city,result){
   pjs.define("city", { type: 'char', length: 50, refParm: city })
   pjs.define("result", { type: 'char', length: 50, refParm: result })

  let _data = pjs.httpRequest({
    method: "GET",
    uri: `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=5a91aab869e6a728330050260c99e999&q=` + city,
    json: true
  });
  
  result = _data.weather[0].description + ", " + _data.main.temp + " degrees, wind is " + _data.wind.speed + " mph"
}

exports.run = weather

exports.parms = [
  { type: 'char', length: 50 },
  { type: 'char', length: 50 }
]