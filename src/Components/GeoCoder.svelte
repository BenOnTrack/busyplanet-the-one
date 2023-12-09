in @types: declare module '@maplibre/maplibre-gl-geocoder';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';

// GeoCoder
		// Geolocate all features within bookmarks
		const customLocalGeocoder = (query, callback) => {
				// Implement your custom geocoding logic here
				// For example, search for features in a GeoJSON file
				const results = bookmarks.features.filter((feature) =>
					feature.properties.name.toLowerCase().includes(query.toLowerCase())
				);

				callback(null, results);
			};
		var GeoApi = {
      forwardGeocode: () => { return { features: [] } },
      reverseGeocode: () => { return { features: [] } }
    }
    
    map.addControl(new MaplibreGeocoder(GeoApi,{
				popup: true,
				marker: false,
				localGeocoder: customLocalGeocoder,
				localGeocoderOnly: true,
				maplibregl: maplibre
			}));
