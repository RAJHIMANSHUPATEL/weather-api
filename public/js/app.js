const weatherApi = "/weather";
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const tempElement = document.querySelector('.temperature span');
const locationElement = document.querySelector('.place');
const dateElement = document.querySelector('.date');

// Displaying the date
const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleDateString("en-US", options);
dateElement.textContent = currentDate.getDate() + ", " + monthName;

// Weather form
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    locationElement.textContent = "Loading...";
    weatherIcon.className = "";
    tempElement.textContent = "";
    weatherCondition.textContent = "";

    const city = search.value;
    if (city) {
        showData(city);
    } else {
        locationElement.textContent = "Please enter a city";
    }
});

// Function to fetch weather data
function showData(city) {
    getWeatherData(city)
        .then(result => {
            if (result.cod === 200) {
                const description = result.weather[0].description;
                weatherIcon.className = description.includes("rain") || description.includes("fog") ?
                    "wi wi-day-" + description : "wi wi-day-cloudy";
                locationElement.textContent = result.name;
                tempElement.textContent = (result.main.temp - 273.5).toFixed(2) + String.fromCharCode(176);
                weatherCondition.textContent = description.toUpperCase();
            } else {
                locationElement.textContent = "City Not Found";
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            locationElement.textContent = "Error fetching data";
        });
}

// Function to fetch weather data from the server
function getWeatherData(city) {
    const locationApi = weatherApi + "?address=" + city;
    return fetch(locationApi)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

// Geolocation
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.address && data.address.city) {
                        const city = data.address.city;
                        showData(city);
                    } else {
                        console.log("City Not Found");
                    }
                })
                .catch(error => {
                    console.error("Error fetching geolocation data:", error);
                });
        },
        error => {
            console.error("Geolocation is not available on this browser:", error);
        }
    );
} else {
    console.log("Geolocation is not supported in this browser");
}
