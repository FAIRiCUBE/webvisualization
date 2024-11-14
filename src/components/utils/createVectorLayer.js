
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
