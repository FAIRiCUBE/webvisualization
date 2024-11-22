// import d3 scalechromatic
import * as d3 from 'd3';
/*
import { palette } from '../components/App.js';


export function getInterpolateBand1AsColor() {

    const pal = palette();


    if (pal.toLowerCase()=='rgb')return { color: ['array', ['band', 1], ['band', 2], ['band', 3], 1] };

    let color = null;
    if (pal=='A') color = d3.scaleSequential(d3.interpolateRainbow);
    if (pal=='B') color = d3.scaleSequential(d3.interpolateViridis);
    if (pal=='C') color = d3.scaleSequential(d3.interpolateWarm);
    if (pal=='D') color = d3.scaleSequential(d3.interpolateGnBu);


      const clr_arr = [
        'interpolate',
        ['linear'],
        ['band', 1],
        0,
        [255,0,0,0],
        0.001,
        color(0.001),
        0.1,
        color(0.1),
        0.1,
        color(0.1),
        0.2,
        color(0.2),
        0.4,
        color(0.4),
        0.6,
        color(0.6),
        1,
        color(1)
      ];
      interpolation_to_colorbar(clr_arr.slice(3));
      return {color: clr_arr};

}


// Given a MapLibre color interpolation array like [value, color, value, color, ...], create a
// colorbar elelement with a CSS background gradient 
// that matches the color ramp
function interpolation_to_colorbar(interp){
  const colorbar = document.getElementById('colorbar');
  colorbar.innerHTML = '';
  for (let i = 0; i < interp.length; i+=2){
      let div = document.createElement('div');
      div.innerHTML = interp[i]; // Value
      colorbar.appendChild(div);
  }
  const maxValue = interp[interp.length-2];
  let gradient = '';
  for (let i = 0; i < interp.length; i+=2){
      const value = interp[i];
      const percent = (value/maxValue)*100;
      let clr = interp[i+1];
      // If the color is an array, convert it to a string
      if (Array.isArray(clr)) clr = `rgba(${clr.join(',')})`;
      gradient += clr + ' ' + percent + '%, ';
  }
  gradient = gradient.slice(0, -2);
  colorbar.style.background = 'linear-gradient(to right, ' + gradient + ')';

}

*/