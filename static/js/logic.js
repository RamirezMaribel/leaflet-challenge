// Creating the map object
let myMap = L.map("map", {
    center: [37.8, -96],
    zoom: 5
});

// Adding the tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Adding topo layer
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Funtion to determine marker size based on magnitude
function markerSize(magnitude){ 
    return magnitude*5;
}

//Function to determine marker color based on depth
function markerColor(depth){
    if(depth >90) return "#de2d26";
    else if (depth >70) return "#fc9272";
    else if (depth >50) return "#fec44f";
    else if (depth >30) return "#feb24c";
    else if (depth >10) return "#9ecae1";
    else return "#a1d99b"
}

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

    //Function to create features for each earthquake
    function createFeatures(feature, layer){
        layer.bindPopup(`<h3>Magnitude:${feature.properties.mag}</h3><h3>Location:${feature.properties.place}</h3><h3>Depth:${feature.geometry.coordinates[2]}</h3>`);
    }
    
    //GeoJSON layer containing the features and calling both marker functions
    L.geoJSON(data,{
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            })
        },
        onEachFeature: createFeatures
    }).addTo(myMap);

//Set up ledgend
let legend=L.control({ position: "bottomright"});

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10,10,30,50,70,90]
    let colors = ["#a1d99b","#9ecae1","#feb24c","#fec44f","#fc9272","#de2d26"];

//loop though intervals and label the colored squares
for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
}

return div};

//add legend to the map
legend.addTo(myMap);

});

//Base maps
let baseMaps={
    "Street Map": street,
    "Topographic Map": topo
};

//Addd layer control to map
L.control.layers(baseMaps).addTo(myMap);