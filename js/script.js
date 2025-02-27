// Loading CSV file and TopoJSON file
Promise.all([
    d3.csv("data/national_health_data_2024.csv"),
    d3.json("data/counties-10m.json")
 ]).then(([data, geoData]) => {
    console.log("CSV Data Loaded:", data);
    console.log("JSON Data Loaded:", geoData);
 
    if (geoData.objects.counties) {
        var geoJSON = topojson.feature(geoData, geoData.objects.counties);
        console.log("GeoJSON conversion successful:", geoJSON);
    } else {
        console.error("GeoJSON conversion failed: Missing 'counties' in TopoJSON file.");
        return;
    }
 
    data.forEach(d => {
        d.cnty_fips = d.cnty_fips.toString().padStart(5, "0");
        d.elderly_percentage = +d.elderly_percentage || 0;//passing the attributes
        d.percent_no_health_insurance = +d.percent_no_heath_insurance || 0; 
        d.median_household_income = +d.median_household_income || 0;
        d.education_less_than_high_school_percent = +d.education_less_than_high_school_percent || 0; 
    });
 
    updateVisualizations("elderly_percentage");
 
    document.getElementById("x-attribute-select").addEventListener("change", function () {
     let selectedXAttribute = this.value;
     let selectedYAttribute = document.getElementById("attribute-select").value;
     updateVisualizations(selectedXAttribute, selectedYAttribute);
 });
 
 document.getElementById("attribute-select").addEventListener("change", function () {
     let selectedXAttribute = document.getElementById("x-attribute-select").value;
     let selectedYAttribute = this.value;
     updateVisualizations(selectedXAttribute, selectedYAttribute);
 });
 
 function updateVisualizations(xAttr, yAttr) {
     if(yAttr==undefined){
         yAttr="elderly_percentage";
     }
     d3.select("#histogram-elderly").selectAll("*").remove();
     d3.select("#map-elderly").selectAll("*").remove();
     d3.select("#scatterplot").selectAll("*").remove();
     d3.select("#map-income").selectAll("*").remove();
 
     const colorMapping = {
         "elderly_percentage": d3.interpolateOranges,
         "percent_no_health_insurance": d3.interpolateWarm,
         "median_household_income": d3.interpolateBrBG,
         "education_less_than_high_school_percent": d3.interpolateMagma
     };
 
     let colorScheme = colorMapping[yAttr] || "Greys";
 
     if (data.some(d => d[yAttr] > 0)) {
         createHistogram(data, yAttr, "#histogram-elderly", `${yAttr.replace(/_/g, " ")} (%)`, "Reds");
         createScatterPlot(data, xAttr, yAttr, "#scatterplot");  
     } else {
         d3.select("#histogram-elderly").append("p").text("No valid data available for histogram.");
         d3.select("#scatterplot").append("p").text("No valid data available for scatter plot.");
     }
     createChoroplethMap(data, geoJSON, yAttr, "#map-elderly", `${yAttr.replace(/_/g, " ")} (%)`, colorScheme);
     createChoroplethMap(data, geoJSON, "median_household_income", "#map-income", "Median Household Income", "Greens");
 }
 
    function createHistogram(data, attr, container, title, color) {
     const validData = data.filter(d => d[attr] > 0);
     if (validData.length === 0) {
         d3.select(container).html("<p>No data available for histogram.</p>");
         return;
     }
 
     const width = 500, height = 300, margin = { top: 20, right: 30, bottom: 60, left: 70 };
 
     // Select or create the SVG container
     let svg = d3.select(container).select("svg");
     if (svg.empty()) {
         svg = d3.select(container)
             .append("svg")
             .attr("width", width)
             .attr("height", height);
         
         // Add X-axis label
         svg.append("text")
             .attr("class", "x-label")
             .attr("x", width / 2)
             .attr("y", height - 10)
             .attr("text-anchor", "middle")
             .style("font-size", "14px");
 
         // Add Y-axis label
         svg.append("text")
             .attr("class", "y-label")
             .attr("transform", "rotate(-90)")
             .attr("y", 15)
             .attr("x", -height / 2)
             .attr("text-anchor", "middle")
             .style("font-size", "14px");
     }
 
     const x = d3.scaleLinear()
         .domain(d3.extent(validData, d => d[attr])).nice()
         .range([margin.left, width - margin.right]);
 
     const bins = d3.histogram()
         .domain(x.domain())
         .thresholds(x.ticks(20))
         (validData.map(d => d[attr]));
 
     const y = d3.scaleLinear()
         .domain([0, d3.max(bins, d => d.length)]).nice()
         .range([height - margin.bottom, margin.top]);
 
     const tooltip = d3.select("body").select(".tooltip");
     if (tooltip.empty()) {
         d3.select("body")
             .append("div")
             .attr("class", "tooltip")
             .style("display", "none")
             .style("position", "absolute")
             .style("background", "rgba(0, 0, 0, 0.8)")
             .style("color", "white")
             .style("padding", "8px")
             .style("border-radius", "5px")
             .style("font-size", "12px")
             .style("pointer-events", "none");
     }
 
     // Update X & Y axis
     svg.selectAll(".x-axis").remove();
     svg.selectAll(".y-axis").remove();
 
     svg.append("g")
         .attr("class", "x-axis")
         .attr("transform", `translate(0,${height - margin.bottom})`)
         .call(d3.axisBottom(x));
 
     svg.append("g")
         .attr("class", "y-axis")
         .attr("transform", `translate(${margin.left},0)`)
         .call(d3.axisLeft(y));
 
     // Update labels
     svg.select(".x-label").text(attr.replace(/_/g, " "));
     svg.select(".y-label").text("Frequency");
 
     const bars = svg.selectAll("rect").data(bins);
 
     // Remove old bars
     bars.exit()
         .transition().duration(500)
         .attr("height", 0)
         .remove();
 
     // Update existing bars
     bars.transition().duration(500)
         .attr("x", d => x(d.x0) + 1)
         .attr("y", d => y(d.length))
         .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
         .attr("height", d => y(0) - y(d.length));
 
     // Add new bars
     bars.enter().append("rect")
         .attr("x", d => x(d.x0) + 1)
         .attr("y", height - margin.bottom) // Start from bottom for animation
         .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
         .attr("height", 0) // Start with 0 height
         .attr("fill", "#addd8e")
         .attr("opacity", 0.8)
         .on("mouseover", function (event, d) {
             d3.select(this).transition().duration(200).attr("opacity", 1);
             tooltip.style("display", "block")
                 .html(`Range: ${d.x0.toFixed(2)} - ${d.x1.toFixed(2)}<br>Count: ${d.length}`)
                 .style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 20) + "px");
         })
         .on("mouseout", function () {
             d3.select(this).transition().duration(200).attr("opacity", 0.8);
             tooltip.style("display", "none");
         })
         .transition().duration(2000) 
         .attr("y", d => y(d.length))
         .attr("height", d => y(0) - y(d.length));
 }
 
   
 function createScatterPlot(data, xAttr, yAttr, container) {
     const validData = data.filter(d => d[xAttr] > 0 && d[yAttr] > 0);
     if (validData.length === 0) {
         d3.select(container).html("<p>No data available for scatter plot.</p>");
         return;
     }
 
     const width = 600, height = 400, margin = { top: 20, right: 50, bottom: 60, left: 70 };
 
     let svg = d3.select(container).select("svg");
     if (svg.empty()) {
         svg = d3.select(container)
             .append("svg")
             .attr("width", width)
             .attr("height", height);
         
         svg.append("text")
             .attr("class", "x-label")
             .attr("x", width / 2)
             .attr("y", height - 10)
             .attr("text-anchor", "middle")
             .style("font-size", "14px");
 
         svg.append("text")
             .attr("class", "y-label")
             .attr("transform", "rotate(-90)")
             .attr("y", 15)
             .attr("x", -height / 2)
             .attr("text-anchor", "middle")
             .style("font-size", "14px");
     }
 
     const x = d3.scaleLinear()
         .domain(d3.extent(validData, d => d[xAttr])).nice()
         .range([margin.left, width - margin.right]);
 
     const y = d3.scaleLinear()
         .domain(d3.extent(validData, d => d[yAttr])).nice()
         .range([height - margin.bottom, margin.top]);
 
     svg.selectAll(".x-axis").remove();
     svg.selectAll(".y-axis").remove();
 
     svg.append("g")
         .attr("class", "x-axis")
         .attr("transform", `translate(0,${height - margin.bottom})`)
         .call(d3.axisBottom(x));
 
     svg.append("g")
         .attr("class", "y-axis")
         .attr("transform", `translate(${margin.left},0)`)
         .call(d3.axisLeft(y));
 
     svg.select(".x-label").text(xAttr.replace(/_/g, " "));
     svg.select(".y-label").text(yAttr.replace(/_/g, " "));
 
     const points = svg.selectAll("circle").data(validData, d => d.cnty_fips);
 
     // Removing Old Points
     points.exit()
         .transition().duration(200)
         .attr("r", 0) // Shrink the points
         .attr("opacity", 0) // Fade out
         .remove();
 
     // Existing Points Move
     points.transition().duration(200)
         .attr("cx", d => x(d[xAttr]))
         .attr("cy", d => y(d[yAttr]))
         .attr("fill", "#ffcc66") 
         .attr("opacity", 0.8);
 
     // New Points Appear
     points.enter().append("circle")
         .attr("cx", d => x(d[xAttr]))
         .attr("cy", d => y(d[yAttr]))
         .attr("r", 0)  
         .attr("fill", "#addd8e")
         .attr("opacity", 0)
         .transition().duration(500)
         .attr("r", 8)  
         .attr("opacity", 0.8);
 
     // Brush Function
     const brush = d3.brush()
         .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
         .on("brush end", function(event) {
             if (!event.selection) return;
             const [[x0, y0], [x1, y1]] = event.selection;
             const selectedData = validData.filter(d => x(d[xAttr]) >= x0 && x(d[xAttr]) <= x1 &&
                                                        y(d[yAttr]) >= y0 && y(d[yAttr]) <= y1);
 
             points.transition().duration(10)
                 .attr("fill", d => selectedData.includes(d) ? "orange" : "#ffcc66"); 
 
             createHistogram(selectedData, yAttr, "#histogram-elderly", `${yAttr.replace(/_/g, " ")} (%)`, "teal");
             createChoroplethMap(selectedData, geoJSON, yAttr, "#map-elderly", `${yAttr.replace(/_/g, " ")} (%)`, "interpolateOranges");
         });
 
     svg.selectAll(".brush").remove();
     svg.append("g").attr("class", "brush").call(brush);
 }
 
 
 
 function createChoroplethMap(data, geoData, attr, container, title, colorScheme) {
    d3.select(container).selectAll("*").remove();
    const width = 600, height = 400;
    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("display", "none");
 
    geoData.features.forEach(feature => {
        let county = data.find(d => d.cnty_fips === feature.id);
        feature.properties.value = county ? county[attr] : 0;
        feature.properties.name = county ? county.display_name : "Unknown County";
    });
 
    const extentValues = d3.extent(data, d => d[attr]);
 
    if (!extentValues || extentValues[0] === undefined || extentValues[1] === undefined) {
        //console.error(`Invalid data for attribute: ${attr}`);
        d3.select(container).append("p").text("No valid data available for this attribute.");
        return;
    }
 
    const svg = d3.select(container).append("svg").attr("width", width).attr("height", height);
    const projection = d3.geoAlbersUsa().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);
    const colorScale = d3.scaleSequential(colorScheme).domain(extentValues);
 
 
    svg.selectAll("path").data(geoData.features).enter().append("path")
        .attr("d", path)
        .attr("fill", d => d.properties.value ? colorScale(d.properties.value) : "#ccc")
        .attr("stroke", "#000").attr("stroke-width", 0.2)
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`<strong>${d.properties.name}</strong><br>${title}: ${d.properties.value ? d.properties.value.toFixed(2) + '%' : 'No Data'}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"))
        .on("click", (event, d) => {
            
            d3.selectAll("path").attr("stroke-width", 0.2);
            d3.select(event.target).attr("stroke-width", 2).attr("stroke", "black");
 
            
            let selectedCountyData = data.filter(row => row.cnty_fips === d.id);
            createHistogram(selectedCountyData, attr, "#histogram-elderly", `${attr.replace(/_/g, " ")} (%)`, "teal");
            createScatterPlot(selectedCountyData, "elderly_percentage", attr, "#scatterplot");
        });
 
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
 }
 
 }).catch(error => {
   console.error("Error loading data:", error);
 });
 