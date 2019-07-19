
// Create a new http request
let req = new XMLHttpRequest();

// API key
let apiKey = '6a0b5d5d6abb3afef1eceed83838a4d5';

// Check that the page is loaded before allowing a submission
document.addEventListener('DOMContentLoaded', bindButtons);

// Weather form submission
function bindButtons() {
    document.getElementById('citySubmit').addEventListener('click', function(event){

    // Receive city from form
    let city = document.getElementById('text-box-2').value;

    // Receive zip from form
    let zip = document.getElementById('num-box-2').value;

        console.log(city);
        console.log(zip);

    // Set location
    let location = '';

    if (city !== '') {
        location = city;
    }   else if (zip !== '') {
        location = zip;
    }   else {
        alert("Please enter a city or zip code");
        return;
    }

    // Open the get request
    req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + location + ',us&APPID=' + apiKey, false);

    // Send the request
    req.send(null);

    // Log the response
    console.log(JSON.parse(req.responseText));

    // Store the response data
    data = JSON.parse(req.responseText);

    // Populate the current city
    document.getElementById('city').textContent = ' ' + data.name;

    // Get the temp and convert from kelvin to fahrenheit
    let temp = data.main.temp
    temp = (temp - 273.15) * 9/5 + 32
    temp = temp.toPrecision(3);
    document.getElementById('temp').textContent = ' ' + temp + ' degrees F.';

    // Show the current conditions
    document.getElementById('other').textContent = ' ' + data.weather[0].description;

    // Run once for each button click
    event.preventDefault();
    })
};


// API key for link shortener
var apiKey2 = 'AIzaSyAh2sUzWPm-pRQCbgyZijqWcKGFcoXeK2o';

//
document.addEventListener('DOMContentLoaded', bindButtons2);

//
function bindButtons2(){
    document.getElementById('urlSubmit').addEventListener('click', function(event){
      var req = new XMLHttpRequest();
      var payload = {longUrl:null};
      payload.longUrl = document.getElementById('longUrl').value;
      req.open('POST', 'https://www.googleapis.com/urlshortener/v1/url?key=' + apiKey2, false);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(payload));
      var response = JSON.parse(req.responseText);
      document.getElementById('originalUrl').textContent = response.longUrl;
      document.getElementById('shortUrl').textContent = response.id;
      event.preventDefault();
    })
}




