<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		filteredDirectory,
		selectedCommunity,
		directoryData,
		selectedOutlet,
		popup,
		map
	} from '$lib/stores.js';

	// List of communities for dropdown menu

	// $: communityList =
	// 	selectedCommunityType === 'ethnicity'
	// 		? [
	// 				...new Set(
	// 					(communityList = $filteredDirectory.features
	// 						?.filter((d) => d.properties['TARGET COMMUNITY ETHNICITY'])
	// 						.map((d) => d.properties['TARGET ETHNICITY'])
	// 						.flatMap((d) => d)
	// 						.sort())
	// 				)
	// 			]
	// 		: selectedCommunityType === 'religion'
	// 			? [
	// 					...new Set(
	// 						(communityList = $filteredDirectory.features
	// 							?.filter((d) => d.properties['TARGET COMMUNITY RELIGION'])
	// 							.map((d) => d.properties['TARGET RELIGION'])
	// 							.flatMap((d) => d)
	// 							.sort())
	// 					)
	// 				]
	// 			: selectedCommunityType === 'theme'
	// 				? [
	// 						...new Set(
	// 							(communityList = $filteredDirectory.features
	// 								?.filter((d) => d.properties['TARGET COMMUNITY THEME'])
	// 								.map((d) => d.properties['TARGET THEME'])
	// 								.flatMap((d) => d)
	// 								.sort())
	// 						)
	// 					]
	// 				: [];

	$: ethnicityList = [
		...new Set(
			$filteredDirectory.features
				?.filter((d) => d.properties['TARGET COMMUNITY ETHNICITY'])
				.map((d) => d.properties['TARGET ETHNICITY'])
				.flatMap((d) => d)
				.sort()
		)
	];
	$: religionList = [
		...new Set(
			$filteredDirectory.features
				?.filter((d) => d.properties['TARGET COMMUNITY RELIGION'])
				.map((d) => d.properties['TARGET RELIGION'])
				.flatMap((d) => d)
				.sort()
		)
	];
	$: themeList = [
		...new Set(
			$filteredDirectory.features
				?.filter((d) => d.properties['TARGET COMMUNITY THEME'])
				.map((d) => d.properties['TARGET THEME'])
				.flatMap((d) => d)
				.sort()
		)
	];

	let valueEthnicity;
	let valueReligion;
	let valueTheme;
	// Selected values in dropdown remain in place even after going to another panel
	//let value = $selectedCommunity;

	// Text above filter dropdown
	let communityHeader;
	const communityIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#686D76"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>
`;

	// FIX!!!
	$: communityHeader =
		// $selectedCommunity
		// 	? ethnicityList.length > 1
		// 		? ethnicityList.length - value.length === 0
		// 			? `<span class="filter-field-label" style="color: var(--gray);">${communityIcon} No additional communities available</span>`
		// 			: `
		// 				<span class="filter-field-label">${communityIcon} Search by community <span style="font-weight: 400;">(${ethnicityList.length - value.length} more)</span></span>
		// 				<p class="filter-field-description">Selecting more than 1 community will show outlets that serve all of those communities.</p>
		// 			  `
		// 		: `<span class="filter-field-label" style="color: var(--gray);">${communityIcon} No additional communities available</span>`
		// 	:
		`
			<span class="filter-field-label">${communityIcon} Search by community <span style="font-weight: 400;">(Choose a category)</span></span>
			<p class="filter-field-description">The number on the tabs indicate how many options are available.</p>
			
			`;

	// Clear/reset selected filter when outlet is selected
	$: if ($selectedOutlet) {
		valueEthnicity = undefined; // clear selected value in filter when outlet is selected
		valueReligion = undefined;
		valueTheme = undefined;
		$filteredDirectory = $directoryData; // reset filter options
	}

	// For opened dropdown menu to appear on top of other elements
	let floatingConfig = {
		strategy: 'fixed'
	};

	// Inline dropdown to select type of community and send selection to Filters.svelte (parent)

	let selectedCommunityType = 'ethnicity';
	export let communityType;

	function setType() {
		communityType = selectedCommunityType;
	}

	const buttonArray = [
		{
			value: 'ethnicity',
			text: 'Ethnicity'
		},
		{
			value: 'religion',
			text: 'Religion'
		},
		{
			value: 'theme',
			text: 'Theme'
		}
	];

	// Lengths for community type buttons

	$: ethnicityLength = [
		...new Set(
			$filteredDirectory.features
				.filter((d) => d.properties['TARGET COMMUNITY ETHNICITY'])
				.map((d) => d.properties['TARGET ETHNICITY'])
				.flatMap((d) => d)
		)
	].length;

	$: religionLength = [
		...new Set(
			$filteredDirectory.features
				.filter((d) => d.properties['TARGET COMMUNITY RELIGION'])
				.map((d) => d.properties['TARGET RELIGION'])
				.flatMap((d) => d)
		)
	].length;

	$: themeLength = [
		...new Set(
			$filteredDirectory.features
				.filter((d) => d.properties['TARGET COMMUNITY THEME'])
				.map((d) => d.properties['TARGET THEME'])
				.flatMap((d) => d)
		)
	].length;
	// $: ethnicityLength = $filteredDirectory.features.filter(
	// 	(d) => d.properties['TARGET COMMUNITY ETHNICITY']
	// ).length;
	// const religionLength = $filteredDirectory.features.filter(
	// 	(d) => d.properties['TARGET COMMUNITY RELIGION']
	// ).length;
	// const themeLength = $filteredDirectory.features.filter(
	// 	(d) => d.properties['TARGET COMMUNITY THEME']
	// ).length;

	$: console.log($selectedCommunity);
