// import d3 scalechromatic
import * as d3 from 'd3';



export function getInterpolateBand1AsColor() {

  const pal = localStorage.getItem('palette') || 'd3.interpolateBlues';

  if (pal.toLowerCase()=='rgb')
    return { color: ['array', ['band', 1], ['band', 2], ['band', 3], 1] };


  let color = getPaletteAsFunction();
  // If inverted, change the color function domain to 1,0
  if (localStorage.getItem('invertpalette')==='true') color.domain([1,0]);


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
  return {color: clr_arr};
    
}


export function getPaletteAsGradient() {

  const color = getPaletteAsFunction();
  if (!color) return 'red';
  const gradient = [];
  for(let i=0; i<1; i+=0.1) {
    const c = color(i);
    gradient.push(c);
  }
  const invert = localStorage.getItem('invertpalette')==='true';
  if (invert) gradient.reverse();
  return `linear-gradient(to right, ${gradient.join(',')})`;
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






export function getPaletteAsFunction() {

  const palette = localStorage.getItem('palette') || 'd3.interpolateBlues';
  if (palette=='rgb') return null;
  const paletteFunction = eval(palette);

  const invert = localStorage.getItem('invertpalette');

  /*let min = localStorage.getItem('min') ?? 0;
  let max = localStorage.getItem('max') ?? 1;
  if (invert==='true') {
    [min, max] = [max, min];
  }
*/
  return d3.scaleSequential(paletteFunction);//.domain([min, max]);
}