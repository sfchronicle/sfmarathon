var d3 = require('d3');

// speed and timing mats line chart --------------------------------------------

// setting sizes of interactive
var margin = {
  top: 15,
  right: 15,
  bottom: 80,
  left: 100
};
if (screen.width > 768) {
  var width = 1000 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;
} else if (screen.width <= 768 && screen.width > 480) {
  var width = 650 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
} else if (screen.width <= 480) {
  var margin = {
    top: 15,
    right: 15,
    bottom: 40,
    left: 45
  };
  var width = 310 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
}

// Parse the date / time
var parseTime = d3.time.format("%M:%S").parse;

// create SVG container for chart components
var svg = d3.select(".timing_lines").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x-axis scale
var x = d3.scale.linear()
    .range([0, width]);

// y-axis scale
var y = d3.time.scale()
    .range([height, 0]);

// y-axis scale
// var y = d3.scale.linear()
//     .range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .tickFormat(d3.time.format("%M:%S"));

// var yAxis = d3.svg.axis().scale(y)
//     .orient("left").ticks(5);

var splitsSeries = splitsData.map(function(splitS){
  return [
    {distance:2.3,pace:parseTime(splitS.pace23M)},
    {distance:5.5,pace:parseTime(splitS.pace55M)},
    {distance:7.5,pace:parseTime(splitS.pace75M)},
    {distance:13.3,pace:parseTime(splitS.pace133M)},
    {distance:17.1,pace:parseTime(splitS.pace171M)},
    {distance:23.5,pace:parseTime(splitS.pace235M)},
    {distance:26.2,pace:parseTime(splitS.paceFINISH)},
  ]
});

// console.log(splitsSeries);

x.domain([0,26.2]);
y.domain([parseTime('4:00'), parseTime('24:00')]);

var line = d3.svg.line()
    .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
    .x(function(d) {
      return x(d.distance);
    })
    .y(function(d) {
      return y(d.pace);
    });

splitsSeries.forEach(function(d) {
  svg.append("path")
    .attr("class", "line")
    .attr("d", line(d));
});

if (screen.width <= 480) {
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 35)
      .style("text-anchor", "end")
      .text("Mile");
} else {
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Mile");
}

if (screen.width <= 480) {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("Pace per mile")
} else {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -90)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("Pace per mile")
}

//----------------------------------------------------------------------------------
// bubble graph ---------------------------------------------------------------
//----------------------------------------------------------------------------------

// convert strings to numbers
bubbleData.forEach(function(d) {
  d.race = d.race;
  d.gender = d.gender;
  d.age = +d.age;
  d.pace = parseTime(d.avgPace);
  // d.pace = Number(d.avgPace.split(":")[0])+Number(d.avgPace.split(":")[1]/60)
})

// look at more specific data
// var plotData = bubbleData.filter(function(bubble) { return bubble.gender == "M" });
// var plotData = plotData2.filter(function(bubble) { return bubble.city == "San Francisco" });
var plotData = bubbleData;

// x-axis scale
var x = d3.scale.linear()
    .rangeRound([0, width]);

// y-axis scale
// var y = d3.scale.linear()
//     .rangeRound([height, 0]);
var y = d3.time.scale()
    .range([height, 0]);

// color bands
// var color = d3.scale.ordinal()
//     .range(["#FFE599", "#DE8067"]);

var color = d3.scale.category10();
// var color = "red";

// use x-axis scale to set x-axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .tickFormat(d3.time.format("%M:%S"));

// var valueline = d3.svg.line()
//   .x(function(d) {return x(d.salaryK); })
//   .y(function(d) {return y(d.salaryK/3); });

// create SVG container for chart components
var svg = d3.select(".bubble-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x.domain(d3.extent(plotData, function(d) { return d.pace; })).nice();//.nice();
// x.domain(d3.extent(plotData, function(d) { return d.age; })).nice(); //.nice();
x.domain([10,90]);
// y.domain([4,20]);
y.domain([parseTime('4:00'), parseTime('20:00')]);

var xMin = x.domain()[0];
var xMax = x.domain()[1];
// var xMax = 20;

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width-10)
    .attr("y", -10)
    .style("text-anchor", "end")
    .text("Age");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", -10)
    .attr("y", 20)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Pace per mile")

// color in the dots
svg.selectAll(".dot")
    .data(plotData)
    .enter().append("circle")
    .attr("r", function(d) {
      return 5;
    })
    .attr("cx", function(d) { return x(d.age); })
    .attr("cy", function(d) { return y(d.pace); })
    .attr("opacity","0.4")
    .style("fill", function(d) {
      return color_function(d) || colors.fallback;
    })
    .on("mouseover", function(d) {
        tooltip.html(`
            <div>Age: <b>${d.age}</b></div>
            <div>Gender: <b>${d.gender}</b></div>
            <div>Average pace: <b>${d.avgPace} min/mi</b></div>
            <div>City: <b>${d.city}</b></div>
            <div>Country: <b>${d.country}</b></div>
        `);
        tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip
          .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          .style("left",10+"px");
      } else {
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-80)+"px");
      }
    })
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

