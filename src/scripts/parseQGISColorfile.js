//0.18361639675688013,247,251,255,0,<= 0.184
//0.20085971412133119,175,209,231,255,0.197 - 0.201

const raw = `# QGIS Generated Color Map Export File
INTERPOLATION:DISCRETE
0.18361639675688013,247,251,255,255,<= 0.184
0.1914761584173186,226,237,248,255,0.184 - 0.191
0.19652318360632007,205,224,241,255,0.191 - 0.197
0.20085971412133119,175,209,231,255,0.197 - 0.201
0.20510714723349466,137,190,220,255,0.201 - 0.205
0.20948479962674316,96,166,210,255,0.205 - 0.209
0.21458802471600238,62,142,196,255,0.209 - 0.215
0.2220374814135834,34,114,181,255,0.215 - 0.222
0.2423891558630224,10,84,158,255,0.222 - 0.242
inf,8,48,107,255,> 0.242`;
localStorage.setItem('QGISColorfile', raw);

export async function getQGISColorfile(){
    const url = localStorage.getItem('url');
    if (!url) return null;
    //const doFake = url.includes('twi_2019_10m_b1_COG.tif');
    //if (!doFake) return null;

    const colorfileurl = url.replace('.tif', '.gdaldemrgb');
    localStorage.setItem('QGISColorfile', '');
    
    
    /*console.warn('Using fake QGISColorfile');
    localStorage.setItem('QGISColorfile', raw);
    localStorage.setItem('palette', 'qgis');
    document.dispatchEvent(new Event('newpalette'));
    return;*/

    try {
        const response = await fetch(colorfileurl);
        if (!response.ok) throw new Error(`Failed to fetch QGISColorfile: ${response.statusText}`);
        const text = await response.text();
        localStorage.setItem('QGISColorfile', text);
        localStorage.setItem('palette', 'qgis');
        document.dispatchEvent(new Event('newpalette'));
    } catch (error) {
        if (localStorage.getItem('palette')=='qgis') localStorage.setItem('palette', 'd3.interpolateBlues');
        document.dispatchEvent(new Event('newpalette'));
        console.error('Error fetching QGISColorfile:', error);
    }
}

/**
 * Returns a function which accepts a value in the domain
 * of the QGISColorfile and returns a color.
 * @returns 
 */
export function QGISColorfileAsd3ColrFn(){
    // read raw from localstorage
    let raw = localStorage.getItem('QGISColorfile');
    let lines = raw.split('\n');

    // remove the first line 
    lines.shift();
    lines.shift(); // Remove the second line



    let values = []; // The first column of each line
    const colors = []; // Column 1-4 of each line (RGBA)
    //const labels = []; // The text after the comma and before the next value
    for (const line of lines){
        const parts = line.split(',');
        let value = parseFloat(parts[0]);
        if (parts[0]==='inf') break;
        values.push(value);
        colors.push(`rgba(${parts.slice(1, 5).join(',')})`);
    }
    // Find the largest non-infinite value
    const maxValue = Math.max(...values.filter(v => isFinite(v)));
    localStorage.setItem('QGISColorfileValues', JSON.stringify(values));

    //const max = parseFloat(localStorage.getItem('max') ?? 1);
    //const min = parseFloat(localStorage.getItem('min') ?? 0);
    //console.log(`data min/max is ${min}/${max} and QGISColorfile range is ${values[0]}/${values[values.length-1]}`);
    //values = values.map(v => (v-min)/(max-min));

    // Create a function: input is a value, output is the color
    const color_function = (value) => {
        let index = 0;
        while (value > values[index])index++;
        return colors[index];
    }

    return color_function
}

export default QGISColorfileAsd3ColrFn;