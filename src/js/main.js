var d3 = require('d3');
var $ = require("jquery");

// helpful functions:
var formatthousands = d3.format("0,000");

// Parse the date / time
var parseTime = d3.time.format("%_M:%S").parse;

var color = d3.scale.category10();

function color_by_group(group) {
  if (group == "Males") {
    return "rgb(31, 119, 180)";//"#D13D59";
  } else if (group == "Females") {
    return "#D13D59";//"#FFCC32";
  } else if (group == "Overall"){
    return "#FFCC32";//"#80A9D0";
  }
}

function color_by_gender(gender) {
  if (gender == "M") {
    return "rgb(31, 119, 180)";//"#80A9D0";
  } else if (gender == "F") {
    return "#D13D59";
  } else {
    return "#FFCC32";
  }
}

function color_stravabubbles(d) {
  if (d.gender == "F") {
    if (d.category == "Fastest") {
      return "#9E0A26";
    } else if (d.category == "Slowest") {
      return "#FF708C";
    } else {
      return "#D13D59";
    }
  } else if (d.gender == "M"){
    if (d.category == "Fastest") {
      return "#004481";
    } else if (d.category == "Slowest") {
      return "#52AAE7";
    } else {
      return "#1F77B4";//"#D13D59";
    }
  }
}

function color_function(d) {
  if (d.city == "San Francisco") { // (d.country != "United States") || (d.country != "USA") || (
    return "#1F77B4";//"#80A9D0";
  } else if (d.country != "US") {
    return "#FFCC32";
  } else if (d.gender == "F") {
    return "#D13D59";
  } else if (d.gender == "M"){
    return "#6C85A5";
  }
}

function color_gender(d) {
  if (d.gender == "F") {
    return "#D13D59";
  } else if (d.gender == "M"){
    return "#6C85A5";
  } else {
    return "red";
  }
}

function color_origin(d) {
  if (d.city == "San Francisco") { // (d.country != "United States") || (d.country != "USA") || (
    return "#1F77B4";//#80A9D0";
  } else if (d.country != "US") {
    return "#FFCC32";
  } else {
    return "#9C8B9E";
  }
}

//----------------------------------------------------------------------------------
// BAR CHART HISTOGRAM OF AGES WITH LINES ------------------------------------
//----------------------------------------------------------------------------------

var pacesPerYear = [];
ageData.forEach(function(d,index){
  pacesPerYear.push({ age:d.age, pace: parseTime(String(d.avgPace)), paceString:String(d.avgPace) });
});

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
var xvar = d3.scale.ordinal()
    .rangeRoundBands([0, width], bar_spacing);

// y-axis scale
var yvar = d3.scale.linear()
    .rangeRound([height, 0]);

var yRight = d3.time.scale()
    .range([height, 0]);

var colorbar = d3.scale.ordinal()
    .range(["#B7447A"]);

var voronoibars = d3.geom.voronoi()
    .x(function(d) { return xvar(d.age); })
    .y(function(d) { return yRight(d.pace); })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

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

var yAxisRightBars = d3.svg.axis().scale(yRight)
    .orient("right")
    .tickFormat(d3.time.format("%_M:%S"));

