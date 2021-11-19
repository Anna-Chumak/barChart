document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data.data;
      //values for measurments
      const w = 840;
      const h = 490;
      const padding = 40;
      const barWidth = (w - padding * 2) / dataset.length;
      //value for dates converted from strings
      var yearsDate = dataset.map(function (item) {
        return new Date(item[0]);
      });

      var tooltip = d3
        .select(".chart")
        .append("div")
        .attr("id", "tooltip")
        .attr("width", "60px")
        .attr("height", "40px")
        .style("font-size", "12px")
        .style("display", "none");

      const xScale = d3
        .scaleTime()
        .domain([d3.min(yearsDate), d3.max(yearsDate)])
        .range([padding, w - padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h - padding, padding]);

      const svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
      var linearScaleForHeight = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([padding, h - padding]);

      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("data-date", function (d, i) {
          return dataset[i][0];
        })
        .attr("data-gdp", function (d, i) {
          return dataset[i][1];
        })
        .attr("x", (d, i) => xScale(yearsDate[i]))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", barWidth)
        .attr("height", (d) => linearScaleForHeight(d[1]) - padding)
        .attr("class", "bar")
        .style("fill", "#33adff")
        .on("mouseover", (event, d) => {
          event.target.style.fill = "red";
          tooltip
            .attr("data-date", d[0])
            .style("display", "block")
            .html(
              `<p>Date: ${d[0]}</p>
                <p>GDP: ${d[1]}</p>`
            )
            .style("top", h - 100 + "px");
        })
        .on("mouseout", (event, d) => {
          event.target.style.fill = "#33adff";
          tooltip.style("display", "none");
        });

      const xAxis = d3.axisBottom(xScale);

      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);
      svg
        .append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .attr("id", "y-axis")
        .call(yAxis);
    });
  //console.log(dataset);
});
