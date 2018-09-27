// importing d3.js
import * as d3 from 'd3';

// importing accessory functions
import {parseTime} from '../utils';

// importing stylesheets

// Modules
import MapProjection from '../components/MapProjection';
import AreaChart from '../components/AreaChart';
import DrawCircles from '../components/DrawCircles';
import DateDisplay from '../components/DateDisplay';

// instantiating modules
const areaChart = AreaChart()
    .yAxis('average_population');
const dateDisplay = DateDisplay();

// defining Factory function
function Main(_) {

    // TO DO: create getter-setter variables in factory scope
    let _margin = {t:0, r:0, b:0, l:0};

    function exports(population,timeline,mapTile) {

        const root = _;
        const container = d3.select(root);

        // declaring setup/layout variables

        // instantiating modules
        const usMap = MapProjection(mapTile.features);
        const drawCircles = DrawCircles(mapTile.features);

        // data transformation
        const listDates = timeline.map(d => parseTime(d.start_date));
        const minDate = d3.min(listDates);

        // appending containers
        let mapContainerUpdate = container.selectAll('.wrapper-map-d3')
            .data([timeline]);
        const mapContainerEnter = mapContainerUpdate.enter()
            .append('div')
            .classed('wrapper-map-d3',true);
        mapContainerUpdate.exit().remove();
        mapContainerUpdate = mapContainerUpdate.merge(mapContainerEnter);

        mapContainerUpdate.each(usMap);
        drawCircles.minDate(minDate);
        mapContainerUpdate.each(drawCircles);

        let areaChartContainerUpdate = container.selectAll('.wrapper-area-chart-d3')
            .data([population]);
        const areaChartContainerEnter = areaChartContainerUpdate.enter()
            .append('div')
            .classed('wrapper-area-chart-d3',true);
        areaChartContainerUpdate.exit().remove();
        areaChartContainerUpdate = areaChartContainerUpdate.merge(areaChartContainerEnter);

        areaChart.margin(_margin)
            .minDate(minDate);
        areaChartContainerUpdate.each(areaChart);

        let dateDisplayContainerUpdate = container.selectAll('.wrapper-date-d3')
            .data([minDate]);
        const dateDisplayContainerEnter = dateDisplayContainerUpdate.enter()
            .append('div')
            .classed('wrapper-date-d3',true);
        dateDisplayContainerUpdate.exit().remove();
        dateDisplayContainerUpdate = dateDisplayContainerUpdate.merge(dateDisplayContainerEnter);

        dateDisplayContainerUpdate.each(dateDisplay);

        // handling events
        areaChart.on('change:date',function(d) {
            drawCircles.minDate(d);
            mapContainerUpdate.each(drawCircles);

            dateDisplayContainerUpdate.data([d])
                .each(dateDisplay);
        });


    }

    // create getter-setter pattern for customization
    exports.margin = function(_) {
            // _ expects a json object {t:,r:,b:,l:}
            if (_ === 'undefined') return _margin;
            _margin = _;
            return this;
    };

    // returning of module
    return exports;
}

// exporting factory function as default
export default Main;