var pacelineBars = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {
      return xvar(d.age);
    })
    .y(function(d) {
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

barData.forEach(function (d,index) {
  var y0 = 0;
  d.types = ageMap.map(function (name) {
      return {
          name: name,
          value: +d[name]
      };
  });
});

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

yRight.domain([parseTime('6:00'), parseTime('18:00')]);

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

// generate rectangles for all the data values
var year = svgbars.selectAll(".age")
    .data(barData)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function (d) {
      return "translate(" + xvar(d.Age) + ",0)";
    })
    .on("mouseover", function(d) {
      bar_tooltip.html(`
  				<div>Age: <b>${d.Age}</b></div>
          <div>Count: <b>${formatthousands(d.Count)}</b></div>
  		`);
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
    .attr("class","pacepath2 voronoipath")
    .attr("d", pacelineBars(pacesPerYear));

var focusbars = svgbars.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");

focusbars.append("circle")
    .attr("r", 3.5);

focusbars.append("rect")
    .attr("x",-110)
    .attr("y",-25)
    .attr("width","150px")
    .attr("height","20px")
    .attr("opacity","0.6")
    .attr("fill","white");

focusbars.append("text")
    .attr("x", -100)
    .attr("y", -10);

var voronoiGroupBars = svgbars.append("g")
    .attr("class", "voronoipath");

voronoiGroupBars.selectAll(".voronoipath")
  .data(voronoibars(pacesPerYear))
  .enter().append("path")
  .attr("d", function(d) {
    if (d) {
      return "M" + d.join("L") + "Z";
    }
  })
  .datum(function(d) {
    if (d) {
      return d.point;
    }
  })
  .on("mouseover", mouseoverbars)
  .on("mouseout", mouseoutbars);

// console.log(voronoiGroup);

function mouseoverbars(d) {
  d3.select("."+d.key).classed("line-hover", true);
  focusbars.attr("transform", "translate(" + xvar(d.age) + "," + yRight(d.pace) + ")");
  focusbars.select("text").text("Age: "+d.age+", Pace: "+d.paceString);
}

function mouseoutbars(d) {
  d3.select("."+d.key).classed("line-hover", false);
  focusbars.attr("transform", "translate(-100,-100)");
}

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

svgbars.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisBar)
    .append("text")
    .attr("class", "label")
    .attr("x", width-15)
    .attr("y", -10)
    .style("text-anchor", "end")
    .text("Age");

//----------------------------------------------------------------------------------
// AVERAGE PACES FROM STRAVA ------------------------------------
//----------------------------------------------------------------------------------

// setting sizes of interactive
var margin = {
  top: 15,
  right: 100,
  bottom: 50,
  left: 100
};
if (screen.width > 768) {
  var width = 800 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
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
var svgMilePace = d3.select(".pace-line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xMilePace = d3.scale.linear()
    .range([0,width]);

var yMilePace = d3.time.scale()
    .range([height, 0]);

var yRightMilePace = d3.scale.linear()
    .range([height, 0]);

var voronoiMilePace = d3.geom.voronoi()
    .x(function(d) { return xMilePace(d.mile); })
    .y(function(d) { return yMilePace(d.pace); })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

// Define the axes
var xAxisMilePace = d3.svg.axis().scale(xMilePace)
    .orient("bottom");

var yAxisMilePace = d3.svg.axis().scale(yMilePace)
    .orient("left")
    .tickFormat(d3.time.format("%_M:%S"));

var yAxisRightMilePace = d3.svg.axis().scale(yRightMilePace)
    .orient("right")

var group_list_paces = ["Males","Females","Overall"];
var pacePerGroup = milePaceData.map(function(group,idx){
  var data_list = [];
  var index = 1;
  while (index <= 26) {
    data_list.push({mile:index,key:group_list_paces[idx], pace:parseTime(String(milePaceData[idx][index])), paceText: String(milePaceData[idx][index]) });
    index++;
  }
  return data_list;
});

var flatDataPerMile = [];
pacePerGroup.forEach(function(d,idx){
  var index = 0;
  while (index < 26) {
    flatDataPerMile.push(pacePerGroup[idx][index]);
    index++;
  }
})

xMilePace.domain([0,26.2]);
yMilePace.domain([parseTime('6:00'), parseTime('12:00')]);
yRightMilePace.domain([-7,1000]);

var lineElevationAvg = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {
      return xMilePace(d.distance);
    })
    .y(function(d) {
      return yRightMilePace(d.elevation);
    });

svgMilePace.append("path")
  .attr("class","elevationprofile")
  .attr("d",lineElevationAvg(elevationData));

var lineMilePace = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {
      return xMilePace(d.mile);
    })
    .y(function(d) {
      return yMilePace(d.pace);
    });

// plotting histogram of ages for last 6 years
pacePerGroup.forEach(function(d,idx) {
  var class_list = "line voronoipath "+group_list_paces[idx];
  svgMilePace.append("path")
    .attr("class",class_list)
    .style("stroke", color_by_group(group_list_paces[idx]))
    .attr("d", lineMilePace(d));
});

var focusMilePace = svgMilePace.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");

focusMilePace.append("circle")
    .attr("r", 3.5);

focusMilePace.append("rect")
    .attr("x",-110)
    .attr("y",-25)
    .attr("width","150px")
    .attr("height","20px")
    .attr("opacity","0.8")
    .attr("fill","white");

focusMilePace.append("text")
    .attr("x", -100)
    .attr("y", -10);

var voronoiGroupMilePace = svgMilePace.append("g")
    .attr("class", "voronoiMilePace");

// console.log(flatData);
voronoiGroupMilePace.selectAll(".voronoiMilePace")
  .data(voronoiMilePace(flatDataPerMile))
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
  .on("mouseover", mouseoverMilePace)
  .on("mouseout", mouseoutMilePace);

function mouseoverMilePace(d) {
  d3.select("."+d.key).classed("line-hover", true);
  focusMilePace.attr("transform", "translate(" + xMilePace(d.mile) + "," + yMilePace(d.pace) + ")");
  focusMilePace.select("text").text("Mile "+d.mile+", "+d.paceText+ " per mi");
}

function mouseoutMilePace(d) {
  d3.select("."+d.key).classed("line-hover", false);
  focusMilePace.attr("transform", "translate(-100,-100)");
}

if (screen.width <= 480) {
  svgMilePace.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisMilePace)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 35)
      .style("text-anchor", "end")
      .text("Mile");
} else {
  svgMilePace.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisMilePace)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Mile");
}

