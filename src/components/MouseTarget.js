// importing d3.js
import * as d3 from 'd3';

// importing util functions
import {parseTime} from '../utils';

// importing stylesheets

// setting up modules

// defining global variables

// defining Factory function
function MouseTarget(_) {

    /* CREATE GETTER SETTER PATTERN */
    let _margin = {t:0, r:0, b:0, l:0};
    let _minDate = parseTime('12/31/2015');

    const _dispatch = d3.dispatch('mousemove:x');

    function exports(data) {

        const root = this;
        const container = d3.select(root);

        // declaring setup/layout variables
        const clientWidth = root.parentNode.clientWidth;
        const clientHeight = root.parentNode.clientHeight;
        const margin = _margin;
        const w = clientWidth - (margin.r + margin.l);
        const h = clientHeight - (margin.t + margin.b);

        // data transformation
        const listDates = data.map(d => parseTime(d.date));
        const minDate = d3.min(listDates);
        const getMin = d3.min([minDate,_minDate]);
        const maxDate = d3.max(listDates);

        // setting up scales
        const scaleX = d3.scaleTime()
            .domain([getMin,maxDate])
            .range([0,w]);

        let mouseControllerUpdate = container.selectAll('.mouse-controller')
            .data(d => [d]);
        // enter selection
        const mouseControllerEnter = mouseControllerUpdate.enter()
            .append('g')
            .classed('mouse-controller', true);
        // exit selection
        mouseControllerUpdate.exit().remove();
        // enter+update selection
        mouseControllerUpdate = mouseControllerUpdate.merge(mouseControllerEnter);

        //Mouse indicator
		let mouseIndicatorUpdate = mouseControllerUpdate.selectAll('.mouse-indicator')
			.data([1]);
		const mouseIndicatorEnter = mouseIndicatorUpdate.enter()
			.append('line')
			.attr('class','mouse-indicator');
        mouseIndicatorUpdate.exit().remove();
        mouseIndicatorUpdate = mouseIndicatorUpdate.merge(mouseIndicatorEnter)
			.attr('stroke',1)
			.attr('stroke','#e95e1d');

        //Mouse target
		let mouseTargetUpdate = mouseControllerUpdate.selectAll('.mouse-target')
			.data([1]);
		const mouseTargetEnter = mouseTargetUpdate.enter()
			.append('rect')
			.attr('class','mouse-target');
        mouseTargetUpdate.exit().remove();
        mouseTargetUpdate = mouseTargetUpdate.merge(mouseTargetEnter)
            .attr('width',w)
            .attr('height',h)
            .attr('fill-opacity',0)
            .on('mousemove', function(){
                const [x,y] = d3.mouse(this);
                mouseIndicatorUpdate.attr('x1',x)
					.attr('x2',x)
					.attr('y1',h)
					.attr('y2',y);
            _dispatch.call('mousemove:x',null,scaleX.invert(x));
			}).on('mouseleave', () => {
				mouseIndicatorUpdate.attr('x1',0)
					.attr('x2',0)
					.attr('y1',0)
					.attr('y2',0);
			});

    }

    // create getter-setter pattern for customization
    exports.on = function(eventType,cb) {
        // eventType is a string ===> custom eventType
        // cb is a function ===> callback
        _dispatch.on(eventType,cb);
        return this;
    };

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

    // returning module
    return exports;
}

// exporting factory function as default
export default MouseTarget;
