import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';

import MVT from 'ol/format/MVT';
import * as d3 from 'd3';


export function createVectorLayer(){

    const vectorLayer = new VectorTileLayer({
        declutter: true,
        source: new VectorTileSource({
          format: new MVT(),
          url:"https://data.sustainability.nilu.no/fairicube-tiles/{z}/{x}/{y}.pbf",
        }),
        style:  getVectorFeatureStyle
      });
    
    vectorLayer.setVisible(false);
    
    // Listener for vector tile source tileloadend event
    vectorLayer.getSource().on('tileloadend', (event) => {
        // Get all features in the view extent
        const isVector = datasetURL().endsWith('.tif') == false;
        if (!isVector) return;
        const propertyToShow = document.querySelector('input[name="fixedurl"]:checked').value;
        const min = d3.min(event.tile.getFeatures(), d => d.getProperties()[propertyToShow]);
        const max = d3.max(event.tile.getFeatures(), d => d.getProperties()[propertyToShow]);
        setMin(min);
        setMax(max);
      
      
    });

    return vectorLayer;
}




function getVectorFeatureStyle(feature, resolution) {

  const propertyToShow = datasetURL()
  if (propertyToShow.endsWith('.tif')) return new Style({});

  let color = d3.scaleSequential([min(), max()], d3.interpolateRainbow);
  if (pal() == 'A') color = d3.scaleSequential([min(), max()], d3.interpolateRainbow);
  if (pal() == 'B') color = d3.scaleSequential([min(), max()], d3.interpolateViridis);
  if (pal() == 'C') color = d3.scaleSequential([min(), max()], d3.interpolateWarm);
  if (pal() == 'D') color = d3.scaleSequential([min(), max()], d3.interpolateGnBu);


  return new Style({
      stroke: new Stroke({
          color: color(feature.getProperties()[propertyToShow]),
          width: 0 // not connected with scale in screen resolution
      }),
      'fill': new Fill({ color: color(feature.getProperties()[propertyToShow]) })
  });


} // end of function