if (screen.width <= 480) {
  svgMilePace.append("g")
      .attr("class", "y axis")
      .call(yAxisMilePace)
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
  svgMilePace.append("g")
    .attr("class", "y axis")
    .call(yAxisMilePace)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("Pace per mile")

  svgMilePace.append("g")
    .attr("class", "y axis")
    .call(yAxisRightMilePace)
    .attr("transform", "translate(" + width + " ,0)")
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 60)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Elevation (ft)")

}

//----------------------------------------------------------------------------------
// STRAVA: SPEED PER MILE, ALL DATA --------------------------------------------
//----------------------------------------------------------------------------------

// setting sizes of interactive
var margin = {
  top: 15,
  right: 80,
  bottom: 50,
  left: 100
};
if (screen.width > 768) {
  var width = 900 - margin.left - margin.right;
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
var svgTimingLines = d3.select(".timing-lines").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x-axis scale
var xAllStrava = d3.scale.linear()
    .range([0, width]);

// y-axis scale
var yAllStrava = d3.time.scale()
    .range([height, 0]);

// y-axis scale
var yRightAllStrava = d3.scale.linear()
    .range([height, 0]);

var voronoiAllStrava = d3.geom.voronoi()
    .x(function(d) {
      return xAllStrava(d.mile);
    })
    .y(function(d) {
      return yAllStrava(d.pace);
    })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

// Define the axes
var xAxisAllStrava = d3.svg.axis().scale(xAllStrava)
    .orient("bottom").ticks(5);

var yAxisAllStrava = d3.svg.axis().scale(yAllStrava)
    .orient("left")
    .tickFormat(d3.time.format("%_M:%S"));

var yAxisRightAllStrava = d3.svg.axis().scale(yRightAllStrava)
    .orient("right")

var stravaNested = d3.nest()
  .key(function(d){ return d.athlete_id; })
  .entries(stravaSplitsData);

xAllStrava.domain([0,26.2]);
yAllStrava.domain([parseTime('0:00'), parseTime('20:00')]);
yRightAllStrava.domain([-7,1200]);

var lineAllStrava = d3.svg.line()
    .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
    .x(function(d) {
      return xAllStrava(d.mileShort);
    })
    .y(function(d) {
      var pacetemp = parseTime(d.paceShort);
      return yAllStrava(pacetemp);
    });

var lineElevation = d3.svg.line()
    .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
    .x(function(d) {
      return xAllStrava(d.distance);
    })
    .y(function(d) {
      return yRightAllStrava(d.elevation);
    });

svgTimingLines.append("path")
  .attr("class","elevationprofile")
  .attr("d",lineElevation(elevationData));

stravaNested.forEach(function(d) {
  var class_list = "line voronoi id"+d.key;
  svgTimingLines.append("path")
    .attr("class", class_list)
    .style("stroke", color_by_gender(d.values[0].gender))
    .attr("d", lineAllStrava(d.values));
});

var focusAllStrava = svgTimingLines.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");

focusAllStrava.append("circle")
    .attr("r", 3.5);

focusAllStrava.append("rect")
    .attr("x",-110)
    .attr("y",-25)
    .attr("width","170px")
    .attr("height","20px")
    .attr("opacity","0.5")
    .attr("fill","white");

focusAllStrava.append("text")
    .attr("x", -100)
    .attr("y", -10);

var voronoiGroupAllStrava = svgTimingLines.append("g")
    .attr("class", "voronoi");

var flatStravaData = [];
stravaSplitsData.forEach(function(d,idx){
  flatStravaData.push(
    {key: d.athlete_id, mile: d.mileShort, pace: parseTime(d.paceShort), paceText: String(d.paceShort),gender: d.gender }
  );
});

voronoiGroupAllStrava.selectAll(".voronoi")
  .data(voronoiAllStrava(flatStravaData))
  .enter().append("path")
  .attr("d", function(d) {
    if (d) {
      return "M" + d.join("L") + "Z";
    }
  })
  .datum(function(d) {
    if (d) {
      return d.point;
    }
  })
  .on("mouseover", mouseoverAllStrava)//mouseoverAllStrava)
  .on("mouseout", mouseoutAllStrava);//mouseoutAllStrava);

function mouseoverAllStrava(d) {
  d3.select(".id"+d.key).classed("line-hover", true);
  focusAllStrava.attr("transform", "translate(" + xAllStrava(d.mile) + "," + yAllStrava(d.pace) + ")");
  if (d.gender){
    focusAllStrava.select("text").text("Mile: "+d.mile+", Pace: "+d.paceText+" ("+d.gender+")");
  } else {
    focusAllStrava.select("text").text("Mile: "+d.mile+", Pace: "+d.paceText);
  }
}

function mouseoutAllStrava(d) {
  d3.select(".id"+d.key).classed("line-hover", false);
  focusAllStrava.attr("transform", "translate(-100,-100)");
}

if (screen.width <= 480) {
  svgTimingLines.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisAllStrava)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 35)
      .style("text-anchor", "end")
      .text("Mile");
} else {
  svgTimingLines.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisAllStrava)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Mile");
}

