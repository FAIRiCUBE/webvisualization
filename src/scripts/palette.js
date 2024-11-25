// import d3 scalechromatic
import * as d3 from 'd3';

import QGISColorfileAsd3ColrFn from './parseQGISColorfile';


export function getInterpolateBand1AsColor() {

  const pal = localStorage.getItem('palette') || 'd3.interpolateBlues';

  if (pal.toLowerCase()=='rgb')
    return { color: ['array', ['band', 1], ['band', 2], ['band', 3], 1] };


  let color = getPaletteAsFunction();
  // If inverted, change the color function domain to 1,0
  if (pal!='qgis' && (localStorage.getItem('invertpalette')==='true')) color.domain([1,0]);

  console.assert(color, 'color is null');

  let values = Array.from({length: 10}, (_, i) => i/10);
  if (pal=='qgis') values = JSON.parse(localStorage.getItem('QGISColorfileValues'));

  const clr_arr = [
    'interpolate',
    ['linear'],
    ['band', 1]];
  
  for (const val of values) {
    const clr = color(val);
    console.assert(clr, `Error creating palette: colorFn(${val}) = ${clr}`);
    clr_arr.push(val, clr);
  }

  return {color: clr_arr};
    
}


export function getPaletteAsGradient() {

  const color = getPaletteAsFunction();
  const pal = localStorage.getItem('palette');
  if (!color) return 'red';
  const gradient = [];

  let stops = Array.from({length: 10}, (_, i) => i/10);
  let stopsPct = stops.map(v => `${v*100}%`);
  if (pal=='qgis') {
    stops = JSON.parse(localStorage.getItem('QGISColorfileValues'));
    // Normalize stops to percentage
    const min = stops[0];
    const max = stops[stops.length-1];
    stopsPct = stops.map(v => `${((v-min)/(max-min)*100).toFixed(2)}%`);
  }

  for(const [i, stop] of stops.entries()) {
    const c = color(stop);
    gradient.push(`${c} ${stopsPct[i]}`);
  }
  let invert = localStorage.getItem('invertpalette')==='true';
  if (pal=='qgis') invert = false;
  if (pal=='rgb') invert = false;
  if (invert) gradient.reverse();

  return `linear-gradient(to right, ${gradient.join(',')})`;
}







/**
 * Returns a color function over the domain [0,1]
 * If palette is rgb, returns null
 * If palette is qgis, the domain is not [0,1] but the value range in the QGISColorfile
 * 
 * @returns 
 */
export function getPaletteAsFunction() {

  const palette = localStorage.getItem('palette') || 'd3.interpolateBlues';
  if (palette=='rgb') return null;
  if (palette=='qgis') return QGISColorfileAsd3ColrFn();

  let paletteFunction = d3.interpolateBlues;
  switch (palette) {
    case 'd3.interpolateBlues': paletteFunction = d3.interpolateBlues; break;
    case 'd3.interpolateReds': paletteFunction = d3.interpolateReds; break;
    case 'd3.interpolateGreens': paletteFunction = d3.interpolateGreens; break;
    case 'd3.interpolatePurples': paletteFunction = d3.interpolatePurples; break;
    case 'd3.interpolateOranges': paletteFunction = d3.interpolateOranges; break;
    case 'd3.interpolateGreys': paletteFunction = d3.interpolateGreys; break;
    case 'd3.interpolateRdYlBu': paletteFunction = d3.interpolateRdYlBu; break;
    case 'd3.interpolateRdYlGn': paletteFunction = d3.interpolateRdYlGn; break;
    case 'd3.interpolateRdYlBu': paletteFunction = d3.interpolateRdYlBu; break;
    case 'd3.interpolateRdYlGn': paletteFunction = d3.interpolateRdYlGn; break;
    case 'd3.interpolateRdYlBu': paletteFunction = d3.interpolateRdYlBu; break;
    case 'd3.interpolateRdYlGn': paletteFunction = d3.interpolateRdYlGn; break;
    case 'd3.interpolateTurbo': paletteFunction = d3.interpolateTurbo; break;
    case 'd3.interpolateViridis': paletteFunction = d3.interpolateViridis; break;
    case 'd3.interpolateInferno': paletteFunction = d3.interpolateInferno; break;
    case 'd3.interpolateMagma': paletteFunction = d3.interpolateMagma; break;
    case 'd3.interpolatePlasma': paletteFunction = d3.interpolatePlasma; break;
    default: console.error(`Unknown palette: ${palette}`);
  }
  // = eval(palette);
  const invert = localStorage.getItem('invertpalette');

  /*let min = localStorage.getItem('min') ?? 0;
  let max = localStorage.getItem('max') ?? 1;
  if (invert==='true') {
    [min, max] = [max, min];
  }
*/
  return d3.scaleSequential(paletteFunction);//.domain([min, max]);
}