var mymap = L.map('mapid', {scrollWheelZoom:false}).setView([37, -0.09], 2);

// Crates map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW1lc2N1ZGkiLCJhIjoiY2pxczEzY2dxMDJkODQycWNzNHk5cno5cyJ9.6CNRsXMmHZaCBnxsyapgJA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light',
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

        
        console.log(population.length);
        
        let idGeoJson = countriesData.features[0].properties.name;
        console.log(idGeoJson);
        
        let idCSV = population[0]["Country Code"];
        console.log(idCSV);
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
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function (props) {
            this._div.innerHTML = '<h4>World Population</h4>' + (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Hover over a country');
        };

        info.addTo(mymap);






        // Choropleth Test

        //population[0][2017]

        function countryColor (population) {
            if ( population > 50000000000 ) {
                return '#006d2c'
            } else if ( population > 25000000000 ) {
                return '#2ca25f'
            } else if ( population > 10000000000 ) {
                return '#66c2a4'
            } else if ( population> 5000000 ) {
                return '#b2e2e2'
            } else {
                return '#edf8fb'
            }
        }

        for (let i = 0; i < population.length; i++) {
            // Countries style
            function countriesStyle (feature){
                return {
                    fillColor: countryColor(population[i][2017]),
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.7
                }
            }
            
            
        }




        // Map interaction
        function highlightFeature(e) {
            var layer = e.target;
        
            layer.setStyle({
                weight: 5,
                color: '#fff',
                dashArray: '',
                fillOpacity: 0.7
            });
        
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            
            function highlightFeature(e) {
                info.update(layer.feature.properties);
            }
        }
        
        var geojson;
        
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

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
        
        geojson = L.geoJson(
            countriesData,
            { style: countriesStyle },
            { onEachFeature: onEachFeature },
        ).addTo(mymap);



        





        

    });
});