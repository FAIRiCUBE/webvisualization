import { For } from "solid-js"


export const vectorURLs = [
    {url:"number_of_summer_days_2018", name:"Summer Days", max: 71},
    {url:"number_of_tropical_nights_2018", name:"Tropical Nights", max:158},
    {url:"utci_heat_nights_2018", name:"UTCI Heat Nights", max:16},
    {url:"urban_green_percent", name:"% Green", max:100},
    {url:"urban_blue_percent", name:"% Blue", max:33}
]

function ChooseVectorLayer() {
    return <div>
        {vectorURLs.map((item, index) =>
            <label><input type="radio" name="fixedurl" onClick={() => setDatasetURL(item.url)} value={item.url} />{item.name}</label>
        )}
    </div>
}

export default ChooseVectorLayer;