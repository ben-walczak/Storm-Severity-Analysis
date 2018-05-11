//https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097

var margin = {top: 15, right: 100, bottom: 50, left: 100},
width = 800 - margin.left - margin.right,
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

      lg = calculateLinearRegression(lindata_standard)

      // Adjust regression line bounds to prevent crossing x-axis
      pointBound = pointBounds(lindata_standard[0],lg);

      lindata_standard[0].YEAR = new Date(pointBound.x, 0);
      lindata_standard[0].DEATHS = pointBound.y;

      console.log(lindata_standard);

      svg.selectAll("*").remove();

      var color = d3.scaleSequential(d3.interpolateReds).domain([d3.min(deathData, function(d) { return d.TAVG }) - 1, d3.max(deathData, function(d) { return d.TAVG }) + 1]);
      var size = d3.scaleLinear().domain(d3.extent(deathData, function(d) { return d.SUMEVENTS
      })).range([4, 8]);

      svg.append("g")
      .attr("class", "legendSequential")
      .attr("transform", "translate(650,15)");
      var legendSequential = d3.legendColor()
      .shape('circle')
      .orient("vertical")
      .scale(color)

      svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate(610,65)")  // centre below axis
      .text("Celsius");

      svg.select(".legendSequential")
      .call(legendSequential);

      svg.append("g")
      .attr("class", "legendSize")
      .attr("transform", "translate(650,175)");
      svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate(635,240)rotate(-90)")  // centre below axis
      .text("Weather Events");

      var legendSize = d3.legendSize()
      .labelFormat(".0s")
      .shape('circle')
      .shapePadding(10)
      .labelOffset(10)
      .orient("vertical")
      .scale(size);

      svg.select(".legendSize")
      .call(legendSize);

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
      .attr("transform", "translate("+ 660 +","+(height-280)+")")  // centre below axis
      .text("TAVG: " + mean + " C");
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
      d.x = +d.YEAR;
      d.y = +d.DEATHS;

      return d;
    }

    function calculateLinearRegression(points) {
      x1 = 1950
      y1 = points[0].DEATHS
      x2 = 2017
      y2 = points[1].DEATHS

      m = (y2-y1)/(x2-x1);
      b = y1 - m*x1

      return {
        slope: m,
        intercept: b
      }
    }

    function pointBounds(point, lg) {
      var y = 0;
      var x = (y - lg.intercept)/lg.slope;

      return {
        x: x,
        y: 0
      }
    }
