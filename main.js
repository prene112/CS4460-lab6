var width = 550;
var height = 650;

//ranges of the chart
var rangeX = [50, 500]
var rangeY = [470, 30]

//the range of the yAxis
var extent = [0,500];


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

  // used to store unique values for each variable 
  //(such as wii, xbox360, nes, etc. for Platform)
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


  //Create SVG for chart
  var chart1 = d3
    .select("#chart1")
    .append("svg:svg")
    .attr("id", "svg1")
    .attr("width", width)
    .attr("height", height);



  $(document).ready(function(){
    //runs the following functions when the axes,filters, or mouseover change
    $('#xCategorySelect').on( 'change', function(){ onCategoryChanged(retrieveCutoff(), retrieveSort()); } );
    $('#yCategorySelect').on( 'change', function(){ onCategoryChanged(retrieveCutoff(), retrieveSort()); } );
    $('#sortSelect').on( 'change', function(){ onCategoryChanged(retrieveCutoff(), retrieveSort()); } );
    $("#cutoffButton1").on('click', function() {onCategoryChanged(retrieveCutoff(), retrieveSort())})
    $('#chart1').mouseover(function(){
      $('.gClass').mouseover(function(val) {
        var hoverColumn = val.target.__data__;
        $('#columnName').text(function(){return "Column Name: " + hoverColumn.column})
        $('#value').text(function(){return "Value: " + hoverColumn.value.toFixed(2) + " million"})
      });
    })
     
    /* All these changes below occur during startup */
    //change Axes names
    xLabel.text("Platform");
    yLabel.text("Global_Sales (in millions of dollars)");

    var platformData = organizeData(platformExtent, "Platform", "Global_Sales");
    updateAxes();
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

  //Labels for Charts
  var title1 = d3
    .select("#svg1")
    .append("text")
    .attr("x", width/2)
    .attr("y", 12)
    .attr("font-size", "12px");

  //Labels for axes location
  var yLabel = d3
    .select("#svg1")
    .append("text")
    .attr("x", 10)
    .attr("y", 250)
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(-230,300)rotate(-90)")
    .attr("font-weight", "bold")
    .text("yAxis");

  var xLabel = d3
    .select("#svg1")
    .append("text")
    .attr("x", 275)
    .attr("y", 625)
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text("xAxis");
 

  function updateAxes() {

    yScale = d3.scaleLinear().domain([0, extent[1]]).range(rangeY);

    yAxis = d3.axisLeft().scale(yScale);

    //appending axis
    chart1 
      .append("g") 
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

    //change Axes names
    xLabel.text(xVal);
    yLabel.text(yVal + " (in millions of dollars)");

    if (xVal == "Year") {
      clearYearsData();
    }
    var result = organizeData(inputExtent, xVal, yVal);

    //sorting and filtering occurs
    var finalResult = result.filter((d)=> {return d.value >= cutoff})
    if (sort == "lowToHigh") {
      finalResult = finalResult.sort(function(a, b){return a.value-b.value});
    } else if (sort == "highToLow"){
      finalResult = finalResult.sort(function(a, b){return b.value-a.value});
    } else {
      finalResult = result;
    }
    updateChart(finalResult);
  }

  //sets all values to 0 in yearsData variable
  function clearYearsData() {
    yearsData.forEach((val)=>{
      val.value = 0;
    })
  }

  //updates chart with bars and text
  function updateChart(newData) {
    var actualHeight = rangeY[0]-rangeY[1]
    var actualWidth = rangeX[1]-rangeX[0]

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
        var value = d.value < 500 ? d.value : 550;
        return value* (actualHeight/extent[1]) 
      })
      .attr('width', function(){return actualWidth/newData.length - 10})
      .attr('class', 'bar');
    
    selection.append('text')
      .attr('text-anchor', 'end')
      .attr('transform',  function(d){
        var value = d.value < 500 ? d.value : 550;
        return "translate(15," + ((value* (440/extent[1])) + 10) + ")"+"rotate(-45)"
      })
      .text(function(d){
          return d.column;
      });
        
    selection.merge(newTitle).attr('transform', function(d, index){
        var value = d.value < 500 ? d.value : 550;
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

    if (xVariable == "Year") {
      newData.forEach((row)=>{
        if (row.column != 'NaN') {
          var mod = 8 - Math.floor((2021-row.column)/5)
          yearsData[mod].value = row.value + yearsData[mod].value;
        }
      })
      newData = yearsData;
    }
    console.log(newData);
    return newData;
    
  }
});
