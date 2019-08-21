
// Import API key
import * as credentials from './credentials.js';



// Find the user's location
const locationReq = new XMLHttpRequest();
let location;
locationReq.open('GET', 'https://geoip-db.com/json/', true);

locationReq.onload = function() {
  if (locationReq.status >= 200 && locationReq.status < 400) {
    // Success!
    const locationData = JSON.parse(locationReq.responseText);
    console.log(locationData.country_name);
    console.log(locationData.state);
    console.log(locationData.city);
    console.log(locationData.latitude);
    console.log(locationData.longitude);
    console.log(locationData.IPv4);
    location = locationData.city;
  } else {
    // We reached our target server, but it returned an error
    console.log('error from target')
  }
};

locationReq.onerror = function() {
  // There was a connection error of some sort
  console.log('connection error')
};

locationReq.send();



// Function to match current weather icon to api's suggestion
let currentIcon;

function findIcon(data) {
    switch (data.weather[0].icon) {
        case '01d':
            currentIcon = './icons/sun.png';
            break;
        case '01n':
            currentIcon = './icons/moon.png';
            break;
        case '02d':
            currentIcon = './icons/partly-sunny.png';
            break;
        case '02n':
            currentIcon = './icons/clouds.png';
            break;
        case '03d':
            currentIcon = './icons/clouds.png';
            break;
        case '03n':
            currentIcon = './icons/clouds.png';
            break;
        case '04d':
            currentIcon = './icons/clouds.png';
            break;
        case '04n':
            currentIcon = './icons/clouds.png';
            break;
        case '09d':
            currentIcon = './icons/rain.png';
            break;
        case '09n':
            currentIcon = './icons/rain.png';
            break;
        case '10d':
            currentIcon = './icons/rain-sun.png';
            break;
        case '10n':
            currentIcon = './icons/rain.png';
            break;
        case '11d':
            currentIcon = './icons/storm.png';
            break;
        case '11n':
            currentIcon = './icons/storm.png';
            break;
        case '13d':
            currentIcon = './icons/snow.png';
            break;
        case '13n':
            currentIcon = './icons/snow.png';
            break;
        case '50d':
            currentIcon = './icons/drizzle.png';
            break;
        case '50n':
            currentIcon = './icons/drizzle.png';
            break;
    }
}


const req = new XMLHttpRequest();

// Check that the page is loaded before allowing a submission
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
    document.getElementById('city-submit').addEventListener('click', function(event) {

    // Receive city or zip from form
    const city = document.getElementById('text-box').value;
    // const zip = document.getElementById('num-box').value;

        // Log the form's entered city or zip value
        // console.log(city);
        // console.log(zip);

    //Check that the location is set
    let location = '';

    if (city !== '') {
        location = city;
    }
    // else if (zip !== '') {
    //     location = zip;
    // }
    else {
        alert("Please enter a city or zip code");
        return;
    }

    // Open get request to the open weather api
    req.open('GET', `http://api.openweathermap.org/data/2.5/weather?q=${location},us&APPID=${credentials.apiKey}`, true);

    req.addEventListener('load',function(){
        if (req.status >= 200 && req.status < 400) {

            document.getElementById('form-box').style = 'display:none'

            // Log the response
            // console.log(JSON.parse(req.responseText));

            // Store the response data
            const data = JSON.parse(req.responseText);

            const displayBox = document.createElement('div');
            displayBox.id = 'display-box';
            document.getElementById('root').appendChild(displayBox);

            // Populate the current city
            const city = document.createElement('p');
            city.id = 'city';
            city.className = 'reply';
            document.getElementById('display-box').appendChild(city);
            document.getElementById('city').textContent = data.name;

            // Set the current weather icon
            findIcon(data);
            const weatherIcon = document.createElement('img');
            weatherIcon.src = currentIcon;
            weatherIcon.id = 'icon';
            weatherIcon.className = 'reply';
            document.getElementById('display-box').appendChild(weatherIcon);

            // List the current conditions
            const conditions = document.createElement('p');
            conditions.id = 'other';
            conditions.className = 'reply';
            document.getElementById('display-box').appendChild(conditions);
            document.getElementById('other').textContent = data.weather[0].description;

            // Create temp element
            const tempBox = document.createElement('p');
            tempBox.id = 'temp';
            tempBox.className = 'reply';
            document.getElementById('display-box').appendChild(tempBox);

            // Set temp standard to fahernheit and add switching button
            const standard = document.createElement('button');
            standard.id = 'standard-btn';
            standard.tempType = 'F';
            document.getElementById('display-box').appendChild(standard);
            document.getElementById('standard-btn').textContent = 'Fahrenheit | Celcius';

            // Convert kelvin from api to initial fahrenheit
            let temp = data.main.temp;
            temp = (temp - 273.15) * 9/5 + 32;
            temp = Math.floor(temp);
            document.getElementById('temp').textContent = `${temp}\xB0 ${standard.tempType}`;

            // Farenheit or Celcius button
            document.getElementById('standard-btn').addEventListener('click', function(event) {
                if (standard.tempType == 'F') {
                    standard.tempType = 'C';
                    temp = data.main.temp
                    temp = temp - 273.15;
                }
                else if (standard.tempType == 'C') {
                    standard.tempType = 'F';
                    temp = data.main.temp
                    temp = (temp - 273.15) * 9/5 + 32;
                }
                temp = Math.floor(temp);
                document.getElementById('temp').textContent = `${temp}\xB0 ${standard.tempType}`;
            })

            // Button to refresh page so user can change location
            const changeBtn = document.createElement('button');
            changeBtn.id = 'change-btn';
            document.getElementById('root').appendChild(changeBtn);
            document.getElementById('change-btn').textContent = 'Change location';

            document.getElementById('change-btn').addEventListener('click', function(event) {
                window.location.href = window.location.href;
            })
        } 
        else {
        console.log("Error in network request: " + req.statusText);
        }});

    // Send the request
    req.send(null);

    // Run once for each button click
    event.preventDefault();
    })
};
