

const baseUrl = 'https://stacapi.eoxhub.fairicube.eu';

export type Collections = Collection[];
export type Collection = any;
export type Item = any;
export type Items = Item[];

/**
 * This function will get all the STAC items from the STAC API for the catalog at:
 * https://stacapi.eoxhub.fairicube.eu
 * 
 * The function queries all collections, then queries each collection to get all items in the collection. It returns a JSON object.
 * 
 */
export async function getAllSTACItems(){
    console.log("Getting all STAC items");
    return await getCollections();

}


async function getCollections(){

    const response = await fetch(`${baseUrl}/collections`);
    const data = await response.json();
    const collections = data.collections as Collections;
    // If there is a link with rel="next" in the collections, 
    // follow that to fetch the next page of collections
    let nextLink = data.links.find((link: any) => link.rel === 'next');
    if (nextLink){
        const response = await fetch(nextLink.href);
        const data = await response.json();
        collections.push(...data.collections as Collections);
        nextLink = data.links.find((link: any) => link.rel === 'next');
    }

    for (const [i, collection] of collections.entries()){
        collections[i].items = await getItems(collection);
    }

    return collections;
}

/**
 * This function will get all the items for each collection
 * It contintually calls the links:next 
 * to get another page of items
 * until there are no more links:next
 * 
 * @param {*} collections 
 * @returns 
 */
async function getItems(collection: Collection): Promise<Items>{
    let items : Items = [];
    const response = await fetch(`${baseUrl}/collections/${collection.id}/items`);
    const data = await response.json();
    items.push(...data.features);

    // get the next link
    let nextLink = data.links.find((link: any) => link.rel === 'next');
    while (nextLink){
        const response = await fetch(nextLink.href);
        const data = await response.json();
        items.push(...data.features);
        nextLink = data.links.find((link: any) => link.rel === 'next');
    }

    const count = items.length;
    items.forEach((item) => {
        // convert item.assets to an array, and add the key as ".id"to each item
        //@ts-ignore
        item.assets = Object.entries(item.assets).map(([key, val]) => ({...val, id: key}));

        // Remove assets that do not contain "data" or "overview" in the .roles array
        item.assets = item.assets.filter((asset: any) => asset.roles.includes("data") || asset.roles.includes("overview"));
        //item.assets = item.assets.filter((asset: any) => asset.roles.includes("data"));

        // Remove assets that do not have a .href
        item.assets = item.assets.filter((asset: any) => asset.href);

        // Remove assets where href does not end with .tif,.png,.jpg,.jpeg,.gif,.bmp,.webp, or .geojson
        item.assets = item.assets.filter((asset: any) => asset.href.endsWith(".tif") || asset.href.endsWith(".png") || asset.href.endsWith(".jpg") || asset.href.endsWith(".jpeg") || asset.href.endsWith(".gif") || asset.href.endsWith(".bmp") || asset.href.endsWith(".webp") || asset.href.endsWith(".geojson"));
    });



    // Remove items that do not contain any assets
    items = items.filter((item) => item.assets.length > 0);

    if (count != items.length){
        console.log(`Removed ${count - items.length} items from collection ${collection.id} (kept only items with a 'data' or 'thumbnail' role, and where the .href ends with .tif,.png,.jpg,.jpeg,.gif,.bmp,.webp, or .geojson)`);
    }

    return items;
}