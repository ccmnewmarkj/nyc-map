<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		map,
		selectedLanguage,
		directoryData,
		filteredDirectory,
		selectedOutlet,
		popup
	} from '$lib/stores.js';

	// List of formats for dropdown menu
	$: languageList = [
		...new Set(
			$filteredDirectory.features
				?.map((d) => d.properties['PRIMARY LANGUAGE'])
				?.flatMap((d) => d) // to break apart ["Spanish", "English"] and retain both values
				.sort()
		)
	];

	// Selected values in dropdown remain in place even after going to another panel
	let value = $selectedLanguage;

	// Change icon color when filter is applied
	let languageIconState;
	$: if (value) {
		languageIconState = '#e2a200';
	} else {
		languageIconState = '#333';
	}

	// Text above filter dropdown
	let languageHeader;
	$: languageIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill=${languageIconState}><path
		d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"
	/></svg
>
`;

	$: languageHeader = $selectedLanguage
		? languageList.length > 1
			? languageList.length - value.length === 0
				? `<span class="filter-field-label">${languageIcon} Search by primary language <span style="font-weight: 400;">(No more options)</span></span>
					<p class="filter-field-description">
							Map shows ${filteredDirectory.length > 1 ? 'outlets that have' : 'the outlet that has'} content in the ${value.length} selected languages.
						</p>`
				: `
						<span class="filter-field-label">
							${languageIcon} Search by primary language <span style="font-weight: 400;">(${languageList.length - value.length} more ${languageList.length - value.length > 1 ? 'options' : 'option'})</span></span>
						<p class="filter-field-description">
							Selecting more than 1 language will show outlets that have content in all of those languages.
						</p>
					  `
			: `<span class="filter-field-label">
							${languageIcon} Search by primary language 
							
							</span>
						<p class="filter-field-description">
							No additional languages available.
						</p>`
		: // <span style="font-weight: 400;">(${languageList.length - value.length} more options)</span>
			//`<span class="filter-field-label" style="color: var(--gray);">${languageIcon} No additional languages available</span>`
			`
			<span class="filter-field-label">${languageIcon} Search by primary language <span style="font-weight: 400;">(${languageList.length} options)</span></span>
		  `;

	// Clear/reset any value(s) in language filter (and store) when an outlet is selected
	$: if ($selectedOutlet) {
		value ? (value = undefined) : null; // clear selected value(s) in filter
		$selectedLanguage ? ($selectedLanguage = undefined) : null; // clear store
	}

	// Clear value from dropdown when language filter is reset (via clear filter button)
	$: if ($selectedLanguage === undefined) {
		value = undefined;
	}
</script>

<form>
	<label for="language-search" class="filter-name">
		<span class:active={$selectedLanguage}>{@html languageHeader}</span></label
	>
	<Select
		id="language-search"
		--border-focused="1px solid rgba(var(--cerulean), 0.75)"
		--item-hover-bg="rgba(var(--cerulean), 0.1)"
		items={languageList}
		placeholder="Select primary language"
		multiple
		clearable={false}
		bind:value
		on:focus={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
		}}
		on:change={() => {
			$selectedLanguage = value.map((d) => d.value);
		}}
		on:clear={() => {
			$popup?.remove();
			if (value === undefined) {
				$selectedLanguage = undefined;
				//$filteredDirectory = $directoryData;
			} else {
				$selectedLanguage = value.map((d) => d.value);
			}
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
