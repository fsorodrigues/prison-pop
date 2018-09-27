// importing d3.js
import * as d3 from 'd3';

// importing util functions
import {parseTime,formatTime} from '../utils';

// importing stylesheets

// setting up modules

// defining global variables

// defining Factory function
function DateDisplay(_) {

    // create getter-setter variables in factory scope

    function exports(data) {

        const root = this;
        const container = d3.select(root);

        // data transformation

        let tooltipUpdate = container.selectAll('.date-display')
            .data([data]);
        const tooltipEnter = tooltipUpdate.enter()
            .append('div')
            .classed('date-display',true);
        tooltipUpdate.exit().remove();
        tooltipUpdate = tooltipUpdate.merge(tooltipEnter)
            .html(d => `<span class="anchor-text">date displayed:</span> <span class="date-text">${formatTime(d)}<span>`);

    }

    // create getter-setter pattern for customization

    // returning module
    return exports;
}

// exporting factory function as default
export default DateDisplay;
