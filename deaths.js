//https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097

// set margins for svg to fit screen well
var margin = {top: 5, right: 5, bottom: 50, left: 100},
  width = 800 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

var svg = d3.select(".DeathChart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set scales and axes of visualization
var x = d3.scaleLinear()
  .range([0,width]);
var y = d3.scalePow().exponent(0.3)
  .range([height,0]);
var xAxis = d3.axisBottom()
  .scale(x);
var yAxis = d3.axisLeft()
  .scale(y);

// set global variables
var deathData;
var deathThreshold;
var equality;

// update visualization given interaction
function updateDeathCsv() {

  // gather weather events selected
  SelectedWeatherEvents = []
  var checkboxes = document.getElementsByClassName("DeathChecks");

  for (i= 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked == true)
    SelectedWeatherEvents.push(checkboxes[i].id)
  }

  // filter data according to weather events selected
  filteredData = deathData.filter(function(element) {
    return SelectedWeatherEvents.includes(element.EVENT_TYPE)
  });

  // gather threshold for regression
  deathThreshold = deathSlider.value;
  deathOutput.innerHTML = "Regression line of<br>data points with:<br>Deaths "+equality+" "+deathSlider.value;
  var radiobuttons = document.getElementsByClassName("equality");

  for (i= 0; i < radiobuttons.length; i++) {
    if (radiobuttons[i].checked == true)
    equality = radiobuttons[i].value;
  }

  // get axes domain or range
  y.domain(d3.extent(filteredData, function(d){ return d.DEATHS}));
  x.domain(d3.extent(filteredData, function(d){ return d.TAVG}));

  // get data within threshold for second linear regression
  var ThresholdData = getThresholdDataGivenEquality();

  // calculate regression for all data points
  var line = d3.line().x(function(d) { return x(d.TAVG); }).y(function(d) { return y(d.DEATHS); });
  var regression_standard = ss.linearRegression(filteredData.map(function(d) {
    return [+d.TAVG, d.DEATHS]; }));
  var lin_s = ss.linearRegressionLine(regression_standard);
  var lindata_standard = x.domain().map(function(x) {
    return {
      TAVG: parseFloat(x),
      DEATHS: lin_s(+x)
    };});

  // calculate regression for data points within threshold
  var line2 = d3.line().x(function(d) { return x(d.TAVG); }).y(function(d) { return y(d.DEATHS); });
  var regression_standard2 = ss.linearRegression(ThresholdData.map(function(d) {
    return [+d.TAVG, d.DEATHS]; }));
  var lin_s2 = ss.linearRegressionLine(regression_standard2);
  var lindata_standard2 = x.domain().map(function(x) {
    return {
      TAVG: parseFloat(x),
      DEATHS: lin_s2(+x)
    };});

  lg = calculateLinearRegression(lindata_standard)
  lg2 = calculateLinearRegression(lindata_standard2)

  regression = document.getElementById("DeathEquation");
  regression.innerHTML = "y = " +lg.slope.toFixed(3)+"x + "+lg.intercept.toFixed(3);

  thresholdRegression = document.getElementById("DeathOutlierEquation");
  thresholdRegression.innerHTML = "y = " +lg2.slope.toFixed(3)+"x + "+lg2.intercept.toFixed(3);

  // Adjust regression line bounds to prevent crossing x-axis
  pointBound = pointBounds(lindata_standard[0],lg);
  pointBound2 = pointBounds(lindata_standard2[0],lg2);

  lindata_standard[0].TAVG = pointBound.x;
  lindata_standard[0].DEATHS = pointBound.y;
  lindata_standard2[0].TAVG = pointBound2.x;
  lindata_standard2[0].DEATHS = pointBound2.y;

  pointBound = pointBounds(lindata_standard[1],lg);
  pointBound2 = pointBounds(lindata_standard2[1],lg2);

  lindata_standard[1].TAVG = pointBound.x;
  lindata_standard[1].DEATHS = pointBound.y;
  lindata_standard2[1].TAVG = pointBound2.x;
  lindata_standard2[1].DEATHS = pointBound2.y;

  // remove all svg elements
  svg.selectAll("*").remove();

  // draw all svg elements to screen
  svg.selectAll(".point")
    .data(filteredData)
    .enter().append("circle")
    .attr("class", "point")
    .attr("r", 3)
    .attr("cy", function(d){ return y(d.DEATHS); })
    .attr("cx", function(d){ return x(d.TAVG); })
    .style("opacity", .5)
    .style("fill", "blue");

  svg.append("path")
    .datum(lindata_standard)
    .attr("class", "reg")
    .attr("d", line)
    .attr("stroke-width", 1)
    .attr("stroke", "red");

  svg.append("path")
    .datum(lindata_standard2)
    .attr("class", "reg")
    .attr("d", line2)
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
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ -55 +","+(height/2)+")rotate(-90)")
    .text("Deaths");

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width/2) +","+(height+40)+")")
    .text("Average Temperature");
};

// update slider text
function updateSlider() {
  deathOutput.innerHTML = "Regression line of<br>data points with:<br>Deaths "+equality+" "+deathSlider.value;
};

// get equality given equality chosen by radio button
function updateEquality() {
  var radiobuttons = document.getElementsByClassName("equality");
  for (i= 0; i < radiobuttons.length; i++) {
    if (radiobuttons[i].checked == true)
    equality = radiobuttons[i].value;
  }
  updateDeathCsv();
};

// get threshold given the equality selected on screen
function getThresholdDataGivenEquality() {
  if (equality == ">")
    return filteredData.filter(function(element) {return element.DEATHS >= deathThreshold});
  else if (equality == "<") {
    return filteredData.filter(function(element) {return element.DEATHS <= deathThreshold});
  }
};

// read all data from tsv
d3.tsv("data/deaths.tsv", types, function(error, data){
  data.forEach(function(d) {
    d.DEATHS = parseInt(d.DEATHS);
    d.TAVG = parseFloat(d.TAVG);
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

function calculateLinearRegression(points) {
  x1 = points[0].TAVG
  y1 = points[0].DEATHS
  x2 = points[1].TAVG
  y2 = points[1].DEATHS

  m = (y2-y1)/(x2-x1);
  b = y1 - m*x1

  return {
    slope: m,
    intercept: b
  }
}

function pointBounds(point, lg) {
  if (parseFloat(point.DEATHS) > 0) {
    return {
      x: point.TAVG,
      y: point.DEATHS
    };
  }

  var y = 0;
  var x = (y - lg.intercept)/lg.slope;

  return {
    x: x,
    y: 0
  }
}
