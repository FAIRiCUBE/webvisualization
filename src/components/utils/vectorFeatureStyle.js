export function getVectorFeatureStyle(feature, resolution) {

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
