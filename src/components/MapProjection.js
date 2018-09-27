// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// importing utitily functions
import {parseTime,isMobile} from '../utils';

// instantiating mobile check
const mobile = isMobile();

// defining global variables

// defining Factory function
function MapProjection(mapTile) {

    // create getter-setter variables in factory scope
    let _margin = {t:0, r:0, b:0, l:0};
    // let _interpolator = d3.piecewise(d3.interpolateRgb.gamma(0.5), ["#FF8C00",'white',"#003c30"]);
    let _display = 'state';
    let _minDate = parseTime('12/31/2015');
    // let _max = 0.3;
    // let _display = 'Temporary order denied'
    // let _display = 'Withdrawn by plaintiff'
    // let _display = 'Dismissed on merits'

    // let _dispatch = d3.dispatch('node:enter','node:leave');

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = this;
        const container = d3.select(root);

        // declaring setup/layout variables
        const clientWidth = root.clientWidth;
        const clientHeight = root.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        // setting up geo projection
        const mapProjection = d3.geoAlbersUsa()
            .scale(890)
            .translate([w/2,h/2]);

        if (mobile) {
            mapProjection.scale(465)
                .translate([w/2,h/2]);
        }

        const path = d3.geoPath()
            .projection(mapProjection);

        // data transformation

        // setting up scales

        // appending svg to node
        // enter, exit, update pattern
        // update selection
        let svgUpdate = container.selectAll('.svg-map')
            .data([1]);
        // update selection
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('svg-map', true);
        // exit selection
        svgUpdate.exit().remove();
        // enter + update
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', clientWidth)
            .attr('height', clientHeight);

        // appending <defs> to create dropshadow effect
        let defsUpdate = svgUpdate.selectAll('defs')
            .data([1]);
        const defsEnter = defsUpdate.enter()
            .append('defs');
        defsUpdate.exit().remove();
        defsUpdate = defsUpdate.merge(defsEnter);

        let filterUpdate = defsUpdate.selectAll('filter')
            .data([1]);
        const filterEnter = filterUpdate.enter()
            .append('filter');
        filterUpdate.exit().remove();
        filterUpdate = filterUpdate.merge(filterEnter)
            .attr('id', 'drop-shadow')
            .attr('height', '125%');

        let gaussianBlurUpdate = filterUpdate.selectAll('feGaussianBlur')
            .data([1]);
        const gaussianBlurEnter = gaussianBlurUpdate.enter()
            .append('feGaussianBlur');
        gaussianBlurUpdate.exit().remove();
        gaussianBlurUpdate = gaussianBlurUpdate.merge(gaussianBlurEnter)
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3)
            .attr('result', 'blur');

        let offsetUpdate = filterUpdate.selectAll('feOffset')
            .data([1]);
        const offsetEnter = offsetUpdate.enter()
            .append('feOffset');
        offsetUpdate.exit().remove();
        offsetUpdate = offsetUpdate.merge(offsetEnter)
            .attr('in', 'blur')
            .attr('dx', 1)
            .attr('dy', 1)
            .attr('result', 'offsetBlur');

        let mergeUpdate = filterUpdate.selectAll('feMerge')
            .data([1]);
        const mergeEnter = mergeUpdate.enter()
            .append('feMerge');
        mergeUpdate.exit().remove();
        mergeUpdate = mergeUpdate.merge(mergeEnter);

        let mergeNodeUpdate = mergeUpdate.selectAll('feMergeNode')
            .data(['offsetBlur','SourceGraphic']);
        const mergeNodeEnter = mergeNodeUpdate.enter()
            .append('feMergeNode');
        mergeNodeUpdate.exit().remove();
        mergeNodeUpdate = mergeNodeUpdate.merge(mergeNodeEnter)
            .attr('in', d => d);

        // appending <g> to SVG
        let plotUpdate = svgUpdate.selectAll('.plot')
            .data([1]);
        const plotEnter = plotUpdate.enter()
            .append('g')
            .classed('plot',true);
        plotUpdate.exit().remove();
        plotUpdate = plotUpdate.merge(plotEnter)
            .attr('transform',`translate(${margin.l},${margin.t})`);

        let mapUpdate = plotUpdate.selectAll('.map-tile')
            .data([1]);
        const mapEnter = mapUpdate.enter()
            .append('g')
            .classed('map-tile',true);
        mapUpdate.exit().remove();
        mapUpdate = mapUpdate.merge(mapEnter);

        let stateTileUpdate = mapUpdate.selectAll('.county-bg')
            .data(mapTile);
        const stateTileEnter = stateTileUpdate.enter()
            .append('path')
            .classed('county-bg',true);
        stateTileUpdate.exit().remove();
        stateTileUpdate = stateTileUpdate.merge(stateTileEnter)
            .attr('d', path)
            .style('fill', 'none');
        let combinedD = '';
        mapUpdate.selectAll('.county-bg')
            .each(function() { combinedD += d3.select(this).attr('d'); });
        stateTileUpdate.remove();
        let shadowLayerUpdate = mapUpdate.selectAll('.shadow-layer')
            .data([1]);
        const shadowLayerEnter = shadowLayerUpdate.enter()
            .append('path')
            .classed('shadow-layer',true);
        shadowLayerUpdate.exit().remove();
        shadowLayerUpdate = shadowLayerUpdate.merge(shadowLayerEnter)
            .attr('d', combinedD)
            .style('stroke', 'none')
            .style('stroke-width', 0)
            .style('fill', 'white')
            .style('fill-opacity',1)
            .style('filter', 'url(#drop-shadow)');

        let stateNodesUpdate = mapUpdate.selectAll('.county')
            .data(mapTile);
        const stateNodesEnter = stateNodesUpdate.enter()
            .append('path')
            .attr('class', d => 'class')
            .classed('county',true);
        stateNodesUpdate.exit().remove();
        stateNodesUpdate = stateNodesUpdate.merge(stateNodesEnter)
            .attr('d', path)
            .style('stroke', '#696969')
            .style('stroke-width', 0.1)
            .style('fill','gainsboro');

    }

    // create getter-setter pattern for customization

    exports.margin = function(_) {
            // _ expects a json object {t:,r:,b:,l:}
            if (_ === 'undefined') return _margin;
            _margin = _;
            return this;
    };
    
    exports.minDate = function(_) {
        // is a date object
        if (_ === 'undefined') return _minDate;
        _minDate = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default MapProjection;
