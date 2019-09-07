function ploteverything() {
    var margin = { top: 20, right: 30, bottom: 40, left: 30 },
        width = 900 - margin.left - margin.right,
        height = 620 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);


    var y = d3.scaleBand()
        .rangeRound([0, height])
        .padding(0.1);


    var xAxis = d3.axisBottom(x)

    // .text("% GDP Change");

    var yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(6);

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("static/assets/data/final_gdpdata_v1.csv").then(function (data) {
        console.log(data)

        x.domain(d3.extent(data, function (d) { return d.GDP_Change; })).nice();
        y.domain(data.map(function (d) { return d.Quarter; }));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", function (d) { return "bar bar--" + (d.GDP_Change < 0 ? "negative" : "positive"); })
            .attr("x", function (d) { return x(Math.min(0, d.GDP_Change)); })
            .attr("y", function (d) { return y(d.Quarter); })
            .attr("width", function (d) { return Math.abs(x(d.GDP_Change) - x(0)); })
            .attr("height", y.bandwidth());

        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + height + ")")
        //     .style("font-size", "14px") 
        //     .style("text-anchor", "middle")
        //     .text("% GDP Change")
        //     .call(xAxis);

        // svg.append("g")
        //     .attr("class", "y axis")
        //     .attr("transform", "translate(" + x(0) + ",0)")
        //     .call(yAxis);



        var updateBars = function (data) {
            //return; 
            console.log(data);
            // First update the x-axis domain to match data
            var extent = (d3.extent(data, function (d) { return d.GDP_Change; }));
            extent[0] = Math.min(-1, extent[0]);
            x.domain(extent).nice();
            y.domain(data.map(function (d) { return d.Quarter; }));
            d3.selectAll("#xaxis").remove();
            d3.selectAll("#yaxis").remove();
            svg.append("g")
                .attr("id", "xaxis")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .style("font-size", "14px")
                .style("text-anchor", "middle")
                .text("% GDP Change")
                .call(xAxis);

            svg.append("g")
                .attr("id", "yaxis").attr("class", "y axis")
                .attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);
            var bars = svg.selectAll(".bar").data(data);

            // Add bars for new data
            bars.enter().append("rect")
                .attr("class", function (d) { return "bar bar--" + (d.GDP_Change < 0 ? "negative" : "positive"); })
                .attr("x", function (d) { return x(Math.min(0, d.GDP_Change)); })
                .attr("y", function (d) { return y(d.Quarter); })
                .attr("width", function (d) { return Math.abs(x(d.GDP_Change) - x(0)); })
                .attr("height", y.bandwidth());

            // Update old ones, already have x / width from before
            bars
                .transition().duration(250)
                .attr("x", function (d) { return x(Math.min(0, d.GDP_Change)); })
                .attr("width", function (d) { return Math.abs(x(d.GDP_Change) - x(0)); })

            // Remove old ones
            bars.exit().remove();
        };

        // Handler for dropdown value change
        var dropdownChange = function () {
            var newState = d3.select(this).property('value'),
                newData = data.filter(d => { return d.State === newState });
            updateBars(newData);
            console.log(newData);
        };

        // Get names of states, for dropdown
        var states = data.map(x => x.State);
        console.log(states);

        function sort_unique(arr) {
            return arr.sort().filter(function (el, i, a) {
                return (i == a.indexOf(el));
            });
        }
        states = sort_unique(states);
        states.splice(data.indexOf('United States'), 1);
        states = ['United States'].concat(states);

        var dropdown = d3.select("#vis-container")
            .insert("select", "svg")
            .on("change", dropdownChange);

        dropdown.selectAll("option")
            .data(states)
            .enter().append("option")
            .attr("value", function (d) { return d; })
            .text(function (d) { return d; });

        var initialData = data.filter(d => { return d.State === 'United States' });
        updateBars(initialData);
        console.log(initialData);



    });

    function type(d) {
        d.GDP_Change = +d.GDP_Change;
        return d;
    }
};
ploteverything();

 // the end