function color_function(d) {
  if (d.state != "CA") { // (d.country != "United States") || (d.country != "USA") || (
    // console.log(d.country);
    return "#D13D59";
  } else if (d.gender == "F") {
    return "#FFCC32";
  } else if (d.gender == "M"){
    return "#80A9D0";
  }
}

var node = svg.selectAll(".circle")
    .data(plotData)
    .enter().append("g")
    .attr("class","node");

// show tooltip
var tooltip = d3.select(".bubble-graph")
    .append("div")
    .attr("class","tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")

//----------------------------------------------------------------------------------
// age histogram data over the last six years ------------------------------------
//----------------------------------------------------------------------------------

// setting sizes of interactive
var margin = {
  top: 15,
  right: 100,
  bottom: 80,
  left: 100
};
if (screen.width > 768) {
  var width = 800 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;
} else if (screen.width <= 768 && screen.width > 480) {
  var width = 650 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
} else if (screen.width <= 480) {
  var margin = {
    top: 15,
    right: 15,
    bottom: 40,
    left: 45
  };
  var width = 310 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
}

// create SVG container for chart components
var svg = d3.select(".age-distribution").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x-axis scale
// var x = d3.time.scale()
//     .range([0, width]);
var x = d3.scale.linear()
    .range([0,width]);

// y-axis scale
var y = d3.scale.linear()
    .range([height, 0]);

var y1 = d3.time.scale()
    .range([height, 0]);

var voronoi = d3.geom.voronoi()
    .x(function(d) { return x(d.age); })
    .y(function(d) { return y(d.count); })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
    .orient("left")

var yAxisRight = d3.svg.axis().scale(y1)
    .orient("right")
    .tickFormat(d3.time.format("%M:%S"));

var ageDataTrimmed = ageData.filter(function(d) { return d.Year[0] == "C" });
var ageDataPace = ageData.filter(function(d) { return d.Year[0] != "C" });
var ageDataRecent = ageData.filter(function(d) {return d.Year == "TOTAL-Count"})

var agesPerYear = ageDataTrimmed.map(function(year,idx){
  var data_list = [];
  var index = 1;
  while (index <= 100) {
    data_list.push({age:index,count: year[index], key:"year"+(2010+idx), pace:String(ageDataPace[0][index]) });
    index++;
  }
  return data_list;
});

var pacesPerYear = [];
var index = 1;
while(index<=100) {
  if (String(ageDataPace[0][index]) != "0:00") {
    pacesPerYear.push({ age:index, pace: parseTime(String(ageDataPace[0][index])) });
  }
  index++;
}

var flatData = [];
agesPerYear.forEach(function(d,idx){
  var index = 0;
  while (index < 100) {
    flatData.push(agesPerYear[idx][index]);
    index++;
  }
})

x.domain([1,100]);
y.domain([1,400]);
y1.domain([parseTime('4:00'), parseTime('16:00')]);

var line = d3.svg.line()
    .interpolate("monotone")//"basis")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
    .x(function(d) {
      return x(d.age);
    })
    .y(function(d) {
      return y(d.count);
    });

var paceline = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {
      return x(d.age);
    })
    .y(function(d) {
      console.log(d.pace);
      return y1(d.pace);
    });

// plotting histogram of ages for last 6 years
agesPerYear.forEach(function(d,idx) {
  var year = 2010+idx;
  var class_list = "line "+"year"+year+" voronoipath";
  // console.log(class_list);
  svg.append("path")
    .attr("class",class_list)
    .style("stroke", color_by_year(year))
    .attr("d", line(d));
});

// adding in line for average pace for each age
svg.append("path")        // Add the valueline2 path.
    .attr("class","pacepath")
    .attr("d", paceline(pacesPerYear));

var focus = svg.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");

focus.append("circle")
    .attr("r", 3.5);

focus.append("text")
    .attr("x", -100)
    .attr("y", -10);

var voronoiGroup = svg.append("g")
    .attr("class", "voronoi");

// console.log(flatData);
voronoiGroup.selectAll(".voronoipath")
  .data(voronoi(flatData))
  .enter().append("path")
  .attr("d", function(d) {
    // console.log(d);
    if (d) {
      return "M" + d.join("L") + "Z";
    }
  })
  .datum(function(d) {
    if (d) {
      return d.point;
    }
  })
  .on("mouseover", mouseover)
  .on("mouseout", mouseout);

// console.log(voronoiGroup);

