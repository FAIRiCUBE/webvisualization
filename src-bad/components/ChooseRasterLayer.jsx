

const rasterURLs = [
    {url:"https://hub-fairicube0.s3.eu-central-1.amazonaws.com/data/web/vienna/r05_treecover2018_100m_b1_COG.tif", name:"Vienna Treecover"},
    {url:"/images/r05_treecover2018_100m_b1_COG.tif", name:"Vienna Treecover local"},
    {url:"https://hub-fairicube0.s3.eu-central-1.amazonaws.com/data/web/vienna/r08_Wien_builiding_vol_ha_grid100m_COG.tif", name:"Vienna"},
    {url:"/images/ua2018_mosaic_raster_10m_cog_2_3_B1.tif", name:"Denmark"},
    {url:"/images/no-overviews.tif", name:"Bahamas"},
    {url:"https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/21/H/UB/2021/9/S2B_21HUB_20210915_0_L2A/TCI.tif", name:"Brazil"},
    {url:"https://hub-fairicube0.s3.eu-central-1.amazonaws.com/data/web/luxembourg/shadow_2019_10m_b1_COG.tif", name:"Luxembourg"}
]

function setURL(index){
    console.log('setURL', index);
    const item = rasterURLs[index];
    if (!item.url.startsWith("http")) item.url = window.location.origin + item.url;
    setDatasetURL(item.url);
}

function ChooseRasterLayer() {
    return <div>
        {rasterURLs.map((item, index) =>
            <label><input type="radio" name="fixedurl" onClick={() => setURL(index)} checked={index==0} value={item.url} />{item.name}</label>
        )}
    </div>
}

export default ChooseRasterLayer;