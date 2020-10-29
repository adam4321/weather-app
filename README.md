# Local Weather app

A Local weather application that is built using vanilla JavaScript and a small server in Node.js. It uses the Open Weather API to return the current weather for either the current location of the user. It first tries to find the user's location and if geolocation is successful, then the local weather is shown. If geolocation is unsuccessful, or if the user manually decides to change the location, then a form is rendered so that the user can manually choose the city.

If geolocation is blocked, then the manual form will be displayed. Geolocation happens in the client and then the city is passed to the backend, which queries the Open Weather API and returns the weather to the client.
