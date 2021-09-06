// require('dotenv').config();
// console.log(process.env);
STARGAZR_PROD_ENDPOINT ="https://stargazr-5l7reasoza-uc.a.run.app"
STARGAZER_DEV_ENDPOINT = "http://172.18.0.2:8085"


// Base Tileset Layers
mapLink = '<a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>';
infoLink = '<a href="https://djlorenz.github.io/astronomy/lp2016/" target="_blank">Light Pollution Atlas Information</a>';

var mapbox_dark = L.tileLayer('https://api.mapbox.com/styles/v1/bgcastro/ckq4hds6m370n17o3e8doenww/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmdjYXN0cm8iLCJhIjoiY2twbjlhdWV4MDZqdDJwbzNvOG55dW4ydiJ9.78LWX5FlEiAMxVw47jJq5A', {
    attribution: '<a href="https://www.mapbox.com">Mapbox Studio</a>',
    maxZoom: 17,
})

var mapbox_red = L.tileLayer('https://api.mapbox.com/styles/v1/bgcastro/ckppv2b0n05ie17qmkqtoowq5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmdjYXN0cm8iLCJhIjoiY2twbjlhdWV4MDZqdDJwbzNvOG55dW4ydiJ9.78LWX5FlEiAMxVw47jJq5A', {
    attribution: '<a href="https://www.mapbox.com">Mapbox Studio</a>',
    maxZoom: 17,
})

var open_street = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors | ' + infoLink,
    maxZoom: 17,
})

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community  | ' + infoLink,
    maxZoom: 17,
});

var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community  | ' + infoLink,
    maxZoom: 17,
});

var open_topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>) | ' + infoLink,
    maxZoom: 17,
})

// Light Pollution Overlay
var lightpollution2016 = L.tileLayer('tiles16/tile_{z}_{x}_{y}.png', {
    minZoom: 2,
    maxNativeZoom: 8,
    maxZoom: 17,
    tileSize: 1024,
    zoomOffset: -2,
    opacity: 0.5
})



// Create Map
var map = L.map('map', {
    center: [0, 0],
    zoom: 2,
    maxZoom: 17,
    minZoom: 3,
    layers: [mapbox_dark, lightpollution2016]
});

// Create and add sidebar
var sidebar = L.control.sidebar({ container: 'sidebar' })
    .addTo(map)

sidebar.options.autopan = true;

//Add all layers and overlay to layer control and add to map
var baseLayers = {
    "Dark Night Vision": mapbox_dark,
    "Red Night Vision": mapbox_red,
    "Satellite (Esri)": Esri_WorldImagery,
    "Topographic (Esri)": Esri_WorldTopoMap,
    "OpenStreetMap": open_street,
    "OpenTopoMap": open_topo
};
var overlays = {
    "2016 light pollution": lightpollution2016
};
var options = {
    position: 'topleft'
};
L.control.layers(baseLayers, overlays, options).addTo(map);

function formatLat(num){
    if (num < 0){
        number = Math.abs(Number(num).toFixed(4)) + "\u00B0 S";
    }
    else{
        number = Number(num).toFixed(4) + "\u00B0 N";
    }
    return number

}
function formatLng(num) {
    if (num < 0){
        number = Math.abs(Number(num).toFixed(4)) + "\u00B0 W";
    }
    else{
        number = Number(num).toFixed(4) + "\u00B0 E";
    }
    return number

}

// Generates marker and gets coordinates on each click
var newMarker = {}
var coords = {}
function addMarker(e) {

    // Add marker to map at click location;
    if (newMarker != undefined) {
        map.removeLayer(newMarker);
    };
    newMarker = new L.marker(e.latlng).addTo(map);
    coords = { "lat": e.latlng.lat, "lng": e.latlng.wrap().lng }
    var coodrs_text_lat = formatLat(coords.lat)+",";
    var coords_text_lng = formatLng(coords.lng);
    $("#selected-coords-lat").text(coodrs_text_lat);
    $("#selected-coords-lng").text(coords_text_lng);
    $("#selected-coords-sidebar").text(coodrs_text_lat + coords_text_lng);
    console.log(coords)
}
map.on('click', addMarker);


function displayData(response_json){
    CDSChart = response_json.CDSChart
    cloudCover = response_json.cloudCover * 100 + "%"
    drivingDistance = response_json.drivingDistance
    elevation = Math.round(response_json.elevation) + " m"
    humidity = response_json.humidity * 100 + "%"
    lightPol = response_json.lightPol
    precipProb = response_json.precipProb
    siteQuality = Math.round(response_json.siteQuality) 
    siteQualityDiscript = response_json.siteQualityDiscript
    status = response_json.status
    lunarphase = (response_json.lunarphase)*100 + "% Full"

    $("#sg-rate-cloud").text(cloudCover)
    $("#sg-rate-lp").text(lightPol)
    $("#sg-rate-humidity").text(humidity)
    $("#sg-rate-elev").text(elevation)
    $("#sg-rate-overall-val").text(siteQuality)
    $("#sg-rate-overall-desc").text(siteQualityDiscript)
    $("#sg-rate-lunar").text(lunarphase)

    console.log(drivingDistance)
    console.log(CDSChart)

    // $("#sg-rate-drivetime").text(drivingDistance)
    // $("#sg-rate-csc-name").text(CDSChart.name)
    // $("#sg-rate-csc-dist").text(CDSChart.dist_km + " km")
    // $("#sg-rate-csc-img img").attr("src", CDSChart.mimi_img)
    // $("#sg-rate-csc-img a").href(CDSChart.mimi_img+"key.html?1")

}


function Locate({ panTo }) {
    navigator.geolocation.getCurrentPosition(
        position => {
            panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        },
        () => null
    );
}

//Stargaze Button Click: Open thing, call API (eventually)
function getSGReport(lat, lng){
    //https://stargazr-5l7reasoza-uc.a.run.app/?lat_selected=37.75&lng_selected=-122.45
    var lat = coords.lat
    var lng = coords.lng
    console.log("report at ", lat,lng)
    sidebar.open('data');


    const callEndpoint = async () => {
        console.log("hey", lat, lng)
        const response = await fetch(STARGAZER_PROD_ENDPOINT+'?lat_selected='+lat+'&lng_selected='+lng);
        const response_json = await response.json(); //extract JSON from the http response
        console.log(response_json)
        displayData(response_json)
        // $("#stargaze-conditions").text(response_json)

    }
    callEndpoint()
}
$("#get-report-btn").on('click', getSGReport);
