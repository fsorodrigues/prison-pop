const msg = 'webpack template running';
console.log(msg);

// funcs
import {csv,json} from 'd3';

// importing util funcs
import {isMobile} from './utils';

// instantiating mobile check
const mobile = isMobile();

// CSS
import './style/main.css';

// Modules
import Main from './containers/Main';

// global variables

// Instantiating Modules
const main = Main(document.querySelector('.wrapper-d3'))
    .margin({t:5, r:5, b:11, l:20})
    .isMobile(mobile);

const population = csv('./data/out-of-state-avg-pop.csv', d => d);
const timeline = csv('./data/out-of-state-facilities.csv', d => d);
const mapTile = json('./data/us-map.json');

Promise.all([population,timeline,mapTile])
    .then(([population,timeline,mapTile]) => {
        main(population,timeline,mapTile);
    });
