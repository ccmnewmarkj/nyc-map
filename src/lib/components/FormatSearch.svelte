<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		map,
		selectedFormat,
		selectedAudience,
		selectedLanguage,
		directoryData,
		filteredDirectory,
		selectedOutlet,
		popup
	} from '$lib/stores.js';

	// List of formats for dropdown menu:
	// Show all options when no other filter is applied
	let formatList;
	$: if (!$selectedAudience && !$selectedLanguage) {
		formatList = [
			...new Set(
				$directoryData.features
					?.map((d) => d.properties['PRIMARY FORMAT'])
					?.flatMap((d) => d)
					.sort()
			)
		];
	} else {
		formatList = [
			...new Set(
				$filteredDirectory.features
					?.map((d) => d.properties['PRIMARY FORMAT'])
					?.flatMap((d) => d)
					.sort()
			)
		];
	}

	// Selected values in dropdown remain in place even after going to another panel
	let value = $selectedFormat;

	// Change icon color when filter is applied
	let formatIconState;
	$: if (value) {
		formatIconState = '#e2a200';
	} else {
		formatIconState = '#333';
	}

	// Text above filter dropdown
	let formatHeader;

	$: formatIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill=${formatIconState}><path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm-50-100 160-100-160-100v200Zm-430 20v-480 480Z"/></svg>`;

	$: formatHeader = $selectedFormat
		? `<span class="filter-field-label">${formatIcon} Search by primary format </span>
				<p class="filter-field-description">
					Only one format can be selected at a time.
				</p>
				`
		: `<span class="filter-field-label">${formatIcon} Search by primary format <span style="font-weight: 400;">(${formatList.length} options)</span></span><p class="filter-field-description">
					Only one format can be selected at a time.
				</p>`;

	// Clear/reset any value(s) in format filter (and store) when an outlet is selected
	$: if ($selectedOutlet) {
		value ? (value = undefined) : null; // clear selected value(s) in filter
		$selectedFormat ? ($selectedFormat = undefined) : null; // clear store
	}

	// Clear filter when map reset button selected
	// $: if ($selectedFormat === undefined) {
	// 	value = undefined;
	// }

	// Clear filter when map reset button selected
	$: if ($selectedFormat === undefined) {
		value = undefined;
	} else if ($selectedFormat) {
		// Set format based on map legend selection
		value = { value: $selectedFormat, label: $selectedFormat };
	}
</script>

<form>
	<label for="format-search" class="filter-name">
		<span class:active={$selectedFormat}>{@html formatHeader}</span>
	</label>
	<Select
		id="format-search"
		--border-focused="1px solid rgba(var(--cerulean), 0.75)"
		--item-hover-bg="rgba(var(--cerulean), 0.1)"
		items={formatList}
		placeholder="Select primary format"
		bind:value
		on:focus={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
		}}
		on:change={() => {
			$selectedFormat = value.value;
		}}
		on:clear={() => {
			$popup?.remove();
			$selectedFormat = undefined;
			//$filteredDirectory = $directoryData;
		}}
	/>
</form>

<style>
	label {
		font-family: 'Roboto Condensed', sans-serif;
		text-transform: uppercase;
	}

	.filter-name {
		font-weight: 800;
		font-size: 0.85rem;
	}
</style>
