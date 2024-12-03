<script>
	// Import components
	import Map from '$lib/components/Map.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	// Import icon components
	import ListIcon from '$lib/components/icons/ListOpen.svelte';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set state of sidebar
	let sidebarVisible = true;

	// Import data for county and NTA polygons
	import nta from '$lib/data/nta-simplified.json';
	import counties from '$lib/data/county-simplified.json';

	// Import directory data
	export let data; // Airtable directory data
	import { directoryData, filteredDirectory, countyPolygons, ntaPolygons } from '$lib/stores.js';

	// Create Turf modules
	import centroid from '@turf/centroid';

	import { onMount } from 'svelte';

	// Variable for checking for duplicate coordinates
	let longitudeValue;

	onMount(() => {
		// Set Airtable data to $directoryData store
		directoryData.set({
			type: 'FeatureCollection',
			features: data.airtableRecords
				.map((d) => {
					const obj = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [+d['LONGITUDE'], +d['LATITUDE']]
						},
						properties: {
							OUTLET: d['OUTLET'],
							URL: d['URL'],
							STATUS: d['STATUS'],
							CITY: d['CITY'],
							STATE: d['STATE'],
							'LOCATION STATUS': d['LOCATION STATUS'],
							'PRIMARY FORMAT': d['PRIMARY FORMAT'],
							FOUNDED: d['FOUNDED'],
							'TARGET LOCATION CATEGORY': d['TARGET LOCATION CATEGORY'],
							'TARGET LOCATION': d['TARGET LOCATION'],
							'TARGET COMMUNITY ETHNICITY': d['TARGET COMMUNITY ETHNICITY'],
							'TARGET ETHNICITY': d['TARGET ETHNICITY'],
							'TARGET COMMUNITY RELIGION': d['TARGET COMMUNITY RELIGION'],
							'TARGET RELIGION': d['TARGET RELIGION'],
							'TARGET COMMUNITY THEME': d['TARGET COMMUNITY THEME'],
							'TARGET THEME': d['TARGET THEME'],
							'PRIMARY LANGUAGE': d['PRIMARY LANGUAGE'],
							'ADDITIONAL LANGUAGE': d['ADDITIONAL LANGUAGE'],
							'DIRECTORY URL': d['DIRECTORY URL']
						}
					};
					return obj;
				})
				.filter((d) => d.properties['STATUS'] === 'Active')
				// When sorting only, remove "The ", "La ", or "El " from the beginning of outlet name for alphabetizing
				.sort((a, b) => {
					const nameA = a.properties['OUTLET'].replace(/^(The|La|El)\s+/i, '');
					const nameB = b.properties['OUTLET'].replace(/^(The|La|El)\s+/i, '');

					return nameA.localeCompare(nameB);
				})
		});

		// Check for duplicate coordinates
		$directoryData.features.forEach((d) => {
			longitudeValue = d.properties.LONGITUDE;
			if (
				$directoryData.features
					.filter((e) => e.properties['OUTLET'] !== d.properties['OUTLET'])
					.filter((e) => e.properties.LONGITUDE)
					.filter((e) => e.properties.LATITUDE === longitudeValue).length > 0
			) {
				// Add column indicating duplicate coordinates
				d.properties.duplicateCoords = true;
				// Nudge coordinates apart
				(d.geometry.coordinates[0] = d.geometry.coordinates[0] + (Math.random() - 0.5) * 0.002),
					(d.geometry.coordinates[1] = d.geometry.coordinates[1] + (Math.random() - 0.5) * 0.002);
			} else {
				d.properties.duplicateCoords = false;
			}
		});

		// Set filteredDirectory to include all outlets as its initial state
		filteredDirectory.set($directoryData);

		// COUNTIES
		// Add centroid point for polygon labels
		counties.features.forEach((d) => {
			d.centroid = centroid({
				type: 'Feature',
				geometry: d.geometry
			});
		});
		// Set polygons as feature collection
		countyPolygons.set(counties);

		// NTAs

		// Filter out null geometries
		nta.features = nta.features.filter((d) => d.geometry !== null);

		// Add centroid point for polygon labels
		nta.features.forEach((d) => {
			d.centroid = centroid({
				type: 'Feature',
				geometry: d.geometry
			});
		});

		// Set to store
		ntaPolygons.set(nta);
	});
</script>

<!-- Map -->
<Map bind:sidebarVisible />

<!-- Sidebar -->
<section id="sidebar-container" aria-labelledby="sidebar-title">
	{#if sidebarVisible}
		<div class="sidebar-content" transition:fade={{ duration: 300 }}>
			<Sidebar bind:sidebarVisible></Sidebar>
		</div>
	{:else}
		<!-- Sidebar toggle -->
		<button
			aria-label="Show sidebar"
			class="sidebar-collapsed"
			on:click|stopPropagation={() => (sidebarVisible = !sidebarVisible)}
		>
			<ListIcon />
		</button>
	{/if}
</section>

<style>
	.sidebar-content {
		position: relative;
		max-width: 375px;
		max-height: calc(100vh - 3rem);
		max-height: calc(100svh - 3rem);
		border-radius: 5px;
		background-color: rgba(255, 255, 255, 0.85);
		top: 0;
		z-index: 2; /* above zoom controls */
		margin: 1rem;
		box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 0.75px solid var(--blue-gray);
	}

	.sidebar-collapsed {
		position: absolute;
		top: 0;
		margin: 1rem; /* 2rem; */
		background-color: transparent;
		border: 0;
	}

	@media only screen and (max-device-width: 512px) {
		.sidebar-content {
			max-height: calc(100vh - 2rem);
			max-height: calc(100svh - 2rem);
		}
	}
</style>
