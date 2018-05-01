//https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097

    var margin = {top: 5, right: 5, bottom: 50, left: 100},
	     width = 475 - margin.left - margin.right,
	     height = 475 - margin.top - margin.bottom;

	  var svg = d3.select(".DeathChart").append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  var x = d3.scaleTime().range([0, width]);
	  var y = d3.scaleLinear().range([height,0]);

	  var xAxis = d3.axisBottom()
	      .scale(x).ticks(5);

	  var yAxis = d3.axisLeft()
	      .scale(y).ticks(5);

    var deathData;
    var deathThreshold;
    var equality;

    function updateDeathCsv() {

      y.domain(d3.extent(deathData, function(d) {return d.DEATHS}));
      x.domain(d3.extent(deathData, function(d){ return d.YEAR}));

      // see below for an explanation of the calcLinear function
	  var line = d3.line().x(function(d) { return x(d.YEAR); }).y(function(d) { return y(d.DEATHS); });
	  var regression_standard = ss.linearRegression(deathData.map(function(d) {
      return [+d.YEAR, d.DEATHS]; }));
	  var lin_s = ss.linearRegressionLine(regression_standard);
	  var lindata_standard = x.domain().map(function(x) {
      return {
             YEAR: new Date(x),
             DEATHS: lin_s(+x)
              };});

      svg.selectAll("*").remove();

      var color = d3.scaleSequential(d3.interpolateReds).domain([d3.min(deathData, function(d) { return d.TAVG }) - 1, d3.max(deathData, function(d) { return d.TAVG }) + 1]);
      var size = d3.scaleLinear().domain(d3.extent(deathData, function(d) { return d.SUMEVENTS
        })).range([3, 9]);
		
	   svg.append("g")
	   .attr("class", "legendSequential")
	   .attr("transform", "translate(20,20)");
	   var legendSequential = d3.legendColor()
		.shapeWidth(30)
		.cells(8)
		.orient("vertical")
		.scale(color) 
	   svg.select(".legendSequential")
       .call(legendSequential);

      svg.selectAll(".point")
          .data(deathData)
          .enter().append("circle")
          .attr("class", "point")
          .attr("r", function(d) {
                return size(d.SUMEVENTS)
            })
          .attr("cy", function(d){ return y(d.DEATHS); })
          .attr("cx", function(d){ return x(d.YEAR); })
          .style("opacity", .7)
          .style("fill", function(d) {
                return color(d.TAVG)
            });

        svg.append("path")
        .datum(lindata_standard)
        .attr("class", "reg")
        .attr("d", line)
        .attr("stroke-width", 1)
        .attr("stroke", "green");


      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ -55 +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
                .text("Deaths");

     svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (width/2) +","+(height+40)+")")  // centre below axis
                .text("Year");

		mean = Math.round(d3.mean(deathData, function(d){ return d.TAVG}));
		svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height-180)+")")  // centre below axis
        .text("Average Temperature: " + mean + " Celsius.");
    };

    function updateSlider() {
      deathOutput.innerHTML = "Deaths "+equality+" "+deathSlider.value;
    };
	  var parseDate = d3.timeParse("%Y");
      var formatDate = d3.timeFormat("%Y");
	  d3.tsv("data/deaths_aggregated.tsv", types, function(error, data){
      data.forEach(function(d) {
            d.YEAR = parseDate(d.YEAR);
            d.DEATHS = parseInt(d.DEATHS);
            d.TAVG = parseFloat(d.TAVG);
            d.SUMEVENTS = parseInt(d.SUMEVENTS);
      });
      deathData = data;
      var deathSlider = document.getElementById("deathSlider");
      var deathOutput = document.getElementById("deathOutput");
      updateDeathCsv();
	  });


	  function types(d){
	    d.x = +d.TAVG;
	    d.y = +d.DEATHS;

	    return d;
	  }
