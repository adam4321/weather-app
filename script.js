/*******************************************************************
**  Author:       Adam Wright
**  Description:  Client-side only weather widget that returns the
**                user's current local weather. It first tries to
**                return the location using geolocation, but if that
**                fails, then it will request the city name. 
*******************************************************************/

// Import Open Weather map API key
import credentials from './credentials.js';

// Function to match current weather icon to API's suggestion
let currentIcon;

function findIcon(data) {
    switch (data.weather[0].icon) {
        case "01d":
            currentIcon = "/weather_widget/icons/sun.png";
            break;
        case "01n":
            currentIcon = "/weather_widget/icons/moon.png";
            break;
        case "02d":
            currentIcon = "/weather_widget/icons/partly-sunny.png";
            break;
        case "02n":
            currentIcon = "/weather_widget/icons/clouds.png";
            break;
        case "03d":
            currentIcon = "/weather_widget/icons/clouds.png";
            break;
        case "03n":
            currentIcon = "/weather_widget/icons/clouds.png";
            break;
        case "04d":
            currentIcon = "/weather_widget/icons/clouds.png";
            break;
        case "04n":
            currentIcon = "/weather_widget/icons/clouds.png";
            break;
        case "09d":
            currentIcon = "/weather_widget/icons/rain.png";
            break;
        case "09n":
            currentIcon = "/weather_widget/icons/rain.png";
            break;
        case "10d":
            currentIcon = "/weather_widget/icons/rain-sun.png";
            break;
        case "10n":
            currentIcon = "/weather_widget/icons/rain.png";
            break;
        case "11d":
            currentIcon = "/weather_widget/icons/storm.png";
            break;
        case "11n":
            currentIcon = "/weather_widget/icons/storm.png";
            break;
        case "13d":
            currentIcon = "/weather_widget/icons/snow.png";
            break;
        case "13n":
            currentIcon = "/weather_widget/icons/snow.png";
            break;
        case "50d":
            currentIcon = "/weather_widget/icons/drizzle.png";
            break;
        case "50n":
            currentIcon = "/weather_widget/icons/drizzle.png";
            break;
    }
}


// Button so the user can change location
document.getElementById('change-btn').addEventListener('click', (event) => {
    location = '';
    showForm();
})


// Helper function to display the city select form and hide current weather box
function showForm() {
    document.getElementById('input-form').reset();
    document.getElementById('form-box').style.display = 'block';
    document.getElementById('text-box').focus();
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
span1.onclick = () => {
    emptyModal.style.display = "none";
}

span2.onclick = () => {
    notFoundModal.style.display = "none";
}
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == emptyModal || event.target == notFoundModal) {
        emptyModal.style.display = "none";
        notFoundModal.style.display = "none";
    }
}


// Attempt to find the user's location
const locationReq = new XMLHttpRequest();
let location;

locationReq.open('GET', 'https://geoip-db.com/json/', true);
locationReq.onload = () => {
    if (locationReq.status >= 200 && locationReq.status < 400) {
        const locationData = JSON.parse(locationReq.responseText);

        // Attempt to find the weather if the city was found
        if (locationData.city) {
            location = locationData.city;
            document.getElementById('city-submit').click();
        }
        // We reached our target server, but it returned no city
        else {
            console.error('Error from geolocation service')
            showForm();
        }
    }
    // We reached our target server, but it returned an error
    else {
        console.error('Error from geolocation service')
        showForm();
    }
};


// There was a connection error of some sort
locationReq.onerror = () => {
    console.error('Geolocation connection error')
    showForm();
};

locationReq.send();


// Populate weather if geolocation worked or render the choose city form
document.getElementById('city-submit').addEventListener('click', (event) => {
    event.preventDefault();

    // Receive city from form
    let city = document.getElementById('text-box').value;
    document.getElementById('form-header').style = '';

    console.log(location);

    //Check that the location is set
    if (city == '' && location == '') {
        (() => emptyModal.style.display = "block")();
        showForm();
    }
    else if (location == '') {
        // Weather API needs a space after a period in a city name
        let regex = new RegExp("\\.");
        if (regex.test(city)) {
            city = city.replace('.', '. ');
        }

        location = city;
        document.getElementById('form-box').style = 'display:none'; 
    }
    
    // Open GET request to the open weather api
    if (location !== '') {
        const req = new XMLHttpRequest();
        req.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${location},us&APPID=${credentials}`, true);
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {

                // Store the response data
                const data = JSON.parse(req.responseText);

                // Hide the spinner
                document.getElementById('spinner').style = 'display:none';

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
                document.getElementById('standard-btn').addEventListener('click', (event) => {
                    if (temp.tempType == 'F') {
                        temp.tempType = 'C';
                        temp.val = data.main.temp;
                        temp.val = temp.val - 273.15;
                    }
                    else if (temp.tempType == 'C') {
                        temp.tempType = 'F';
                        temp.val = data.main.temp;
                        temp.val = (temp.val - 273.15) * 9/5 + 32;
                    }
                    temp.val = Math.floor(temp.val);
                    document.getElementById('temp').textContent = `${temp.val}\xB0 ${temp.tempType}`;
                })

                // Show the weather result and change button
                document.getElementById('display-box').style = '';
                document.getElementById('change-btn').style = '';
                document.getElementById('standard-btn').style.display = 'unset';
                city = '';
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
    }
})