if (screen.width <= 480) {
  svgTimingLines.append("g")
      .attr("class", "y axis")
      .call(yAxisAllStrava)
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
  svgTimingLines.append("g")
      .attr("class", "y axis")
      .call(yAxisAllStrava)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -90)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .style("fill","white")
      .text("Pace per mile")
  svgTimingLines.append("g")
    .attr("class", "y axis")
    .call(yAxisRightAllStrava)
    .attr("transform", "translate(" + width + " ,0)")
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 60)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Elevation (ft)")
}

//----------------------------------------------------------------------------------
// bubble graph ---------------------------------------------------------------
//----------------------------------------------------------------------------------

// convert strings to numbers
stravaBubbleData.forEach(function(d) {
  d.segment = d.Segment;
  d.slope = d.Grade;
  d.paceString = d.Speed;
  d.category = d.Category;
  d.pace = parseTime(d.Speed);
  d.gender = d.Gender;
});

var womenStravaBubbleData = stravaBubbleData.filter(function(bubble) { return bubble.gender == "F" });
var menStravaBubbleData = stravaBubbleData.filter(function(bubble) { return bubble.gender == "M" });
var plotBubbleData = womenStravaBubbleData;

$("#fastslowmen").hide();
bubblechart_slope();

$("#men-slope").click(function(){
  $("#men-slope").addClass("selected");
  $("#women-slope").removeClass("selected");
  plotBubbleData = null;
  plotBubbleData = menStravaBubbleData;
  $("#fastslowwomen").hide();
  $("#fastslowmen").show();
});

$("#women-slope").click(function(){
  $("#women-slope").addClass("selected");
  $("#men-slope").removeClass("selected");
  plotBubbleData = null;
  plotBubbleData = womenStravaBubbleData;
  $("#fastslowwomen").show();
  $("#fastslowmen").hide();
});

$("#bubbleoptions-slope").click(function(){
  bubblechart_slope();
});

var groups = ["Fastest","Average","Slowest"];
//var years = [1997, 2005, 2010, 2014];
var i = 0;

// fills in HTML for year as years toggle
var updateInfo = function(group) {
  $(".legend-text").css("background","white");
  $(".legend-text").css("color","#696969");
  $("#"+group+"woman").css("color","white");
  $("#"+group+"woman").css("background","#9E0A26");//"red");//"#004481");
  console.log("#"+group+"woman");
};

var loop = null;
var tick = function() {
  bubblechart_slope(groups[i]);
  updateInfo(groups[i]);
  i = (i + 1) % groups.length;
  loop = setTimeout(tick, i == 0 ? 1700 : 1000);
};

tick();

