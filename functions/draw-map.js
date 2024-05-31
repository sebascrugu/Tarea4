const d3 = require('d3');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const bnaData = `
    53,01779804,14 -117.032351,48.999188 -117.035545,46.410012 -116.915989,45.995413 -118.987129,45.999855 -121.084933,45.647893 -122.262625,45.544321 -123.547659,46.259109 -124.080983,46.735003 -124.412106,47.691199 -124.050734,48.177747 -122.760448,48.14324 -122.75802,49.002357 -118.8366130356,49.0003077593 -117.032351,48.999188 ...
    `;

    const width = 960;
    const height = 600;

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height);

    const projection = d3.geoAlbersUsa()
      .scale(1280)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath()
      .projection(projection);

    const bnaLines = bnaData.trim().split('\n').map(line => {
      const [code, ...coords] = line.split(',');
      return {
        code: code,
        coordinates: coords.map(c => c.split(' ').map(Number))
      };
    });

    svg.selectAll("path")
      .data(bnaLines)
      .enter().append("path")
      .attr("d", d => path({ type: "LineString", coordinates: d.coordinates }))
      .attr("fill", "none")
      .attr("stroke", "#000");

    const output = svg.node().outerHTML;

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/svg+xml" },
      body: output
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