function mouseover(d) {
  d3.select("."+d.key).classed("line-hover", true);
  focus.attr("transform", "translate(" + x(d.age) + "," + y(d.count) + ")");
  if (d.pace == "0:00") {
    focus.select("text").text("Year: "+d.key.split("year")[1]+", Age: "+d.age+" ("+d.count+")");
  } else {
    focus.select("text").text("Year: "+d.key.split("year")[1]+", Age: "+d.age+" ("+d.count+")"+", Average pace: "+d.pace+" /mi");
  }
}

function mouseout(d) {
  d3.select("."+d.key).classed("line-hover", false);
  focus.attr("transform", "translate(-100,-100)");
}

if (screen.width <= 480) {
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 35)
      .style("text-anchor", "end")
      .text("Age");
} else {
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Age");
}

if (screen.width <= 480) {
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("Count")
} else {
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("Count")

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxisRight)
    .attr("transform", "translate(" + width + " ,0)")
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 60)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Pace per mile")

}

function color_by_year(year) {
  if (year == "2010") {
    return "#D13D59";
  } else if (year == "2011") {
    return "#FFCC32";
  } else if (year == "2012"){
    return "#80A9D0";
  } else if (year == "2013") {
    return '#996B7D';
  } else if (year == "2014"){
    return '#A89170';
  } else if (year == "2015"){
    return '#61988E';
  } else if (year == "2016"){
    return '#E89EAC';
  }
}

//----------------------------------------------------------------------------------
// age histogram data over the last six years with BARS ------------------------------------
//----------------------------------------------------------------------------------

// var barData = ageDataRecent[0];
var bar_spacing = 0.1;

// show tooltip
var bar_tooltip = d3.select(".age-distribution-bars")
    .append("div")
    .attr("class","bar_tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")

var margin = {
  top: 15,
  right: 100,
  bottom: 25,
  left: 100
};
if (screen.width > 768) {
  var width = 900 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
} else if (screen.width <= 768 && screen.width > 480) {
  var width = 460 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;
} else if (screen.width <= 480) {
  var margin = {
    top: 15,
    right: 15,
    bottom: 25,
    left: 55
  };
  var width = 310 - margin.left - margin.right;
  var height = 220 - margin.top - margin.bottom;

}

// x-axis scale
// var x = d3.scale.linear()
//     .rangeRound([0,width],bar_spacing);

// x-axis scale
var xvar = d3.scale.ordinal()
    // .ticks(10)
    .rangeRoundBands([0, width], bar_spacing);

// y-axis scale
var yvar = d3.scale.linear()
    .rangeRound([height, 0]);

var yRight = d3.time.scale()
    .range([height, 0]);

var colorbar = d3.scale.ordinal()
    .range(["#B7447A"]);

var xAxisBar = d3.svg.axis()
    .scale(xvar)
    .tickFormat(function(d) {
      if ((d % 10) != 0) {
        return '';
      } else {
        return d;
      }
    })
    .orient("bottom");

// use y-axis scale to set y-axis
var yAxisLeft = d3.svg.axis()
    .scale(yvar)
    .orient("left");
    // .tickFormat(d3.format(".2s"));

var yAxisRightBars = d3.svg.axis().scale(yRight)
    .orient("right")
    .tickFormat(d3.time.format("%M:%S"));

var pacelineBars = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {
      return xvar(d.age);
    })
    .y(function(d) {
      console.log(d.pace);
      return yRight(d.pace);
    });

// create SVG container for chart components
var svgbars = d3.select(".age-distribution-bars").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// map columns to colors
var ageMap = d3.keys(barData[0]).filter(function (key) {
    if (key != "types") {
      return key !== "Age";
    }
});

if (!barData[0].types) {
  barData.forEach(function (d,index) {
      var tempvar = ageDataPace[0][index];
      // var tempvar = pacesPerYear[index-15];
      // if (tempvar) {
      if (tempvar != "0:00"){
        d.pace = tempvar;
      }
      var y0 = 0;
      d.types = ageMap.map(function (name) {
          return {
              name: name,
              value: +d[name]
          };
      });
  });
};

// x domain is set of years
xvar.domain(barData.map(function (d) {
    return d.Age;
}));

// y domain is scaled by highest total
yvar.domain([0, d3.max(barData, function (d) {
    return d3.max(d.types, function(d) {
      return d.value;
    });
})]);

yRight.domain([parseTime('8:00'), parseTime('16:00')]);

svgbars.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 2)
    .attr("dy", -70)
    .attr("x", -60)
    .attr("transform", "rotate(-90)")
    .text("Count");

svgbars.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisBar);

svgbars.append("g")
    .attr("class", "y axis")
    .call(yAxisLeft);

console.log(pacesPerYear);

