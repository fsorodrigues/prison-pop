import {format,timeParse,timeFormat} from 'd3';

export const formatSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const tail = number % 100;
    return `${number}${suffixes[(tail < 11 || tail > 13) && (tail % 10)] || suffixes[0]}`;
};

export const formatPercent = (number) => `${number}%`;

export const parseTime = timeParse('%m/%d/%Y');
export const parseTimeYear = timeParse('%Y');
export const formatTime = timeFormat('%b, %Y');
export const formatTimeYear = timeFormat('%Y');

export const isMobile = () => {
	if (navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i) ) {
		return true;
	} else {
		return false;
	}
};

// export const parse = d => d;
//
// export const filterData = (data,criteria) => {
//     return data.filter(d => d.key == criteria);
// };
// export const filterNull = (data) => {
//     return data.filter(d => d.act !== '');
// };
//
// export const parseTimeYear = timeParse('%Y');
// export const parseTime = timeParse('%m/%e/%y')
// export const formatTimeYear = timeFormat('%Y');
//
// export const formatMillions = format('.2s');
// export const formatMillionsMoney = d => {
//     return `$${formatMillions(d).replace('M','m')}`;
// };
// export const formatYear = format('.0f');
//
// export const delay = (d,i) => 200 + i * 30;
//
// export const contains = (d,array,match) => {
//     return d.filter(f => array.includes(f[match]));
// };
//
// export const onlyUnique = (value, index, self) => self.indexOf(value) === index;
//
// export const capitalize = function(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// };
//
