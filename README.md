
## Using QGIS to define a recommended color ramp for your dataset

This tool allows you to export a QGIS color ramp which will be
used as the default palette when users view your COG file.

To do this, simply save the QGIS color ramp in a text file
as a sibling with your data file, with the suffix `.gdaldemrgb`.
For example if your file is 
called `X.tiff`, save the color ramp as a text file called `X.gdaldemrgb`.

The visualization tool will automatically check for the presense of such 
a file, and if found, use it as the default palette.

Here is an example of the format expected in this `.gdaldemrgb` file:

```
# QGIS Generated Color Map Export File
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
inf,8,48,107,255,> 0.242
```
So the format is `LowerValue, R,G,B, Label`, 
where `R,G,B` are values in the range 0-255 specifying the RGB color 
interpolation point. The palette will be clamped, so values outside the defined
range will use the lowest/highest color defined.

Additionally it is possible to set the default palette for your 
dataset to True Color RGB, Viridis, Turbo, Orange/Red, or Green/Blue.
You can do this by creating a sidecar file with the `.palettename.txt` 
extension, and this file should contain one of the following values:
```
d3.interpolateViridis
d3.interpolateTurbo
d3.interpolateOrRd
d3.interpolateGnBu
rgb
qgis
```

If the value is `rgb` the source file will be treated as a RGB image file, not a 
single-band raw data file.

Note that the `qgis` value is redundant, since the same effect can be acheieved by 
omitting the `.palettename.txt` and providing a `.gdaldemrgb` sidecar instead.




## About this repo

This repo is a serverless (i.e. javascript + html only) viewer for Cloud Optimized GeoTiff (COG) files.
COG files are a variant of GeoTIFF raster goespatial files which are optimzied for serving in web apps.

This app reads the COG TIFF files and applies a color ramp in the browser. For this to work the 
browser JavaScript needs to know the min and max values of the entire TIFF file, since the system only
reads small windows of the COG at any time for performance reasons. If you use GDAL to create the COG file
it will include STATISTICS_MINIMUM and STATISTICS_MAXIMUM metadata fields which is sufficient. If you use another 
software to create the COG you will need to provide the min and max values another way. This setup is not well
documented so please see the source code to understand how the JavaScript reads the min and max values.

This repo has support for reading QGIS Color Ramp files. These allow the creator to specify a custom color
ramp across specific data values, allowing you to build subtle color palettes that bring out features 
in datasets where values are not evenly distributed.

This repo has support for exloring a STAC asset catalog. Click on the FAIRiCUBE logo to open the STAC catalog explorer, then click on an asset to load it for visualization.

If this page is called with a query paramter like `?data=https://my.url/my_dataset.tiff" it will load and visualize that COG file. This can be useful for example for creating links in a STAC catalog directly to a visualization.


## Building the app

This app is built using Astro.build to package all the pieces of the web app into a single .html page, and SolidJS to power some interactive elements.

The app uses custom DOM events to connect elements (e.g. to redraw the color bar when a new palette is invoked) and localStorage API to manage state (e.g. which COG URL is being viewed, which palette is active, etc.), and provides access to the basic set of D3 color ramps.

To compile and edit the app on your local machine, you must have NodeJS installed then clone this repo and from inside the repo folder, run:
```
npm install
npm run dev # this will start a dev version on your local machine.
```

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.


### `npm run build`
The command `npm run build`
builds the app for production and compiles the web page(s) the `dist` folder.<br>

### Github Pages
This repo contains a `.yml` file in ./github/workflows which builds the webapp and deploys it to GitHub Pages.


## Creating Cloud Optimized GeoTIFFs

The easiest way is 
```
gdalwarp -of COG -t_srs EPSG:3857   inputdata.tiff result.tiff
```
This will create the COG file, including overview tiles, and warp it to EPSG:3857 which is the normal for web maps.

Learn about COG format here: https://cogeo.org/

