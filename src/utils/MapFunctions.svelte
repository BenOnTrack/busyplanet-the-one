<script context="module" lang="ts">
	import togeojson from '@mapbox/togeojson';
	// update Bookmark source - for front end display
	export async function updateBookmarksSource(map) {
		getData('bookmarks.geojson').then((data) => {
			map.getSource('bookmarksSource').setData(data);
		});
	}

	// postBookmark
	export async function postBookmark(feature) {
		try {
			postData('/bookmarks', feature);
		} catch (error) {
			console.error(error);
		}
	}

	// Post Data to url
	export async function postData(url = '', data = {}) {
		// Default options are marked with *
		const response = await fetch(url, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		return await response.json(); // parses JSON response into native JavaScript objects
	}

	// Fetch data from url
	export async function getData(url = '') {
		// Default options are marked with *
		const response = await fetch(url, {
			method: 'GET', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		});
		return await response.json(); // parses JSON response into native JavaScript objects
	}

	// Fetch data from url
	export async function getDataTxt(url = '') {
		// Default options are marked with *
		const response = await fetch(url);
		return response.text(); // parses JSON response into native JavaScript objects
	}

	export function toggleVisibility(map, layerId) {
		if (map) {
			const visibility = map.getLayoutProperty(layerId, 'visibility');
			map.setLayoutProperty(layerId, 'visibility', visibility === 'visible' ? 'none' : 'visible');
		}
	}

    export function forceToggleVisibility(map, layerId, checked) {
        if (map) {
            const visibility = checked ? "visible" : "none";
            map.setLayoutProperty(layerId, "visibility", visibility);
        }
	}

	export function toggleSpecificLayerIDwithFilter(map, layerId, newFilter) {
		const noneFilter = ['==', 'id', 0];
		const currentFilter = map.getFilter(layerId);

		if (JSON.stringify(currentFilter) === JSON.stringify(newFilter)) {
			map.setFilter(layerId, noneFilter);
		} else {
			map.setFilter(layerId, newFilter);
		}
	}


	export function toggleLayerIDwithFilter(map, layerId, newFilter) {
		const noneFilter = ['in', ['id'], ['literal', [0]]];
		const currentFilter = map.getFilter(layerId);

		if (JSON.stringify(currentFilter) === JSON.stringify(newFilter)) {
			map.setFilter(layerId, noneFilter);
		} else {
			map.setFilter(layerId, newFilter);
		}
	}

	export function togglePark(map) {
		toggleVisibility(map, 'area_fill_national_park');
		toggleVisibility(map, 'area_outline_national_park');
		toggleVisibility(map, 'area_name_national_park');
	}

	export function toggleFoodDrink(map) {
		toggleVisibility(map, 'food_and_drink-heat');
	}

	export function toggleAttraction(map) {
		toggleVisibility(map, 'attraction-heat');
	}
	export function toggleLodging(map) {
		toggleVisibility(map, 'lodging-heat');
	}

	export function changeLayerColor(map, layer, color) {
		map.setPaintProperty(layer, 'fill-color', color);
	}

	export function handleSelect(map,event) {
		if (event.detail.selected) {
			event.detail.selected.forEach((selectedItem) => {
				forceToggleVisibility(map, selectedItem.text,true); // Set checked to true
			});
		}
		if (event.detail.unselected) {
			event.detail.unselected.forEach((unselectedItem) => {
				forceToggleVisibility(map, unselectedItem.text,false); // Set checked to false
			});
		}
	}

	// export function animateHike(map) {
	//     // Load the GeoJSON MultiLineString
	//     d3.json('queen.geojson', (err, data) => {
	//         if (err) throw err;

	//         // Extract the LineStrings from the MultiLineString
	//         const lineStrings = data.features[0].geometry.coordinates;

	//         // Initialize variables
	//         let currentIndex = 0; // Index of the current LineString
	//         let currentCoordinateIndex = 0; // Index of the current coordinate within the LineString

	//         // Create an empty LineString feature to hold the animation path
	//         const animationPath = {
	//             type: 'Feature',
	//             properties: {},
	//             geometry: {
	//                 type: 'LineString',
	//                 coordinates: [],
	//             },
	//         };

	//         // Add the LineString feature to the map
	//         map.addSource('trace', { type: 'geojson', data: animationPath });
	//         map.addLayer({
	//             id: 'trace',
	//             type: 'line',
	//             source: 'trace',
	//             paint: {
	//                 'line-color': 'red',
	//                 'line-opacity': 0.75,
	//                 'line-width': 5,
	//             },
	//         });

	//         // Start the animation
	//         const timer = window.setInterval(() => {
	//             if (currentIndex < lineStrings.length) {
	//                 const currentLineString = lineStrings[currentIndex];

	//                 if (currentCoordinateIndex < currentLineString.length) {
	//                     // Add the current coordinate to the animation path
	//                     animationPath.geometry.coordinates.push(currentLineString[currentCoordinateIndex]);

	//                     // Update the map source data and pan to the current coordinate
	//                     map.getSource('trace').setData(animationPath);
	//                     map.panTo(currentLineString[currentCoordinateIndex]);

	//                     currentCoordinateIndex++;
	//                 } else {
	//                     // Move to the next LineString when the current one is completed
	//                     currentIndex++;
	//                     currentCoordinateIndex = 0;
	//                 }
	//             } else {
	//                 // Stop the timer when all LineStrings are animated
	//                 window.clearInterval(timer);
	//             }
	//         }, 50);
	//     });
	// }

	export function setMapView(map, bbox) {
		map.fitBounds(bbox, { padding: 20 });
	}

	export function getBboxFromGeojson(data) {
		return (bbox = data.features[0].properties.bbox);
	}
	export function toggleRouteAndSetMapView(map, dataSetFeatures, featureID) {
		const dataSetFeature = getDataSetFeatureFromID(dataSetFeatures, featureID);
		console.log("dataSetFeature:",dataSetFeature)
		const bbox = dataSetFeature.bbox;
		console.log("bbox:",bbox)
		const relationMembers = dataSetFeature.members;
		console.log("relationMembers:",relationMembers)
		const filterWayMembers = ['in', ['id'], ['literal', relationMembers]];
		console.log("filterWayMembers:",filterWayMembers)
		const filterRelation = ['==', 'id', featureID];
		console.log("filterRelation:",filterRelation)
		// toggleLayerIDwithFilter(map, 'selected_route_sac_scale', filterWayMembers);
		toggleSpecificLayerIDwithFilter(map, 'selected_route', filterRelation);
		toggleSpecificLayerIDwithFilter(map, 'selected_route_name', filterRelation);
		setMapView(map, bbox);
	}

	export function toggleRouteAndSetMapViewFromFilter(map, filterWayMembers, filterRelation, bbox) {
		//toggleLayerIDwithFilter(map, 'selected_route_sac_scale', filterWayMembers);
		toggleSpecificLayerIDwithFilter(map, 'selected_route', filterRelation);
		toggleSpecificLayerIDwithFilter(map, 'selected_route_name', filterRelation);
		setMapView(map, bbox);
	}
	// return the dataSetFeature knowing the featureID
	export function getDataSetFeatureFromID(dataSetFeatures, featureID) {
		return dataSetFeatures.find((dataSetFeature) => dataSetFeature.id === featureID);
	}

	export function animateHike(map, geojsonData) {
		let bbox = getBboxFromGeojson(geojsonData);
		setMapView(map, bbox);
		let dataToDisplay = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: []
					}
				}
			]
		};

		map.getSource('animateHikeSource').setData({
			type: 'FeatureCollection',
			features: []
		});
		// save full coordinate list for later
		const coordinates = geojsonData.features[0].geometry.coordinates;

		// start by showing just the first coordinate
		dataToDisplay.features[0].geometry.coordinates = [coordinates[0]];

		// setup the viewport
		// map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });

		// on a regular basis, add more coordinates from the saved list and update the map
		let i = 0;
		const intervalDuration = 75;
		const timer = window.setInterval(() => {
			if (i < coordinates.length) {
				dataToDisplay.features[0].geometry.coordinates.push(coordinates[i]);
				map.getSource('animateHikeSource').setData(dataToDisplay);
				// map.panTo(coordinates[i]);
				i++;
			} else {
				window.clearInterval(timer);
			}
		}, intervalDuration);
	}

	export async function animateGpx(map, gpxPath) {
		let dataToDisplay = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: []
					}
				}
			]
		};

		map.getSource('animateGpxSource').setData({
			type: 'FeatureCollection',
			features: []
		});
		const gpxData = await getDataTxt(gpxPath);
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(gpxData, 'text/xml');
		const geojson = togeojson.gpx(xmlDoc);

		// save full coordinate list for later
		const coordinates = geojson.features[0].geometry.coordinates;

		// start by showing just the first coordinate
		dataToDisplay.features[0].geometry.coordinates = [coordinates[0]];

		// setup the viewport
		map.jumpTo({ center: coordinates[0], zoom: 14 });

		// on a regular basis, add more coordinates from the saved list and update the map
		let i = 0;
		const intervalDuration = 50;
		const timer = window.setInterval(() => {
			if (i < coordinates.length) {
				dataToDisplay.features[0].geometry.coordinates.push(coordinates[i]);
				map.getSource('animateGpxSource').setData(dataToDisplay);
				map.panTo(coordinates[i]);
				i++;
			} else {
				window.clearInterval(timer);
			}
		}, intervalDuration);
	}

	export function updateFilteredRouteFeaturesData(start, end, routeFeaturesData) {
		let filteredRouteFeaturesData = routeFeaturesData.filter((item) => {
			const itemLength = item.length;
			return itemLength >= 100 * start && itemLength <= 100 * end;
		});
		console.log(filteredRouteFeaturesData);
		return filteredRouteFeaturesData;
	}

	export function updateGroupedFilteredRouteFeatures(filteredRouteFeaturesData) {
		let groupedFilteredRouteFeaturesData = {};
		filteredRouteFeaturesData.forEach((feature) => {
			if (!groupedFilteredRouteFeaturesData[feature.subclass]) {
				groupedFilteredRouteFeaturesData[feature.subclass] = [];
			}
			groupedFilteredRouteFeaturesData[feature.subclass].push(feature);
		});
		console.log(groupedFilteredRouteFeaturesData);
		return groupedFilteredRouteFeaturesData;
	}

	export function updateMidPointFilter(filteredRouteFeaturesData, map) {
		var selectedIds = filteredRouteFeaturesData.map((feature) => feature.id);
		var filter = ['in', 'id'].concat(selectedIds);
		map.setFilter('route_midpoint', filter);
	}

	export function getMapZoom(map) {
		console.log(map.getZoom())
		return map.getZoom();
		
	}
</script>
