var map;
var currentLatLon;


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
  // console.log("getNearestSunshine invoked", "status: " + this.status)
  if (this.status !== 200) return;
  var jsonString = this.responseText;
  var cities = JSON.parse(jsonString);

  // filter out for sunny cities
  var sunnyCities = cities.list.filter(function(city){
    return city.weather[0].id === 800;
  })
  publishWeatherReport(sunnyCities);
  // do something will not quite sunny weather?
}


var distanceCalc = function(lat, lon){
  var latDif = Math.abs(currentLatLon.lat - lat);
  var lonDif = Math.abs(currentLatLon.lon - lon);
  var distance = Math.sqrt(Math.pow(latDif,2) + Math.pow(lonDif,2));
  console.log("distance calculated:", distance);
  return distance;
}

var sortByDistance = function(citiesArray){
  citiesArray.forEach(function(item){
    item.distance=distanceCalc(item.coord.lat, item.coord.lon);
  })
  console.log(citiesArray[0], citiesArray[1]);
  citiesArray.sort(function(itemA, itemB){
    return itemA.distance-itemB.distance;
  })
  return citiesArray;
}

// present information on app page
var publishWeatherReport = function(citiesArray){

  citiesArray = sortByDistance(citiesArray);

  // get weather report element
  var reportList = document.querySelector("#weather-report");
  //check for sunny locations
  if (citiesArray.length !== 0){
    // add cities to report
    for (var i = 0; i<citiesArray.length; i++){
      addWeatherReport( reportList, citiesArray[i] );
      addMapMarker(citiesArray[i].coord);
    }
  } else {
    console.log("no sun");
  }
}

// needs some work to make the appearance better, maybe even a flickr api and animations?
var addWeatherReport = function(parent, cityObject){
  // console.log(cityObject.weather[0])
  console.log("weather report added", cityObject);
  var weatherBlock = document.createElement('div');
  weatherBlock.setAttribute("class", "weather-block");


  var icon = document.createElement('img');
  icon.width = 70;
  icon.height = 70;
  icon.src = "icons/01d.png";
  weatherBlock.appendChild(icon);

  var description = document.createElement("div");
  description.setAttribute("class","weather-block-description");

  var descriptionHead = document.createElement("p");
  descriptionHead.innerText = cityObject.name + " has clear skies."
  description.appendChild(descriptionHead)

  var descriptionBody = document.createElement("p");
  descriptionBody.innerText = "The temperature is : " + cityObject.main.temp + "°C with a humidity of " + cityObject.main.humidity +"%";
  description.appendChild(descriptionBody)

  weatherBlock.appendChild(description);



  parent.appendChild(weatherBlock)
}


var addMapMarker = function(latlon, label){
  var latLng = {lat: latlon.lat, lng: latlon.lon}
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    label: label
  })
  // console.log(latLng)
}



var onPageLoad = function(){
  // make map
  map = new google.maps.Map(document.getElementById('gmap'), {
     zoom: 8
   });

  //get users current position
  if ("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(function(position) {
      //assign global position
      currentLatLon = {
        lat: position.coords.latitude, 
        lon: position.coords.longitude
      }; 


      // update page with new location
      map.setCenter({lat: currentLatLon.lat, lng: currentLatLon.lon})

      addMapMarker(currentLatLon, "1")
      generateNewReport(currentLatLon, 1.5);
    });
  }



}

window.onload = onPageLoad;






// DEPRECATED CODE


// pittsburgh america test
// currentLatLon={lat:40, lon:-80}


// var generateNewReport = function(latlon, cityCount){
//   console.log("generateNewReport invoked")
//   // build URL
//   var key = "7225d2a55f7cd772384dbba91030c84a";
//   var url = "http://api.openweathermap.org/data/2.5/find?lat=" + latlon.lat + "&lon=" + latlon.lon + "&cnt=" + cityCount + "&APPID=" + key;
//   // make request to API
//   makeSunnyRequest(url, getNearestSunshine)
// }