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

	// Audience type selection stored in Sidebar (grandparent) so value persists when switching between panels
	export let audienceTypeSelection;

	// List of communities for dropdown menu
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

	$: geographyList = [
		...new Set(
			$filteredDirectory.features
				?.filter((d) => d.properties['TARGET LOCATION CATEGORY'])
				.map((d) =>
					JSON.stringify({
						category: d.properties['TARGET LOCATION CATEGORY'],
						label: d.properties['TARGET LOCATION']
					})
				)
				.sort((a, b) => {
					const itemA = JSON.parse(a);
					const itemB = JSON.parse(b);
					if (itemA.category < itemB.category) return -1;
					if (itemA.category > itemB.category) return 1;
					if (itemA.label < itemB.label) return -1;
					if (itemA.label > itemB.label) return 1;
					return 0;
				})
		)
	].map((d) => JSON.parse(d));

	// Selected values in dropdown remain in place even after going to another panel
	let valueEthnicity = $selectedCommunity?.ethnicity;
	let valueReligion = $selectedCommunity?.religion;
	let valueTheme = $selectedCommunity?.theme;
	let valueGeography = $selectedCommunity?.geography;

	// Text above filter dropdown
	let communityHeader;
	const communityIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#2da854"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>`;

	const geographyIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#2da854"><path
		d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"
	/></svg>`;

	// Text above filter
	$: communityHeader =
		audienceTypeSelection === 'community'
			? `
			<span class="filter-field-label">${communityIcon} Search by audience </span>
			`
			: `
			<span class="filter-field-label">${geographyIcon} Search by audience </span>
			`;
	// <span style="font-weight: 400;">(Choose a category)</span>
	// 	<p class="filter-field-description">The number on the tabs indicate how many options are available.</p>

	// Clear/reset selected filter when outlet is selected
	$: if ($selectedOutlet) {
		valueEthnicity = undefined; // clear selected value in filter when outlet is selected
		valueReligion = undefined;
		valueTheme = undefined;
		valueGeography = undefined;
		$filteredDirectory = $directoryData; // reset filter options
	}

	// For opened dropdown menu to appear on top of other elements
	let floatingConfig = {
		strategy: 'fixed'
	};

	// Inline dropdown to select type of community and send selection to Filters.svelte (parent)
	let selectedCommunityType = 'ethnicity';
	//let communityType;

	// function setType() {
	// 	communityType = selectedCommunityType;
	// }

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

	// add svelte transition
	import { fade } from 'svelte/transition';

	// Clear filter when map button selected
	$: if ($selectedCommunity === undefined) {
		valueEthnicity = undefined;
		valueReligion = undefined;
		valueTheme = undefined;
		valueGeography = undefined;
	}
</script>

<form>
	<!-- Filter label -->
	<label for="community-search" class="filter-name">
		<span class:active={$selectedCommunity}>
			{@html communityHeader}
		</span>
	</label>

	<!-- Radio buttons for type of audience -->
	<div class="audience-selection">
		Choose a category:
		<span>
			<input
				type="radio"
				name="audience"
				id="community"
				value="community"
				bind:group={audienceTypeSelection}
			/>
			<label for="community">Community</label>
		</span>
		<span>
			<input
				type="radio"
				name="audience"
				id="geography"
				value="geography"
				bind:group={audienceTypeSelection}
			/>
			<label for="geography">Geography</label>
		</span>
	</div>

	<!-- Show dropdown based on category (radio button) selection -->
	{#if audienceTypeSelection === 'community'}
		<div in:fade>
			<!-- Buttons for community categories (ethnicity, religion, theme) -->
			<div class="btn-container">
				{#each buttonArray as button}
					<button
						on:click|stopPropagation={() => {
							selectedCommunityType = button.value;
						}}
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
					--border-hover="0.5px solid var(--community-color)"
					--border-focused="1px solid var(--community-color)"
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
							theme: valueTheme?.map((d) => d.value),
							geography: valueGeography?.map((d) => d.label.toString())
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
					--border="0.5px solid var(--community-color)"
					--border-hover="1px solid var(--community-color)"
					--border-focused="1px solid var(--community-color)"
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
							theme: valueTheme?.map((d) => d.value),
							geography: valueGeography?.map((d) => d.label.toString())
						};
					}}
					on:clear={() => {
						$popup?.remove();
						if (valueReligion === undefined) {
							$selectedCommunity.religion = undefined;
						} else {
							$selectedCommunity = valueReligion.map((d) => d.value);
						}
					}}
				/>
			{/if}

			{#if selectedCommunityType === 'theme'}
				<Select
					{floatingConfig}
					--list-position="fixed"
					--border="0.5px solid var(--community-color)"
					--border-hover="1px solid var(--community-color)"
					--border-focused="1px solid var(--community-color)"
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
							theme: valueTheme?.map((d) => d.value),
							geography: valueGeography?.map((d) => d.label.toString())
						};
					}}
					on:clear={() => {
						$popup?.remove();
						if (valueTheme === undefined) {
							$selectedCommunity.theme = undefined;
						} else {
							$selectedCommunity = valueTheme.map((d) => d.value);
						}
					}}
				/>
			{/if}
		</div>
	{:else if audienceTypeSelection === 'geography'}
		<div in:fade>
			<Select
				{floatingConfig}
				--list-position="fixed"
				--border="0.5px solid var(--community-color)"
				--border-hover="1px solid var(--community-color)"
				--border-focused="1px solid var(--community-color)"
				id="community-search"
				items={geographyList}
				placeholder="Select location"
				multiple
				clearable={false}
				bind:value={valueGeography}
				groupHeaderSelectable
				groupBy={(item) => item.category}
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
						theme: valueTheme?.map((d) => d.value),
						geography: valueGeography?.map((d) => d.label.toString())
					};
				}}
				on:clear={() => {
					$popup?.remove();
					if (valueGeography === undefined) {
						$selectedCommunity.geography = undefined;
					} else {
						$selectedCommunity = valueGeography.map((d) => d.label.toString());
					}
				}}
			/>
		</div>
	{/if}
</form>

<style>
	label {
		font-family: 'Roboto Condensed', sans-serif;
	}

	.filter-name {
		text-transform: uppercase;
		font-weight: 800;
		font-size: 0.85rem;
	}

	/* community button group */
	.btn-container {
		display: flex;
		margin: auto;
		width: 98%;
		gap: 1px;
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

	button.active {
		background-color: var(--white);
		cursor: auto;
		border-top: 2px solid white;
		border-top: 1px solid var(--community-color);
		border-left: 0.5px solid var(--community-color);
		border-right: 0.5px solid var(--community-color);
	}

	button:not(.active) {
		color: var(--gray);
	}

	/* Add hover effect to buttons that are not active */
	button:not(.active):hover {
		background-color: var(--alice-blue);
		transition: 0.5s;
	}

	/* Radio buttons for type of audience */
	.audience-selection {
		font-family: 'Roboto Condensed', sans-serif;
		font-size: 0.85rem;
		display: flex;
		column-gap: 15px;
		margin-bottom: 5px;
	}

	.audience-selection > span {
		display: flex;
		align-items: center;
		gap: 3px;
		text-transform: none;
		font-weight: 600;
		font-size: 0.85rem;
	}

	input[type='radio'] {
		accent-color: var(--community-color);
	}
</style>
