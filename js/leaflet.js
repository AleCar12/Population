var map = L.map('mapid', {scrollWheelZoom:false}).setView([37, -0.09], 2);

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
       

// DA TOGLIERE
        // Prendere id da CSV
        // populationData[0]["Country Code"]

        // Prendere id da geoJSON
        // countriesData.features[i].id

        // console.log(populationData);
        
        // let idGeoJson = countriesData.features[0].id;
        // console.log(idGeoJson);
        
        // let idCSV = populationData[0]["Country Code"];
        // console.log(idCSV);
// DA TOGLIERE


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
        





        // Info box
        // var info = L.control();

        // info.onAdd = function (map) {
        //     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        //     this.update();
        //     return this._div;
        // };

        // // method that we will use to update the control based on feature properties passed
        // info.update = function (props) {
        //     this._div.innerHTML = '<h4>World Population</h4>' + (props ?
        //     '<b>' + props.features.properties.name + '</b><br />' + props.density + ' people'
        //     : 'Hover over a country');
        // };

        // info.addTo(map);



        // Choropleth countries
        function getColor(population) {
            if (population > 50000000) { // 50 milioni
                return '#006d2c'
            } else if (population > 25000000) { // 25 milioni
                return '#2ca25f'
            } else if (population > 10000000) { // 10 milioni
                return '#2ca25f'
            } else if (population > 5000000) { // 5 milioni
                return '#66c2a4'
            } else if (population > 1000000) { // 1 milione
                return '#b2e2e2'
            } else if (population > 0) {
                return '#edf8fb'
            } else {
                return "#D1D1D1"
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

        // Highlight feature
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

            //info.update(layer.feature.properties);
        }
        
        
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            //info.update();
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
            
            if (countryData.length > 0) {
                countryPopulation = parseInt(countryData[0]['']); 
            } else {
                countryPopulation = 'NaN';
            }

            // Shows countries name on click
            if (feature.properties.name) {
                layer.bindPopup('<b>' + feature.properties.name + '</b><br>'
                                + countryPopulation + ' ' + 'people');
            };
        };

        geojson = L.geoJson(
            countriesData,
            {
                onEachFeature: onEachFeature,
                style: countryStyle
            }
        ).addTo(map);
    });
});