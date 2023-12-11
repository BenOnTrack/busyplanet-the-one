<script context="module" lang="ts">
	import maplibre from 'maplibre-gl';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import tileDatabase from '$lib/tile_database';
	import LayerColorSwitcher from './LayerColorSwitcher.svelte';
	import LayerSwitcher from './LayerSwitcher.svelte';
	// import RouteDropdown from './RouteDropdown.svelte';
	import { Button, Tag } from 'carbon-components-svelte';

	import 'maplibre-gl/dist/maplibre-gl.css';
	import 'carbon-components-svelte/css/white.css';

	import {
		getMapZoom,
		toggleLayerIDwithFilter,
		getDataSetFeatureFromID,
		toggleRouteAndSetMapViewFromFilter
	} from '../utils/MapFunctions.svelte';
	import {
		bookmarkdb,
		addBookmark,
		removeBookmark,
		getAllBookmarks
	} from '$lib/bookmarks/bookmarkdb';

	function getSourceFromProtocol(url:string) {
  // Extract the source ID from the input property
  const match = url.match(/mbtiles:\/\/[^/]+\/([^/]+)\/[0-9]+\/[0-9]+\/[0-9]+\.pbf/);

  // If a match is found, return the source ID, otherwise return null
  return match ? match[1] : null;
}

