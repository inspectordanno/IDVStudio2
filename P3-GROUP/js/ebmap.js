var width = 700;
var height = 500;
var marginLeft = 50;
var marginTop = 50;
//

var svg3 = d3.select('#map')
    .append('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');


  var projection = d3.geoAlbers()
      .scale( 200000 )
      .rotate( [71.057,0] )
      .center( [0, 42.313] )
      .translate( [width/2,height/2] );

      path = d3.geoPath()
            .projection(projection);

var tractLookup = d3.map();

var colorScale = d3.scaleLinear().range(['#fff','#ceef92']);

var div = d3.select("#map")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

queue()
    .defer(d3.json, "data/eastBostonCensusTracts.geojson")
    .defer(d3.csv, "data/ebPop.csv")
    .await(function(err, mapData, popData){

    popData.forEach(function(d){
        tractLookup.set(d.NAME10, d.pop);
    });

    console.log(tractLookup);


    colorScale.domain([0, d3.max(popData.map(function(d){return +d.pop}))]);


        svg3.selectAll("path")               //make empty selection
            .data(mapData.features)          //bind to the features array in the map data
            .enter()
            .append("path")                 //add the paths to the DOM
            .attr("d", path)               //actually draw them
            .attr("class", "feature")
            .attr('fill', function(d){
                return colorScale(tractLookup.get(d.attributes.pop));
            })
            .attr('stroke','#000')
            .attr('stroke-width',2)
                    });
