<script lang="ts">
	import { onMount } from 'svelte';
	import MapLibre from '../Components/MapLibre.svelte';

	import { browser } from '$app/environment';
	import * as Comlink from 'comlink';
	import DownloadWorker from '$lib/workers/tile_file_download?worker';
	import tileDatabase from '$lib/tile_database';

	let statuses: Record<string, string> = {}; // Object to store status for each file
	let status = 'loading';

	function computeStatus(statuses:Record<string, string>) {
    // Assuming statuses is an object with URL keys
    const urls = Object.keys(statuses);

    // Check if all statuses are 'downloaded'
    const allDownloaded = urls.every(url => statuses[url] === 'downloaded');

    // Return the final status
    return allDownloaded ? 'loaded' : 'loading';
}

	async function workerDownload(url: string) {
		let theWorker = new DownloadWorker();
		const worker = Comlink.wrap(theWorker);
		const success = await worker.download(url);
		console.log('Got', success);
		statuses[url] = success ? 'downloaded' : 'error';
		tileDatabase?.downloadStatus.put({ file: url, status: statuses[url] });
	}

	onMount(async () => {
		if (browser) {
			console.log("browser")
			await tileDatabase?.open().catch(function (e) {
				console.error('Open failed: ' + e.stack);
			});

			// List of files to download and cache
			const basemapFiles = [
				'/basemap-nz-8_252_156.zip',
				'/basemap-nz-8_252_157.zip'
			];

			const RouteFiles = ['/route-nz-x.zip']
			const files =  [...basemapFiles, ...RouteFiles];

			// Iterate through the list of files
			for (const file of files) {
				let st = (await tileDatabase?.downloadStatus.where('file').equals(file).first())?.status;
				console.log(st);
				if (st !== 'downloaded') {
					await workerDownload(file);
					st = (await tileDatabase?.downloadStatus.where('file').equals(file).first())?.status;
				}
				statuses[file] = st || 'unknown';
				status=computeStatus(statuses)
			}
			
		}
	});
</script>

{#if status === 'loading'}
	<p>Please wait while loading the map data</p>
{:else if status === 'loaded'}
	<MapLibre />
{:else}
	<h1>Error: Could not load the map data.</h1>

{/if}
