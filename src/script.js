import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'
import TrailApp from './trail.js'


let spinBoost = 0; // rotation speed boost value
let spinPaused = false;

//land positions
const landPositions = [
    new THREE.Vector3(1.6, 0.4, 1.6),  // India
    new THREE.Vector3(-1.2, 0.3, 1.4), // Europe
    new THREE.Vector3(0.8, -0.2, 1.9), // China-ish
    new THREE.Vector3(-1.5, -0.5, 1.3), // Africa
    new THREE.Vector3(-0.9, 0.2, -1.8), // USA
    new THREE.Vector3(-0.3, -1.1, 1.6), // Australia
    new THREE.Vector3(1.4, 1.0, -1.2),  // Russia area
];



// Create yellow pulse marker
const markerGeometry = new THREE.RingGeometry(0.05, 0.1, 32)
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 })
const marker = new THREE.Mesh(markerGeometry, markerMaterial)
marker.rotation.x = -Math.PI / 2 // face camera
marker.visible = false




function showMarkerAtFront() {
    const radius = 9.01
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
     const markerPosition = cameraDirection.multiplyScalar(-radius)
    marker.position.copy(markerPosition)
    marker.visible = true

    // Reset scale and opacity
    marker.scale.set(0.01, 0.01, 0.01)
    marker.material.opacity = 1

    // Animate: grow + fade out
    gsap.to(marker.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out"
    })

    gsap.to(marker.material, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
            marker.visible = false
        }
    })
    console.log("💡 Marker show function called");

}



/**
 * Base
 */
// Debug
const gui = new GUI({ title: '🌍tweaks' })
gui.close();
const guiStyle = gui.domElement.style;
guiStyle.position = 'fixed';
guiStyle.top = '8px';
guiStyle.right = '8px';
// guiStyle.width = '110px';
guiStyle.zIndex = '10000';
guiStyle.cursor = 'pointer'; // For toggle-like feel
// Set the width manually instead of auto
// gui.domElement.style.width = '160px';  // Adjust to desired width










// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.add(marker);
// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Earth
 */
const earthParameters = {}
earthParameters.atmosphereDayColor = '#00aaff'
earthParameters.atmosphereTwilightColor = '#ff6600'

gui
    
    .addColor(earthParameters, 'atmosphereDayColor')
    .onChange(() =>
    {
        earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
        atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
    })

gui
    .addColor(earthParameters, 'atmosphereTwilightColor')
    .onChange(() =>
    {
        earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
        atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
    })

// Textures
const earthDayTexture = textureLoader.load('./earth/day.jpg')
earthDayTexture.colorSpace = THREE.SRGBColorSpace
earthDayTexture.anisotropy = 8

const earthNightTexture = textureLoader.load('./earth/night.jpg')
earthNightTexture.colorSpace = THREE.SRGBColorSpace
earthNightTexture.anisotropy = 8

const earthSpecularCloudsTexture = textureLoader.load('./earth/specularClouds.jpg')
earthSpecularCloudsTexture.anisotropy = 8

// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms:
    {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uNightTexture: new THREE.Uniform(earthNightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms:
    {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    },
})

const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)

/**
 * Sun
 */
// Coordinates
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
const sunDirection = new THREE.Vector3()

// Debug
const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)
scene.add(debugSun)

// Update
const updateSun = () =>
{
    // Sun direction
    sunDirection.setFromSpherical(sunSpherical)

    // Debug
    debugSun.position
        .copy(sunDirection)
        .multiplyScalar(5)

    // Uniforms
    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection)
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
}

updateSun()

// Tweaks
gui
    .add(sunSpherical, 'phi')
    .min(0)
    .max(Math.PI)
    .onChange(updateSun)

gui
    .add(sunSpherical, 'theta')
    .min(- Math.PI)
    .max(Math.PI)
    .onChange(updateSun)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 12
camera.position.y = 5
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000011')

/**
 * Animate
 */
const clock = new THREE.Clock()

function moveEarthToLocation(lat, lon) {
    // Convert lat/lon to spherical coordinates
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)

    // Point the Earth toward the location
    // This just rotates the globe so the point is near the front
    gsap.to(earth.rotation, {
        y: theta,
        duration: 1.5,
        ease: "power2.inOut"
    })
}



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
   
    // earth.rotation.y = elapsedTime * 0.1                  this was prev normal
    
    if (!spinPaused) {
        earth.rotation.y += 0.003 + spinBoost;
    }

    spinBoost *= 0.95;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
new TrailApp()


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const searchBtn = document.querySelector("#search")
const form = document.querySelector("form");
const todayDay = document.querySelector(".today-left :first-child");
const todayDate = document.querySelector(".today-left :nth-child(2)");
const todayLocation = document.querySelector(".today-left > div > span");
const todayIcon = document.querySelector(".today-right :first-child");
const todayTemperature = document.querySelector(".today-right :nth-child(2)");
const todayDescription = document.querySelector(".today-right :nth-child(3)");
const todayPrecipitation = document.querySelector(".today-detail :first-child");
const todayHumidity = document.querySelector(".today-detail :nth-child(2)");
const todayWindSpeed = document.querySelector(".today-detail :nth-child(3)");
const futureDays = document.querySelector(".future");
const searchInput = document.getElementById("input");





// searchBtn.addEventListener("click", async function () {
//     const location = searchInput.value;
//     if (location != "") {
//         console.log("✅ Search clicked");
//         console.log("📍 Location entered:", location);

