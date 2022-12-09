
var width = 600;
var height = 600;

var rangeX = [50, 470]
var rangeY = [470, 30]

d3.csv("videogamesales.csv", function (csv) {

  for (var i = 0; i < csv.length; ++i) {
    csv[i].Rank = Number(csv[i].Calories);
    csv[i].Year = Number(csv[i].Year);
    csv[i].NA_Sales = Number(csv[i].NA_Sales);
    csv[i].EU_Sales = Number(csv[i].EU_Sales);
    csv[i].JP_Sales = Number(csv[i].JP_Sales);
    csv[i].Other_Sales = Number(csv[i].Other_Sales);
    csv[i].Global_Sales = Number(csv[i].Global_Sales);
  }

  // Functions used for scaling axes +++++++++++++++
  let platformExtent = [];
  let genreExtent = [];
  let publishersExtent = [];
  let yearExtent = [];
  let yearsData = [];

  var currYear = 1981;
  for (var i = 0; i < 8; i++) {
    var currData = {}
    currData.column = currYear + " - " + (currYear+4);
    currData.value = 0;
    yearsData.push(currData);
  }
  
  csv.forEach((row) => {
    if(platformExtent.indexOf(row.Platform) === -1) {
      platformExtent.push(row.Platform);
    }
  });
  csv.forEach((row) => {
    if(genreExtent.indexOf(row.Genre) === -1) {
      genreExtent.push(row.Genre);
    }
  });
  csv.forEach((row) => {
    if(publishersExtent.indexOf(row.Publisher) === -1) {
      publishersExtent.push(row.Publisher);
    }
  });
  csv.forEach((row) => {
    if(yearExtent.indexOf(row.Year) === -1) {
      yearExtent.push(row.Year);
    }
  });
  console.log(yearExtent);

  var naExtent = d3.extent(csv, function (row) {
    return row.NA_Sales;
  });
  var euExtent = d3.extent(csv, function (row) {
    return row.EU_Sales;
  });
  var otherExtent = d3.extent(csv, function (row) {
    return row.Other_Sales;
  });
  var globalExtent = d3.extent(csv, function (row) {
    return row.Global_Sales;
  });


  

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  

  //Legend
  //Hint: Append circrcles to each selection to represent the calorie level
  d3.select("#LowCalorie")
    .append('circle')
    .style("stroke", "black")
    .style("fill", 'yellow')
    .attr("r", 5)
    .attr("cx", 10)
    .attr("cy", 6);
  d3.select("#MedCalorie")
    .append('circle')
    .style("stroke", "black")
    .style("fill", 'orange')
    .attr("r", 5)
    .attr("cx", 10)
    .attr("cy", 6);
  d3.select("#HighCalorie")
    .append('circle')
    .style("stroke", "black")
    .style("fill", 'red')
    .attr("r", 5)
    .attr("cx", 10)
    .attr("cy", 6);

  //Create SVGs for charts
  var chart1 = d3
    .select("#chart1")
    .append("svg:svg")
    .attr("id", "svg1")
    .attr("width", width)
    .attr("height", height);
  var extent;

  $(document).ready(function(){
    function hi(){
      onXCategoryChanged()
    }

    $('#xCategorySelect').on( 'change', function(){ hi(); } );
    var platformData = organizeData(platformExtent, "Platform", "NA_Sales");
    updateAxes(platformData);
    updateChart(platformData);
    
  });

  // var chart2 = d3
  //   .select("#chart2")
  //   .append("svg:svg")
  //   .attr("id", "svg2")
  //   .attr("width", width)
  //   .attr("height", height);

  //Labels for Charts
  var title1 = d3
    .select("#svg1")
    .append("text")
    .attr("x", width/2)
    .attr("y", 12)
    .attr("font-size", "12px");

  // var title2 = d3
  //   .select("#svg2")
  //   .append("text")
  //   .attr("x", width/2)
  //   .attr("y", 12)
  //   .attr("font-size", "12px")
  //   .text("Fiber vs Protein");

  //Labels for Axes
    // var label1 = d3
    // .select("#svg1")
    // .append("text")
    // .attr("x", width/2)
    // .attr("y", height)
    // .attr("font-size", "12px")
    // .text("Fat");

    // var label2 = d3
    // .select("#svg1")
    // .append("text")
    // .attr("x", -width/2)
    // .attr("y", 20)
    // .attr("font-size", "12px")
    // .attr("text-anchor", "end")
    // .attr("transform", "rotate(-90)")
    // .text("Carb");

    // var fiberLabel = d3
    // .select("#svg2")
    // .append("text")
    // .attr("x", width/2)
    // .attr("y", height)
    // .attr("font-size", "12px")
    // .text("Fiber");

    // var proteinLabel = d3
    // .select("#svg2")
    // .append("text")
    // .attr("x", -width/2)
    // .attr("y", 20)
    // .attr("font-size", "12px")
    // .attr("text-anchor", "end")
    // .attr("transform", "rotate(-90)")
    // .text("Protein");

  /******************************************
		
		Create Circles for Each Scatterplot

	 ******************************************/
  // var circles1 = d3.select('#svg1')
  //   .selectAll('circle')
  //   .data(csv)
  //   .enter()
  //   .append('circle')
  //   .style("stroke", "black")
  //   .attr('class', function(d){
  //     if (d.Calories<=100) {
  //       return 'yellow';
  //     } else if (d.Calories> 100 && d.Calories<=130) {
  //       return 'orange';
  //     } else {
  //       return 'red';
  //     }
  //   })
  //   .attr("r", 5)
  //   .attr("cx", function(d){
  //     return xScale(d.Fat);
  //   })
  //   .attr("cy", function(d){return yScale(d.Carb)});

  // var circles2 = d3.select('#svg2')
  //   .selectAll('circle')
  //   .data(csv)
  //   .enter()
  //   .append('circle')
  //   .style("stroke", "black")
  //   .attr('class', function(d){
  //     if (d.Calories<=100) {
  //       return 'yellow';
  //     } else if (d.Calories> 100 && d.Calories<=130) {
  //       return 'orange';
  //     } else {
  //       return 'red';
  //     }
  //   })
  //   .attr("r", 5)
  //   .attr("cx", function(d){
  //     //return 10;
  //     return xScale2(d.Fiber);
  //   })
  //   .attr("cy", function(d){return yScale2(d.Protein)});
  
  // chart1 // or something else that selects the SVG element in your visualizations
  //   .append("g") // create a group node
  //   .attr("transform", "translate(0," + (width - 30) + ")")
  //   .call(xAxis) // call the axis generator
  //   .append("text")
  //   .attr("class", "label")
  //   .attr("x", width - 16)
  //   .attr("y", -6)
  //   .style("text-anchor", "end");

  function updateAxes(newData) {
    //organizeData()
    extent = d3.extent(newData, (row)=> {
      return row.value;
    })
    // Axis setup
    //var xScale = d3.scaleLinear().domain(platformExtent).range(rangeX);
    yScale = d3.scaleLinear().domain([0, extent[1]]).range(rangeY);

    console.log(extent);

    // var xScale2 = d3.scaleLinear().domain(fiberExtent).range([50, 470]);
    // var yScale2 = d3.scaleLinear().domain(proteinExtent).range([470, 30]);

    //var xAxis = d3.axisBottom().scale(xScale);
    yAxis = d3.axisLeft().scale(yScale);

    // var xAxis2 = d3.axisBottom().scale(xScale2);
    // var yAxis2 = d3.axisLeft().scale(yScale2);
    chart1 // or something else that selects the SVG element in your visualizations
      .append("g") // create a group node
      .attr("transform", "translate(50, 0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  };



  function onXCategoryChanged() {
    var select = d3.select('#xCategorySelect').node();
    var xVal = select.options[select.selectedIndex].value;
    // Update chart with the selected category of cereal
    var inputExtent;
    if (xVal == "Platform") {
      inputExtent = platformExtent;
    } else if (xVal == "Publisher") {
      inputExtent = publishersExtent;
    } else if (xVal == "Year") {
      inputExtent = yearExtent;
    } else {
      inputExtent = genreExtent;
    }
    updateChart(organizeData(inputExtent, xVal, "NA_Sales"));
  }

  
  // var genreData = organizeData(genreExtent, "Genre");
  // var publisherData = organizeData(publishersExtent, "Publisher");

  function highestExtent() {
    d
  }

  function updateChart(newData) {
    var actualHeight = rangeY[0]-rangeY[1]
    var actualWidth = rangeX[1]-rangeX[0]



    var newTitle = chart1.selectAll('.gClass').data(newData, function(d){
      return d.column;
    });

    var selection = newTitle.enter()
        .append('g')
        .attr('class', 'gClass');
        
    selection.merge(newTitle).attr('transform', function(d, index){
        return "translate(" + (index* (actualWidth/newData.length) + 50)+ "," + (rangeY[0] - (d.value* (actualHeight/extent[1]))) + ")";
    });
    
    
    selection.append('rect')
        .attr('height', function (d) { return d.value* (actualHeight/extent[1]) })
        .attr('width', function(){return actualHeight/newData.length - 10})
        .attr('class', 'bar');
    
    selection.append('text')
      .attr('text-anchor', 'end')
      .attr('transform',  function(d){return "translate(15," + ((d.value* (440/extent[1])) + 10) + ")"+"rotate(-45)"})
      .text(function(d){
          return d.column;
      });

    newTitle.exit().remove();
  }

  // Returns columns with corresponding datapoints
  function organizeData(columnName, xVariable, yVariable) {
    var map = new Map();
    var newData = []
    columnName.forEach((column)=> {
      map.set(column, 0);
    })
    csv.forEach((row)=> {
      map.set(row[xVariable], map.get(row[xVariable]) + row[yVariable]);
    }) 
    const obj = Object.fromEntries(map);
    var arr = Object.entries(obj);
    console.log(map)
    for(var i = 0; i < arr.length; i++) {
      var currData = {}
      currData.column = arr[i][0];
      currData.value = arr[i][1];
      newData.push(currData);
    }
    console.log(newData);

    if (xVariable == "Year") {
      newData.forEach((row)=>{
        console.log(row);
        if (row.column != 'NaN') {
          var mod = 8 - Math.floor((2021-row.column)/5)
          yearsData[mod].value = row.value + yearsData[mod].value;
        }
      })
      newData = yearsData;
    }
    
    
    return newData;
    
  }

  // chart2 // or something else that selects the SVG element in your visualizations
  //   .append("g") // create a group node
  //   .attr("transform", "translate(0," + (width - 30) + ")")
  //   .call(xAxis2)
  //   .append("text")
  //   .attr("class", "label")
  //   .attr("x", width - 16)
  //   .attr("y", -6)
  //   .style("text-anchor", "end");

  // chart2 // or something else that selects the SVG element in your visualizations
  //   .append("g") // create a group node
  //   .attr("transform", "translate(50, 0)")
  //   .call(yAxis2)
  //   .append("text")
  //   .attr("class", "label")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 6)
  //   .attr("dy", ".71em")
  //   .style("text-anchor", "end");
  
  // var g1 = d3.select("#svg1")
  //   .append("g")
  //   .attr("class", "brush")
  //   .call(
  //     d3.brush()
  //       .extent([[50, 30], [470, 470]])
  //       .on("start", brushstart)
  //       .on("brush", highlightBrushedCircles)
  //       .on("end", displayValues));
  
  // var g2 = d3.select("#svg2")
  //   .append("g")
  //   .attr("class", "brush")
  //   .call(
  //     d3.brush()
  //       .extent([[50, 30], [470, 470]])
  //       .on("start", brushstart2)
  //       .on("brush", highlightBrushedCircles2)
  //       .on("end", displayValues2));


  // createPieChart(csv,);

  
  // function brushstart() {
  //   d3.select("#svg1").selectAll("circle").attr("class", "non_brushed");
  //   d3.select(".brush").call(brush.move, null); //using `.call()` to call the brush function on each elements
  // }
  
  // function highlightBrushedCircles() {
  
  //     // Get the extent or bounding box of the brush event, this is a 2x2 array
  //     var e = d3.event.selection;
  //     if(e) {
  //         //Revert circles to initial style
  //         circles1.attr("class", "non_brushed");
  //         circles2.attr("class", "non_brushed");
  
  //         //Select the instance of brush selection (access coordinates of the selection area)
  //         var coords = d3.brushSelection(this);
          
  //         // Select all circles, and add the color gradient classes if the data for that circle
  //         // lies outside of the brush-filter applied for this x and y attributes
  //         var selectionData = [];
  //         var selected1 = circles1.filter(function(val){
  //           var currX = this.cx.animVal.value;
  //           var currY = this.cy.animVal.value;
  //           if ((currY >= coords[0][1] && currY <= coords[1][1]) && (currX >= coords[0][0] && currX <= coords[1][0])) {
  //             return val;
  //           }
  //         })
  //         selected1.attr('class', function(d){
  //           if (d.Calories<=100) {
  //             return 'yellow';
  //           } else if (d.Calories> 100 && d.Calories<=130) {
  //             return 'orange';
  //           } else {
  //             return 'red';
  //           }
  //         })
  //         //console.log(selected1.data());
  //         var selected2 = circles2.data(selected1.data(),function(d){return d.CerealName})
  //         selected2.attr('class', function(d){
  //           if (d.Calories<=100) {
  //             return 'yellow';
  //           } else if (d.Calories> 100 && d.Calories<=130) {
  //             console.log(d.CerealName);
  //             return 'orange';
  //           } else {
  //             return 'red';
  //           }
  //         })
  //         handleOneCircle(selectionData)
  //     }
  // }
  
  // function displayValues() {
  //     // If there is no longer an extent or bounding box then the brush has been removed
  //     if(!d3.event.selection) {
  //         // Bring back all non brushed circle elements to original color gradient
  //         d3.selectAll(".non_brushed").attr("class", function(d){
  //           if (d.Calories<=100) {
  //             return 'yellow';
  //           } else if (d.Calories> 100 && d.Calories<=130) {
  //             return 'orange';
  //           } else {
  //             return 'red';
  //           }
  //         })
  
  //     }
  //     // In Activity 3: Write the code to display tooltip only if one circle is selected in here
      
  // }

  // function handleOneCircle(selectionData) {
  //   if (selectionData.length == 1) {
  //     populateInformation(selectionData);
  //   } else {
  //     emptyInformation();
  //   }

  // }

  // function populateInformation(selectionData) {
  //   d3.select("#cerealText").text('Cereal: ' + selectionData[0]['CerealName']);
  //   d3.select("#caloriesText").text('Calories: ' + selectionData[0]['Calories']);
  //   d3.select("#fatText").text('Fat: ' + selectionData[0]['Fat']);
  //   d3.select("#carbText").text('Carb: ' + selectionData[0]['Carb']);
  //   d3.select("#fiberText").text('Fiber: ' + selectionData[0]['Fiber']);
  //   d3.select("#proteinText").text('Protein: ' + selectionData[0]['Protein']);
  // }

  // function emptyInformation() {
  //   d3.select("#cerealText").text('Cereal: ');
  //   d3.select("#caloriesText").text('Calories: ');
  //   d3.select("#fatText").text('Fat: ');
  //   d3.select("#carbText").text('Carb: ' );
  //   d3.select("#fiberText").text('Fiber: ');
  //   d3.select("#proteinText").text('Protein: ');
  // }

  // function brushstart2() {
  //   d3.select("#svg2").selectAll("circle").attr("class", "non_brushed");
  //   d3.select(".brush").call(brush.move, null); //using `.call()` to call the brush function on each elements
  // }
  
  // function highlightBrushedCircles2() {
  
  //     // Get the extent or bounding box of the brush event, this is a 2x2 array
  //     var e = d3.event.selection;
  //     if(e) {
          
  //         //Revert circles to initial style
  //         circles1.attr("class", "non_brushed");
  //         circles2.attr("class", "non_brushed");
  
  //         //Select the instance of brush selection (access coordinates of the selection area)
  //         var coords = d3.brushSelection(this);
          
  //         // Select all circles, and add the color gradient classes if the data for that circle
  //         // lies outside of the brush-filter applied for this x and y attributes
  //         var selectionData = [];
  //         var selected1 = circles2.filter(function(val){
  //           var currX = this.cx.animVal.value;
  //           var currY = this.cy.animVal.value;
  //           if ((currY >= coords[0][1] && currY <= coords[1][1]) && (currX >= coords[0][0] && currX <= coords[1][0])) {
  //             selectionData.push(val);
  //             return val;
  //           }
  //         })
          
  //         selected1.attr('class', function(d){
  //           if (d.Calories<=100) {
  //             return 'yellow';
  //           } else if (d.Calories> 100 && d.Calories<=130) {
  //             return 'orange';
  //           } else {
  //             return 'red';
  //           }
  //         })

  //         var selected2 = circles1.data(selected1.data(),function(d){
  //           return d.CerealName;
  //         })
  //         console.log(selected2.data());
  //         selected2.attr('class', function(d){
  //           if (d.Calories<=100) {
  //             return 'yellow';
  //           } else if (d.Calories> 100 && d.Calories<=130) {
  //             return 'orange';
  //           } else {
  //             return 'red';
  //           }
  //         })
  //         handleOneCircle(selectionData);
  //     }
  // }
  
  // function displayValues2() {
  //     // If there is no longer an extent or bounding box then the brush has been removed
  //     if(!d3.event.selection) {
  //         // Bring back all non brushed circle elements to original color gradient
  //         d3.selectAll(".non_brushed").attr("class", function(d){
  //           if (d.Calories<=100) {
  //             return 'yellow';
  //           } else if (d.Calories> 100 && d.Calories<=130) {
  //             return 'orange';
  //           } else {
  //             return 'red';
  //           }
  //         })
  
  //     }
  //     // In Activity 3: Write the code to display tooltip only if one circle is selected in here.
  // }
});
