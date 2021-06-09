// require('dotenv').config();
// console.log(process.env);

// Base Tileset Layers
mapLink = '<a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>';
infoLink = '<a href="https://djlorenz.github.io/astronomy/lp2016/" target="_blank">Light Pollution Atlas Information</a>';

var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/bgcastro/xxxx/tiles/256/{z}/{x}/{y}?access_token=xxxx', {
    attribution: 'Mapbox Test',
    maxZoom: 17,
})

var standard = L.tileLayer(
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

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
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
    layers: [standard, lightpollution2016]
});

// Create and add sidebar
var sidebar = L.control.sidebar({ container: 'sidebar' })
    .addTo(map)

sidebar.options.autopan = true;

//Add all layers and overlay to layer control and add to map
var baseLayers = {
    "Mapbox Dark": mapbox,
    "OpenStreetMap": standard,
    "Esri WorldImagery": Esri_WorldImagery,
    "Esri WorldTopoMap": Esri_WorldTopoMap,
    "OpenTopoMap": topo
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
function addMarker(e) {

    // Add marker to map at click location;
    if (newMarker != undefined) {
        map.removeLayer(newMarker);
    };
    newMarker = new L.marker(e.latlng).addTo(map);
    var coords = { "lat": e.latlng.lat, "lng": e.latlng.lng }
    var coodrs_text_lat = formatLat(coords.lat)+",";
    var coords_text_lng = formatLng(coords.lng);
    $("#selected-coords-lat").text(coodrs_text_lat);
    $("#selected-coords-lng").text(coords_text_lng);
    console.log(coords)
}
map.on('click', addMarker);


//Stargaze Button Click: Open thing, call API (eventually)
function openSidebar(){
    sidebar.open('data');
}
$("#get-report-btn").on('click', openSidebar);
