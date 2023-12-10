<script lang="ts">
	import { onMount } from 'svelte';
	import MapLibre from '../Components/MapLibre.svelte';
  
	import { browser } from '$app/environment';
	import * as Comlink from 'comlink';
	import DownloadWorker from '$lib/workers/tile_file_download?worker';
	import tileDatabase from '$lib/tile_database';
  
	let statuses: Record<string, string> = {}; // Object to store status for each file
  
	async function workerDownload(url: string) {
	  let theWorker = new DownloadWorker();
	  const worker = Comlink.wrap(theWorker);
	  const success = await worker.download(url);
	  console.log('Got', success);
	  statuses[url] = success ? 'loaded' : 'error';
	  tileDatabase?.downloadStatus.put({ file: url, status: statuses[url] });
	}
  
	onMount(async () => {
	  if (browser) {
		await tileDatabase?.open().catch(function (e) {
		  console.error('Open failed: ' + e.stack);
		});
  
		// List of files to download and cache
		const files = ['/basemap_nz.zip', '/route_nz.zip'];
  
		// Iterate through the list of files
		for (const file of files) {
		  let st = (await tileDatabase?.downloadStatus.where('file').equals(file).first())?.status;
		  console.log(st)
		  if (st !== 'loaded') {
			await workerDownload(file);
			st = (await tileDatabase?.downloadStatus.where('file').equals(file).first())?.status;
		  }
		  statuses[file] = st || 'unknown';
		}
	  }
	});
  </script>
  
  {#if Object.values(statuses).every(status => status === 'loaded')}
	<MapLibre />
  {:else}
	<h1>Error: Could not load the map data.</h1>
	<p>The tile file should be copied or linked to tile_data/planet.mbtiles.</p>
	<p>This error indicates the backend's tile server could not find the database file.</p>
  {/if}
  