function bubblechart_slope(group) {

  // transition time
  var duration = 700;

  // look at data for a specific year
  var plotData = plotBubbleData.filter(function(d) { return d.Category == group });

  d3.select("#elevation-bubble-graph").select("svg").remove();

  // setting sizes of interactive
  var margin = {
    top: 15,
    right: 30,
    bottom: 40,
    left: 30
  };
  if (screen.width > 768) {
    var width = 800 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
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

  // x-axis scale
  var xSlope = d3.time.scale()
  .range([0, width]);

  var ySlope = d3.scale.linear()
      .rangeRound([height, 0]);

  // use x-axis scale to set x-axis
  var xAxisSlope = d3.svg.axis()
      .scale(xSlope)
      .orient("bottom")
      .tickFormat(d3.time.format("%_M:%S"));

  var yAxisSlope = d3.svg.axis().scale(ySlope)
      .orient("left");

  // create SVG container for chart components
  var svgSlope = d3.select(".elevation-bubble-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xSlope.domain([parseTime('4:00'), parseTime('18:00')]);
  ySlope.domain([-10,10]);

  svgSlope.append("g")
    .append("line")
      .attr("stroke","#B2B2B2")
      .attr("x1",0)
      .attr("y1",(height/2+1))
      .attr("x2",width)
      .attr("y2",height/2);

  svgSlope.append("g")
      .attr("class", "x axis displaynone")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisSlope)
      .append("text")
      .attr("class", "label")
      .attr("x", width-10)
      .attr("y", -10)
      .style("text-anchor", "end")
      .text("Pace per mile");

  svgSlope.append("g")
      .attr("class", "y axis")
      .call(yAxisSlope)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -10)
        .attr("y", 20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("+ Grade (%)")

    svgSlope.append("g")
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -150)
        .attr("y", 20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("- Grade (%)")

  // color in the dots
  svgSlope.selectAll(".dot")
      .data(plotData)
      .enter().append("circle")
      .attr("r", function(d) {
        return 10;
      })
      .attr("cx", function(d) { return xSlope(d.pace); })
      .attr("cy", function(d) { return ySlope(d.slope); })
      .attr("opacity","0.6")
      .style("fill", function(d) {
        return color_stravabubbles(d) || colors.fallback;
      })
      .append("text")
  //     .on("mouseover", function(d) {
  //         tooltip.html(`
  //             <div>${d.category}</div>
  //             <div>${d.segment}</div>
  //             <div>Grade: <b>${d.slope}%</b></div>
  //             <div>Pace: <b>${d.paceString}</b></div>
  //         `);
  //         tooltip.style("visibility", "visible");
  //     })
  //     .on("mousemove", function() {
  //       if (screen.width <= 480) {
  //         return tooltip
  //           .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
  //           .style("left",10+"px");
  //       } else {
  //         return tooltip
  //           .style("top", (d3.event.pageY+20)+"px")
  //           .style("left",(d3.event.pageX-80)+"px");
  //       }
  //     })
  //     .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
  //
  // // show tooltip
  // var tooltip = d3.select(".elevation-bubble-graph")
  //     .append("div")
  //     .attr("class","tooltip")
  //     .style("position", "absolute")
  //     .style("z-index", "10")
  //     .style("visibility", "hidden")

  var node = svgSlope.selectAll(".circle")
      .data(plotData)
      .enter().append("g")
      .attr("class","node");

  node.append("text")
      .attr("x", function(d) { return xSlope(d.pace)+10; })
      .attr("y", function(d) { return ySlope(d.slope)})
      .attr("class","dottextslope")
      .style("fill","#696969")
      .style("font-size","12px")
      .style("font-style","italic")
      .text(function(d) {
          return d.Segment
      });


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
});

// look at more specific data
var womenBubbleData = bubbleData.filter(function(bubble) { return bubble.gender == "F" });
var menBubbleData = bubbleData.filter(function(bubble) { return bubble.gender == "M" });
var womenBubbleData = bubbleData.filter(function(bubble) { return bubble.gender == "F" });
var bayBubbleData = bubbleData.filter(function(bubble) { return bubble.city == "San Francisco" });
var foreignBubbleData = bubbleData.filter(function(bubble) { return bubble.country != "US" });
var plotData = bubbleData;
var plot_flag = "all";

$("#men").hide();
$("#women").hide();
$("#sfrunners").hide();
$("#foreign").hide();

