import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import STAC from 'ol-stac';
import TileLayer from 'ol/layer/WebGLTile.js';
import View from 'ol/View.js';
import proj4 from 'proj4';
import * as olSTACUtil from 'ol-stac/util';
//import {getStacObjectsForEvent} from 'ol/util';
import {register} from 'ol/proj/proj4.js';

register(proj4); // required to support source reprojection

export function showWholeCollection(collectionUrl){

    const layer = new STAC({
        url: collectionUrl,
        displayPreview: true,
        collectionStyle: {
            color: 'red',
        },
        assets: ['data'],

    });

    const background = new TileLayer({source: new OSM()});

    const map = new Map({
    target: 'map-container',
    layers: [background, layer],
    view: new View({
        center: [0, 0],
        zoom: 0,
    }),
    });
    map.on('singleclick', async (event) => {
        const objects = await olSTACUtil.getStacObjectsForEvent(event);
        if (objects.length > 0) {
            objects.forEach((obj) => console.log(obj));
        }
    });

    layer.on('sourceready', () => {
        const view = map.getView();
        view.fit(layer.getExtent());
    });

    return false;

}