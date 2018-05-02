//https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097

    var margin = {top: 5, right: 100, bottom: 50, left: 100},
	     width = 800 - margin.left - margin.right,
	     height = 450 - margin.top - margin.bottom;

	  var svg = d3.select(".DamageChart").append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  var x = d3.scaleLinear()
	      .range([0,width]);

	  var y = d3.scaleLog()
	      .range([height,0]).base(2);


      var quantizeScale = d3.scaleQuantize()
          .range(['green','purple','blue', 'orange', 'red']);

	  var xAxis = d3.axisBottom()
	      .scale(x);

	  var yAxis = d3.axisLeft().tickFormat(d3.format(".3n"))
	      .scale(y);

    var damageData;
    var damageThreshold;
    var equality;

    function updateDamageCsv() {
      // .value = "on" is checked
      // .id = weather event

      SelectedWeatherEvents = []

      damageThreshold = damageSlider.value;
      damageOutput.innerHTML = "Damage "+equality+" "+damageSlider.value;

      var checkboxes = document.getElementsByClassName("DamageChecks");
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
      UsedData = damageData.filter(function(element) {
        return SelectedWeatherEvents.includes(element.EVENT_TYPE)
      });


      //y.domain(d3.extent(UsedData, function(d){ return d.DAMAGE_PROPERTY}));
      y.domain([100, d3.max(UsedData, function(d){ return d.DAMAGE_PROPERTY})]);
      x.domain(d3.extent(UsedData, function(d){ return d.TAVG}));
      quantizeScale.domain(d3.extent(UsedData, function(d){ return d.DAMAGE_PROPERTY}));
        
      y.clamp(true);
      var outlierData = getOutlierDataGivenEquality();

      var lg = calcLinear(UsedData, "x", "y", d3.min(UsedData, function(d){ return d.TAVG}), d3.max(UsedData, function(d){ return d.TAVG}), "DamageEquation");
      var lg2 = calcLinear(outlierData, "x", "y", d3.min(UsedData, function(d){ return d.TAVG}), d3.max(UsedData, function(d){ return d.TAVG}), "DamageOutlierEquation");
      console.log(lg2)

      svg.selectAll("*").remove();

      svg.selectAll(".point")
          .data(UsedData)
          .enter().append("circle")
          .attr("class", "point")
          .attr("r", 3)
          .attr("cy", function(d){ return y(d.DAMAGE_PROPERTY); })
          .attr("cx", function(d){ return x(d.TAVG); })
          .style("opacity", "0.5")
          .style("fill", function(d){ return quantizeScale(d.DAMAGE_PROPERTY)});

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
         .attr("transform", "translate("+ -100 +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
         .text("Damage");

      svg.append("text")
         .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
         .attr("transform", "translate("+ (width/2) +","+(height+40)+")")  // centre below axis
         .text("Average Temperature");
		 
      svg.append("g")
	  .attr("class", "legendQuant")
	  .attr("transform", "translate(530,250)");

	  var legend = d3.legendColor()
	  .labelFormat(d3.format(".2n"))
	  .title("Color Legend")
	  .titleWidth(100)
	  .shape('circle')
      .shapePadding(5)
      .labelOffset(10)
	  .scale(quantizeScale);
	  console.log(quantizeScale.range())

	svg.select(".legendQuant")
	  .call(legend);
    };

    function updateSlider() {
      damageOutput.innerHTML = "Damage "+equality+" "+damageSlider.value;
    };

	  d3.tsv("data/damage.tsv", types, function(error, data){
      data.forEach(function(d) {
        d.DAMAGE_PROPERTY = parseFloat(d.DAMAGE_PROPERTY);
        d.TAVG = parseFloat(d.TAVG);
      });
      damageData = data;
      var damageSlider = document.getElementById("damageSlider");
      var damageOutput = document.getElementById("damageOutput");
      updateDamageCsv();
	  });

    function getOutlierDataGivenEquality() {
      if (equality == ">")
        return UsedData.filter(function(element) {return element.DAMAGE_PROPERTY >= damageThreshold});
      else if (equality == "<") {
        return UsedData.filter(function(element) {return element.DAMAGE_PROPERTY <= damageThreshold});
      }
    };

    function updateEquality() {
      var radiobuttons = document.getElementsByClassName("equality");
      for (i= 0; i < radiobuttons.length; i++) {
        if (radiobuttons[i].checked == true)
            equality = radiobuttons[i].value;
      }
      updateDamageCsv();
    };



	  function types(d){
	    d.x = +d.TAVG;
	    d.y = +d.DAMAGE_PROPERTY;

	    return d;
	  }

    function calcLinear(data, x, y, minX, maxX, type){

      var n = data.length;

      var pts = [];
      data.forEach(function(d,i){
        var obj = {};
        obj.x = d[x];
        obj.y = d[y];
        obj.xy = obj.x*obj.y;
        pts.push(obj);
      });

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

      output = document.getElementById(type);
      output.innerHTML = "y = " +m.toFixed(3)+"x + "+b.toFixed(3);

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
