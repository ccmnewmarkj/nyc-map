<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		map,
		popup,
		directoryData,
		selectedOutlet,
		selectedFormat,
		selectedAudience,
		selectedLanguage
	} from '$lib/stores.js';

	const outletNames = $directoryData.features
		?.filter((d) => d.geometry['coordinates'][0])
		.map((d) => d.properties['OUTLET']);
	// Selected values in dropdown remain in place even after going to another panel
	let value = $selectedOutlet;

	// Zoom to outlet location on map when outlet name is selected
	let lng;
	let lat;
	function flyTo(zoom, center) {
		$map.flyTo({
			zoom: zoom,
			center: center,
			essential: true
		});
	}

	// Highlight selected outlet on map
	function highlightOutlet() {
		if ($selectedOutlet) {
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 0.25);
		}
	}

	// When accordion is closed, any selected outlet will be cleared
	function toggleAccordion() {
		if ($selectedOutlet) {
			value = undefined;
			$selectedOutlet = undefined;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'OUTLET', '']);
		}
	}

	// Clear any selected filter values when an outlet has been selected (in search box) (and vice versa)
	$: if ($selectedOutlet === undefined) {
		value = undefined;
	}
</script>

<details on:toggle={toggleAccordion} open>
	<summary>Search by Outlet</summary>

	<div class="content">
		<p style="padding-bottom: 0.75rem;">
			Look for an outlet on the map, out of the <strong
				>{$directoryData.features.filter((d) => d.geometry['coordinates'][0]).length}</strong
			> with known locations. The map will then zoom in to its location. Select the highlighted marker
			for more details about the outlet.
		</p>

		<Select
			id="outlet-search"
			items={outletNames}
			placeholder="Find outlet name"
			bind:value
			on:change={() => {
				$selectedFormat ? ($selectedFormat = undefined) : null;
				$selectedAudience ? ($selectedAudience = undefined) : null;
				$selectedLanguage ? ($selectedLanguage = undefined) : null;
				$selectedOutlet = value?.value;
				$popup?.remove();

				lng = $directoryData.features
					?.filter((d) => d.properties['OUTLET'] === $selectedOutlet)
					.map((d) => d.geometry.coordinates[0]);
				lat = $directoryData.features
					?.filter((d) => d.properties['OUTLET'] === $selectedOutlet)
					.map((d) => d.geometry.coordinates[1]);

				flyTo(10, [lng, lat]);
				// $directoryData.features.map((d) => d.properties['LATITUDE'])[0] !== undefined
				// 	? flyTo(10, [lng, lat])
				// 	: null;
			}}
			on:change={highlightOutlet}
			on:clear={() => {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'OUTLET', '']);
			}}
		/>
	</div>
	<p class="content" style="font-size: 0.8rem; padding-top: 0; color: #6d6d6d;">
		{#if $selectedOutlet}
			To reset the selected outlet and corresponding highlighted circle, select the "Clear outlet"
			button that appears on the map.
		{:else}
			When an outlet is selected, any applied filters above will be cleared.
		{/if}
	</p>
</details>

<style>
	/* accordion styles from https://css-tricks.com/how-to-animate-the-details-element/ */
	details {
		box-sizing: border-box;
		background-color: var(--alice-blue-light);
	}

	details > summary {
		padding: 0.5rem;
		background-color: var(--blue-gray);
		font-weight: 600;
		color: white;
		cursor: pointer;
		font-family: 'Roboto Condensed', sans-serif;
		text-transform: uppercase;
	}

	/* space between arrow and text */
	summary::before {
		content: '\2008';
	}

	/* style arrow marker */
	summary::-webkit-details-marker {
		color: var(--yellow-orange);
	}
	summary::marker {
		color: var(--yellow-orange);
	}

	details[open] > summary:before {
		transform: rotate(90deg);
	}

	details > .content {
		font-size: 0.8rem;
		padding: 0.75rem;
	}
</style>
