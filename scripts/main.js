$(document).ready(function(){
        function displayLocation(latitude,longitude){
        var request = new XMLHttpRequest();

       var method = 'GET';
       var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
       var async = true;

       request.open(method, url, async);
       request.onreadystatechange = function(){
       if(request.readyState == 4 && request.status == 200){
         var data = JSON.parse(request.responseText);
         alert(request.responseText); // check under which type your city is stored, later comment this line
         var addressComponents = data.results[0].address_components;
         for(i=0;i<addressComponents.length;i++){
            var types = addressComponents[i].types
            //alert(types);
            if(types=="locality,political"){
               alert(addressComponents[i].long_name); // this should be your city, depending on where you are
             }
           }
        //alertaddress.city.short_name);
       }
    };
   request.send();
 
        };

 var successCallback = function(position){
 var x = position.coords.latitude;
 var y = position.coords.longitude;
 displayLocation(x,y);
  
 };


 navigator.geolocation.getCurrentPosition(successCallback);

  });


/*
  
var geocoder;
  

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}
// Get the latitude and the longitude;
function successFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  codeLatLng(lat, lng);
}

function errorFunction() {
  alert("Geocoder failed");
}

function initialize() {
  geocoder = new google.maps.Geocoder();

}

function codeLatLng(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({latLng: latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var arrAddress = results;
        console.log(results);
        $.each(arrAddress, function(i, address_component) {
          if (address_component.types[0] == "locality") {
            console.log("City: " + address_component.address_components[0].long_name);
            itemLocality = address_component.address_components[0].long_name;
          }
        });
      } else {
        alert("No results found");
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
  });
}
codeLatLng();
$("#temp-display").html(arrAddress);

  
  if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(function(position) {
$("#temp-display").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
});
}
  /*
  
 });



var weatherRequest = function() {
   request = new XMLHttpRequest();
request.open("GET", "http://api.openweathermap.org/data/2.5/weather?id=5809844&APPID=369c73a58bd59afd5d0642d98c72773b", false);


  request.send();
  };
console.log(request);

document.getElementById("#temp-display").innerHTML=request.response;

/*
document.getElementById("temp-display").innerHTML =weatherResponse.responseText;
//var data = JSON.parse(responseText);
//var temperature = data.map(function(d) { return d['main']; }).indexOf('temp')*/
