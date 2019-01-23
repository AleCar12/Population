var mymap = L.map('mapid', {scrollWheelZoom:false}).setView([37, -0.09], 2);

// Crates map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW1lc2N1ZGkiLCJhIjoiY2pxczEzY2dxMDJkODQycWNzNHk5cno5cyJ9.6CNRsXMmHZaCBnxsyapgJA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light',
    path: 'red',
    accessToken: 'pk.eyJ1IjoiYW1lc2N1ZGkiLCJhIjoiY2pxczEzY2dxMDJkODQycWNzNHk5cno5cyJ9.6CNRsXMmHZaCBnxsyapgJA'
}).addTo(mymap);

// Countries borders and population
// Import JSON
d3.json("./countries/countries.geo.json", function(countriesData) {
    // Import csv
    d3.csv("./countries/population-databank.csv", function (population) {
       
        // Prendere id da CSV
        // population[0]["Country Code"]

        // Prendere id da geoJSON
        // countriesData.features[i].id

        
        console.log(countriesData);
        
        let idGeoJson = countriesData.features[0].id;
        console.log(idGeoJson);
        
        let idCSV = population[0]["Country Code"];
        console.log(idCSV);
        // DA TOGLIERE
        

        
        L.geoJson(countriesData).addTo(mymap);




        // Map interaction
        function highlightFeature(e) {
            var layer = e.target;
        
            layer.setStyle({
                weight: 5,
                color: '#777',
                dashArray: '',
                fillOpacity: 0.7
            });
        
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        function resetHighlight(e) {
            geojson.resetStyle(e.target);
        }

        var geojson;

        function zoomToFeature(e) {
            mymap.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }
        
        geojson = L.geoJson(countriesData, {
            onEachFeature: onEachFeature
        }).addTo(mymap);

        // // Tiles color
        // function style(feature) {
        //     return {
        //         fillColor: 'red',
        //         weight: 0,
        //         opacity: 1,
        //         color: 'white',
        //         dashArray: '3',
        //         fillOpacity: 0.7
        //     };
        // }
        // L.geoJson(countriesData, {style: style}).addTo(mymap);



        






        
        // Countries list with Handelbars js
        var source = document.getElementById("countriesTemplate").innerHTML;
        var template = Handlebars.compile(source);

        for ( let i = 0; i < countriesData.features.length; i++ ){

            var context = {
                country: countriesData.features[i].properties.name,
                id: countriesData.features[i].id
            }
            var html = template(context);
            document.getElementById("countriesList").innerHTML += html;
        }
    });
});