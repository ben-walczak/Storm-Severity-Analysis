//https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097

    var margin = {top: 5, right: 5, bottom: 50, left: 100},
	     width = 450 - margin.left - margin.right,
	     height = 450 - margin.top - margin.bottom;

	  var svg = d3.select(".DeathChart").append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  var x = d3.scaleLinear()
	      .range([0,width]);

	  var y = d3.scaleLinear()
	      .range([height,0]);

	  var xAxis = d3.axisBottom()
	      .scale(x);

	  var yAxis = d3.axisLeft()
	      .scale(y);

    var deathData;
    var deathThreshold;
    var equality;

    function updateDeathCsv() {
      // .value = "on" is checked
      // .id = weather event
      SelectedWeatherEvents = []

      deathThreshold = deathSlider.value;
      deathOutput.innerHTML = "Deaths "+equality+" "+deathSlider.value;

      var checkboxes = document.getElementsByClassName("DeathChecks");
      var radiobuttons = document.getElementsByClassName("equality");

      for (i= 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == true)
            SelectedWeatherEvents.push(checkboxes[i].id)
      }

      for (i= 0; i < radiobuttons.length; i++) {
        if (radiobuttons[i].checked == true)
            equality = radiobuttons[i].value;
      }

      //SelectedWeatherEvents = ["Tornado","Hurricane"];
      UsedData = deathData.filter(function(element) {
        return SelectedWeatherEvents.includes(element.EVENT_TYPE)
      });


      y.domain(d3.extent(UsedData, function(d){ return d.DEATHS}));
      x.domain(d3.extent(UsedData, function(d){ return d.TAVG}));

      var outlierData = getOutlierDataGivenEquality();

      // see below for an explanation of the calcLinear function
      var lg = calcLinear(UsedData, "x", "y", d3.min(UsedData, function(d){ return d.TAVG}), d3.max(UsedData, function(d){ return d.TAVG}));
      var lg2 = calcLinear(outlierData, "x", "y", d3.min(UsedData, function(d){ return d.TAVG}), d3.max(UsedData, function(d){ return d.TAVG}));
      console.log(lg2)

      svg.selectAll("*").remove();

      svg.selectAll(".point")
          .data(UsedData)
          .enter().append("circle")
          .attr("class", "point")
          .attr("r", 3)
          .attr("cy", function(d){ return y(d.DEATHS); })
          .attr("cx", function(d){ return x(d.TAVG); })
          .style("opacity", .5)
          .style("fill", "blue");

      svg.append("line")
          .attr("class", "regression")
          .attr("x1", x(lg.ptA.x))
          .attr("y1", y(lg.ptA.y))
          .attr("x2", x(lg.ptB.x))
          .attr("y2", y(lg.ptB.y))
          .attr("stroke-width", 1)
          .attr("stroke", "red");

      svg.append("line")
          .attr("class", "regression")
          .attr("x1", x(lg2.ptA.x))
          .attr("y1", y(lg2.ptA.y))
          .attr("x2", x(lg2.ptB.x))
          .attr("y2", y(lg2.ptB.y))
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
                .attr("transform", "translate("+ -40 +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
                .text("Deaths");

            svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (width/2) +","+(height+40)+")")  // centre below axis
                .text("Average Temperature");
    };

    function updateSlider() {
      deathOutput.innerHTML = "Deaths "+equality+" "+deathSlider.value;
    };

	  d3.tsv("deaths.tsv", types, function(error, data){
      data.forEach(function(d) {
        d.TAVG = parseFloat(d.TAVG);
      });
      deathData = data;
      var deathSlider = document.getElementById("deathSlider");
      var deathOutput = document.getElementById("deathOutput");
      updateDeathCsv();
	  });

    function getOutlierDataGivenEquality() {
      if (equality == ">")
        return UsedData.filter(function(element) {return element.DEATHS >= deathThreshold});
      else if (equality == "<") {
        return UsedData.filter(function(element) {return element.DEATHS <= deathThreshold});
      }
    };

    function updateEquality() {
      var radiobuttons = document.getElementsByClassName("equality");
      for (i= 0; i < radiobuttons.length; i++) {
        if (radiobuttons[i].checked == true)
            equality = radiobuttons[i].value;
      }
      updateDeathCsv();
    };



	  function types(d){
	    d.x = +d.TAVG;
	    d.y = +d.DEATHS;

	    return d;
	  }

    // Calculate a linear regression from the data

		// Takes 5 parameters:
    // (1) Your data
    // (2) The column of data plotted on your x-axis
    // (3) The column of data plotted on your y-axis
    // (4) The minimum value of your x-axis
    // (5) The minimum value of your y-axis

    // Returns an object with two points, where each point is an object with an x and y coordinate

    function calcLinear(data, x, y, minX, maxX){
      /////////
      //SLOPE//
      /////////

      // Let n = the number of data points
      var n = data.length;

      // Get just the points
      var pts = [];
      data.forEach(function(d,i){
        var obj = {};
        obj.x = d[x];
        obj.y = d[y];
        obj.xy = obj.x*obj.y;
        pts.push(obj);
      });

			// Print the equation below the chart
			//document.getElementsByClassName("DeathEquation").innerHTML = "y = " + m + "x + " + b;
			//document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + b + " ) / " + m;

      var xysum = 0;
      var xsum = 0;
      var ysum = 0;
      var xsumSq = 0;
      pts.forEach(function(pt){
        xysum = xysum + pt.xy;
        xsum = xsum + pt.x;
        ysum = ysum + pt.y;
        xsumSq = xsumSq + (pt.x * pt.x);
      });

      var m = (n*xysum - xsum*ysum)/(n*xsumSq - xsumSq);
      var b = (ysum/n) - m*(xsum/n);

      console.log(m)
      console.log(b)

      // return an object of two points
      // each point is an object with an x and y coordinate
      return {
        ptA : {
          x: minX,
          y: m * minX + b
        },
        ptB : {
          x: maxX,
          y: m * maxX + b
        }
      }

    }
