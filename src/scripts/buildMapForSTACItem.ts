/*
async function buildMapForSTACItem() {

    // Which STAC item to load?
    let stac_json = localStorage.getItem('stac');
    
    
    if (!stac_json) return buildMapForGeotiff();
    
    
    const layer = new STAC({url: stac_json});
    
    
    // Try to fetch and parse an {url}.aux.xml file. The file is an XML file with metadata about the GeoTIFF
    /*const minmax = await getGeotiffMinmaxFromAuxXML(url);
    if (minmax) {
      geotiffSource.min = minmax[0];
      geotiffSource.max = minmax[1];
      console.log(`Used .tif.aux.xml to find min=${geotiffSource.min}, max=${geotiffSource.max}`);
    }
    ***
    
    
    
    layer.on('sourceready', () => {
      const view = map.getView();
      view.fit(layer.getExtent() as Extent);
    
    });
    
    layer.on('assetsready', () => {
      // Assign titles for e.g. a layerswitcher
      for (const sublayer of layer.getLayersArray()) {
        const stac = sublayer.get('stac');
        let title;
        if (stac.isAsset() || stac.isLink()) {
          title = stac.getMetadata('title') || stac.getKey();
        } else {
    
          const firstDataAsset = stac.getAssets().find(d=>d.roles.includes("data"));
          if (firstDataAsset) {
            localStorage.setItem('url', firstDataAsset.href);
            buildMapForGeotiff();
          } else {
            console.error(`No asset with role "data" found in ${stac_json}`);
          }
    
        }
    
        sublayer.set('title', title);
      }
    });
    
    
    
    // Create the map
    map.setLayers([baselayer,layer]);
    map.render();
    
    
    }; // function buildMapForSTACItem
    
    
    */