// generate rectangles for all the data values
var year = svgbars.selectAll(".age")
    .data(barData)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function (d) {
      return "translate(" + xvar(d.Age) + ",0)";
    })
    .on("mouseover", function(d) {
      console.log(d);
      if (d.pace){
    		bar_tooltip.html(`
    				<div>Age: <b>${d.Age}</b></div>
            <div>Count: <b>${d.Count}</b></div>
    				<div>Average pace: <b>${d.pace}</b></div>
    		`);
      } else {
        bar_tooltip.html(`
    				<div>Age: <b>${d.Age}</b></div>
            <div>Count: <b>${d.Count}</b></div>
    		`);
      }
    	bar_tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
    	if (screen.width <= 480) {
    		return bar_tooltip
    			.style("top", (d3.event.pageY+20)+"px")
    			.style("left",10+"px");
    	} else {
    		return bar_tooltip
    			.style("top", (d3.event.pageY+20)+"px")
    			.style("left",(d3.event.pageX-80)+"px");
    	}
    })
    .on("mouseout", function(){return bar_tooltip.style("visibility", "hidden");});

//
year.selectAll("rect")
    .data(function (d) {
      return d.types;
    })
    .enter().append("rect")
    .attr("width", xvar.rangeBand())
    .attr("x", function (d) {
      return xvar(d.name);
    })
    .attr("y", function (d) {
      return yvar(d.value);
    })
    .attr("height", function (d) {
      return height - yvar(d.value);
    })
    .style("fill", function (d) {
      return color(d.name);
    });

// adding in line for average pace for each age
svgbars.append("path")        // Add the valueline2 path.
    .attr("class","pacepath2")
    .attr("d", pacelineBars(pacesPerYear));

svgbars.append("g")
  .attr("class", "y axis")
  .call(yAxisRightBars)
  .attr("transform", "translate(" + width + " ,0)")
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 60)
    .attr("x", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Pace per mile")

//----------------------------------------------------------------------------------
// elevation vs finish time ------------------------------------
//----------------------------------------------------------------------------------

// Parse the date / time
var parseFinishTime = d3.time.format("%H:%M:%S").parse;

// convert strings to numbers
raceCompData.forEach(function(d) {
  d.race = d.Race;
  d.gender = d.Gender;
  d.elevation = +d.Elevation;
  d.finishers = +d.Finishers2015;
  d.finishtime = parseFinishTime(d.FinishTime);
})

// x-axis scale
var xelev = d3.scale.linear()
    .rangeRound([0, width]);

// y-axis scale
var ypace = d3.time.scale()
    .range([height, 0]);

// use x-axis scale to set x-axis
var xAxisElev = d3.svg.axis()
    .scale(xelev)
    .orient("bottom");

var yAxisTime = d3.svg.axis().scale(ypace)
    .orient("left")
    .tickFormat(d3.time.format("%H:%M:%S"));

// create SVG container for chart components
var svgComp = d3.select(".elevation-finish-bubbles").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



xelev.domain([200,2000]);
// xelev.domain(d3.extent(raceCompData, function(d) { return d.elevation; })).nice();//.nice();
ypace.domain([parseFinishTime('02:00:00'), parseFinishTime('03:20:00')]);

// var xElevMin = xelev.domain()[0];
// var xElevMax = xelev.domain()[1];
// // var xMax = 20;
//
svgComp.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisElev)
    .append("text")
    .attr("class", "label")
    .attr("x", width-10)
    .attr("y", -10)
    .style("text-anchor", "end")
    .text("Elevation");

svgComp.append("g")
    .attr("class", "y axis")
    .call(yAxisTime)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", -10)
    .attr("y", 20)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Winning finish time in 2015");

// color in the dots
svgComp.selectAll(".dot")
    .data(raceCompData)
    .enter().append("circle")
    .attr("r", function(d) {
      return d.finishers/2000+5;
      // return 6;
    })
    .attr("cx", function(d) {
      return xelev(d.elevation);
    })
    .attr("cy", function(d) { return ypace(d.finishtime); })
    .attr("opacity","0.7")
    .style("fill", function(d) {
      return color_gender(d.gender) || colors.fallback;
    })
    .on("mouseover", function(d) {
        tooltip.html(`
            <div>Race: <b>${d.race}</b></div>
            <div>Finish time: <b>${d.FinishTime}</b></div>
            <div>Gender: <b>${d.gender}</b></div>
        `);
        tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip
          .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          .style("left",10+"px");
      } else {
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-80)+"px");
      }
    })
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
//
function color_gender(gender) {
  if (gender == "F") {
    return "#FFCC32";
  } else if (gender == "M"){
    return "#80A9D0";
  }
}
//
// var node = svg.selectAll(".circle")
//     .data(plotData)
//     .enter().append("g")
//     .attr("class","node");
//
// // show tooltip
// var tooltip = d3.select(".bubble-graph")
//     .append("div")
//     .attr("class","tooltip")
//     .style("position", "absolute")
//     .style("z-index", "10")
//     .style("visibility", "hidden")
