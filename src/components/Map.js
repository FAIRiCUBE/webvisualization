import 'ol/ol.css';
import * as ol from 'ol';
import TileLayer from 'ol/layer/WebGLTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import {createBasemapLayer} from './utils/createBasemapLayer.js';
import {createVectorLayer} from './utils/createVectorLayer.js';
// @ts-ignore
import OldTileLayer from 'ol/layer/Tile';
import {Fill, Stroke, Style} from 'ol/style';
import GeoTIFF from 'ol/source/GeoTIFF';
import OSM from 'ol/source/OSM';
import {getColorScale} from './Colorbar.jsx';

import { transformExtent, Projection, get as getProjection, fromLonLat } from 'ol/proj';
import {register,fromEPSGCode} from 'ol/proj/proj4';
import proj4 from 'proj4'
import * as d3 from 'd3';
import zoomToFitData from './utils/zoomToFitData.js';
import getGeotiffMinmaxFromAuxXML from './utils/getGeotiffMinmaxFromAuxXML.js';
let rasterLayer = null;
let vectorLayer = null;
let flag_styleIsSet = false; // This is used to prevent setting the style multiple times
let map = null;








export async function buildMap() {

  // This style flag is used to prevent setting the style multiple times
  // When we build a fresh map we can reset this flag
  flag_styleIsSet = false;

  vectorLayer = createVectorLayer();

  // Create the source and layer

  rasterLayer = new TileLayer({source:  new GeoTIFF({sources: [geotiffSource], normalize: true})});

  // Set timeout for 5 seconds. If flag_styleIsSet false at that time, print a warning to console that we haven't loaded any tiles.
  setTimeout(() => {
    if (!flag_styleIsSet) console.warn(`Warning: After 5s, no tiles have been loaded for ${url}.`);
  }, 5000);

  // Callback on tile load. This is used to set the style
  rasterLayer.getSource().on('tileloadend', (event) => {

    if (flag_styleIsSet) return; // If the style has already been set, do nothing

    console.log(`Got image with ${event.target.bandCount} bands`);
    rasterLayer.setStyle(getColorScale()); // Set the style

    flag_styleIsSet = true; // Set the flag
  });

  // Create the map
  if (!map) {
    const [baselayer, googleview] = createBasemapLayer();
    map = new ol.Map({
      target: 'map-container',
      layers: [baselayer,rasterLayer],
      view: googleview //source.getView()
      
    });
    map.addLayer(vectorLayer);
  } else {
    map.setLayers([baselayer,rasterLayer]);
    //map.setView(source.getView());
    map.setView(googleview);
    map.render();
  }




}; // function buildMap




