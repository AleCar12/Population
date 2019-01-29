setTimeout( function () { $('#whiteSquare').fadeOut('slow')}, 500 );


var map = L.map('mapid', { scrollWheelZoom:false }).setView([20, -1], 2);

// Crates map
var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);
// Add Countries labels on map
var CartoDB_PositronOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
}).addTo(map);



// Countries borders and population
// Import JSON
d3.json("./countries/countries.geo.json", function(countriesData) {
    // Import csv
    d3.csv("./countries/population-databank.csv", function (populationData) {
        
        // Countries list with Handelbars js
        var source = document.getElementById("countriesTemplate").innerHTML;
        var template = Handlebars.compile(source);

        for (let i = 0; i < countriesData.features.length; i++) {

            var context = {
                country: countriesData.features[i].properties.name,
                id: countriesData.features[i].id
            }
            var html = template(context);
            document.getElementById("countriesList").innerHTML += html;
        }


        // Choropleth countries
        function getColor(population) {
            if (population > 50000000) { // 50 milion
                return '#006d2c'
            } else if (population > 25000000) { // 25 milion
                return '#2ca25f'
            } else if (population > 10000000) { // 10 milion
                return '#66c2a4'
            } else if (population > 5000000) { // 5 milion
                return '#99d8c9'
            } else if (population > 1000000) { // 1 milion
                return '#ccece6'
            } else if (population > 0) {
                return '#edf8fb'
            } else {
                return '#D1D1D1'
            }
        }        
        
        // Countries style
        function countryStyle(feature) {
            var countryId = feature.id,
                countryData = populationData.filter(function(d) { return d['Country Code'] === countryId; }), // Il metodo filter degli array ritorna un array dei soli elementi che soddisfano l'uguaglianza: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                countryPopulation = 0;

            if (countryData.length > 0) { // Finds one correspondence
                countryPopulation = parseInt(countryData[0]['']); // Gets first element found
            } else {
                countryPopulation = 0; // If data not found then 0
            }

            return {
                fillColor: getColor(countryPopulation),
                color: getColor(countryPopulation),
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
            }

        }
        

        // Map interaction
        // Highlight country layer
        function highlightFeature(e) {
            var layer = e.target;
            
            layer.setStyle({
                fillColor: '#8D8787',
                weight: 3,
                color: '#8D8787',
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
        
        // Zoom on click
        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }


        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature,
            });            

            // Gets every country population
            var countryId = feature.id,
            countryData = populationData.filter(function(d) { return d['Country Code'] === countryId; }),
            countryPopulation = 0;
            countrySelected = 0;
            
            if (countryData.length > 0) {
                countryPopulation = parseInt(countryData[0]['']);
                countrySelected = countryData[0]['Country Name'];
            } else {
                countryPopulation = 'Undefined';
            }

            // Shows countries name and population on click
            if (feature.properties.name && countryPopulation != 'Undefined') {
                layer.bindPopup('<b>' + feature.properties.name + '</b><br>'
                + countryPopulation.toLocaleString() + ' ' + 'people' );
            } else {
                layer.bindPopup('<b>' + feature.properties.name + '</b><br>'
                + countryPopulation.toLocaleString() );
            };
        }
        
        geojson = L.geoJson(
            countriesData,
            {
                onEachFeature: onEachFeature,
                style: countryStyle
            }
        ).addTo(map);
    });
});