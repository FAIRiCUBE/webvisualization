// import d3 scalechromatic
import * as d3 from 'd3';

import QGISColorfileAsd3ColrFn from './parseQGISColorfile';


// TODO: Improve this using https://openlayers.org/en/latest/examples/cog-style.html

export function getInterpolateBand1AsColor() {

  const pal = localStorage.getItem('palette') || 'd3.interpolateBlues';

  if (pal.toLowerCase()=='rgb') {
    // If bandCount is 3, return the color array for the true color image
    if (localStorage.getItem('bandcount')==='3') {
      return { color: ['array', ['band', 1], ['band', 2], ['band', 3], 1] };
    } else if (localStorage.getItem('bandcount')==='4') {
    // Otherwise, return the color array for the false color image
      return { color: ['array', ['band', 1], ['band', 2], ['band', 3], ['band', 4]] };
    } else {
      console.error(`getInterpolateBand1AsColor: bandcount for "rgb" palette must be 3 or 4, not "${localStorage.getItem('bandcount')}"`);
      return { color: ['array', ['band', 1], ['band', 2], ['band', 3], 1] };
    }
  }


  let color = getPaletteAsFunction();

  console.assert(color, 'color is null');


  const {stops} = getColorStops();

  let band_selector = ['band', 1];

  // Here we sample the data from the first band
  // UNLESS the second band (the NODATA band) is 1. In that case, the data value is 0.
  if (localStorage.getItem('bandcount')==='2'){
    const data_band = ['band', 1];
    const nodata_band = ['band', 2];
    band_selector  = ['case', [['==', nodata_band, 0], data_band, 0]];
  }

  const clr_arr = [
    'interpolate',
    ['linear'],
    band_selector];
  
  for (const stop of stops) {
    clr_arr.push(stop, color(stop));
  }



  return {color: clr_arr};
    
}






export function getPaletteAsGradient() {

  const color = getPaletteAsFunction(); // A color function over the domain of the data values
  if (!color) return 'red';

  const {stops, stopsPct} = getColorStops();

  // Create the gradient. At each stop (% position) we have a color
  const gradient = [];

  for(const [i, stop] of stops.entries()) {
    gradient.push(`${color(stop)} ${stopsPct[i]}`);
  }

  return `linear-gradient(to right, ${gradient.join(',')})`;
}



/**
 * Returns 10 regularly-spaced values in the domain of the data values
 * and their percentage values.
 * If the palette is QGIS, the stops are taken from the QGISColorfileValues
 */
export function getColorStops(){

  const pal = localStorage.getItem('palette') || 'd3.interpolateBlues';

  // Stops are 10 regularly-spaced values in the domain of the data values
  const min = parseFloat(localStorage.getItem('min')||'0');
  const max = parseFloat(localStorage.getItem('max')||'1');
  let stops = [];
  let stopsPct = []; // Percentage values for the stops
  for (let i=0; i<=10; i++) {
    stops.push(min + i*(max-min)/10);
    stopsPct.push(`${i*10}%`);
  }


  // The QGIS Color file may define color stops at irregular intervals
  // So we must override the regular stops.
  // Here we read these QGIS stop values and normalize them to percentage
  if (pal=='qgis') {
    stops = JSON.parse(localStorage.getItem('QGISColorfileValues'));
    // Normalize stops to percentage
    const min = stops[0];
    const max = stops[stops.length-1];
    stopsPct = stops.map(v => `${((v-min)/(max-min)*100).toFixed(2)}%`);
  }

  return {stops, stopsPct};
} // getColorStops



/**
 * Returns 4 regularly-spaced values in the domain of the data values
 * and their percentage values.
 * This is suitable for showing on a colorbar UI element.
 * If the palette is QGIS, the stops are taken from the QGISColorfileValues
 */
export function getColorStopsShort(){

  const pal = localStorage.getItem('palette') || 'd3.interpolateBlues';

  // Stops are 4 regularly-spaced values in the domain of the data values
  const min = parseFloat(localStorage.getItem('min')||'0');
  const max = parseFloat(localStorage.getItem('max')||'1');

  let stops = [];
  for (let i=0; i<=3; i++) stops.push(min + i*(max-min)/3);


  // The QGIS Color file may define color stops at irregular intervals
  // So we must override the regular stops.
  // Here we read these QGIS stop values and normalize them to percentage
  if (pal=='qgis') {
    let tmpstops = JSON.parse(localStorage.getItem('QGISColorfileValues'));
    const nstops = tmpstops.length;
    if (nstops==0) return {stops};
    // Normalize stops to percentage
    stops = [tmpstops[0], tmpstops[Math.floor(nstops*.3)], tmpstops[Math.ceil(nstops*.6)], tmpstops[nstops-1]];
  }

  return {stops};
} // getColorStopsShort






/**
 * Returns a color function over the domain of the data values
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
    case 'd3.interpolateGnBu': paletteFunction = d3.interpolateGnBu; break;
    case 'd3.interpolateOrRd': paletteFunction = d3.interpolateOrRd; break;
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
    case 'd3.interpolateCividis': paletteFunction = d3.interpolateCividis; break;
    case 'd3.interpolateWarm': paletteFunction = d3.interpolateWarm; break;
    case 'd3.interpolateCool': paletteFunction = d3.interpolateCool; break;
    case 'd3.interpolateRainbow': paletteFunction = d3.interpolateRainbow; break;
    case 'd3.interpolateSinebow': paletteFunction = d3.interpolateSinebow; break;
    default: 
    window.newToast(`Unknown palette: ${palette}`);
    console.error(`Unknown palette: ${palette}`);
  }
  // = eval(palette);
  const invert = localStorage.getItem('invertpalette');

  /*let min = localStorage.getItem('min') ?? 0;
  let max = localStorage.getItem('max') ?? 1;
  if (invert==='true') {
    [min, max] = [max, min];
  }
*/
  return (valueInDataValuesDomain) => {
    if (valueInDataValuesDomain==0) return 'rgba(0,0,0,0)';

    const min = parseFloat(localStorage.getItem('min')||'0');
    const max = parseFloat(localStorage.getItem('max')||'1');

    // If inverted, change the color function domain to 1,0
    if (localStorage.getItem('invertpalette')==='true') 
      valueInDataValuesDomain =  max-valueInDataValuesDomain;

    return d3.scaleSequential(paletteFunction).domain([min, max])(valueInDataValuesDomain);
  }
}
