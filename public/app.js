

var generateNewReport = function(latlon, cityCount){
  console.log("generateNewReport invoked")
  // build URL
  var key = "7225d2a55f7cd772384dbba91030c84a";
  var url = "http://api.openweathermap.org/data/2.5/find?lat=" + latlon.lat + "&lon=" + latlon.lon + "&cnt=" + cityCount + "&APPID=" + key;
  // make request to API
  makeSunnyRequest(url, getNearestSunshine)
}

var makeSunnyRequest = function(url, callback){
  console.log("makeRequest invoked")
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
}

var getNearestSunshine = function(){
  console.log("getNearestSunshine invoked", "status: " + this.status)
  if (this.status !== 200) return;
  var jsonString = this.responseText;
  var cities = JSON.parse(jsonString);

  // filter out for sunny cities
  var sunnyCities = cities.list.filter(function(city){
    return city.weather[0].id === 800;
  })
  publishWeatherReport(sunnyCities);
}


var publishWeatherReport = function(citiesArray){
  // get weather report element
  var reportList = document.querySelector("#weather-report");

  //check for sunny locations
  if (citiesArray.length !== 0){
    // add cities to report
    for (var i = 0; i<citiesArray.length; i++){
      addWeatherReport( reportList, citiesArray[i] );
    }

  } else {
    console.log("no sun");
  }
}


var addWeatherReport = function(parent, cityObject){
  console.log(cityObject.weather)
  var weatherBlock = document.createElement('p')
  weatherBlock.innerText = cityObject.name + " weather is " +cityObject.weather[0].description
  parent.appendChild(weatherBlock)
}



// eaxmple request of latlng
//http://api.openweathermap.org/data/2.5/find?lat=55.5&lon=37.5&cnt=40&APPID=7225d2a55f7cd772384dbba91030c84a
// in string concatination->
// "http://api.openweathermap.org/data/2.5/find?lat=" + 
// lat +
// "&lon=" +
// lng +
// "&cnt=
// count +
// "&APPID=7225d2a55f7cd772384dbba91030c84a"



var onPageLoad = function(){
  //get users current position
  if ("geolocation" in navigator){
    // update report on page for current location.
    navigator.geolocation.getCurrentPosition(function(position) {
      var currentLatLon = {
        lat: position.coords.latitude, 
        lon: position.coords.longitude
      };
      
      generateNewReport(currentLatLon, 50) 
    });
  } else {
  }


  // this works, temporary disable to enable mapping
  


}






















window.onload = onPageLoad;