$("#gender").click(function(){
  $("#men").show();
  $("#women").show();
  $("#sfrunners").hide();
  $("#foreign").hide();
});
$("#origin").click(function(){
  $("#men").hide();
  $("#women").hide();
  $("#sfrunners").show();
  $("#foreign").show();
});

bubblechart();

$("#gender").click(function() {
  $("#gender").addClass("selected");
  $("#origin").removeClass("selected");
  $("#all").removeClass("selected");
  $("#men").removeClass("selected");
  $("#women").removeClass("selected");
  $("#sfrunners").removeClass("selected");
  $("#foreign").removeClass("selected");
  plotData = null;
  plotData = bubbleData;
  plot_flag = "gender";
  bubblechart();
});

$("#origin").click(function() {
  $("#origin").addClass("selected");
  $("#gender").removeClass("selected");
  $("#all").removeClass("selected");
  $("#men").removeClass("selected");
  $("#women").removeClass("selected");
  $("#sfrunners").removeClass("selected");
  $("#foreign").removeClass("selected");
  plotData = null;
  plotData = bubbleData;
  plot_flag = "origin";
  bubblechart();
});

$("#men").click(function(){
  $("#men").addClass("selected");
  $("#all").removeClass("selected");
  $("#women").removeClass("selected");
  $("#sfrunners").removeClass("selected");
  $("#foreign").removeClass("selected");
  plotData = null;
  plotData = menBubbleData;
  bubblechart();
});

$("#women").click(function(){
  $("#women").addClass("selected");
  $("#all").removeClass("selected");
  $("#men").removeClass("selected");
  $("#sfrunners").removeClass("selected");
  $("#foreign").removeClass("selected");
  plotData = null;
  plotData = womenBubbleData;
  bubblechart();
});

$("#sfrunners").click(function(){
  $("#sfrunners").addClass("selected");
  $("#all").removeClass("selected");
  $("#men").removeClass("selected");
  $("#women").removeClass("selected");
  $("#foreign").removeClass("selected");
  plotData = null;
  plotData = bayBubbleData;
  bubblechart();
});

$("#foreign").click(function(){
  $("#foreign").addClass("selected");
  $("#men").removeClass("selected");
  $("#women").removeClass("selected");
  $("#sfrunners").removeClass("selected");
  plotData = null;
  plotData = foreignBubbleData;
  bubblechart();
});

