/*******************************************************************
**  Author:       Adam Wright
**  Description:  Single page weather application that returns the
**                user's current local weather. It first tries to
**                return the location using geolocation, but if that
**                fails, then it will request the city name. 
*******************************************************************/

// Import Open Weather map API key
import * as credentials from './credentials.js';


// Hide the page's components initially
document.getElementById('form-header').style = 'display:none';
document.getElementById('form-box').style = 'display:none';
document.getElementById('display-box').style = 'display:none';
document.getElementById('change-btn').style = 'display:none';


// Function to match current weather icon to API's suggestion
let currentIcon;

function findIcon(data) {
    switch (data.weather[0].icon) {
        case "01d":
            currentIcon = "./icons/sun.png";
            break;
        case "01n":
            currentIcon = "./icons/moon.png";
            break;
        case "02d":
            currentIcon = "./icons/partly-sunny.png";
            break;
        case "02n":
            currentIcon = "./icons/clouds.png";
            break;
        case "03d":
            currentIcon = "./icons/clouds.png";
            break;
        case "03n":
            currentIcon = "./icons/clouds.png";
            break;
        case "04d":
            currentIcon = "./icons/clouds.png";
            break;
        case "04n":
            currentIcon = "./icons/clouds.png";
            break;
        case "09d":
            currentIcon = "./icons/rain.png";
            break;
        case "09n":
            currentIcon = "./icons/rain.png";
            break;
        case "10d":
            currentIcon = "./icons/rain-sun.png";
            break;
        case "10n":
            currentIcon = "./icons/rain.png";
            break;
        case "11d":
            currentIcon = "./icons/storm.png";
            break;
        case "11n":
            currentIcon = "./icons/storm.png";
            break;
        case "13d":
            currentIcon = "./icons/snow.png";
            break;
        case "13n":
            currentIcon = "./icons/snow.png";
            break;
        case "50d":
            currentIcon = "./icons/drizzle.png";
            break;
        case "50n":
            currentIcon = "./icons/drizzle.png";
            break;
    }
}


// Helper function to display the city select form and hide current weather box
function showForm() {
    document.getElementById('input-form').reset();
    document.getElementById('form-box').style = '';
    document.getElementById('display-box').style = 'display:none';
    document.getElementById('change-btn').style = 'display:none';
}


// Warning Modal Implementation
let emptyModal = document.getElementById('emptyModal');
let notFoundModal = document.getElementById('notFoundModal')

// Get the <span> element that closes the modal
let span1 = document.getElementsByClassName("close")[0];
let span2 = document.getElementsByClassName("close")[1];

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
    emptyModal.style.display = "none";
}

span2.onclick = function() {
    notFoundModal.style.display = "none";
}
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == emptyModal || event.target == notFoundModal) {
        emptyModal.style.display = "none";
        notFoundModal.style.display = "none";
    }
}


// Attempt to find the user's location
const locationReq = new XMLHttpRequest();
let location;

locationReq.open('GET', 'https://geoip-db.com/json/', true);
locationReq.onload = function() {
    if (locationReq.status >= 200 && locationReq.status < 400) {
        const locationData = JSON.parse(locationReq.responseText);

        // // Log the responses from the API for testing
        // console.log(locationData.country_name);
        // console.log(locationData.state);
        // console.log(locationData.city);
        // console.log(locationData.latitude);
        // console.log(locationData.longitude);
        // console.log(locationData.IPv4);

        if (locationData.city) {
        location = locationData.city;
        document.getElementById('city-submit').click();
        }
        else {
        // We reached our target server, but it returned no city
        console.log('Error from geolocation service')
        showForm();
        }
    }
    else {
        // We reached our target server, but it returned an error
        console.log('Error from geolocation service')
        showForm();
    }
};

locationReq.onerror = function() {
    // There was a connection error of some sort
    console.log('Geolocation connection error')
    showForm();
};

locationReq.send();


// Populate weather if geolocation worked or render the choose city form
const req = new XMLHttpRequest();

document.getElementById('city-submit').addEventListener('click', function(event) {

    // Receive city from form
    let city = document.getElementById('text-box').value;
    document.getElementById('form-header').style = '';

    //Check that the location is set
    if (location) {}
    else if (city == '') {
        (() => emptyModal.style.display = "block")();
        showForm();
    }
    else {
        // Weather API needs a space after a period in a city name
        let regex = new RegExp("\\.");
        if (regex.test(city)) {
            city = city.replace('.', '. ');
        }
        location = city;
        document.getElementById('form-box').style = 'display:none'; 
    }

    // Open get request to the open weather api
    req.open('GET', `http://api.openweathermap.org/data/2.5/weather?q=${location},us&APPID=${credentials.apiKey}`, true);
    req.addEventListener('load',function(){
        if (req.status >= 200 && req.status < 400) {

            // // Log the response for testing
            // console.log(JSON.parse(req.responseText));

            // Store the response data
            const data = JSON.parse(req.responseText);

            // Display the current city name
            document.getElementById('city').textContent = data.name;

            // Set the current weather icon
            findIcon(data);
            document.getElementById('icon').src = currentIcon;

            // List the current conditions
            document.getElementById('other').textContent = data.weather[0].description;

            // Convert kelvin temp from api to fahrenheit as default standard 
            let temp = {};
            temp.val = data.main.temp;
            temp.tempType = 'F';
            temp.val = (temp.val - 273.15) * 9/5 + 32;
            temp.val = Math.floor(temp.val);
            document.getElementById('temp').textContent = `${temp.val}\xB0 ${temp.tempType}`;

            // Farenheit or Celcius button
            document.getElementById('standard-btn').addEventListener('click', function(event) {
                if (temp.tempType == 'F') {
                    temp.tempType = 'C';
                    temp.val = data.main.temp
                    temp.val = temp.val - 273.15;
                }
                else if (temp.tempType == 'C') {
                    temp.tempType = 'F';
                    temp.val = data.main.temp
                    temp.val = (temp.val - 273.15) * 9/5 + 32;
                }
                temp.val = Math.floor(temp.val);
                document.getElementById('temp').textContent = `${temp.val}\xB0 ${temp.tempType}`;
            })

            // Show the weather result and change button
            document.getElementById('display-box').style = ''
            document.getElementById('change-btn').style = '';
            city = '';

            // Button so user can change location
            document.getElementById('change-btn').addEventListener('click', function(event) {
                location = '';
                showForm();
            })
        } 
        else {
            console.log('Error in weather API request: ' + req.statusText);
            location = '';
            showForm();
            if (city != '') {
                city = '';
                (() => notFoundModal.style.display = "block")();
            }
        }
    });

    // Send the request
    req.send(null);
    event.preventDefault();
})
