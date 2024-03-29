// @TODO: YOUR CODE HERE!
// set svg and chart dimensions
function scatterPlot() {
    console.log("...4");
    var svgWidth = document.getElementById('scatter').clientWidth;
    var svgHeight = document.getElementById('scatter').clientHeight+200;
    console.log(svgWidth);
    console.log(svgHeight);
    // set borders in svg
    var margin = {
        top: 0,
        right: 40,
        bottom: 70,
        left: 70
    };

    // calculate chart height and width
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var oldChart = document.getElementById('scatter-div');
    if (oldChart) oldChart.remove();
    var chart = d3
        .select('#scatter')
        .append('div')
        .attr('id', 'scatter-div')
        .classed('chart', true);

    var svg = chart
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    // Append SVG group
    var chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = 'poverty';
    var chosenYAxis = 'highschool';
console.log("...42");
    // function used for updating x-scale var upon click on axis label
    function xScale(censusData, chosenXAxis) {
        // create scales
        var xLinearScale = d3
            .scaleLinear()
            .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8, d3.max(censusData, d => d[chosenXAxis]) * 1.2])
            .range([0, width]);

        return xLinearScale;
    }

    // function used for updating y-scale var upon click on axis label
    function yScale(censusData, chosenYAxis) {
        // create scales
        var yLinearScale = d3
            .scaleLinear()
            .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8, d3.max(censusData, d => d[chosenYAxis]) * 1.2])
            .range([height, 0]);

        return yLinearScale;
    }

    // function used for updating xAxis var upon click on axis label
    function renderAxesX(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis
            .transition()
            .duration(1000) //100000?
            .call(bottomAxis);

        return xAxis;
    }

    // function used for updating yAxis var upon click on axis label
    function renderAxesY(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis
            .transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // function used for updating circles group with a transition to new circles
    // for change in x-axis or y-axis
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        circlesGroup
            .transition()
            .duration(1000)
            .attr('cx', d => newXScale(d[chosenXAxis]))
            .attr('cy', d => newYScale(d[chosenYAxis]));

        return circlesGroup;
    }

    // unction used for updating state lables within the circles with a transition to new
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup
            .transition()
            .duration(1000)
            .attr('x', d => newXScale(d[chosenXAxis]))
            .attr('y', d => newYScale(d[chosenYAxis]));

        return textGroup;
    }

    // function to stylize x-axis values for tooltips based on variable chosen
    function styleX(value, chosenXAxis) {
        // poverty percentage
        if (chosenXAxis === 'poverty') {
            return `${value}%`;
        }
        // household income in dollars
        else if (chosenXAxis === 'householdincome') {
            console.log(value);
            return `$${value}`;
            //return 0
        }
        // ercentage of unemployed
        else if (chosenXAxis === 'unemployment') {
            return `${value}%`;
        }
        // age (number)
        else {
            return `${value}`;
        }
    }
    // function to stylize y-axis values for tooltips based on variable chosen
    function styleY(value, chosenYAxis) {
        // percentage with highschool or less education
        if (chosenYAxis === 'highschool') {
            return `${value}%`;
        }
        // percentage with college or more education
        else if (chosenYAxis === 'college') {
            return `${value}%`;
        }
        // cost of monthly housing via rental
        else if (chosenYAxis === 'rental') {
            //console.log(`rental: ${value}`)
            return `$${value}`;
        }
        // cost of monthly housing via homeownership
        else {
            return `$${value}`;
        }
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        //select x label
        //poverty percentage
        if (chosenXAxis === 'poverty') {
            var xLabel = 'Poverty:';
        }
        //household income in dollars
        else if (chosenXAxis === 'householdincome') {
            var xLabel = 'Median Income:';
        }
        //percentage of unemployed
        else if (chosenXAxis === 'unemployment') {
            var xLabel = 'Unemployment:';
        }
        //age (number)
        else {
            var xLabel = 'Age:';
        }

        //select y label
        //percentage with highschool education or less
        if (chosenYAxis === 'highschool') {
            var yLabel = 'High School or Less Education:';
        }
        //percentage with college or professional education
        else if (chosenYAxis === 'college') {
            var yLabel = 'College or Professional Education:';
        }
        //monthly cost of rental housing
        else if (chosenYAxis === 'rental') {
            var yLabel = 'Monthly Rental Housing Cost:';
        }
        //monthly cost of homeownership
        else {
            var yLabel = 'Monthly Homeownership Costs:';
        }

        // create tooltip
        var toolTip = d3
            .tip()
            .attr('class', 'd3-tip') //d3-tip=tooltip
            .offset([-8, 0])
            .html(function(d) {
                return `${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${styleY(d[chosenYAxis], chosenYAxis)}`;
            });

        circlesGroup.call(toolTip);

        // add events onmouseout event
        circlesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

        return circlesGroup;
    }
    function updateChart(yearFile) {
        // Retrieve data from the CSV file and execute everything below
        d3.csv(yearFile)
            .then(function(censusData) {
                //err,
                // census_data2013-2017_state.csv available
                //if (err) throw err;
                console.log(censusData);

                // parse data
                censusData.forEach(function(data) {
                    data.poverty = +data.poverty;
                    data.age = +data.age;
                    data.householdincome = +data.householdincome;
                    data.unemployment = +data.unemployment;
                    data.highschool = +data.highschool;
                    data.college = +data.college;
                    data.rental = +data.rental;
                    data.mortgage = +data.mortgage;
                });

                // xLinearScale & yLinearScale scales for above csv import
                var xLinearScale = xScale(censusData, chosenXAxis);
                var yLinearScale = yScale(censusData, chosenYAxis);

                // Create initial axis functions
                var bottomAxis = d3.axisBottom(xLinearScale);
                var leftAxis = d3.axisLeft(yLinearScale);

                // append x axis
                var xAxis = chartGroup
                    .append('g')
                    .classed('x-axis', true)
                    .attr('transform', `translate(0, ${height})`)
                    .call(bottomAxis);

                // append y axis
                var yAxis = chartGroup
                    .append('g')
                    .classed('y-axis', true)
                    .call(leftAxis);

                // append initial circles
                var circlesGroup = chartGroup
                    .selectAll('circle')
                    .data(censusData)
                    .enter()
                    .append('circle')
                    .classed('stateCircle', true)
                    .attr('cx', d => xLinearScale(d[chosenXAxis]))
                    .attr('cy', d => yLinearScale(d[chosenYAxis]))
                    .attr('r', 12)
                    .attr('opacity', '.5');

                // append initial text
                var textGroup = chartGroup
                    .selectAll('.stateText')
                    .data(censusData)
                    .enter()
                    .append('text')
                    .classed('stateText', true)
                    .attr('x', d => xLinearScale(d[chosenXAxis]))
                    .attr('y', d => yLinearScale(d[chosenYAxis]))
                    .attr('dy', 3)
                    .attr('font-size', '10px')
                    .text(function(d) {
                        return d.abbr;
                    });

                // Create group for the 4 x-axis labels
                var xLabelsGroup = chartGroup.append('g').attr('transform', `translate(${width / 2}, ${height + 20 + margin.top})`);

                var povertyLabel = xLabelsGroup
                    .append('text')
                    .classed('aText', true)
                    .classed('active', true)
                    .attr('x', 0)
                    .attr('y', 20)
                    .attr('value', 'poverty')
                    .text('In Poverty (%)');

                // var ageLabel = xLabelsGroup
                //     .append('text')
                //     .classed('aText', true)
                //     .classed('inactive', true)
                //     .attr('x', 0)
                //     .attr('y', 40)
                //     .attr('value', 'age')
                //     .text('Age (Median)');

                // var incomeLabel = xLabelsGroup
                //     .append('text')
                //     .classed('aText', true)
                //     .classed('inactive', true)
                //     .attr('x', 0)
                //     .attr('y', 60)
                //     .attr('value', 'householdincome')
                //     .text('Household Income (Median, $)');

                // var unemploymentLabel = xLabelsGroup
                //     .append('text')
                //     .classed('aText', true)
                //     .classed('inactive', true)
                //     .attr('x', 0)
                //     .attr('y', 80)
                //     .attr('value', 'unemployment')
                //     .text('Unemployment (%)');

                // Create group for the 4 y-axis labels
                var yLabelsGroup = chartGroup.append('g').attr('transform', `translate(${0 - margin.left / 4}, ${height / 2})`);

                var highschoolLabel = yLabelsGroup
                    .append('text')
                    .classed('aText', true)
                    .classed('active', true)
                    .attr('x', 0)
                    .attr('y', 0 - 40)
                    .attr('dy', '1em')
                    .attr('transform', 'rotate(-90)')
                    .attr('value', 'highschool')
                    .text('High School Education or Less (%)');

                // var collegeLabel = yLabelsGroup
                //     .append('text')
                //     .classed('aText', true)
                //     .classed('inactive', true)
                //     .attr('x', 0)
                //     .attr('y', 0 - 50)
                //     .attr('dy', '1em')
                //     .attr('transform', 'rotate(-90)')
                //     .attr('value', 'college')
                //     .text('College/Professional Education (%)');

                // var rentalLabel = yLabelsGroup
                //     .append('text')
                //     .classed('aText', true)
                //     .classed('inactive', true)
                //     .attr('x', 0)
                //     .attr('y', 0 - 75)
                //     .attr('dy', '1em')
                //     .attr('transform', 'rotate(-90)')
                //     .attr('value', 'rental')
                //     .text('Monthly Cost of Rental Housing ($)');

                // var mortgageLabel = yLabelsGroup
                //     .append('text')
                //     .classed('aText', true)
                //     .classed('inactive', true)
                //     .attr('x', 0)
                //     .attr('y', 0 - 25)
                //     .attr('dy', '1em')
                //     .attr('transform', 'rotate(-90)')
                //     .attr('value', 'mortgage')
                //     .text('Monthly Cost of Homeownership ($)');

                // updateToolTip function above csv import
                var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // x axis labels event listener
                xLabelsGroup.selectAll('text').on('click', function() {
                    // get value of selection
                    var value = d3.select(this).attr('value');
                    // check if value is same as current axis
                    if (value != chosenXAxis) {
                        // replaces chosenXAxis with value
                        chosenXAxis = value;
                        console.log(chosenXAxis); //something here....

                        //update x scale for new data
                        xLinearScale = xScale(censusData, chosenXAxis);

                        //update x axis with transition
                        xAxis = renderAxesX(xLinearScale, xAxis);

                        //update circles with new x values
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                        //update text with new x values
                        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                        //update tooltips with new info
                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                        // changes classes to change bold text
                        if (chosenXAxis === 'poverty') {
                            povertyLabel.classed('active', true).classed('inactive', false);
                            ageLabel.classed('active', false).classed('inactive', true);
                            incomeLabel.classed('active', false).classed('inactive', true);
                            unemploymentLabel.classed('active', false).classed('inactive', true);
                        } else if (chosenXAxis === 'age') {
                            povertyLabel.classed('active', false).classed('inactive', true);
                            ageLabel.classed('active', true).classed('inactive', false);
                            incomeLabel.classed('active', false).classed('inactive', true);
                            unemploymentLabel.classed('active', false).classed('inactive', true);
                        } else if (chosenXAxis === 'householdincome') {
                            povertyLabel.classed('active', false).classed('inactive', true);
                            ageLabel.classed('active', false).classed('inactive', true);
                            incomeLabel.classed('active', true).classed('inactive', false);
                            unemploymentLabel.classed('active', false).classed('inactive', true);
                        } else {
                            povertyLabel.classed('active', false).classed('inactive', true);
                            ageLabel.classed('active', false).classed('inactive', true);
                            incomeLabel.classed('active', false).classed('inactive', true);
                            unemploymentLabel.classed('active', true).classed('inactive', false);
                        }
                    }
                });

                //y axis labels event listener
                yLabelsGroup.selectAll('text').on('click', function() {
                    //get value of selection
                    var value = d3.select(this).attr('value');

                    //check if value is same as current axis
                    if (value != chosenYAxis) {
                        //replace chosenYAxis with value
                        chosenYAxis = value;
                        console.log(chosenYAxis);

                        //update y scale for new data
                        yLinearScale = yScale(censusData, chosenYAxis);

                        //update x axis with transition
                        yAxis = renderAxesY(yLinearScale, yAxis);

                        //update circles with new y values
                        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                        //update text with new y values
                        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                        //update tooltips with new info
                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                        //change classes to change bold text
                        if (chosenYAxis === 'highschool') {
                            highschoolLabel.classed('active', true).classed('inactive', false);
                            collegeLabel.classed('active', false).classed('inactive', true);
                            rentalLabel.classed('active', false).classed('inactive', true);
                            mortgageLabel.classed('active', false).classed('inactive', true);
                        } else if (chosenYAxis === 'college') {
                            highschoolLabel.classed('active', false).classed('inactive', true);
                            collegeLabel.classed('active', true).classed('inactive', false);
                            rentalLabel.classed('active', false).classed('inactive', true);
                            mortgageLabel.classed('active', false).classed('inactive', true);
                        } else if (chosenYAxis === 'rental') {
                            highschoolLabel.classed('active', false).classed('inactive', true);
                            collegeLabel.classed('active', false).classed('inactive', true);
                            rentalLabel.classed('active', true).classed('inactive', false);
                            mortgageLabel.classed('active', false).classed('inactive', true);
                        } else {
                            highschoolLabel.classed('active', false).classed('inactive', true);
                            collegeLabel.classed('active', false).classed('inactive', true);
                            rentalLabel.classed('active', false).classed('inactive', true);
                            mortgageLabel.classed('active', true).classed('inactive', false);
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    console.log("...about to call updateChart");
    updateChart('/static/assets/data/census_data2017_state.csv');
}

scatterPlot();