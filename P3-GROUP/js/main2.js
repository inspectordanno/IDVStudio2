var data = [
  {
    name: "5% Increase",
    values: [
      {date: "2013", price:	"1365"},
      {date: "2014", price:	"1512"},
      {date: "2015", price:	"1689"},
      {date: "2016", price:	"1886"},
      {date: "2017", price:	"1935"},
      {date: "2018", price:	"2032"},
      {date: "2019", price:	"2133"},
      {date: "2020", price:	"2240"},
      {date: "2021", price:	"2352"},
      {date: "2022", price:	"2470"},
      {date: "2023", price:	"2593"},
    ]
  },
  {
    name: "10% Increase",
    values: [
      {date: "2013", price:	"1365"},
      {date: "2014", price:	"1512"},
      {date: "2015", price:	"1689"},
      {date: "2016", price:	"1886"},
      {date: "2017", price:	"1935"},
      {date: "2018", price:	"2129"},
      {date: "2019", price:	"2341"},
      {date: "2020", price:	"2575"},
      {date: "2021", price:	"2833"},
      {date: "2022", price:	"3116"},
      {date: "2023", price:	"3428"},
    ]
  },
  {
    name: "15% Increase",
    values: [
      {date: "2013", price:	"1365"},
      {date: "2014", price:	"1512"},
      {date: "2015", price:	"1689"},
      {date: "2016", price:	"1886"},
      {date: "2017", price:	"1935"},
      {date: "2018", price:	"2225"},
      {date: "2019", price:	"2559"},
      {date: "2020", price:	"2943"},
      {date: "2021", price:	"3384"},
      {date: "2022", price:	"3892"},
      {date: "2023", price:	"4476"},
    ]
  }
];


var width = 700;
var height = 200;
var margin = 50;
var duration = 250;

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;


/* Format Data */
var parseDate = d3.timeParse("%Y");
data.forEach(function(d) {
  d.values.forEach(function(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
  });
});


/* Scale */
var xScale = d3.scaleTime()
  .domain(d3.extent(data[0].values, d => d.date))
  .range([0, width-margin]);

var yScale = d3.scaleLinear()
  .domain([1000, d3.max(data[0].values, d => d.price)])
  .range([height-margin, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

/* Add SVG */
var svg2 = d3.select("#chart2").append("#svg")
  .attr("width", (width+margin)+"px")
  .attr("height", (height+margin)+"px")
  .append('g')
  .attr("transform", `translate(${margin}, ${margin})`);


/* Add line into SVG */
var line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.price));

let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')
  .on("mouseover", function(d, i) {
      svg.append("text")
        .attr("class", "title-text")
        .style("fill", color(i))
        .text(d.name)
        .attr("text-anchor", "middle")
        .attr("x", (width-margin)/2)
        .attr("y", 5);
    })
  .on("mouseout", function(d) {
      svg.select(".title-text").remove();
    })
  .append('path')
  .attr('class', 'line')
  .attr('d', d => line(d.values))
  .style('stroke', (d, i) => color(i))
  .style('opacity', lineOpacity)
  .on("mouseover", function(d) {
      d3.selectAll('.line')
					.style('opacity', otherLinesOpacityHover);
      d3.selectAll('.circle')
					.style('opacity', circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
  .on("mouseout", function(d) {
      d3.selectAll(".line")
					.style('opacity', lineOpacity);
      d3.selectAll('.circle')
					.style('opacity', circleOpacity);
      d3.select(this)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
    });


/* Add circles in the line */
lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .style("fill", (d, i) => color(i))
  .selectAll("circle")
  .data(d => d.values).enter()
  .append("g")
  .attr("class", "circle")
  .on("mouseover", function(d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d.price}`)
        .attr("x", d => xScale(d.date) + 5)
        .attr("y", d => yScale(d.price) - 10);
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text").remove();
    })
  .append("circle")
  .attr("cx", d => xScale(d.date))
  .attr("cy", d => yScale(d.price))
  .attr("r", circleRadius)
  .style('opacity', circleOpacity)
  .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadius);
      });


/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(10);
var yAxis = d3.axisLeft(yScale).ticks(10);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height-margin})`)
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append('text')
  .attr("y", 15)
  .attr("transform", "rotate(-90)")
  .attr("fill", "#000")
  .text("Average Rent Price");
