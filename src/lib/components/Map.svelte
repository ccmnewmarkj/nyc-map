<script>
	// Import components
	import ResetMap from '$lib/components/ResetMap.svelte';
	import PolygonToggle from '$lib/components/PolygonToggle.svelte';
	import Legend from '$lib/components/MapLegend.svelte';
	import Vis from '$lib/components/Visualizations.svelte';
	import Draggable from '$lib/components/Draggable.svelte';

	// Import icon components
	import NYCIcon from '$lib/components/icons/NYC.svelte';
	import CloseFilledIcon from './icons/CloseCircleFilled.svelte';
	import PlusIcon from './icons/PlusCircle.svelte';
	import BarChartOpenIcon from './icons/BarChartOpen.svelte';
	import BarChartCloseIcon from './icons/BarChartClose.svelte';
	import InsetMapOpenIcon from './icons/InsetMapOpen.svelte';
	import InsetMapCloseIcon from './icons/InsetMapClose.svelte';

	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

	// Import stores
	import {
		map,
		popup,
		directoryData,
		filteredDirectory,
		selectedOutlet,
		countyPolygons,
		ntaPolygons,
		selectedFormat,
		selectedAudience,
		selectedLanguage
	} from '$lib/stores.js';

	// Import transition
	import { fade, slide } from 'svelte/transition';

	let mapContainer;
	const centerMap = { lng: -74, lat: 40.7 };

	mapboxgl.accessToken =
		'pk.eyJ1IjoiamVuY2hlIiwiYSI6ImNsdDlhNWNtdTBnOXEybW5wMmxxMDRneGMifQ.-aAXBbQZGsiJeZ-zvOXJQA';

	// Restrict panning to NYC area bounds
	const mapBounds = [
		[-75.2, 39.17], // SW corner of the bounds
		[-71.66, 42.5] // NE corner of the bounds
	];

	// Sidebar
	export let sidebarVisible;
	let globePadding;

	// On desktop, shift map to the right when sidebar is visible
	$: if (sidebarVisible) {
		globePadding = { left: 400 };
	} else {
		globePadding = { left: 0 };
	}

	// Reset button
	let initialCenterLng;
	let movedCenterLng;

	let isMobile;

	// Color by format
	const newspaperFormat = '250, 112, 112',
		tvFormat = '64, 162, 227',
		// radioFormat = '168, 136, 181',
		// radioFormat = '165, 148, 249',
		radioFormat = '177, 156, 217',
		// magazineFormat = '115, 144, 114',
		magazineFormat = '114, 191, 120',
		digitalFormat = '255, 201, 74',
		// digitalFormatText = '244, 194, 81',
		digitalFormatText = '250, 177, 47',
		otherFormat = '179, 200, 207';

	onMount(() => {
		isMobile =
			/Android|BlackBerry|IEMobile|iPod|iPhone|Opera Mini|webOS/i.test(navigator.userAgent) &&
			!/iPad|Tablet/i.test(navigator.userAgent) &&
			window.matchMedia('(max-width: 768px)').matches;

		// Set up map via store
		map.set(
			new mapboxgl.Map({
				container: mapContainer,
				accessToken: mapboxgl.accessToken,
				style: 'mapbox://styles/jcccm/cm39p365y01n401pdemnr46zj',
				center: [centerMap.lng, centerMap.lat],
				minZoom: 5,
				zoom: 7.25,
				maxZoom: 14
			})
		);

		// Zoom controls
		$map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

		// Add inset map
		const insetMap = new mapboxgl.Map({
			container: 'mapInset',
			style: 'mapbox://styles/mapbox/dark-v10',
			center: [centerMap.lng, centerMap.lat],
			zoom: 4.5, // starting zoom
			hash: false,
			interactive: false,
			attributionControl: false
		});

		let initLoad = true;

		//Helper functions for inset map
		function getInsetBounds() {
			let bounds = $map.getBounds();

			let boundsJson = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[bounds._sw.lng, bounds._sw.lat],
									[bounds._ne.lng, bounds._sw.lat],
									[bounds._ne.lng, bounds._ne.lat],
									[bounds._sw.lng, bounds._ne.lat],
									[bounds._sw.lng, bounds._sw.lat]
								]
							]
						}
					}
				]
			};

			if (initLoad) {
				addInsetLayer(boundsJson);
				initLoad = false;
			} else {
				updateInsetLayer(boundsJson);
			}
		}

		function addInsetLayer(bounds) {
			insetMap.addSource('boundsSource', {
				type: 'geojson',
				data: bounds
			});

			insetMap.addLayer({
				id: 'boundsLayer',
				type: 'fill',
				source: 'boundsSource',
				layout: {},
				paint: {
					'fill-color': '#fff',
					'fill-opacity': 0.15
				}
			});
			// Add a black outline around the polygon.
			insetMap.addLayer({
				id: 'outlineLayer',
				type: 'line',
				source: 'boundsSource',
				layout: {},
				paint: {
					'line-color': 'rgb(111, 196, 236)', // blue
					'line-width': 1
				}
			});
		}

		function updateInsetLayer(bounds) {
			insetMap.getSource('boundsSource').setData(bounds);
		}

		// Geocoder
		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			placeholder: 'Enter city or address',
			mapboxgl: mapboxgl,
			// marker: true,
			marker: {
				color: '#ff8200' // '#3189CB'
			},
			zoom: 10,
			countries: 'us',
			bbox: [-79.76, 40.48, -71.79, 45.02]
		});

		// Add geocoder to HTML element for tabbing order
		let geocoderEl = document.querySelector('.geocoder-container');
		geocoderEl.appendChild(geocoder.onAdd($map));

		// Add ID to geocoder
		const inputElement = document.querySelector('input[class="mapboxgl-ctrl-geocoder--input"]');
		inputElement.setAttribute('id', 'geocoder');

		$map.on('load', () => {
			///////////////////////////
			// POLYGONS
			///////////////////////////

			// Add county polygons
			$map.addSource('counties', {
				type: 'geojson',
				data: $countyPolygons
			});

			// Add border for county polygons
			$map.addLayer({
				id: 'county-border-layer',
				type: 'line',
				source: 'counties',
				layout: {},
				paint: {
					'line-color': 'rgba(81, 130, 155, 0.75)',
					'line-width': {
						base: 0,
						stops: [
							[5, 0],
							[6, 0.5]
							// [8, 0.75],
							//[10, 0.75]
						]
					}
				}
			});

			// Add data for county labels at centroid
			$map.addSource('countyLabels', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $countyPolygons?.features.map((d) => ({
						type: 'Feature',
						properties: {
							// name: `${d.properties.name.split(' County')[0]}`
							name: `${d.properties.name.split(',')[0]}`
						},
						geometry: {
							type: 'Point',
							coordinates: d.centroid.geometry.coordinates
						}
					}))
				}
			});

			// Add county labels
			$map.addLayer({
				id: 'county-labels',
				type: 'symbol',
				source: 'countyLabels',
				layout: {
					'text-field': ['get', 'name'],
					'text-font': ['DIN Offc Pro Italic'],
					'text-offset': [0, 0],
					'text-anchor': 'center',
					'text-size': {
						base: 0,
						stops: [
							[5, 10],
							[8, 14],
							[11, 18]
						]
					}
				},
				paint: {
					'text-color': 'rgba(81, 130, 155, 1)'
				}
			});

			// Add metro area polygons
			$map.addSource('nta', {
				type: 'geojson',
				data: $ntaPolygons
			});

			// Add fill color for metro area
			$map.addLayer({
				id: 'nta-layer',
				type: 'fill',
				source: 'nta',
				layout: {},
				paint: {
					'fill-color': 'transparent',
					'fill-opacity': 0.05
				}
			});

			// Add border for NTA polygons
			$map.addLayer({
				id: 'nta-border-layer',
				type: 'line',
				source: 'nta',
				layout: {},
				paint: {
					'line-color': 'rgba(226, 162, 0, 1)',
					'line-width': {
						base: 0,
						stops: [
							[5, 0],
							[6, 0.5]
							// [5, 0.25],
							// [6, 0.75],
							// [8, 1]
						]
					}
				}
			});

			// Add data for NTA labels at centroid
			$map.addSource('ntaLabels', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $ntaPolygons.features?.map((d) => ({
						type: 'Feature',
						properties: {
							ntaname: `${d.properties.ntaname}`
						},
						geometry: {
							type: 'Point',
							coordinates: d.centroid.geometry.coordinates
						}
					}))
				}
			});

			// Add NTA labels
			$map.addLayer({
				id: 'nta-labels',
				type: 'symbol',
				source: 'ntaLabels',
				layout: {
					'text-field': ['get', 'ntaname'],
					'text-font': ['DIN Offc Pro Italic'],
					'text-offset': [0, 0],
					'text-anchor': 'center',
					'text-size': {
						base: 0,
						stops: [
							[5, 0],
							[8, 10],
							[11, 14]
							// [5, 10],
							// [8, 14],
							// [11, 18]
						]
					}
				},
				paint: {
					'text-color': 'rgba(166, 92, 2, 1)'
				}
			});

			// Hide county polygons on initial load
			//$map?.setLayoutProperty('county-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-labels', 'visibility', 'none');

			// Hide NTA polygons on initial load
			$map?.setLayoutProperty('nta-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('nta-labels', 'visibility', 'none');

			///////////////////////////
			// POINTS
			///////////////////////////

			// Add markers for outlets
			$map.addSource('outlets', {
				type: 'geojson',
				data: $directoryData
			});

			$map.addLayer({
				id: 'outlet-layer',
				type: 'circle',
				source: 'outlets',
				paint: {
					'circle-radius': {
						base: 1.75,
						stops: [
							[8, 6],
							[15, 10]
						]
					},
					'circle-stroke-width': 1.5,
					'circle-stroke-color': 'white',
					'circle-color': [
						'match',
						['get', 'PRIMARY FORMAT'],
						'Newspaper',
						`rgba(${newspaperFormat}, 1)`,
						'TV',
						`rgba(${tvFormat}, 1)`,
						'Radio',
						`rgba(${radioFormat}, 1)`,
						'Magazine',
						`rgba(${magazineFormat}, 1)`,
						'Digital-only',
						`rgba(${digitalFormat}, 1)`,
						/* other */ `rgba(${otherFormat}, 1)`
					]
				}
			});

			// Cursor becomes pointer when on point
			$map.on('mouseenter', 'outlet-layer', () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// Cursor goes back to default off point
			$map.on('mouseleave', 'outlet-layer', () => {
				$map.getCanvas().style.cursor = '';
			});

			// Same for outlet search layer
			$map.on('mouseenter', 'outlet-search-layer', () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			$map.on('mouseleave', 'outlet-search-layer', () => {
				$map.getCanvas().style.cursor = '';
			});

			///////////////////////////
			// HIGHLIGHTED OUTLET from Outlet Search
			///////////////////////////

			$map.addLayer({
				id: 'outlet-search-layer',
				type: 'circle',
				source: 'outlets',
				paint: {
					'circle-radius': {
						base: 1.75,
						stops: [
							[8, 7],
							[15, 24]
						]
					},
					//'circle-radius': 8,
					'circle-stroke-width': 2.5,
					'circle-stroke-color': 'yellow',
					'circle-color': [
						'match',
						['get', 'PRIMARY FORMAT'],
						'Newspaper',
						`rgba(${newspaperFormat}, 1)`,
						'TV',
						`rgba(${tvFormat}, 1)`,
						'Radio',
						`rgba(${radioFormat}, 1)`,
						'Magazine',
						`rgba(${magazineFormat}, 1)`,
						'Digital-only',
						`rgba(252, 199, 55, 1)`,
						/* other */ `rgba(${otherFormat}, 1)`
					]
				}
			});

			// Initially hide all markers in outlet-search-layer
			// When outlet name is selected, circle will be in different opacity
			$map.setFilter('outlet-search-layer', ['in', 'OUTLET', '']);

			///////////////////////////
			// POPUP
			///////////////////////////

			$map.on('click', ['outlet-layer', 'outlet-search-layer'], (e) => {
				const coordinates = e.features[0].geometry.coordinates.slice();

				// "Ensure that if the map is zoomed out such that multiple
				// copies of the feature are visible, the popup appears
				// over the copy being pointed to."
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				// Background of header section based on format
				let popupColor =
					{
						Newspaper: newspaperFormat,
						TV: tvFormat,
						Radio: radioFormat,
						Magazine: magazineFormat,
						'Digital-only': digitalFormat
					}[e.features[0].properties['PRIMARY FORMAT']] || otherFormat;

				// Icon source: https://iconoir.com/
				const openLinkIcon = `
				<svg
				aria-label="Open website in a new tab"
					width="14px"
					height="14px"
					viewBox="0 0 24 24"
					stroke-width="2.1"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					color="rgba(var(--black), 1)"
					><path
						d="M21 3L15 3M21 3L12 12M21 3V9"
						stroke="rgba(${popupColor}, 1)"
						stroke-width="2.1"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H11"
						stroke="rgba(${popupColor}, 1)"
						stroke-width="2.1"
						stroke-linecap="round"
					></path></svg
				>
				`;

				const infoIcon = `
				<svg
				aria-hidden="true"
					width="12px"
					height="12px"
					stroke-width="2.5"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					color="rgba(var(--black), 1)"
					><path
						d="M12 11.5V16.5"
						stroke="rgba(var(--black), 1)"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M12 7.51L12.01 7.49889"
						stroke="rgba(var(--black), 1)"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
						stroke="rgba(var(--black), 1)"
						stroke-width="2.1"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
				`;

				// Conditional popup values
				let yearFoundedValue = e.features[0].properties['FOUNDED']
					? ` • <span style="font-weight: 400;">Since ${e.features[0].properties['FOUNDED']}</span>`
					: '';

				let communityLabelValue;
				if (
					e.features[0].properties['TARGET ETHNICITY'] ||
					e.features[0].properties['TARGET RELIGION'] ||
					e.features[0].properties['TARGET THEME']
				) {
					communityLabelValue =
						// JSON.parse(e.features[0].properties['TARGET ETHNICITY'])?.length > 1 ||
						// JSON.parse(e.features[0].properties['TARGET RELIGION'])?.length > 1 ||
						// JSON.parse(e.features[0].properties['TARGET THEME'])?.length > 1
						e.features[0].properties['TARGET ETHNICITY']?.includes(',') ||
						e.features[0].properties['TARGET RELIGION']?.includes(',') ||
						e.features[0].properties['TARGET THEME']?.includes(',') ||
						(e.features[0].properties['TARGET ETHNICITY'] &&
							e.features[0].properties['TARGET RELIGION']) ||
						(e.features[0].properties['TARGET ETHNICITY'] &&
							e.features[0].properties['TARGET RELIGION'] &&
							e.features[0].properties['TARGET THEME']) ||
						(e.features[0].properties['TARGET ETHNICITY'] &&
							e.features[0].properties['TARGET THEME']) ||
						(e.features[0].properties['TARGET RELIGION'] &&
							e.features[0].properties['TARGET THEME'])
							? 'Communities'
							: 'Community';
				}

				let locationLabelValue;
				if (e.features[0].properties['TARGET LOCATION']) {
					locationLabelValue = 'Reach';
				}

				let primaryLanguageLabelValue =
					JSON.parse(e.features[0].properties['PRIMARY LANGUAGE']).length > 1
						? 'Primary Languages'
						: 'Primary Language';

				let additionalLanguageLabelValue;
				if (e.features[0].properties['ADDITIONAL LANGUAGE']) {
					additionalLanguageLabelValue =
						JSON.parse(e.features[0].properties['ADDITIONAL LANGUAGE'])?.length > 1
							? 'Additional Languages'
							: 'Additional Language';
				}

				let linkValue = e.features[0].properties['URL']
					? `<a href="${e.features[0].properties['URL']}" target="_blank" class="popup-link-btn" style="color: rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1); border: 1px solid rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1); box-shadow: rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 0.25) 0 -2px 0 inset;"  onmouseover="this.style.boxShadow='rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 0.5) 0 -2px 0 inset';"
   onmouseout="this.style.boxShadow='rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 0.25) 0 -2px 0 inset';">Visit Website ${openLinkIcon}</a>`
					: '';

				let locationNotes =
					e.features[0].properties['LOCATION STATUS'] == 'Location approximate' ||
					e.features[0].properties.duplicateCoords
						? `${infoIcon} Map location is approximate`
						: '';

				// POPUP CONTENT
				const popupContent = `
				
			<div class="popup-header ${e.features[0].properties['REGION'] === 'NYC' ? 'nyc' : e.features[0].properties['REGION'] === 'NYS' ? 'nys' : e.features[0].properties['REGION'] === 'LI' ? 'li' : e.features[0].properties['REGION'] === 'NJ' ? 'nj' : 'ct'}" style="background-color: ${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? `rgba(${popupColor}, 0.75)` : `rgba(${popupColor}, 0.5)`};">
				<p class="popup-outlet-name">${e.features[0].properties['OUTLET']}</p>
				<p class="popup-location">
					${e.features[0].properties['CITY']}, 
					${e.features[0].properties['STATE'] === 'New York' ? 'NY' : e.features[0].properties['STATE'] === 'New Jersey' ? 'NJ' : e.features[0].properties['STATE'] === 'Connecticut' ? 'CT' : e.features[0].properties['STATE']} 
					${yearFoundedValue}
				</p>
			</div>

			<div class="popup-body">

				<div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm-50-100 160-100-160-100v200Zm-430 20v-480 480Z"/></svg> Primary Format</p>
					<p class="popup-category-value">${e.features[0].properties['PRIMARY FORMAT']}</p>
				</div>

					 ${
							e.features[0].properties['TARGET ETHNICITY'] &&
							!e.features[0].properties['TARGET RELIGION'] &&
							!e.features[0].properties['TARGET THEME']
								? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET ETHNICITY']).join(', ')}</p>
				</div>`
								: e.features[0].properties['TARGET ETHNICITY'] &&
									  e.features[0].properties['TARGET RELIGION'] &&
									  !e.features[0].properties['TARGET THEME']
									? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET ETHNICITY']).join(', ')}, ${JSON.parse(e.features[0].properties['TARGET RELIGION']).join(', ')}</p>
				</div>`
									: e.features[0].properties['TARGET ETHNICITY'] &&
										  e.features[0].properties['TARGET RELIGION'] &&
										  e.features[0].properties['TARGET THEME']
										? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET ETHNICITY']).join(', ')}, ${JSON.parse(e.features[0].properties['TARGET RELIGION']).join(', ')}, ${JSON.parse(e.features[0].properties['TARGET THEME']).join(', ')}</p>
				</div>`
										: e.features[0].properties['TARGET ETHNICITY'] &&
											  !e.features[0].properties['TARGET RELIGION'] &&
											  e.features[0].properties['TARGET THEME']
											? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET ETHNICITY']).join(', ')}, ${JSON.parse(e.features[0].properties['TARGET THEME']).join(', ')}</p>
				</div>`
											: !e.features[0].properties['TARGET ETHNICITY'] &&
												  e.features[0].properties['TARGET RELIGION'] &&
												  e.features[0].properties['TARGET THEME']
												? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET RELIGION']).join(', ')}, ${JSON.parse(e.features[0].properties['TARGET THEME']).join(', ')}</p>
				</div>`
												: !e.features[0].properties['TARGET ETHNICITY'] &&
													  e.features[0].properties['TARGET RELIGION'] &&
													  !e.features[0].properties['TARGET THEME']
													? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET RELIGION']).join(', ')}</p>
				</div>`
													: !e.features[0].properties['TARGET ETHNICITY'] &&
														  !e.features[0].properties['TARGET RELIGION'] &&
														  e.features[0].properties['TARGET THEME']
														? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET THEME']).join(', ')}</p>
				</div>`
														: ''
						}

${
	e.features[0].properties['TARGET LOCATION']
		? `<hr class="outlet-card-divider" /><div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/></svg></svg> ${locationLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['TARGET LOCATION']).join(', ')}</p>
				</div>`
		: ''
}

				<hr class="outlet-card-divider" />

				<div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" height="15px" viewBox="0 -960 960 960" width="15px" fill="rgba(${e.features[0].properties['PRIMARY FORMAT'] === 'Digital-only' ? digitalFormatText : popupColor}, 1)"><path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z" /></svg> ${primaryLanguageLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['PRIMARY LANGUAGE']).join(', ')}</p>
				</div>

			<hr class="outlet-card-divider" />

				${linkValue}
			</div>

			<div class="popup-footer" style="background-color: rgba(${popupColor}, 0.15);">
				${locationNotes}
			</div>
				
				`;

				popup.set(new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo($map));
			});

			///////////////////////////
			// RESET MAP + MOBILE
			///////////////////////////

			// Establish initial center longtitude value
			initialCenterLng = $map?.getCenter().lng;
			movedCenterLng = $map?.getCenter().lng;

			// ...to determine when map has been panned/zoomed (i.e. when center longitude value has changed) for setting conditional styling on reset map button
			$map.on('move', () => {
				movedCenterLng = $map?.getCenter().lng;

				// Restrict panning to bounds
				$map?.setMaxBounds(mapBounds);

				// Update inset map bounds
				getInsetBounds();
			});

			$map.on('click', () => {
				// Hide sidebar on mobile if map touched
				if (
					window.matchMedia('(max-width: 480px), (max-height: 480px)').matches &&
					sidebarVisible
				) {
					sidebarVisible = false;
				}

				// If vis popup visible, touching map will close the popup
				// toggleVis ? (toggleVis = false) : null;
			});

			// For mobile
			if (window.matchMedia('(max-width: 512px)').matches) {
				// set bounds
				// $map.fitBounds([
				// 	[-79.75, 40.5],
				// 	[-72, 45]
				// ]);

				// set zoom level
				$map.setZoom(8);
			}

			// "Disable map rotation using right click + drag"
			$map.dragRotate.disable();

			// "Disable map rotation using touch rotation gesture"
			$map.touchZoomRotate.disableRotation();
		});
	});

	onDestroy(() => {
		if ($map) {
			$map.remove();
		}
	});

	// Update globe padding depending on state of sidebar
	$: if (!isMobile)
		$map?.easeTo({
			padding: globePadding,
			duration: 1000
		});

	// Polygon toggles
	export let showCounties = false;
	export let showNTAs = false;

	// Highlight selected outlet circle on map
	$: if ($selectedOutlet) {
		$map.setFilter('outlet-search-layer', ['any', ['in', $selectedOutlet, ['get', 'OUTLET']]]);
	}

	// Toggle on-screen map elements (excludes "clear filters" and "reset" buttons)
	let mapElementsVisible = true;

	// Toggle (show/hide) vis
	let toggleVis = false;

	// Toggle option to drag vis panel
	let toggleDrag = false;

	// Toggle inset map
	let toggleInsetMap = true;

	// Change color of close button icon on hover
	let fillColor = 'rgba(var(--dark-cerulean), 1)';
</script>

<!-- Geocoder CSS -->
<svelte:head>
	<link
		rel="stylesheet"
		href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"
		type="text/css"
	/>
</svelte:head>

<!-- Map -->
<section id="map-container" aria-label="Map of media outlets across New York State">
	<div class="map" bind:this={mapContainer} />
</section>

<!-- Container for map elements -->
<section id="map-elements-container" aria-label="Map tools and features">
	<!-- Address search -->
	<div class="geocoder-container">
		<fieldset>
			<legend style="width: 85px; text-align: right; line-height: 1.15;"
				>Search by NYS location</legend
			>
			<!-- <div class="geocoder-container" tabindex="-1" role="searchbox" aria-label="search"> -->
		</fieldset>
	</div>

	<!-- Button + toggles + legend -->
	<div class="on-screen-elements-container">
		<button
			on:click|stopPropagation={() => (mapElementsVisible = !mapElementsVisible)}
			on:mouseover={() => (fillColor = 'rgba(var(--dark-cerulean), 0.9)')}
			on:mouseout={() => (fillColor = 'rgba(var(--dark-cerulean), 1)')}
			>Map Features
			{#if mapElementsVisible}
				<CloseFilledIcon
					width={'20px'}
					height={'20px'}
					{fillColor}
					iconTitle={'Hide the option to show neighborhood and county borders and the color legend for the map markers'}
				/>
			{:else}
				<PlusIcon
					width={'20px'}
					height={'20px'}
					fillColor={'rgba(var(--dark-cerulean), 1)'}
					iconTitle={'Show neighborhood and county borders toggle and marker color legend'}
				/>
			{/if}
		</button>

		<!-- Map elements to show/hide -->
		{#if mapElementsVisible}
			<div class="on-screen-elements" transition:slide={{ y: -200, duration: 500 }}>
				<!-- Toggle polygon filters -->
				<fieldset class="toggle-container">
					<legend class="sr-only">Geographic boundaries</legend>

					<PolygonToggle bind:checked={showNTAs} polygonType="Neighborhoods" />

					<PolygonToggle bind:checked={showCounties} polygonType="Counties" />
				</fieldset>

				<!-- <hr class="map-elements" style="top: 8.5rem;" /> -->

				<!-- Legend -->
				<div class="legend-container">
					<Legend {newspaperFormat} {tvFormat} {radioFormat} {magazineFormat} {digitalFormat} />
				</div>
			</div>
		{/if}
	</div>

	<!-- Button: Reset applied filters -->
	{#if $selectedFormat || $selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme || $selectedAudience?.geography || $selectedLanguage || $selectedOutlet}
		<div class="reset-container" transition:fade={{ duration: 100 }}>
			{#if $selectedFormat || $selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme || $selectedAudience?.geography || $selectedLanguage}
				<button
					aria-label="Clear any applied filters"
					on:click|stopPropagation={() => {
						$selectedFormat = undefined;
						$selectedAudience = undefined;
						$selectedLanguage = undefined;
						$selectedOutlet = undefined;
						$popup?.remove();
						$map.getSource('outlets').setData($filteredDirectory);
					}}
					>{#if ($selectedFormat && ($selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme)) || ($selectedFormat && $selectedLanguage) || (($selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme) && $selectedLanguage) || ($selectedAudience?.ethnicity && $selectedAudience?.religion) || ($selectedAudience?.ethnicity && $selectedAudience?.theme) || ($selectedAudience?.ethnicity && $selectedAudience?.geography) || ($selectedAudience?.religion && $selectedAudience?.theme) || ($selectedAudience?.religion && $selectedAudience?.geography) || ($selectedAudience?.theme && $selectedAudience?.geography)}Clear
						filters{:else}Clear filter{/if}
					<span style="color: rgba(var(--light-red), 1);">✕</span></button
				>
			{/if}

			<!-- Button: Reset highlighted outlet -->
			{#if $selectedOutlet}
				<button
					class="reset-selected-outlet"
					aria-label="Remove outlet selection"
					on:click|stopPropagation={() => {
						$selectedOutlet = undefined;
						$popup?.remove();
						$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
						$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
					}}
					>Clear outlet
					<span style="color: rgba(var(--yellow-orange), 1);">✕</span>
				</button>
			{/if}
		</div>
	{/if}
</section>

<section id="bottom-elements-container">
	<!-- Reset button -->
	{#if initialCenterLng?.toFixed(1) !== movedCenterLng?.toFixed(1)}
		<div class="reset-map-container" transition:fade={{ duration: 100 }}>
			RESET
			<br />MAP

			<ResetMap {centerMap} {isMobile}><NYCIcon /></ResetMap>
		</div>
	{/if}

	<!-- Visualizations -->
	{#if $filteredDirectory.features}
		<div class="vis-container">
			{#if !toggleVis}
				<div class="vis-btn-container">
					Show <br />Charts
					<button on:click={() => (toggleVis = !toggleVis)}><BarChartOpenIcon /></button>
				</div>
			{:else}
				<div class="vis-btn-container">
					Hide <br />Charts<button on:click={() => (toggleVis = !toggleVis)}
						><BarChartCloseIcon /></button
					>
				</div>

				{#if toggleDrag}
					<Draggable>
						<div class="vis-element-container">
							<Vis bind:toggleVis bind:toggleDrag />
						</div>
					</Draggable>
				{:else}
					<div class="vis-element-container">
						<Vis bind:toggleVis bind:toggleDrag />
					</div>
				{/if}
			{/if}
		</div>
	{/if}

	<!-- Inset map -->
	<div class="inset-container">
		{#if toggleInsetMap}
			<div class="inset-btn-container">
				Hide <br />mini map
				<button on:click={() => (toggleInsetMap = !toggleInsetMap)}><InsetMapCloseIcon /></button>
			</div>
		{:else}
			<div class="inset-btn-container">
				Show <br />mini map
				<button on:click={() => (toggleInsetMap = !toggleInsetMap)}><InsetMapOpenIcon /></button>
			</div>
		{/if}
		<div id="mapInset" style="display: visible" class:hideInsetMap={!toggleInsetMap}></div>
	</div>
</section>

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}

	#map-elements-container {
		position: absolute;
		top: 1rem;
		right: 10px;
		pointer-events: none;
	}

	/* geocoder */
	.geocoder-container {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.geocoder-container legend {
		font-family: 'Roboto Condensed', 'sans-serif;';
		text-transform: uppercase;
		font-size: 0.8rem;
		font-weight: 800;
		text-shadow:
			0 0 5px #fff,
			0 0 10px #fff,
			0 0 20px #fff,
			0 0 30px #fff,
			0 0 40px #fff;
	}

	.on-screen-elements-container,
	.legend-container,
	.reset-container {
		margin-left: auto;
		width: fit-content;
	}

	.on-screen-elements-container {
		margin-top: 1rem;
	}

	/* toggle button for showing/hiding polygon filters + legend*/
	.on-screen-elements-container button {
		padding: 3px 6px;
		margin-right: -5px;
		margin-left: auto;
		pointer-events: auto;
		display: flex;
		align-items: center;
		column-gap: 5px;
		font-size: 1rem;
		font-weight: 800;
		text-transform: uppercase;
		color: rgba(var(--dark-cerulean), 1);
		text-shadow:
			0 0 5px #fff,
			0 0 10px #fff,
			0 0 20px #fff,
			0 0 30px #fff,
			0 0 40px #fff;
	}

	.on-screen-elements {
		margin-right: 9px;
		padding-right: 10px;
		border-right: 1.5px dotted rgba(var(--dark-cerulean), 1);
	}

	/* toggle button for polygon filters */
	.toggle-container {
		margin-top: 0.4rem;
		pointer-events: auto;
		width: fit-content;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	/* legend */
	/* when filter applied or outlet selected */
	.legend-container,
	.reset-container {
		pointer-events: auto;
	}

	.legend-container {
		margin-top: 1rem;
	}

	/* when filter applied or outlet selected */
	.reset-container {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 10px;
	}

	button.reset-selected-outlet {
		box-shadow: rgba(var(--yellow-orange), 1) 0 -2px 0 inset;
	}

	button.reset-selected-outlet:hover {
		color: rgba(var(--yellow-orange), 1);
	}

	/* elements above zoom controls: vis, reset map */
	#bottom-elements-container {
		position: absolute;
		bottom: 100px;
		right: 10px;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		row-gap: 12px;
	}

	/* button-specific containers */
	.reset-map-container,
	.vis-btn-container,
	.inset-btn-container {
		margin-left: auto;
		width: fit-content;
		display: flex;
		flex-direction: column;
		align-items: end;
		text-align: right;
		text-transform: uppercase;
		line-height: 1;
		font-size: 0.75rem;
		font-weight: 600;
		font-family: 'Roboto Condensed', sans-serif;
	}

	/* reset map button */
	.reset-map-container {
		position: relative;
		bottom: 140px;
		text-shadow:
			0 0 5px #fff,
			0 0 10px #fff,
			0 0 20px #fff,
			0 0 30px #fff,
			0 0 40px #fff;
	}

	/* visualizations */
	.vis-container,
	.inset-container {
		position: relative;
		right: -2px !important;
	}

	.vis-btn-container,
	.inset-btn-container {
		/* Prevent vis window from jumping when toggling between dragging option */
		position: absolute;
		/* Reserve space for the buttons */
		/* width: 75px; */
		/* height: 60px; */
		right: 0;
	}

	.vis-btn-container {
		bottom: 65px;
	}

	.inset-btn-container {
		bottom: 5px;
		width: 75px;
	}

	.vis-btn-container button,
	.inset-btn-container button {
		background: rgba(var(--black), 1);
		border-radius: 20px;
		padding: 5px 5px 3px 5px;
		/* width: fit-content; */
		box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1); /* outer glow */
	}

	.vis-element-container {
		position: absolute;
		right: 60px;
		bottom: 90px;
		background-color: rgba(var(--white), 1);
		border-radius: 8px;
		box-shadow: 0 0 5px rgba(var(--black), 0.2);
		border: 0.5px solid rgba(var(--dark-cerulean), 0.75);
		width: 250px;
		height: 290px;
		overflow: hidden;
		z-index: 10;

		/* stack child divs vertically */
		display: flex;
		flex-direction: column;
	}

	/* .vis-element-container > .footer {
		font-family: 'DM Sans', sans-serif;
		background-color: rgba(var(--gold), 0.3);
		padding: 2px 5px;
		font-size: 11px;
		display: block;
		border-radius: 0 0 8px 8px;
	} */

	@media only screen and (max-device-width: 512px) {
		.geocoder-container {
			display: none;
		}

		.on-screen-elements-container {
			margin: 0;
		}

		.reset-map-container {
			bottom: 125px;
		}
	}

	fieldset {
		border: none;
		padding: 0;
	}

	fieldset.toggle-container {
		position: relative;
	}

	/* source: https://guides.18f.gov/accessibility/hidden-content/ */
	.sr-only {
		border: 0;
		clip: rect(0 0 0 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
	}

	/* map inset */
	#mapInset {
		bottom: -65px;
		right: 60px;
		height: 150px;
		width: 200px;
		position: absolute;
		pointer-events: none;
		border-radius: 4px;
		box-shadow: 0 0 5px rgba(var(--black), 0.75);
	}

	@media (max-width: 500px) {
		.vis-container,
		.inset-container {
			display: none;
		}
	}

	.hideInsetMap {
		display: none;
	}
</style>
