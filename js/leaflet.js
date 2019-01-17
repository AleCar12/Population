var mymap = L.map('mapid', {scrollWheelZoom:false}).setView([37, -0.09], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW1lc2N1ZGkiLCJhIjoiY2pxczEzY2dxMDJkODQycWNzNHk5cno5cyJ9.6CNRsXMmHZaCBnxsyapgJA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //maxZoom: 2,
    //minZoom: 1.3,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiYW1lc2N1ZGkiLCJhIjoiY2pxczEzY2dxMDJkODQycWNzNHk5cno5cyJ9.6CNRsXMmHZaCBnxsyapgJA'
}).addTo(mymap);

d3.json("./countries/countries.geo.json", function(countriesData) {
    L.geoJson(countriesData).addTo(mymap);
});