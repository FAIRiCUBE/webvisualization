import { createResource, createSignal } from "solid-js";
import { getAllSTACItems } from "../scripts/getAllItems";
import { showWholeCollection } from "./utils/ShowWholeCollection";

export default function STACTreeView(props) {


    //const [STACCatalogs, setSTACCatalogs] = createSignal();
    const [dummySignal, setDummySignal] = createSignal();

    const [STACCatalogs] = createResource(dummySignal, getAllSTACItems);


    setDummySignal(true);
 
    return <For each={STACCatalogs()} fallback={<div>Loading...</div>}>
        
        {(collection, collectionIdx) => {
            return <ViewCollection collection={collection} />
        }}
    </For>
}

function ViewCollection({collection}) {


    return <div>{collection.title}:

    <button onClick={() => showWholeCollection(collection.links.filter(link => link.rel == "self")[0].href)}>Show whole collection</button>

    <ul>
        <For each={collection.items}>
            {(item, itemIdx) => {
                return <li>{item.id}<br/>
                <For each={Object.entries(item.assets)}>
                    {(entry) => {
                        const [key, val] = entry;
                        // If val.rolesdoes not contain "data", skip
                        if (!val.roles.includes("data")) return <>🔗</>
                        return <div>🔎 {val?.description  ?? val.id ?? key}:  {val.href}</div>
                    }}
                </For>
                
                </li>
            }}
        </For>
    </ul>
    </div>
}