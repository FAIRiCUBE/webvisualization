import styles from "./Colorbar.module.css";

//import { palette } from "./App.js";
import * as d3 from 'd3';



    
export function getColorScale(palette, min, max){

    let color = d3.scaleSequential(d3.interpolateRainbow);
    if (palette()=='A') color = d3.scaleSequential(d3.interpolateRainbow);
    if (palette()=='B') color = d3.scaleSequential(d3.interpolateViridis);
    if (palette()=='C') color = d3.scaleSequential(d3.interpolateWarm);
    if (palette()=='D') color = d3.scaleSequential(d3.interpolateGnBu);


    return [
        'interpolate',
        ['linear'],
        ['band', 1],
        0,
        [255,0,0,0],
        0.001,
        color(0.001),
//        0.1,
//        color(0.1),
//        0.1,
//        color(0.1),
//        0.2,
//        color(0.2),
        0.4,
        color(0.4),
        0.6,
        color(0.6),
        1,
        color(1)
      ];

}

function Colorbar(props) {

      return <div class={styles.colorbar} style={{
        display: props.palette().toLowerCase()=='rgb' ? 'none' : 'flex',
        background: getColorScale_Gradient(props.palette, props.min, props.max)
      }} id="colorbar">{getColorScale_Labels(props.palette, props.min, props.max)}</div>;

}

// Given a MapLibre color interpolation array like [value, color, value, color, ...], create a
// colorbar elelement with a CSS background gradient 
// that matches the color ramp
function getColorScale_Labels(palette, min, max){
  const interp = getColorScale(palette, min, max).slice(5);
  const children = [];
  for (let i = 0; i < interp.length; i+=2){
      let div = document.createElement('div');
      div.innerHTML = (interp[i] * max()).toFixed(1); // Value
      children.push(div);
  }
  return children;
}


// Given a MapLibre color interpolation array like [value, color, value, color, ...], create a
// colorbar elelement with a CSS background gradient 
// that matches the color ramp
function getColorScale_Gradient(palette, min, max){
  const interp = getColorScale(palette, min, max).slice(3);
  let gradient = '';
  for (let i = 0; i < interp.length; i+=2){
      const value = interp[i];
      const percent = value*100;
      let clr = interp[i+1];
      // If the color is an array, convert it to a string
      if (Array.isArray(clr)) clr = `rgba(${clr.join(',')})`;
      gradient += clr + ' ' + percent + '%, ';
  }
  gradient = gradient.slice(0, -2); // Remove the last comma
  return 'linear-gradient(to right, ' + gradient + ')';

}



export default Colorbar;