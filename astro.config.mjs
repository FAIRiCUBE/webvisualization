import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js';

export default defineConfig({
    site: "https://vis.fairicube.eu",
    integrations: [solid()],
    output: "static",
    publicDir: "public",
    outDir: "dist",
})
