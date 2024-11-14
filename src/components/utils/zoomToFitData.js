async function zoomToFitData(map, source){

    const vo = await source.getView();
    if (!vo.projection) {
      console.log(`File  ${url} contains insufficient metadata about its projection`);
      //return;
    }

    const proj = getProjection(vo.projection?.getCode());
    if (!proj) {
      // Look up at epsg.io
      vo.projection= await fromEPSGCode(vo.projection?.getCode() || "EPSG:31256");
      console.log(`Downloading projection ${vo.projection.getCode()} used by ${url}`);
      //return;
    }

    // Reproject the extent to the map's projection
    const extent = transformExtent(vo.extent, vo.projection, googleview.getProjection());
    const  bahamas_extent = [ -78, 26.4858, -76, 28 ];
    map.getView().fit(extent);
  }


  export default zoomToFitData;
  