// // Example usage
// const url = 'mbtiles://localhost:5173/basemap/15/32336/20010.pbf';
// const sourceId = getSourceIdFromUrl(url);

	let bookmarks: number[] = [];
	if (browser) {
		tileDatabase?.on('ready', () => {
			maplibre.addProtocol('mbtiles', (params, callback) => {
				// params is filled when maplibre makes a request for a tile from style.json
				const url = params.url
				const zxy = params.url.match(/\/([0-9]+)\/([0-9]+)\/([0-9]+)\.pbf/);
				if (zxy?.length != 4) return callback(new Error(`Tile fetch error: bad params`));
				const source=getSourceFromProtocol(url)
				const z = parseInt(zxy[1]);
				const x = parseInt(zxy[2]);
				const y = parseInt(zxy[3]);
				console.log("source",source)
				console.log("z",z)
				console.log("y",y)
				console.log("x",x)
				const query=`[${source}+${z}+${x}+${y}]`
				console.log("query",query)
				const dxres = tileDatabase.mapTiles
					.where('[source+z+x+y]')
					.equals([`${source}`, z, x, y])
					.toArray()
					.then((e) => {
						if (e.length == 1) {
							callback(null, e[0].data, null, null);
						} else callback(new Error(e));
					})
					.catch('NotFoundError', (e) => callback(new Error(e)));
				return { cancel: () => {} };
			});
		});
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { Map, NavigationControl } from 'maplibre-gl';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';

	export let lat = -36.88;
	export let lon = 174.77;
	export let zoom = 8;
	let bounds = new maplibre.LngLatBounds([174.398279, -37.104532], [175.33349, -36.828027]);
	$: if (map) {
		map.flyTo({ center: [lon, lat], zoom: zoom, essential: true });
	}
	// const { Map /*GeolocateControl */ } = maplibre;

	// Map
	let mapContainer: HTMLDivElement;
	let map: Map;
	let basemapOrigin: string;
	let routeOrigin: string;
	let staticOrigin: string;
	let targetLayers: string[];
	let clickedSourceFeature: maplibregl.GeoJSONFeature;
	let clickedDataSetFeature = null;
	let bookmarks = {};

	interface StyleLayer {
		id: number;
		text: string;
		visibility: string;
	}
	let styleLayers: StyleLayer[];
	let layerColorSwitcherIds: StyleLayer[] = [];
	let layerSwitcherIds: StyleLayer[] = [];
	let layerSwitcherSelectedIds: number[];
	interface Layer {
		id: string;
		metadata?: { switch: boolean };
	}
	// Tags
	let tagList: string[] = [];

	// Bookamarks
	let bookmarkIds: number[];

	// RouteSwitcher
	let routeDataSetFeatures = [];
	let filteredRouteDataSetFeatures = [];
	let groupedFilteredRouteDataSetFeatures = {};
	let routeMin = 0;
	let routeMax = 1;
	const nice = (d) => {
		if (!d && d !== 0) return '';
		return d.toFixed(2);
	};

	onMount(async () => {
		console.log('Page Url Origin:', $page.url.origin);
		console.log('Base path:', base);
		basemapOrigin = `mbtiles://${$page.url.origin.split('://')[1]}`;

		staticOrigin = `${$page.url.origin}${base}`;
		const style = await (await fetch(`${base}/mystyle.json`)).json();
		style.sources.basemap.tiles = style.sources.basemap.tiles.map((s: string) => {
			return s.replace('@basemapOrigin@', basemapOrigin);
		});
		style.sources.route.tiles = style.sources.route.tiles.map((s: string) => {
			return s.replace('@basemapOrigin@', basemapOrigin);
		});
		style.sprite = style.sprite.replace('@staticOrigin@', staticOrigin);
		style.glyphs = style.glyphs.replace('@staticOrigin@', staticOrigin);

		// Style Layers
		styleLayers = style.layers.map((layer: { id: number }, id: number) => ({
			id,
			text: layer.id,
			visibility: layer.layout?.visibility || null
		}));
		// Layer Color Switcher
		layerColorSwitcherIds = styleLayers.filter((layer) => {
			const metadata = style.layers[layer.id]?.metadata;
			return metadata && metadata.color === true;
		});

		// Layer Switcher
		layerSwitcherIds = styleLayers.filter((layer) => {
			const layerData = style.layers[layer.id];
			return layerData.metadata && layerData.metadata.switch === true;
		});
		layerSwitcherSelectedIds = layerSwitcherIds
			.filter((layer) => layer.visibility === 'visible')
			.map((layer) => layer.id);

		// Route Switcher
		routeDataSetFeatures = await (await fetch(`${base}/route_dataset.json`)).json();
		console.log('routeDataSet:', routeDataSetFeatures);
		// filteredRouteDataSetFeatures contains the filtered set
		filteredRouteDataSetFeatures = routeDataSetFeatures;
		// Group the features by category
		filteredRouteDataSetFeatures.forEach((feature) => {
			if (!groupedFilteredRouteDataSetFeatures[feature.subclass]) {
				groupedFilteredRouteDataSetFeatures[feature.subclass] = [];
			}
			groupedFilteredRouteDataSetFeatures[feature.subclass].push(feature);
		});

		let bounds = new maplibre.LngLatBounds([174.37500000, -37.16031655], [175.78125000, -36.59788913]);
		targetLayers = ['poi-food_and_drink', 'poi-lodging', 'poi-transportation', 'bookmarks-symbol'];

		// Bookmarks

		// Map
		map = new Map({
			container: mapContainer,
			style: style,
			center: [lon, lat],
			maxTileCacheSize: 5000,
			refreshExpiredTiles: false,
			doubleClickZoom: false,
			// maxBounds: bounds
		});

		map.on('load', function () {
			// control
			map.addControl(new NavigationControl(), 'top-right');
			map.addControl(
				new maplibre.GeolocateControl({
					positionOptions: {
						enableHighAccuracy: true
					},
					trackUserLocation: true
				})
			);

			// POI
			map.on('click', (e) => {
				let features = map.queryRenderedFeatures(e.point, {
					layers: targetLayers
				});
				if (!features.length) return;
				else {
					console.log(features[0]);
					clickedSourceFeature = features[0];
					updateFeatureInfo();
					map.flyTo({
						center: clickedSourceFeature.geometry.coordinates,
						zoom: 20,
						essential: true,
						duration: 7000,
					});
				}
			});

			// Route_midpoint
			map.on('click', (e) => {
				let renderedSourceFeatures = map.queryRenderedFeatures(e.point, {
					layers: ['route_midpoint']
				});
				if (!renderedSourceFeatures.length) return;
				else {
					clickedSourceFeature = renderedSourceFeatures[0];
					console.log('clickedSourceFeature', clickedSourceFeature);
					clickedDataSetFeature = getDataSetFeatureFromID(
						filteredRouteDataSetFeatures,
						clickedSourceFeature.properties.id
					);
					const { id, type, bbox, members } = clickedDataSetFeature;
					console.log('clickedDataSetFeature', clickedDataSetFeature);
					const routeData = {
						id: id,
						type: type,
						bbox: bbox,
						zoom: 14
					};
					const filterWayMembers = ['in', ['id'], ['literal', members]];
					const filterRelation = ['==', 'id', id];
					toggleRouteAndSetMapViewFromFilter(map, filterWayMembers, filterRelation, bbox);
				}
			});

			// Add zoom event listener to the map
			map.on('zoom', () => {
				const currentZoom = map.getZoom();
				console.log('Current Zoom:', currentZoom);
			});

			// Bookmark
			updateBookmark();
		});
	});

	async function updateBookmark() {
		let bookmarkIds = await getAllBookmarks();
		const bookmarkIdList = bookmarkIds.map((item) => item.id);
		console.log(bookmarkIdList);
		const bookmarkIdFilter = ['in', ['id'], ['literal', bookmarkIdList]];
		toggleLayerIDwithFilter(map, 'bookmarks-symbol', bookmarkIdFilter);
		toggleLayerIDwithFilter(map, 'bookmarks-circle', bookmarkIdFilter);
	}
	async function saveBookmark() {
		const currentId: number = clickedSourceFeature.id;
		const currentName: string = clickedSourceFeature.properties['name:latin'];
		const currentClass: string = clickedSourceFeature.properties['class'];
		const currentSubclass: string = clickedSourceFeature.properties['subclass'];
		const currentCategory: string = clickedSourceFeature.properties['category'];
		if (currentId !== null) {
			console.log('Current ID:', currentId);

			try {
				const allIds = await getAllBookmarks();
				// Check if the current ID exists in the database
				const idExists = allIds.some((item) => item.id === currentId);
				if (idExists) {
					// If the ID exists, remove it
					await removeBookmark(currentId);
					console.log(`ID ${currentId} removed from the database.`);
				} else {
					// If the ID does not exist, add it
					await addBookmark(
						currentId,
						currentName,
						currentClass,
						currentSubclass,
						currentCategory,
						''
					);
					console.log(`ID ${currentId} added to the database.`);
				}
			} catch (error) {
				console.error('Error checking and updating ID in the database: ', error);
			}
		} else {
			console.log('No ID selected.');
		}
		updateBookmark();
	}
	function updateFeatureInfo() {
		tagList = [];
		const propertiesToInclude = ['name:latin', 'class', 'subclass', 'category', 'cuisine'];

		propertiesToInclude.forEach((property) => {
			const value = clickedSourceFeature['properties'][property];
			if (value !== undefined && value !== null && value !== '') {
				tagList.push(value);
			}
		});
	}

	async function navigateToEdit() {
  const currentId: number = clickedSourceFeature.id;

  try {
    const bookmark = await bookmarkdb.ids
      .where({ id: currentId })
      .first();

    if (bookmark) {
      // Bookmark with the specified ID exists, navigate to edit page
      goto(`${base}/${currentId}`);
    } else {
      // Bookmark with the specified ID doesn't exist
      console.error(`Bookmark with ID ${currentId} not found.`);
      // You may choose to show a user-friendly message or handle this case as appropriate
    }
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    // Handle other errors as needed
  }
}

</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
	/>
</svelte:head>

<div>
	<div id="map" bind:this={mapContainer} />
	<LayerColorSwitcher {map} {layerColorSwitcherIds} />
	<LayerSwitcher {map} {layerSwitcherIds} {layerSwitcherSelectedIds} />
	<Button on:click={saveBookmark}>Save Bookmark</Button>
	<Button on:click={navigateToEdit}>Edit Bookmark</Button>
	<div id="feature-info">
		<!-- <RouteDropdown {map} {filteredRouteDataSetFeatures} {groupedFilteredRouteDataSetFeatures} /> -->

		{#if tagList.length > 0}
			{#each tagList as tag (tag)}
				<Tag>{tag}</Tag>
			{/each}
		{/if}
	</div>
</div>

<style>
	#map {
		width: 100%; /* Adjust as needed */
		height: 80vh; /* Adjust as needed */
	}
	#feature-info {
		padding: 10px;
	}
</style>