</script>

<form>
	<label for="community-search" class="filter-name">
		<span class:active={$selectedCommunity}>
			{@html communityHeader}
		</span>
	</label>

	<!-- Buttons for community categories (ethnicity, religion, theme) -->
	<div class="btn-container">
		{#each buttonArray as button}
			<button
				on:click|stopPropagation={() => {
					selectedCommunityType = button.value;
					//$selectedCommunity ? ($selectedCommunity = undefined) : null;
					// when selecting another button, clear any selected community
					// if (value) {
					// 	value = undefined;
					// 	$filteredDirectory = $directoryData; // reset dropdown list
					// }
				}}
				on:click={setType}
				class:active={selectedCommunityType === button.value}
				>{button.text}&nbsp;
				<span style="font-weight: 400;">
					({button.value === 'ethnicity'
						? ethnicityLength
						: button.value === 'religion'
							? religionLength
							: themeLength})</span
				></button
			>
		{/each}
	</div>

	{#if selectedCommunityType === 'ethnicity'}
		<Select
			{floatingConfig}
			--list-position="fixed"
			id="community-search"
			items={ethnicityList}
			placeholder="Select community"
			multiple
			clearable={false}
			bind:value={valueEthnicity}
			on:focus={() => {
				$selectedOutlet ? ($selectedOutlet = undefined) : null;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'OUTLET', '']);
			}}
			on:change={() => {
				$selectedCommunity = {
					ethnicity: valueEthnicity?.map((d) => d.value),
					religion: valueReligion?.map((d) => d.value),
					theme: valueTheme?.map((d) => d.value)
				};
			}}
			on:clear={() => {
				$popup?.remove();
				if (valueEthnicity === undefined) {
					$selectedCommunity.ethnicity = undefined;
					//$filteredDirectory = $directoryData;
				} else {
					$selectedCommunity = valueEthnicity.map((d) => d.value);
				}
			}}
		/>
	{/if}

	{#if selectedCommunityType === 'religion'}
		<Select
			{floatingConfig}
			--list-position="fixed"
			id="community-search"
			items={religionList}
			placeholder="Select community"
			multiple
			clearable={false}
			bind:value={valueReligion}
			on:focus={() => {
				$selectedOutlet ? ($selectedOutlet = undefined) : null;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'OUTLET', '']);
			}}
			on:change={() => {
				$selectedCommunity = {
					ethnicity: valueEthnicity?.map((d) => d.value),
					religion: valueReligion?.map((d) => d.value),
					theme: valueTheme?.map((d) => d.value)
				};
			}}
			on:clear={() => {
				$popup?.remove();
				if (valueReligion === undefined) {
					$selectedCommunity.religion = undefined;
				} else {
					$selectedCommunity = valueReligion.map((d) => d.value);
				}
				// if (valueReligion === undefined) {
				// 	$selectedCommunity.religion = undefined;
				// 	$filteredDirectory = $directoryData;
				// } else {
				// 	$selectedCommunity.religion = valueReligion.map((d) => d.value);
				// }
			}}
		/>
	{/if}

	{#if selectedCommunityType === 'theme'}
		<Select
			{floatingConfig}
			--list-position="fixed"
			id="community-search"
			items={themeList}
			placeholder="Select community"
			multiple
			clearable={false}
			bind:value={valueTheme}
			on:focus={() => {
				$selectedOutlet ? ($selectedOutlet = undefined) : null;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'OUTLET', '']);
			}}
			on:change={() => {
				$selectedCommunity = {
					ethnicity: valueEthnicity?.map((d) => d.value),
					religion: valueReligion?.map((d) => d.value),
					theme: valueTheme?.map((d) => d.value)
				};
			}}
			on:clear={() => {
				$popup?.remove();
				if (valueTheme === undefined) {
					$selectedCommunity.theme = undefined;
				} else {
					$selectedCommunity = valueTheme.map((d) => d.value);
				}
				// if (valueTheme === undefined) {
				// 	$selectedCommunity = undefined;
				// 	$filteredDirectory = $directoryData;
				// } else {
				// 	$selectedCommunity = valueTheme.map((d) => d.value);
				// }
			}}
		/>
	{/if}
</form>

<style>
	label {
		font-family: 'Roboto Condensed', sans-serif;
		text-transform: uppercase;
	}

	/* .community-label {
		display: flex;
		column-gap: 5px;
	} */

	.filter-name {
		font-weight: 800;
		font-size: 0.85rem;
	}

	/* community button group */
	.btn-container {
		display: flex;
		margin: auto;
		width: 98%;
		gap: 1px;
		/* border-top: 1px solid rgba(248, 181, 0, 0.5);
		border-bottom: 2px solid rgba(248, 181, 0, 0.45); */
	}

	button {
		background-color: var(--light-gray);
		font-size: 0.8rem;
		font-weight: 600;
		/* text-transform: uppercase; */
		padding: 5px 0;
		display: flex;
		justify-content: center;

		flex: 1; /* make buttons equal width */
		border-top: 2px solid white;
	}

	/*

	button:last-child {
		flex: 1.2; /* make the last button slightly larger
	}
*/

	/* button:not(:last-child) {
		border-right: 0.5px solid white;
	} */

	button.active {
		background-color: var(--white);
		cursor: auto;
		border-top: 2px solid white;
		border-top: 1px solid #969696;
		border-left: 1px solid silver;
		border-right: 1px solid silver;
	}

	button:not(.active) {
		color: var(--gray);
	}

	/* Add hover effect to buttons that are not active */
	button:not(.active):hover {
		background-color: var(--alice-blue);
		transition: 0.5s;
	}
</style>
