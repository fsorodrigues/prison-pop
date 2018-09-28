// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// importing utitily functions
import {parseTime} from '../utils';

// instantiating mobile check

// defining global variables

// defining Factory function
function MapProjection(mapTile) {

    // create getter-setter variables in factory scope
    let _margin = {t:0, r:0, b:0, l:0};
    let _display = 'state';
    let _minDate = parseTime('12/31/2015');
    let _isMobile = false;

    // let _dispatch = d3.dispatch('node:enter','node:leave');

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = this;
        const container = d3.select(root)
            .select('.plot');

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

        if (_isMobile) {
            mapProjection.scale(465)
                .translate([w/2,h/2]);
        }

        const path = d3.geoPath()
            .projection(mapProjection);

        // data transformation
        const dataset = data.filter(d => (parseTime(d.start_date) <= _minDate) &
                                         (parseTime(d.end_date) >= _minDate)
                                );

        // setting up scales

        // appending svg to node
        // enter, exit, update pattern
        // update selection

        // appending <g> to SVG
        // let plotUpdate = container.selectAll('.plot')
        //     .data([1]);
        // const plotEnter = plotUpdate.enter()
        //     .append('g')
        //     .classed('plot',true);
        // plotUpdate.exit().remove();
        // plotUpdate = plotUpdate.merge(plotEnter)
        //     .attr('transform',`translate(${margin.l},${margin.t})`);


        let centroids = mapTile.map(d => {
            return {
                state: d.properties.NAME,
                coordinates: path.centroid(d)
            };
        });

        centroids = d3.map(centroids,d => d.state);

        let circlesUpdate = container.selectAll('.circle-tile')
            .data([1]);
        const circlesEnter = circlesUpdate.enter()
            .append('g')
            .classed('circle-tile',true);
        circlesUpdate.exit().remove();
        circlesUpdate = circlesUpdate.merge(circlesEnter);

        let circleNodeUpdate = circlesUpdate.selectAll('.circle-node')
            .data(dataset);
        const circleNodeEnter = circleNodeUpdate.enter()
            .append('circle')
            .classed('circle-node',true);
        circleNodeUpdate.exit().remove();
        circleNodeUpdate = circleNodeUpdate.merge(circleNodeEnter)
            .attr('cx', d => centroids.get(d.state).coordinates[0])
            .attr('cy', d => centroids.get(d.state).coordinates[1])
            .attr('r', 5);

        if (_isMobile) {
            circleNodeUpdate.attr('r',3);
        }

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

    exports.isMobile = function(_) {
        // _ expects a boolean
        if (_ === 'undefined') return _isMobile;
        _isMobile = _;
        return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default MapProjection;
