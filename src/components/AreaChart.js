// importing d3.js
import * as d3 from 'd3';
import textures from 'textures';

// importing util functions
import {parseTime,parseTimeYear,formatTimeYear} from '../utils';

// importing modules
import MouseTarget from './MouseTarget';

// importing stylesheets

// instantiating modules
const mouseTarget = MouseTarget();

// defining global variables

// defining Factory function
function AreaChart(_) {

    /* CREATE GETTER SETTER PATTERN */
    let _margin = {t:0, r:0, b:0, l:0};
    let _curve = d3.curveLinear;
    let _axisOpacity = 0;
    let _yAxis = 'value';
    let _minDate = parseTime('12/31/2015');
    let _isMobile = false;

    const _dispatch = d3.dispatch('change:date');

    function exports(data) {

        const root = this;
        const container = d3.select(root);

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        // appending svg & <g> plot
        // update selection
        let svgUpdate = d3.select(root)
            .selectAll('svg')
            .data([data]);
        // enter selection
        const svgEnter = svgUpdate.enter()
            .append('svg');
        // exit selection
        svgUpdate.exit().remove();
        // enter+update selection
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('height', clientHeight)
            .attr('width', clientWidth);

        // update selection
        let plotUpdate = svgUpdate.selectAll('.plot')
            .data(d => [d]);
        // enter selection
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('plot', true)
			.attr('transform',`translate(${margin.l},${margin.t})`);
        // exit selection
        plotUpdate.exit().remove();
        // enter+update selection
        plotUpdate = plotUpdate.merge(plotEnter);

        // data transformation
        const listDates = data.map(d => parseTime(d.date));
        const minDate = d3.min(listDates);
        const getMin = d3.min([minDate,_minDate]);
        const maxDate = d3.max(listDates);
        const maxValue = d3.max(data,d => d[_yAxis]);

        // setting up scales
        const scaleX = d3.scaleTime()
            .domain([getMin,maxDate])
            .range([0,w]);

        const scaleY = d3.scaleLinear()
            .domain([0,maxValue])
            .range([h,0])
            .nice();

        //Set up axis generator
        const axisY = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-w)
            .ticks(3);

        const axisX = d3.axisBottom()
            .scale(scaleX)
            .tickSize(0)
            .ticks(d3.timeYear.every(1))
            .tickFormat(d => formatTimeYear(d));

        if (_isMobile) {
            axisX.ticks(d3.timeYear.every(2));
        }

        // setting up line generator path
        const line = d3.line()
            .x(d => scaleX(parseTime(d.date)))
            .y(d => scaleY(d[_yAxis]))
            .curve(_curve);

        const area = d3.area()
            .x(d => scaleX(parseTime(d.date)))
            .y0(d => scaleY(0))
            .y1(d => scaleY(d[_yAxis]))
            .curve(_curve);

        // individual <g> for area/line
        // enter-exit-update pattern
        // update selection
        let lineWrapperUpdate = plotUpdate.selectAll('.line-chart')
            .data([data]);
        // enter selection
        const lineWrapperEnter = lineWrapperUpdate.enter()
            .append('g')
            .classed('line-chart',true);
        // exit selection
        lineWrapperUpdate.exit().remove();
        // update + enter selection
        lineWrapperUpdate = lineWrapperUpdate.merge(lineWrapperEnter);

        let areaWrapperUpdate = plotUpdate.selectAll('.area-chart')
            .data([data]);
        // enter selection
        const areaWrapperEnter = areaWrapperUpdate.enter()
            .append('g')
            .classed('area-chart',true);
        // exit selection
        areaWrapperUpdate.exit().remove();
        // update + enter selection
        areaWrapperUpdate = areaWrapperUpdate.merge(areaWrapperEnter);

        // appending paths to groups
        let areaUpdate = areaWrapperUpdate.selectAll('.area-node')
            .data(d => [d]);
        const areaEnter = areaUpdate.enter()
            .append('path')
            .classed('area-node', true);
        areaUpdate = areaUpdate.merge(areaEnter)
            .attr('d', area)
            .style('stroke', 'none')
            .style('stroke-width',0)
            .style('fill', 'black')
            .style('fill-opacity',0.6);

        let lineUpdate = lineWrapperUpdate.selectAll('.line-node')
            .data(d => [d]);
        const lineEnter = lineUpdate.enter()
            .append('path');
        lineUpdate = lineUpdate.merge(lineEnter)
            .classed('line-node', true)
            .attr('d', line)
            .style('stroke', 'black')
            .style('stroke-width',2)
            .style('fill', 'none')
            .style('fill-opacity',0);

        // creating pattern with textures module
        const texture = textures.lines()
            .size(10)
            .strokeWidth(0.25)
            .stroke('#C0C0C0')
            .background('#F5F5F5');
        svgUpdate.call(texture);

        // drawing rect for unavailable data
        let dataNAWrapperUpdate = plotUpdate.selectAll('.data-unavailable-node')
            .data([1]);
        // enter selection
        const dataNAWrapperEnter = dataNAWrapperUpdate.enter()
            .append('g')
            .classed('data-unavailable-node',true);
        // exit selection
        dataNAWrapperUpdate.exit().remove();
        // update + enter selection
        dataNAWrapperUpdate = dataNAWrapperUpdate.merge(dataNAWrapperEnter);

        let dataNAUpdate = dataNAWrapperUpdate.selectAll('.data-unavailable-rect')
            .data([1]);
        // enter selection
        const dataNAEnter = dataNAUpdate.enter()
            .append('rect')
            .classed('data-unavailable-rect',true);
        // exit selection
        dataNAUpdate.exit().remove();
        // update + enter selection
        dataNAUpdate = dataNAUpdate.merge(dataNAEnter)
            .attr('width',scaleX(minDate))
            .attr('height',h-scaleY(610))
            .attr('y',scaleY(610))
            .attr('fill', texture.url());

        let dataNATextUpdate = dataNAWrapperUpdate.selectAll('.data-unavailable-text')
            .data([1]);
        // enter selection
        const dataNATextEnter = dataNATextUpdate.enter()
            .append('text')
            .classed('data-unavailable-text',true);
        // exit selection
        dataNATextUpdate.exit().remove();
        // update + enter selection
        dataNATextUpdate = dataNATextUpdate.merge(dataNATextEnter)
            .attr('x',scaleX(minDate)/2)
            .attr('y',scaleY(625))
            .attr('fill', 'black')
            .attr('text-anchor','middle')
            .text('Data N/A');

        // draw axis
        // x-axis
        const axisXNode = plotUpdate.selectAll('.axis-x')
            .data([1]);
        const axisXNodeEnter = axisXNode.enter()
            .append('g')
            .attr('class','axis axis-x vertical');
        axisXNode.merge(axisXNodeEnter)
            .attr('transform',`translate(0,${h})`)
            .call(axisX);
        // y-axis
        const axisYNode = plotUpdate.selectAll('.axis-y')
            .data([1]);
        const axisYNodeEnter = axisYNode.enter()
            .append('g')
            .attr('class','axis axis-y vertical');
        axisYNode.merge(axisYNodeEnter)
            .attr('transform',`translate(${0},${0})`)
            .call(axisY)
            .select('.tick:first-of-type')
            .style('opacity',_axisOpacity);

        mouseTarget.margin(_margin)
            .minDate(getMin);
        plotUpdate.each(mouseTarget);

        mouseTarget.on('mousemove:x',function(d) {
            _dispatch.call('change:date',null,d);
        });

    }

    // create getter-setter pattern for customization
    exports.on = function(eventType,cb) {
        // eventType is a string ===> custom eventType
        // cb is a function ===> callback
        _dispatch.on(eventType,cb);
        return this;
    };

    exports.curve = function(_) {
		// _ is a d3 built-in function
		if (typeof _ === "undefined") return _curve;
		_curve = _;
		return this;
	};

    exports.margin = function(_) {
            // _ expects a json object {t:,r:,b:,l:}
            if (_ === 'undefined') return _margin;
            _margin = _;
            return this;
    };

    exports.yAxis = function(_) {
		// _ is a string ===> indicated which property will encode y axis
		if (typeof _ === "undefined") return _yAxis;
		_yAxis = _;
		return this;
	};

    exports.minDate = function(_) {
        // is a date object
        if (_ === 'undefined') return _minDate;
        _minDate = _;
        return this;
    };

    exports.isMobile = function(_) {
        // _ expects a boolean
        if (_ === 'undefined') return _isMobile;
        _isMobile = _;
        return this;
    };

    // returning module
    return exports;
}

// exporting factory function as default
export default AreaChart;
