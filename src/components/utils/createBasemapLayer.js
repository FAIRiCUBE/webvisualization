export function createBasemapLayer(){

    const baselayer = new OldTileLayer({source:new OSM()});
    const googleview = new ol.View({
    projection: 'EPSG:3857',
    //center: [16.2,48.2],zoom:10 // Vienna
    //center: [10,55.2],zoom:6 // Copenhagen
    //center:[-77.1778,26.4858], zoom: 8 // Virgin Gorda
    });
    googleview.setCenter( fromLonLat([16.2,48.2], googleview.getProjection())); googleview.setZoom(10);  // Vienna
    googleview.setCenter( fromLonLat([-77.1778,26.4858], googleview.getProjection())); googleview.setZoom(8);  // Virgin Gorda
    googleview.setCenter( fromLonLat([10,55.2], googleview.getProjection())); googleview.setZoom(6);  // Copenhagen

    return [baselayer, googleview];
    
} // end of function