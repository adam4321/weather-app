
// Import API key
import * as credentials from './credentials.js';

// let local = prompt('Please enter your location');

// Create a new http request
let req = new XMLHttpRequest();

// Check that the page is loaded before allowing a submission
document.addEventListener('DOMContentLoaded', bindButtons);

// Weather form submission
function bindButtons() {
    // Attach click handler to weather cubmit button
    document.getElementById('city-submit').addEventListener('click', function(event) {

    // Receive city from form
    let city = document.getElementById('text-box').value;

    // Receive zip from form
    let zip = document.getElementById('num-box').value;

        console.log(city);
        console.log(zip);

    // Set location
    let location = '';

    if (city !== '') {
        location = city;
    }
    else if (zip !== '') {
        location = zip;
    }
    else {
        alert("Please enter a city or zip code");
        return;
    }

    // Open the get request for weather app
    req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + location + ',us&APPID=' + credentials.apiKey, true);

    req.addEventListener('load',function(){
        if (req.status >= 200 && req.status < 400) {

            document.getElementById('form-box').style = 'display:none'

            // Log the response
            console.log(JSON.parse(req.responseText));

            // Store the response data
            let data = JSON.parse(req.responseText);

            let displayBox = document.createElement('div');
            displayBox.id = 'display-box';
            document.getElementById('root').appendChild(displayBox);

            // Populate the current city
            let city = document.createElement('p');
            city.id = 'city';
            city.className = 'reply';
            document.getElementById('display-box').appendChild(city);
            document.getElementById('city').textContent = data.name;

            // Create temp element and convert from kelvin to fahrenheit
            let tempBox = document.createElement('p');
            tempBox.id = 'temp';
            tempBox.className = 'reply';
            document.getElementById('display-box').appendChild(tempBox);
            
            let temp = data.main.temp
            temp = (temp - 273.15) * 9/5 + 32
            temp = temp.toPrecision(3);
            document.getElementById('temp').textContent = ' ' + temp + ' degrees F.';

            // Show the current conditions
            let conditions = document.createElement('p');
            conditions.id = 'other';
            conditions.className = 'reply';
            document.getElementById('display-box').appendChild(conditions);
            document.getElementById('other').textContent = ' ' + data.weather[0].description;

            let currentIcon = './icons/moon.png'
            let weatherIcon = document.createElement('img');
            weatherIcon.src = currentIcon;
            weatherIcon.id = 'icon';
            weatherIcon.className = 'reply';
            document.getElementById('display-box').appendChild(weatherIcon);
            // document.getElementById('icon').textContent = `icon ${data.weather[0].icon}`;

        } else {
        console.log("Error in network request: " + req.statusText);
        }});

    // Send the request
    req.send(null);

    // Run once for each button click
    event.preventDefault();
    })
};
