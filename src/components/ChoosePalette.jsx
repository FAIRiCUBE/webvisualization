

export function ChoosePalette(props) {
    return <div>
        <label><input onClick={() => props.setPalette('A')} type="radio" name="palette" value="A" checked />Palette A</label>
        <label><input onClick={() => props.setPalette('B')} type="radio" name="palette" value="B" />Palette B</label>
        <label><input onClick={() => props.setPalette('C')} type="radio" name="palette" value="C" />Palette C</label>
        <label><input onClick={() => props.setPalette('D')} type="radio" name="palette" value="D" />Palette D</label>
        <label
        style={{display: props.datasetURL().endsWith('.tif') ? 'initial' : 'none'}}
        ><input onClick={() => props.setPalette('RGB')} type="radio" name="palette" value="RGB" 
        />True Color</label>
    </div>
}

export default ChoosePalette;
