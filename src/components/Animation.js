// importing d3.js
import * as d3 from 'd3';

// importing util functions
import {parseTime,timeConstant} from '../utils';

// importing modules

// importing stylesheets

// instantiating modules

// defining global variables

// defining Factory function

function Animation(_) {

    /* CREATE GETTER SETTER PATTERN */
    let _animate = false;
    let _origin = parseTime('12/31/2015');
    let _minDate = parseTime('12/31/2015');
    let _t;
    let _fps = 100;
    let now;
    let then = Date.now();
    let interval = 1000/_fps;
    let delta;

    /* INSTANTIATE DISPATCHER WITH CUSTOM EVENTS */
    const _dispatch = d3.dispatch('change:date');

    function exports() {

        _t = _minDate;

        function renderFrame() {
            // request another frame
            requestAnimationFrame(renderFrame);

            // calc elapsed time since last loop
            now = Date.now();
            delta = now - then;

            // if enough time has elapsed, draw the next frame
            if (delta > interval) {
                // Get ready for next frame by setting then=now, but also adjust for your
                // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                then = now - (delta % interval);

                if (_animate) {
                    // drawing code here
                    const date = new Date(_t.valueOf() + timeConstant(2));
                    _t = new Date(date);

                    if (_t > Date.now()) {
                        _t = _origin;
                    }

                    _dispatch.call('change:date',null,_t);

                } else {

                    cancelAnimationFrame(renderFrame);

                }
            }
        }

        renderFrame();

    }

    // create getter-setter pattern for customization
    exports.on = function(eventType,cb) {
        // eventType is a string ===> custom eventType
        // cb is a function ===> callback
        _dispatch.on(eventType,cb);
        return this;
    };

    exports.fps = function(_) {
        // _ is a number
        if (_ === 'undefined') return _fps;
        _fps = _;
        return this ;
    };

    exports.animate = function(_) {
        // _ is a boolean
        if (_ === 'undefined') return _animate;
        _animate = _;
        return this ;
    };

    exports.minDate = function(_) {
        // _ is a date string
        if (_ === 'undefined') return _minDate;
        _minDate = _;
        return this ;
    };

    exports.origin = function(_) {
        // _ is a date string
        if (_ === 'undefined') return _origin;
        _origin = _;
        return this ;
    };

    exports.getMinDate = function() {
        return _t ;
    };

    // returning module
    return exports;
}

export default Animation;
