// importing d3.js
import * as d3 from 'd3';

// importing util functions
import {invertButton} from '../utils';

// importing modules

// importing stylesheets

// instantiating modules

// defining global variables

// defining Factory function

function PlayButton(_) {
    // getter-setter pattern
    let _animate = true;

    // create dispatcher
    const _dispatch = d3.dispatch('animation:play','animation:pause');

    function exports() {

        const root = this;
        const container = d3.select(root);

        let buttonContainerUpdate = container.selectAll('.button-container')
            .data([1]);
        const buttonContainerEnter = buttonContainerUpdate.enter()
            .append('div')
            .classed('button-container',true);
        buttonContainerUpdate.exit().remove();
        buttonContainerUpdate = buttonContainerUpdate.merge(buttonContainerEnter);

        let buttonUpdate = buttonContainerUpdate.selectAll('.button')
            .data([1]);
        const buttonEnter = buttonUpdate.enter()
            .append('button')
            .classed('button',true)
            .classed('play',true);
        buttonUpdate.exit().remove();
        buttonUpdate = buttonUpdate.merge(buttonEnter)
            .on('click', function(d) {
                const thisEl = d3.select(this);
                const state = thisEl.attr('class').replace('button ','');

                thisEl.classed(state,false)
                    .classed(invertButton(state),true);

                _dispatch.call(`animation:${state}`,this,state);
            });

        if (!_animate) {
            buttonUpdate.classed('play',true)
                .classed('pause',false);
        }

    }

    // create getter-setter pattern for customization
    exports.on = function(eventType,cb) {
        // eventType is a string ===> custom eventType
        // cb is a function ===> callback
        _dispatch.on(eventType,cb);
        return this;
    };

    exports.animate = function(_) {
        // _ is a boolean
        if (_ === 'undefined') return _animate;
        _animate = _;
        return this;
    };

    exports.getAnimate = function() {
        return _animate;
    };

    return exports;
}

export default PlayButton;