function bubblechart() {

  d3.select("#bubble-graph").select("svg").remove();

  // setting sizes of interactive
  var margin = {
    top: 15,
    right: 15,
    bottom: 40,
    left: 100
  };
  if (screen.width > 768) {
    var width = 900 - margin.left - margin.right;
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

  // x-axis scale
  var x = d3.scale.linear()
      .rangeRound([0, width]);

  var y = d3.time.scale()
      .range([height, 0]);

  // use x-axis scale to set x-axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis().scale(y)
      .orient("left")
      .tickFormat(d3.time.format("%M:%S"));

  // create SVG container for chart components
  var svg = d3.select(".bubble-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([10,90]);
  y.domain([parseTime('4:00'), parseTime('22:00')]);

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

  if (plot_flag == "gender") {
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
          return color_gender(d) || colors.fallback;
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
  } else if (plot_flag == "origin"){
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
          return color_origin(d) || colors.fallback;
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
  } else {
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

}


//----------------------------------------------------------------------------------
// SF MARATHON ALL LINES --------------------------------------------
//----------------------------------------------------------------------------------

// // setting sizes of interactive
// var margin = {
//   top: 15,
//   right: 15,
//   bottom: 80,
//   left: 100
// };
// if (screen.width > 768) {
//   var width = 900 - margin.left - margin.right;
//   var height = 700 - margin.top - margin.bottom;
// } else if (screen.width <= 768 && screen.width > 480) {
//   var width = 650 - margin.left - margin.right;
//   var height = 400 - margin.top - margin.bottom;
// } else if (screen.width <= 480) {
//   var margin = {
//     top: 15,
//     right: 15,
//     bottom: 40,
//     left: 45
//   };
//   var width = 310 - margin.left - margin.right;
//   var height = 350 - margin.top - margin.bottom;
// }
//
// // create SVG container for chart components
// var svg = d3.select(".timing_lines").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// // x-axis scale
// var x = d3.scale.linear()
//     .range([0, width]);
//
// // y-axis scale
// var y = d3.time.scale()
//     .range([height, 0]);
//
// // Define the axes
// var xAxis = d3.svg.axis().scale(x)
//     .orient("bottom").ticks(5);
//
// var yAxis = d3.svg.axis().scale(y)
//     .orient("left")
//     .tickFormat(d3.time.format("%_M:%S"));
//
// var splitsSeries = splitsData.map(function(splitS){
//   return [
//     {distance:2.3,pace:parseTime(splitS.pace23M)},
//     {distance:5.5,pace:parseTime(splitS.pace55M)},
//     {distance:7.5,pace:parseTime(splitS.pace75M)},
//     {distance:13.3,pace:parseTime(splitS.pace133M)},
//     {distance:17.1,pace:parseTime(splitS.pace171M)},
//     {distance:23.5,pace:parseTime(splitS.pace235M)},
//     {distance:26.2,pace:parseTime(splitS.paceFINISH)},
//   ]
// });
//
// // console.log(splitsSeries);
//
// x.domain([0,26.2]);
// y.domain([parseTime('24:00'), parseTime('4:00')]);
//
// var line = d3.svg.line()
//     .interpolate("monotone")
//     .x(function(d) {
//       return x(d.distance);
//     })
//     .y(function(d) {
//       return y(d.pace);
//     });
//
// splitsSeries.forEach(function(d) {
//   svg.append("path")
//     .attr("class", "line")
//     .attr("d", line(d));
// });
//
// if (screen.width <= 480) {
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//       .append("text")
//       .attr("class", "label")
//       .attr("x", width)
//       .attr("y", 35)
//       .style("text-anchor", "end")
//       .text("Mile");
// } else {
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//       .append("text")
//       .attr("class", "label")
//       .attr("x", width)
//       .attr("y", 40)
//       .style("text-anchor", "end")
//       .text("Mile");
// }
//
// if (screen.width <= 480) {
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -45)
//       .attr("x", -10)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       // .style("fill","white")
//       .text("Pace per mile")
// } else {
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -90)
//       .attr("x", -10)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       // .style("fill","white")
//       .text("Pace per mile")
// }

//----------------------------------------------------------------------------------
// age histogram data over the last six years ------------------------------------
//----------------------------------------------------------------------------------

// // setting sizes of interactive
// var margin = {
//   top: 15,
//   right: 100,
//   bottom: 80,
//   left: 100
// };
// if (screen.width > 768) {
//   var width = 800 - margin.left - margin.right;
//   var height = 600 - margin.top - margin.bottom;
// } else if (screen.width <= 768 && screen.width > 480) {
//   var width = 650 - margin.left - margin.right;
//   var height = 400 - margin.top - margin.bottom;
// } else if (screen.width <= 480) {
//   var margin = {
//     top: 15,
//     right: 15,
//     bottom: 40,
//     left: 45
//   };
//   var width = 310 - margin.left - margin.right;
//   var height = 350 - margin.top - margin.bottom;
// }
//
// // create SVG container for chart components
// var svg = d3.select(".age-distribution").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// // x-axis scale
// // var x = d3.time.scale()
// //     .range([0, width]);
// var x = d3.scale.linear()
//     .range([0,width]);
//
// // y-axis scale
// var y = d3.scale.linear()
//     .range([height, 0]);
//
// var y1 = d3.time.scale()
//     .range([height, 0]);
//
// var voronoi = d3.geom.voronoi()
//     .x(function(d) { return x(d.age); })
//     .y(function(d) { return y(d.count); })
//     .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);
//
// // Define the axes
// var xAxis = d3.svg.axis().scale(x)
//     .orient("bottom");
//
// var yAxis = d3.svg.axis().scale(y)
//     .orient("left")
//
// var yAxisRight = d3.svg.axis().scale(y1)
//     .orient("right")
//     .tickFormat(d3.time.format("%_M:%S"));
//
// var ageDataTrimmed = ageData.filter(function(d) { return d.Year[0] == "C" });
// var ageDataPace = ageData.filter(function(d) { return d.Year[0] != "C" });
//
// var agesPerYear = ageDataTrimmed.map(function(year,idx){
//   var data_list = [];
//   var index = 1;
//   while (index <= 100) {
//     data_list.push({age:index,count: year[index], key:"year"+(2010+idx), pace:String(ageDataPace[0][index]) });
//     index++;
//   }
//   return data_list;
// });
//
// var pacesPerYear = [];
// var index = 1;
// while(index<=100) {
//   if (String(ageDataPace[0][index]) != "0:00") {
//     pacesPerYear.push({ age:index, pace: parseTime(String(ageDataPace[0][index])) });
//   }
//   index++;
// }
//
// var flatData = [];
// agesPerYear.forEach(function(d,idx){
//   var index = 0;
//   while (index < 100) {
//     flatData.push(agesPerYear[idx][index]);
//     index++;
//   }
// })
//
// x.domain([1,100]);
// y.domain([1,400]);
// y1.domain([parseTime('4:00'), parseTime('16:00')]);
//
// var line = d3.svg.line()
//     .interpolate("monotone")//"basis")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
//     .x(function(d) {
//       return x(d.age);
//     })
//     .y(function(d) {
//       return y(d.count);
//     });
//
// var paceline = d3.svg.line()
//     .interpolate("monotone")
//     .x(function(d) {
//       return x(d.age);
//     })
//     .y(function(d) {
//       return y1(d.pace);
//     });
//
// // plotting histogram of ages for last 6 years
// agesPerYear.forEach(function(d,idx) {
//   var year = 2010+idx;
//   var class_list = "line "+"year"+year+" voronoipath";
//   // console.log(class_list);
//   svg.append("path")
//     .attr("class",class_list)
//     .style("stroke", color_by_year(year))
//     .attr("d", line(d));
// });
//
// // adding in line for average pace for each age
// svg.append("path")        // Add the valueline2 path.
//     .attr("class","pacepath")
//     .attr("d", paceline(pacesPerYear));
//
// var focus = svg.append("g")
//     .attr("transform", "translate(-100,-100)")
//     .attr("class", "focus");
//
// focus.append("circle")
//     .attr("r", 3.5);
//
// focus.append("text")
//     .attr("x", -100)
//     .attr("y", -10);
//
// var voronoiGroup = svg.append("g")
//     .attr("class", "voronoi");
//
// voronoiGroup.selectAll(".voronoipath")
//   .data(voronoi(flatData))
//   .enter().append("path")
//   .attr("d", function(d) {
//     // console.log(d);
//     if (d) {
//       return "M" + d.join("L") + "Z";
//     }
//   })
//   .datum(function(d) {
//     if (d) {
//       return d.point;
//     }
//   })
//   .on("mouseover", mouseover)
//   .on("mouseout", mouseout);
//
// // console.log(voronoiGroup);
//
// function mouseover(d) {
//   d3.select("."+d.key).classed("line-hover", true);
//   focus.attr("transform", "translate(" + x(d.age) + "," + y(d.count) + ")");
//   if (d.pace == "0:00") {
//     focus.select("text").text("Year: "+d.key.split("year")[1]+", Age: "+d.age+" ("+d.count+")");
//   } else {
//     focus.select("text").text("Year: "+d.key.split("year")[1]+", Age: "+d.age+" ("+d.count+")"+", Average pace: "+d.pace+" /mi");
//   }
// }
//
// function mouseout(d) {
//   d3.select("."+d.key).classed("line-hover", false);
//   focus.attr("transform", "translate(-100,-100)");
// }
//
// if (screen.width <= 480) {
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//       .append("text")
//       .attr("class", "label")
//       .attr("x", width)
//       .attr("y", 35)
//       .style("text-anchor", "end")
//       .text("Age");
// } else {
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//       .append("text")
//       .attr("class", "label")
//       .attr("x", width)
//       .attr("y", 40)
//       .style("text-anchor", "end")
//       .text("Age");
// }
//
// if (screen.width <= 480) {
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -45)
//       .attr("x", -10)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       // .style("fill","white")
//       .text("Count")
// } else {
//   svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -60)
//       .attr("x", -10)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       // .style("fill","white")
//       .text("Count")
//
//   svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxisRight)
//     .attr("transform", "translate(" + width + " ,0)")
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 60)
//       .attr("x", -10)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Pace per mile")
//
// }
//
// function color_by_year(year) {
//   if (year == "2010") {
//     return "#D13D59";
//   } else if (year == "2011") {
//     return "#FFCC32";
//   } else if (year == "2012"){
//     return "#80A9D0";
//   } else if (year == "2013") {
//     return '#996B7D';
//   } else if (year == "2014"){
//     return '#A89170';
//   } else if (year == "2015"){
//     return '#61988E';
//   } else if (year == "2016"){
//     return '#E89EAC';
//   }
// }