//         const data = await fetchData(location); // ✅ FIXED here

//         if (data === null) {
//             alert("location not Found");
//         } else {
//             updateDOM(data); // Optional — if you're doing a UI update

//             // 🔥 SPIN logic
//             spinBoost = 0.1;

//             setTimeout(() => {
//                 spinPaused = true;
//                 showMarkerAtFront(); // 🟡 Yellow pulse

//                 setTimeout(() => {
//                     spinPaused = false;
//                     marker.visible = false;
//                 }, 3000);
//             }, 1500);
//         }

//         searchInput.value = "";
//     }
// });

searchBtn.addEventListener("click", async function () {
    console.log("🌟 Search button clicked");
    const location = searchInput.value;
    if (location != "") {
        console.log("🔍 Searching for:", location);

        const data = await fetchData(location); // already fixed this name

        if (data === null) {
            alert("location not Found");
        } else {
            console.log("✅ Weather found! Applying spin/marker");

            spinBoost = 0.1;

            setTimeout(() => {
                spinPaused = true;

                showMarkerAtFront(); // 🔥 THIS SHOULD SHOW MARKER
                console.log("📍 Called showMarkerAtFront");

                setTimeout(() => {
                    spinPaused = false;
                    marker.visible = false;
                }, 3000);
            }, 1500);
        }

        searchInput.value = "";
    }
});


// Define a mapping of weather icons
const weatherIcons = {
    "01d": "bi bi-sun-fill",             // Clear sky (day)
    "01n": "bi bi-moon-fill",            // Clear sky (night) 
    "02d": "bi bi-cloud-sun-fill",       // Few clouds (day)
    "02n": "bi bi-cloud-moon-fill",      // Few clouds (night)
    "03d": "bi bi-cloud-fill",           // Scattered clouds (day)
    "03n": "bi bi-cloud-fill",           // Scattered clouds (night)
    "04d": "bi bi-clouds-fill",          // Broken clouds (day)
    "04n": "bi bi-clouds-fill",          // Broken clouds (night)
    "09d": "bi bi-cloud-rain-fill",      // Shower rain (day)
    "09n": "bi bi-cloud-rain-fill",      // Shower rain (night)
    "10d": "bi bi-cloud-rain-fill",      // Rain (day)
    "10n": "bi bi-cloud-rain-fill",      // Rain (night)
    "11d": "bi bi-cloud-lightning-fill", // Thunderstorm (day)
    "11n": "bi bi-cloud-lightning-fill", // Thunderstorm (night)
    "13d": "bi bi-cloud-snow-fill",      // Snow (day)
    "13n": "bi bi-cloud-snow-fill",      // Snow (night)
    "50d": "bi bi-cloud-haze-fill",      // Haze (day)
    "50n": "bi bi-cloud-haze-fill"       // Haze (night)
};

const fetchData = (city) => {
    // Replace with your API key
    const apiKey = "your_api_key";

    // Use fetch to make a request to the Weather API
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=5c949ff87b1fcb59589fb637b7827de5&units=metric`;
    fetch(apiUrl).then(response => {
        if (!response.ok) {
            throw new Error("Weather data could not be retrieved.");
        }
        return response.json();
    })
        .then(data => {

            // Update the city name and today's weather information
            todayDay.textContent = new Date().toLocaleDateString("en", { weekday: "long" });
            todayDate.textContent = new Date().toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
            todayLocation.textContent = `${data.city.name}, ${data.city.country}`;

            todayIcon.className = weatherIcons[data.list[0].weather[0].icon];
            todayTemperature.innerHTML = `${Math.round(data.list[0].main.temp)}&#8451;`;
            todayDescription.textContent = data.list[0].weather[0].description;

            // todayPrecipitation.textContent = `Precipitation : ${data.list[0].pop}%`;
            // todayHumidity.textContent = `Humidity : ${data.list[0].main.humidity}%`;
            // todayWindSpeed.textContent = `Wind Speed : ${data.list[0].wind.speed} m/s`;

            // Get weather data for the next 4 days
            const futureWeather = data.list.slice(8, 40); // 5-day data with readings every 3 hours
            futureDays.innerHTML = "";

            // Create and display weather information dynamically
            futureWeather.forEach((forecast, index) => {
                if (index % 8 === 0) {

                    const date = new Date(forecast.dt * 1000);
                    const day = date.toLocaleDateString("en", { weekday: "long" });
                    const temperature = Math.round(forecast.main.temp);
                    const description = forecast.weather[0].description;
                    const icon = forecast.weather[0].icon;

                    const futureDayElement = document.createElement("div");
                    futureDayElement.classList.add("future-day");
                    futureDayElement.innerHTML = `

                        <p class="day">${day}</p>
                        <i class="${weatherIcons[icon]}"></i>
                        <p class="temperature">${temperature}°C</p>
                        <p class="description">${description}</p>

                    `;
                    futureDays.appendChild(futureDayElement);
                }
            });
        })
        .catch((error) => {
            console.error(error);
            // Show an alert to the user in case of an error
            alert("Weather data could not be retrieved.");
        });
}

// Fetch weather data on document load for default city
document.addEventListener("DOMContentLoaded", function () {
    const defaultLocation = "Mumbai";
    fetchData(defaultLocation);
});

// Listen for the submit event on the search box
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("input");

    // Get the city name entered sby the user
    const city = input.value;
    if (city.trim() === "") {
        alert("Please enter a city name.");
        return;
    } else {
        fetchData(city);
        input.value = "";
    }
});