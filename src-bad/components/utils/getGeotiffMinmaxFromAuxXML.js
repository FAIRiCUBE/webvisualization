async function getGeotiffMinmaxFromAuxXML(geotiffSourceURL){
    try {

    const auxurl = geotiffSourceURL.replace('.tif','.tif.aux.xml');
    const aux = await fetch(auxurl);
    const auxxml = await aux.text();
    const auxdoc = new DOMParser().parseFromString(auxxml, 'text/xml');
    const min = auxdoc.querySelector('[key="STATISTICS_MINIMUM"]').textContent;
    const max = auxdoc.querySelector('[key="STATISTICS_MAXIMUM"]').textContent;
    return [parseFloat(min), parseFloat(max)];
    } catch {
        return null;
    }
}

export default getGeotiffMinmaxFromAuxXML;

