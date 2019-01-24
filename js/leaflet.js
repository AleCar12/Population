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
    d3.csv("./countries/population-databank.csv", function (populationData) {
       


        // Prendere id da CSV
        // populationData[0]["Country Code"]

        // Prendere id da geoJSON
        // countriesData.features[i].id

        console.log(populationData);
        console.log(populationData.length);
        
        let idGeoJson = countriesData.features[0].properties.name;
        console.log(idGeoJson);
        
        let idCSV = populationData[0]["Country Code"];
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
            '<b>' + props.features.properties.name + '</b><br />' + props.density + ' people'
            : 'Hover over a country');
        };

        info.addTo(mymap);






        // Choropleth Test
        function getColor(population) {
            if (population > 10000000) { // Cento milioni
                return '#006d2c'
            } else if (population > 50000000) { // 50 milioni
                return '#2ca25f'
            } else if (population > 10000000) { // 10 milioni
                return '#66c2a4'
            } else if (population > 1000000) { // Un milione
                return '#b2e2e2'
            } else if (population > 0) {
                return '#edf8fb'
            } else {
                return "transparent"
            }
        }
        
        // for (let i = 0; i < populationData.length; i++) {
        //     let countryColor = populationData[i][2017];
        //     console.log (countryColor);
        //     return countryColor
        // }

        
        
        // Countries style
        function countryStyle(feature) {
            //console.log(feature);
            var countryId = feature.id,
                countryData = populationData.filter(function(d) { return d['Country Code'] === countryId; }), // Il metodo filter degli array ritorna un array dei soli elementi che soddisfano l'uguaglianza: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                countryPopulation = 0;

            if (countryData.length > 0) { // Hai trovato una corrispondenza
                countryPopulation = parseInt(countryData[0]['2017']); // Prendo il primo e unico elemento trovato, prendo il valore del 2017 e lo faccio diventare un numero
            } else {
                countryPopulation = 0; // Assenza del dato = popolazione uguale a 0
            }

            return {
                fillColor: getColor(countryPopulation),
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
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
            // Prova ad aggiungere qui un popup che mostri il nome del paese e la sua popolazione...
            // Vedi https://leafletjs.com/examples/geojson/ (capitolo onEachFeature)
            // Occhio che il popup si apre al click sul paese e tu già sopra gli dici di zoomare...
            // La popolazione la ricavi di nuovo come fatto prima nella funzione countryStyle
        }

        geojson = L.geoJson(
            countriesData,
            {
                onEachFeature: onEachFeature,
                style: countryStyle // Dal tutorial: https://leafletjs.com/examples/choropleth/ (capitolo Adding Some Color, secondo blocco di codice)
            },
        ).addTo(mymap);



        





        

    });
});