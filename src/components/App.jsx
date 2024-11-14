
import styles from "./App.module.css";
import { createSignal } from "solid-js";
import Colorbar from "./Colorbar.jsx";
import ChoosePalette from "./ChoosePalette.jsx";
import ChooseVectorLayer from "./ChooseVectorLayer.jsx";
import ChooseRasterLayer from "./ChooseRasterLayer.jsx";
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';

// Register EPSG:3035
//proj4.defs("EPSG:3035","+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
proj4.defs("EPSG:31256","+proj=tmerc +lat_0=0 +lon_0=16.3333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=551.7,162.9,467.9,6.04,1.96,-11.38,-4.82 +units=m +no_defs +type=crs");
register(proj4); // Make projections defined in proj4 (with proj4.defs()) available in OpenLayers. Req

//import "./Map.js";


function App() {


    const [datasetURL, setDatasetURL] = createSignal('https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/21/H/UB/2021/9/S2B_21HUB_20210915_0_L2A/TCI.tif');
    const [palette, setPalette] = createSignal('A');
    const [min, setMin] = createSignal(0);
    const [max, setMax] = createSignal(1);
    
    // Listener to the palette or min/max values change
    const updateStyle = () => {
        palette();
        min();
        max();
        layer.setStyle(getColorScale());
        vectorLayer.getSource().refresh();
        map.render();
    };


    // Listener to the dataset URL
    const updateVisibility = async () => { 
        const url = datasetURL();
        const isVector = !url.endsWith('.tif');
        vectorLayer.setVisible(isVector);
        rasterLayer.setVisible(!isVector);
        map.render();
        await zoomToFitData(map,source);
    };


    // Listener to update min/max values on rendering a new GeoTIFF
    const updateMinMax = async () => { 
        const url = datasetURL();
        if (!url.endsWith('.tif')) return;
        const minmax = await getGeotiffMinmaxFromAuxXML(url);
        if (minmax) {
          setMin(minmax[0]);
          setMax(minmax[1]);
        }
    };

    return <div>
                <div class={styles.ui}>
                    <ChoosePalette setPalette={setPalette} datasetURL={datasetURL} />
                    <ChooseVectorLayer />
                    <ChooseRasterLayer />
                </div>
                <Colorbar min={min} max={max} palette={palette} />
            </div>;


}


export default App;
