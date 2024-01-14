// vite.config.js
import { sveltekit } from "file:///Users/benjaminmodave/Documents/Coding/busyplanet/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { SvelteKitPWA } from "file:///Users/benjaminmodave/Documents/Coding/busyplanet/node_modules/@vite-pwa/sveltekit/dist/index.mjs";
import { viteCommonjs } from "file:///Users/benjaminmodave/Documents/Coding/busyplanet/node_modules/@originjs/vite-plugin-commonjs/lib/index.js";
var config = {
  server: {
    port: 5173
  },
  worker: {
    plugins: [sveltekit()],
    format: "es"
  },
  optimizeDeps: {
    include: ["jszip"]
  },
  plugins: [
    viteCommonjs(),
    sveltekit(),
    SvelteKitPWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
        suppressWarnings: true
      },
      manifest: {
        theme_color: "green",
        icons: [
          {
            src: "manifest-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any"
          },
          {
            src: "manifest-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          }
        ]
      },
      workbox: {
        // use client/ prefix always, the folder for workbox is .svetlekit/output
        // don't include json files, include specific json names
        globPatterns: ["client/**/*.{ico,js,css,html,png,jpg,svg}", "client/mystyle.json"],
        navigateFallbackDenylist: [/\.zip$/]
      }
      //   strategies: 'injectManifest',
      //   srcDir: 'src',
      //   filename: 'my-sw.js', // or `my-sw.ts`
      /* other pwa options */
    })
  ]
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYmVuamFtaW5tb2RhdmUvRG9jdW1lbnRzL0NvZGluZy9idXN5cGxhbmV0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYmVuamFtaW5tb2RhdmUvRG9jdW1lbnRzL0NvZGluZy9idXN5cGxhbmV0L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9iZW5qYW1pbm1vZGF2ZS9Eb2N1bWVudHMvQ29kaW5nL2J1c3lwbGFuZXQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgU3ZlbHRlS2l0UFdBIH0gZnJvbSAnQHZpdGUtcHdhL3N2ZWx0ZWtpdCc7XG5pbXBvcnQgeyB2aXRlQ29tbW9uanMgfSBmcm9tICdAb3JpZ2luanMvdml0ZS1wbHVnaW4tY29tbW9uanMnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgndml0ZScpLlVzZXJDb25maWd9ICovXG5jb25zdCBjb25maWcgPSB7XG5cdHNlcnZlcjp7XG5cdFx0cG9ydDo1MTczXG5cdH0sXG5cdHdvcmtlcjoge1xuXHRcdHBsdWdpbnM6IFtzdmVsdGVraXQoKV0sXG5cdFx0Zm9ybWF0OiAnZXMnLFxuXHR9LFxuXHRvcHRpbWl6ZURlcHM6IHtcblx0XHRpbmNsdWRlOiBbJ2pzemlwJ11cblx0fSxcblx0cGx1Z2luczogW1xuXHRcdHZpdGVDb21tb25qcygpLFx0XG5cdHN2ZWx0ZWtpdCgpLFxuXHRTdmVsdGVLaXRQV0Eoe1xuXHRcdHN0cmF0ZWdpZXM6ICdnZW5lcmF0ZVNXJyxcblx0XHRyZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcblx0XHRkZXZPcHRpb25zOiB7XG5cdFx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRcdHN1cHByZXNzV2FybmluZ3M6IHRydWUsXG5cdFx0fSxcblx0XHRtYW5pZmVzdDoge1xuXHRcdFx0dGhlbWVfY29sb3I6ICdncmVlbicsXG5cdFx0XHRpY29uczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3JjOiAnbWFuaWZlc3QtaWNvbi0xOTIucG5nJyxcblx0XHRcdFx0XHRzaXplczogJzE5MngxOTInLFxuXHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxuXHRcdFx0XHRcdHB1cnBvc2U6ICdtYXNrYWJsZSBhbnknXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzcmM6ICdtYW5pZmVzdC1pY29uLTUxMi5wbmcnLFxuXHRcdFx0XHRcdHNpemVzOiAnNTEyeDUxMicsXG5cdFx0XHRcdFx0dHlwZTogJ2ltYWdlL3BuZycsXG5cdFx0XHRcdFx0cHVycG9zZTogJ2FueSdcblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH0sXG5cdFx0d29ya2JveDoge1xuXHRcdFx0Ly8gdXNlIGNsaWVudC8gcHJlZml4IGFsd2F5cywgdGhlIGZvbGRlciBmb3Igd29ya2JveCBpcyAuc3ZldGxla2l0L291dHB1dFxuXHRcdFx0Ly8gZG9uJ3QgaW5jbHVkZSBqc29uIGZpbGVzLCBpbmNsdWRlIHNwZWNpZmljIGpzb24gbmFtZXNcblx0XHRcdGdsb2JQYXR0ZXJuczogWydjbGllbnQvKiovKi57aWNvLGpzLGNzcyxodG1sLHBuZyxqcGcsc3ZnfScsICdjbGllbnQvbXlzdHlsZS5qc29uJ10sXG5cdFx0XHRuYXZpZ2F0ZUZhbGxiYWNrRGVueWxpc3Q6IFsvXFwuemlwJC9dLFxuXHRcdH1cblx0XHQvLyAgIHN0cmF0ZWdpZXM6ICdpbmplY3RNYW5pZmVzdCcsXG5cdFx0Ly8gICBzcmNEaXI6ICdzcmMnLFxuXHRcdC8vICAgZmlsZW5hbWU6ICdteS1zdy5qcycsIC8vIG9yIGBteS1zdy50c2Bcblx0XHQvKiBvdGhlciBwd2Egb3B0aW9ucyAqL1xuXHR9KSxcbl1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVUsU0FBUyxpQkFBaUI7QUFDL1YsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxvQkFBb0I7QUFHN0IsSUFBTSxTQUFTO0FBQUEsRUFDZCxRQUFPO0FBQUEsSUFDTixNQUFLO0FBQUEsRUFDTjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ1AsU0FBUyxDQUFDLFVBQVUsQ0FBQztBQUFBLElBQ3JCLFFBQVE7QUFBQSxFQUNUO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDYixTQUFTLENBQUMsT0FBTztBQUFBLEVBQ2xCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixhQUFhO0FBQUEsTUFDWixZQUFZO0FBQUEsTUFDWixjQUFjO0FBQUEsTUFDZCxZQUFZO0FBQUEsUUFDWCxTQUFTO0FBQUEsUUFDVCxrQkFBa0I7QUFBQSxNQUNuQjtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ047QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1Y7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLE1BQ0EsU0FBUztBQUFBO0FBQUE7QUFBQSxRQUdSLGNBQWMsQ0FBQyw2Q0FBNkMscUJBQXFCO0FBQUEsUUFDakYsMEJBQTBCLENBQUMsUUFBUTtBQUFBLE1BQ3BDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtELENBQUM7QUFBQSxFQUNGO0FBQ0E7QUFFQSxJQUFPLHNCQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
