
var width = 550;
var height = 650;

var rangeX = [50, 500]
var rangeY = [470, 30]

var length = 0;
var data;

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
  
  //creating data for any Sales for a specific year range
  var currYear = 1981;
  for (var i = 0; i < 8; i++) {
    var currData = {}
    currData.column = currYear + " - " + (currYear+4);
    currYear += 5;
    currData.value = 0;
    yearsData.push(currData);
  }
  
  //finds all the unique items from each xAxis variable
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


  

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  //Create SVGs for chart
  var chart1 = d3
    .select("#chart1")
    .append("svg:svg")
    .attr("id", "svg1")
    .attr("width", width)
    .attr("height", height);


  var extent = [0,500];

  $(document).ready(function(){

    $('#xCategorySelect').on( 'change', function(){ onCategoryChanged(retrieveCutoff(), retrieveSort()); } );
    $('#yCategorySelect').on( 'change', function(){ onCategoryChanged(retrieveCutoff(), retrieveSort()); } );
    $('#sortSelect').on( 'change', function(){ onCategoryChanged(retrieveCutoff(), retrieveSort()); } );
    $("#cutoffButton1").on('click', function() {onCategoryChanged(retrieveCutoff(), retrieveSort())})


    $('#chart1').mouseover(function(val){
      console.log(val.clientX);
      var i = Math.floor((val.clientX-50)/((rangeX[1] - rangeX[0])/data.length));
      console.log(data[i]);
      if (data[i].column == undefined) {
        $('#columnName').text(function(){return "Column Name: "})
        $('#value').text(function(){return "Value: "})
      } else {
        $('#columnName').text(function(){return "Column Name: " + data[i].column})
        $('#value').text(function(){return "Value: " + data[i].value + " million"})
      }
      
    });

    var platformData = organizeData(platformExtent, "Platform", "Global_Sales");
    updateAxes(platformData);
    updateChart(platformData);
    
  });

  function retrieveSort() {
    var select = d3.select('#sortSelect').node();
    var sortVal = select.options[select.selectedIndex].value;
    return sortVal
  }

  function retrieveCutoff() {
    var cutoffVal = $('#cutoff').val()
    return cutoffVal;
  }

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
      .attr("transform", "translate(75, 0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  };



  function onCategoryChanged(cutoff, sort) {
    var select = d3.select('#xCategorySelect').node();
    var xVal = select.options[select.selectedIndex].value;

    var select1 = d3.select('#yCategorySelect').node();
    var yVal = select1.options[select1.selectedIndex].value;

    console.log(xVal);
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


    var result = organizeData(inputExtent, xVal, yVal);
    //sorting and filtering occurs
    console.log(sort);
    var finalResult = result.filter((d)=> {return d.value >= cutoff})
    if (sort == "lowToHigh") {
      finalResult = finalResult.sort(function(a, b){return a.value-b.value});
    } else {
      finalResult = finalResult.sort(function(a, b){return b.value-a.value});
    }
    updateChart(finalResult);
  }

  
  // var genreData = organizeData(genreExtent, "Genre");
  // var publisherData = organizeData(publishersExtent, "Publisher");
0
  function highestExtent() {

  }

  function updateChart(newData) {
    var actualHeight = rangeY[0]-rangeY[1]
    var actualWidth = rangeX[1]-rangeX[0]

    length = newData.length;

    var newTitle = chart1.selectAll('.gClass').data(newData, function(d){
      return d.column;
    });

    newTitle.remove();
    newTitle = chart1.selectAll('.gClass').data(newData, function(d){
      return d.column;
    });

    var selection = newTitle.enter()
        .append('g')
        .attr('class', 'gClass');

    selection.append('rect')
      .attr('height', function (d) { 
        var value = d.value < 500 ? d.value : 510;
        return value* (actualHeight/extent[1]) 
      })
      .attr('width', function(){return actualWidth/newData.length - 10})
      .attr('class', 'bar');
    
    selection.append('text')
      .attr('text-anchor', 'end')
      .attr('transform',  function(d){
        var value = d.value < 500 ? d.value : 500;
        return "translate(15," + ((value* (440/extent[1])) + 10) + ")"+"rotate(-45)"
      })
      .text(function(d){
          return d.column;
      });
        
    selection.merge(newTitle).attr('transform', function(d, index){
        var value = d.value < 500 ? d.value : 500;
        console.log((rangeY[0] - (value * (actualHeight/extent[1]))))
        return "translate(" + (index* (actualWidth/newData.length) + 75)+ "," + (rangeY[0] - (value * (actualHeight/extent[1]))) + ")";
    });
    

    newTitle.exit().remove();

  }

  // Returns columns with corresponding datapoints
  function organizeData(columnName, xVariable, yVariable) {
    //changes axes and title of graph
    d3.select("#chart1Title").text(xVariable + " vs " + yVariable + " (in Millions)"); 
     
    //organization of data begins
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
    for(var i = 0; i < arr.length; i++) {
      var currData = {}
      currData.column = arr[i][0];
      currData.value = arr[i][1];
      newData.push(currData);
    }
    console.log(newData);

    if (xVariable == "Year") {
      newData.forEach((row)=>{
        if (row.column != 'NaN') {
          var mod = 8 - Math.floor((2021-row.column)/5)
          yearsData[mod].value = row.value + yearsData[mod].value;
        }
      })
      newData = yearsData;
    }
    data = newData;

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
