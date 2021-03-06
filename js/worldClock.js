// population.io JSON
d3.json("http://api.population.io:80/1.0/population/World/today-and-tomorrow/?format=json", function(data) {
    
    // Calculates number of people born per second
    let worldPopulationToday = data.total_population[0].population;
    let worldPopulationTomorrow = data.total_population[1].population;
    let peopleBornPerSecond = Math.ceil((data.total_population[1].population - data.total_population[0].population) / (24 * 60 * 60));
    
    // Write in html the world population today
    $("#worldClock").text(worldPopulationToday);
    
    // Add every second peopleBornPerSecond and replaces the new
    var populationNow = parseInt($("#worldClock").text());
    let comma = d3.format(",");
    let newWorldPopulationToday = setInterval(function() { $("#worldClock").text( comma( populationNow = populationNow + peopleBornPerSecond) ); }, 1000);    
});