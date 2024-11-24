import { createResource, createSignal } from "solid-js";
import { getAllSTACItems } from "../scripts/getAllSTACItems";
import { showWholeCollection } from "./utils/ShowWholeCollection";
import STAC from 'ol-stac';

export default function STACTreeView(props) {


    //const [STACCatalogs, setSTACCatalogs] = createSignal();
    const [dummySignal, setDummySignal] = createSignal();

    const [STACCatalogs] = createResource(dummySignal, getAllSTACItems);


    setDummySignal(true);
 
    return  <div class="stactreeview">
        <For each={STACCatalogs()} fallback={<div>Loading...</div>}>
            
            {(collection, collectionIdx) => {
                return <ViewCollection collection={collection} />
            }}
        </For>
    </div>
}




function ViewCollection({collection}) {

    // This should (but doesn't) show the whole collection as outlines in the map.
    // <button onClick={() => showWholeCollection(collection.links.filter(link => link.rel == "self")[0].href)}>Show whole collection</button>

    if (collection.items.length===0) return null;

    return <div>{collection.title}:

    <ul>
        <For each={collection.items}>
            {(item, itemIdx) => {
                // find the item in item.links[] array named "rel"="self" and get the "href" attribute of that item
                const selfLink = item.links.find(link => link.rel == "self");
                const href = selfLink ? selfLink.href : null;

                /*const handleClickOnSTACItem = (e) => {
                    e.preventDefault();
                    localStorage.setItem('stac', e.target.href);
                    document.dispatchEvent(new Event('newsource'));
                }*/

                //return <li><a href={href} onClick={handleClickOnSTACItem}>{item.id}</a>
                return <li>{item.id}
                <For each={Object.entries(item.assets)}>
                    {(entry) => <STACItem entry={entry} />}
                </For>
                
                </li>
            }}
        </For>
    </ul>
    </div>
}

function STACItem({entry}) {

    const [key, val] = entry;

    /*
    // If val.rolesdoes not contain "data", skip
    if (!(val.roles.includes("data") || val.roles.includes("overview"))) {
        return null;
        return <>No asset with "data" or "overview" role (only {val.roles.join(", ")})</>
    }
*/

    const urlInput = document.getElementById('url-input');
    if (urlInput) urlInput.onchange = () => document.dispatchEvent(new Event('newsource'));

    const urlInputButton = document.getElementById('url-input-button');
    if (urlInputButton) urlInputButton.onclick = () => document.dispatchEvent(new Event('newsource'));

    function handleClick(e) {
        e.preventDefault();

        localStorage.setItem('url', e.target.href);

        document.dispatchEvent(new Event('newsource'));
    }

    return <a href={val.href} class="stacitemasset" onClick={handleClick}>{val?.description  ?? val.id ?? key}</a>

}

