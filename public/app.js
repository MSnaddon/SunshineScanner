var map;

var getScanArea = function(latlon, range){
  // generate array of left,top,right,bottom for scanning box
  scanBox = [
  latlon.lon-range,
  latlon.lat+range,
  latlon.lon+range,
  latlon.lat-range
  ]
  
  return scanBox
}

// called upon generating a new clear-sky map
var generateNewReport = function(latlon, range){
  console.log("generateNewReport invoked")
  // build URL
  var key = "7225d2a55f7cd772384dbba91030c84a";
  var boxCoords = getScanArea(latlon, range).join(",");
  console.log(boxCoords)
  var url = "http://api.openweathermap.org/data/2.5/box/city?bbox=" + boxCoords + ",20&cluster=yes&appid=" + key
  console.log("request url", url)

  //http://api.openweathermap.org/data/2.5/box/city?bbox=12,32,15,37,10&cluster=yes&appid=b1b15e88fa797225412429c1c50c122a1

  // make request to API
  makeSunnyRequest(url, getNearestSunshine)

  // OLD KEY
  // var url = "http://api.openweathermap.org/data/2.5/find?lat=" + latlon.lat + "&lon=" + latlon.lon + "&cnt=" + cityCount + "&APPID=" + key;
}

// api request info
var makeSunnyRequest = function(url, callback){
  console.log("makeRequest invoked")
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
}

// parse the information from request into data arrays
var getNearestSunshine = function(){
  console.log("getNearestSunshine invoked", "status: " + this.status)
  if (this.status !== 200) return;
  var jsonString = this.responseText;
  var cities = JSON.parse(jsonString);
  console.log(cities)

  // filter out for sunny cities
  var sunnyCities = cities.list.filter(function(city){
    return city.weather[0].id === 800;
  })
  publishWeatherReport(sunnyCities);
}

// present information on app page
var publishWeatherReport = function(citiesArray){
  // get weather report element
  var reportList = document.querySelector("#weather-report");

  //check for sunny locations
  if (citiesArray.length !== 0){
    // add cities to report
    for (var i = 0; i<citiesArray.length; i++){
      addWeatherReport( reportList, citiesArray[i] );
      addMapMarker(citiesArray[i].coord)
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


var addMapMarker = function(latlon, label){
  var latLng = {lat: latlon.lat, lng: latlon.lon}
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    label: label
  })
  console.log(latLng)
}




var onPageLoad = function(){
  // make map
   map = new google.maps.Map(document.getElementById('gmap'), {
     // center: {lat: 0, lng: 0},
     zoom: 7
   });

  //get users current position
  if ("geolocation" in navigator){
    // update report on page for current location.
    navigator.geolocation.getCurrentPosition(function(position) {
      var currentLatLon = {
        lat: position.coords.latitude, 
        lon: position.coords.longitude
      }; 
      
      // pittsburgh america test
      // currentLatLon={lat:40, lon:-80}

      map.setCenter({lat: currentLatLon.lat, lng: currentLatLon.lon})

      addMapMarker(currentLatLon, "1")
      generateNewReport(currentLatLon, 1.5);
    });
  }

  }

window.onload = onPageLoad;






// DEPRECATED CODE

// var generateNewReport = function(latlon, cityCount){
//   console.log("generateNewReport invoked")
//   // build URL
//   var key = "7225d2a55f7cd772384dbba91030c84a";
//   var url = "http://api.openweathermap.org/data/2.5/find?lat=" + latlon.lat + "&lon=" + latlon.lon + "&cnt=" + cityCount + "&APPID=" + key;
//   // make request to API
//   makeSunnyRequest(url, getNearestSunshine)
// }