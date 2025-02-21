<script>
	// Import stores
	import {
		map,
		filteredDirectory,
		selectedFormat,
		selectedAudience,
		selectedLanguage,
		selectedOutlet,
		directoryData,
		outletCount,
		popup
	} from '$lib/stores.js';

	// Import components
	import ExportCSV from '$lib/components/ExportCSV.svelte';

	// Import icon components
	import OpenLinkIcon from '$lib/components/icons/OpenLink.svelte';
	import MapPinIcon from '$lib/components/icons/MapPin.svelte';
	import LeftArrowIcon from '$lib/components/icons/LeftArrow.svelte';
	import RightArrowIcon from '$lib/components/icons/RightArrow.svelte';
	import SearchIcon from '$lib/components/icons/Search.svelte';
	import MediaFormatIcon from '$lib/components/icons/MediaFormat.svelte';
	import PeopleIcon from '$lib/components/icons/People.svelte';
	import LanguagesIcon from '$lib/components/icons/Languages.svelte';
	import OpenBookIcon from '$lib/components/icons/OpenBook.svelte';
	import MapIcon from '$lib/components/icons/Map.svelte';

	// Search through cards via outlet name
	let searchQuery = '';

	// generating ethnicity tag
	let formattedEthnicityList;
	$: if ($selectedAudience?.ethnicity) {
		const ethnicityList = [
			...($selectedAudience.ethnicity
				? $selectedAudience.ethnicity
						.toString()
						.split(',')
						.map((item) => item.trim())
				: [])
		];

		formattedEthnicityList =
			ethnicityList.length > 1
				? ethnicityList.slice(0, -1).join(', ') + ', ' + ethnicityList.slice(-1)
				: ethnicityList[0];
	}

	// generating religion tag
	let formattedReligionList;
	$: if ($selectedAudience?.religion) {
		const religionList = [
			...($selectedAudience.religion
				? $selectedAudience.religion
						.toString()
						.split(',')
						.map((item) => item.trim())
				: [])
		];

		formattedReligionList =
			religionList.length > 1
				? religionList.slice(0, -1).join(', ') + ', ' + religionList.slice(-1)
				: religionList[0];
	}

	// generating theme tag
	let formattedThemeList;
	$: if ($selectedAudience?.theme) {
		const themeList = [
			...($selectedAudience.theme
				? $selectedAudience.theme
						.toString()
						.split(',')
						.map((item) => item.trim())
				: [])
		];

		formattedThemeList =
			themeList.length > 1
				? themeList.slice(0, -1).join(', ') + ', ' + themeList.slice(-1)
				: themeList[0];
	}

	// generating geography tag
	let formattedGeographyList;
	$: if ($selectedAudience?.geography) {
		const geographyList = [
			...($selectedAudience.geography
				? $selectedAudience.geography
						.toString()
						.split(',')
						.map((item) => item.trim())
				: [])
		];

		formattedGeographyList =
			geographyList.length > 1
				? geographyList.slice(0, -1).join(', ') + ', ' + geographyList.slice(-1)
				: geographyList[0];
	}

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
	$: if ($selectedOutlet) {
		$map.setPaintProperty('outlet-layer', 'circle-opacity', 0.25);
	}

	// Paginate outlet cards
	let currentPage = 0;
	const itemsPerPage = 20;

	// Search through cards, by outlet name
	$: filteredDirectoryBySearch = $filteredDirectory?.features.filter((outlet) =>
		outlet.properties['OUTLET'].toLowerCase().includes(searchQuery.toLowerCase())
	);

	$: paginatedDirectory = filteredDirectoryBySearch.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);

	// Scroll to top of section when going between "pages"
	import { onMount } from 'svelte';

	let sectionRef;
	onMount(() => {
		sectionRef = document.querySelector('.header');
	});

	function scrollToTop() {
		if (sectionRef) {
			sectionRef.scrollIntoView({ behavior: 'smooth' });
		}
	}

	// Import transition
	import { fade } from 'svelte/transition';
</script>

<section id="outlet-cards" aria-label="List of media outlets">
	<!-- Intro text -->
	<div class="header" in:fade>
		{#if $selectedFormat || $selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme || $selectedAudience?.geography || $selectedLanguage}
			<!-- Message when filter has been applied -->
			<p class="filter-applied">
				<SearchIcon /><strong
					>{[$selectedAudience, $selectedFormat, $selectedLanguage].filter(Boolean).length >= 2 ||
					($selectedFormat && $selectedAudience) ||
					($selectedFormat && $selectedLanguage) ||
					($selectedAudience && $selectedLanguage) ||
					($selectedAudience?.ethnicity && $selectedAudience?.religion) ||
					($selectedAudience?.ethnicity && $selectedAudience?.theme) ||
					($selectedAudience?.ethnicity && $selectedAudience?.geography) ||
					($selectedAudience?.religion && $selectedAudience?.theme) ||
					($selectedAudience?.religion && $selectedAudience?.geography) ||
					($selectedAudience?.theme && $selectedAudience?.geography)
						? 'Filters'
						: 'Filter'} applied:</strong
				>
				<span
					>Showing <strong>{$filteredDirectory?.features.length}</strong> out of {$directoryData
						?.features.length} outlets</span
				>
			</p>

			<!-- Filter tags -->
			<p class="filter-applied tags-container">
				<!-- format -->
				{#if $selectedFormat}
					<span class="filter-tag"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 -960 960 960"
							width="18px"
							fill="rgba(var(--gold), 1)"
							aria-hidden="true"
							><path
								d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm-50-100 160-100-160-100v200Zm-430 20v-480 480Z"
							/></svg
						>
						{$selectedFormat}
						<button
							on:click|stopPropagation={() => {
								$selectedFormat = undefined;

								$popup?.remove();
								$map.getSource('outlets').setData($filteredDirectory);
							}}
							aria-label="Remove filter showing outlets in {$selectedFormat} format">×</button
						></span
					>
				{/if}

				<!-- ethnicity -->
				{#if $selectedAudience?.ethnicity}
					<span class="filter-tag"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 -960 960 960"
							width="18px"
							fill="rgba(var(--gold), 1)"
							><path
								d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"
							/></svg
						>{formattedEthnicityList}<button
							class="filter-tag-close"
							on:click|stopPropagation={() => {
								$selectedAudience.ethnicity = undefined;
								$popup?.remove();
								$map.getSource('outlets').setData($filteredDirectory);
							}}
							aria-label="Remove filter showing outlets serving the{formattedEthnicityList} community"
							>×</button
						></span
					>
				{/if}

				<!-- religion -->
				{#if $selectedAudience?.religion}
					<span class="filter-tag"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 -960 960 960"
							width="18px"
							fill="rgba(var(--gold), 1)"
							><path
								d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"
							/></svg
						>{formattedReligionList}<button
							class="filter-tag-close"
							on:click|stopPropagation={() => {
								$selectedAudience.religion = undefined;

								$popup?.remove();
								$map.getSource('outlets').setData($filteredDirectory);
							}}
							aria-label="Remove filter showing outlets serving the{formattedReligionList} community"
							>×</button
						></span
					>
				{/if}

				<!-- theme -->
				{#if $selectedAudience?.theme}
					<span class="filter-tag"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 -960 960 960"
							width="18px"
							fill="rgba(var(--gold), 1)"
							><path
								d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"
							/></svg
						>{formattedThemeList}<button
							class="filter-tag-close"
							on:click|stopPropagation={() => {
								$selectedAudience.theme = undefined;

								$popup?.remove();
								$map.getSource('outlets').setData($filteredDirectory);
							}}
							aria-label="Remove filter showing outlets covering{formattedThemeList}">×</button
						></span
					>
				{/if}

				<!-- geography -->
				{#if $selectedAudience?.geography}
					<span class="filter-tag"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 -960 960 960"
							width="18px"
							fill="rgba(var(--gold), 1)"
							><path
								d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"
							/></svg
						>{formattedGeographyList}<button
							class="filter-tag-close"
							on:click|stopPropagation={() => {
								$selectedAudience.geography = undefined;

								$popup?.remove();
								$map.getSource('outlets').setData($filteredDirectory);
							}}
							aria-label="Remove filter showing outlets covering{formattedGeographyList}">×</button
						></span
					>
				{/if}

				<!-- language -->
				{#if $selectedLanguage}
					<span class="filter-tag"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 -960 960 960"
							width="18px"
							fill="rgba(var(--gold), 1)"
							><path
								d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"
							/></svg
						>{$selectedLanguage.toString().replaceAll(',', ', ')}<button
							class="filter-tag-close"
							on:click|stopPropagation={() => {
								$selectedLanguage = undefined;

								$popup?.remove();
								$map.getSource('outlets').setData($filteredDirectory);
							}}
							aria-label="Remove filter showing outlets reporting in{selectedLanguage}">×</button
						></span
					>
				{/if}
			</p>
		{:else}
			<p>
				This <strong
					>list of all {$outletCount}
					outlets</strong
				>
				includes those without a known location and do not appear on the map. Apply filters in the
				<span class="tab">Search</span> tab to narrow down the list or search for an outlet below.
			</p>
		{/if}

		<hr style="margin: 10px 0 0 0; background-color: rgba(var(--gray), 0.25);" />
		<!-- Search cards by outlet name -->
		{#if $filteredDirectory.features.length > 1}
			<div class="search-field">
				<label for="search-input">Search cards for an outlet name</label>
				<input
					id="search-input"
					name="search_input"
					type="text"
					placeholder="Enter outlet name"
					bind:value={searchQuery}
					aria-label="Enter outlet name to find it in the list"
				/>

				<!-- Show clear search button when text has been entered -->
				{#if searchQuery}
					<button
						on:click={() => (searchQuery = '')}
						aria-label="Clear search terms"
						class="clear-form-btn">✕</button
					>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Cards -->
	<div class="cards-container">
		<p>
			{#if !searchQuery}
				<ExportCSV />
				<hr
					style="border-top: 1px solid rgba(var(--black), 0.1);
		margin: 0.75rem 0;"
				/>
			{/if}
			{#if filteredDirectoryBySearch.length > 0}
				Selecting the <OpenBookIcon
					width={'16px'}
					height={'14px'}
					minY={-1100}
					ariaLabel={'Book symbol found next to outlet names in list below'}
				/> icon will take you to the outlet's entry in the Many Voices, One City directory, where you
				can find information about the staff and audience.
			{:else}
				No outlets found. Please change the filter selections.
			{/if}
		</p>
		{#each paginatedDirectory as outlet}
			<div class="outlet-card">
				<!-- Card header row -->
				<div class="header-row">
					<p class="outlet-name">
						<span>
							{outlet.properties['OUTLET']}
							<a href={outlet.properties['DIRECTORY URL']}><OpenBookIcon /></a>
						</span>
					</p>
					<p class="founded">
						{#if outlet.properties['FOUNDED']}
							Since {outlet.properties['FOUNDED']}
						{/if}
					</p>
				</div>

				<!-- Card body row -->
				<div class="body-container">
					<!-- Primary format -->
					<div class="body-row">
						<p class="category-label">
							<MediaFormatIcon width="14px" height="14px" /> Primary Format
						</p>
						<p class="category-value">{outlet.properties['PRIMARY FORMAT']}</p>
					</div>
					<hr class="outlet-card-divider" />

					<!-- Community (ethnicity, religion, theme) -->
					{#if outlet.properties['TARGET ETHNICITY'] || outlet.properties['TARGET RELIGION'] || outlet.properties['TARGET THEME']}
						<div class="body-row">
							<!-- Community label -->
							<p class="category-label">
								{#if outlet.properties['TARGET ETHNICITY']
									?.toString()
									.includes(',') || outlet.properties['TARGET RELIGION']
										?.toString()
										.includes(',') || outlet.properties['TARGET THEME']
										?.toString()
										.includes(',') || (outlet.properties['TARGET ETHNICITY'] && outlet.properties['TARGET RELIGION']) || (outlet.properties['TARGET ETHNICITY'] && outlet.properties['TARGET RELIGION'] && outlet.properties['TARGET THEME']) || (outlet.properties['TARGET ETHNICITY'] && outlet.properties['TARGET THEME']) || (outlet.properties['TARGET RELIGION'] && outlet.properties['TARGET THEME'])}
									<PeopleIcon width="14px" height="14px" /> Communities
								{:else}
									<PeopleIcon width="14px" height="14px" /> Community
								{/if}
							</p>
							<!-- Community values -->
							<p class="category-value">
								{#if outlet.properties['TARGET ETHNICITY']}
									{outlet.properties['TARGET ETHNICITY']
										.toString()
										.replaceAll(',', ', ')}{/if}{#if outlet.properties['TARGET RELIGION']}
									{#if outlet.properties['TARGET ETHNICITY']},{/if}
									{outlet.properties['TARGET RELIGION'].toString().replaceAll(',', ', ')}
								{/if}
								{#if outlet.properties['TARGET THEME']}
									{#if outlet.properties['TARGET ETHNICITY'] || outlet.properties['TARGET RELIGION']},
									{/if}
									{outlet.properties['TARGET THEME'].toString().replaceAll(',', ', ')}
								{/if}
							</p>
						</div>
						<hr class="outlet-card-divider" />
					{/if}

					<!-- Geographic reach -->
					{#if outlet.properties['TARGET LOCATION']}
						<div class="body-row">
							<!-- Reach label -->
							<p class="category-label">
								{#if outlet.properties['TARGET LOCATION']}
									<MapIcon width="14px" height="14px" /> Geographic Reach
								{/if}
							</p>

							<!-- Location values -->
							<p class="category-value">
								<!-- Note: If borough name is in neighborhood name, exclude ", [borough]") -->
								{#if outlet.properties['TARGET LOCATION']}
									{outlet.properties['TARGET LOCATION']
										.toString()
										.replaceAll(
											',',
											', '
										)}{#if (outlet.properties['TARGET LOCATION CATEGORY'] === 'Manhattan' && !!outlet.properties['TARGET LOCATION'].includes('Manhattan') && !outlet.properties['TARGET LOCATION'].includes('Manhattan')) || (outlet.properties['TARGET LOCATION CATEGORY'] === 'Brooklyn' && !!outlet.properties['TARGET LOCATION'].includes('Brooklyn') && !outlet.properties['TARGET LOCATION'].includes('Brooklyn')) || (outlet.properties['TARGET LOCATION CATEGORY'] === 'Queens' && !!outlet.properties['TARGET LOCATION'].includes('Queens') && !outlet.properties['TARGET LOCATION'].includes('Queens')) || (outlet.properties['TARGET LOCATION CATEGORY'] === 'Bronx' && !!outlet.properties['TARGET LOCATION'].includes('Bronx') && !outlet.properties['TARGET LOCATION'].includes('Bronx')) || (outlet.properties['TARGET LOCATION CATEGORY'] === 'Staten Island' && !!outlet.properties['TARGET LOCATION'].includes('Staten Island') && !outlet.properties['TARGET LOCATION'].includes('Staten Island'))}
										, {outlet.properties['TARGET LOCATION CATEGORY']}
									{/if}
								{/if}
							</p>
						</div>
						<hr class="outlet-card-divider" />
					{/if}

					<!-- Language -->
					<div class="body-row">
						<p class="category-label">
							{#if outlet.properties['PRIMARY LANGUAGE'].toString().includes(',')}
								<LanguagesIcon width="14px" height="14px" /> Primary Languages
							{:else}
								<LanguagesIcon width="14px" height="14px" /> Primary Language
							{/if}
						</p>
						<p class="category-value">
							{outlet.properties['PRIMARY LANGUAGE'].toString().replaceAll(',', ', ')}
						</p>
					</div>
				</div>

				<!-- Card footer row -->
				<div class="footer-row">
					<!-- Buttons -->
					<div class="action-btns">
						{#if outlet.properties['URL']}
							<a href={outlet.properties['URL']} class="card-btn website-btn" target="_blank"
								><OpenLinkIcon /> Visit website</a
							>
						{/if}
						{#if outlet.geometry.coordinates[0]}<button
								aria-label="Highlights outlet marker on map"
								class="card-btn map-btn"
								on:click={() => {
									$selectedOutlet = outlet.properties['OUTLET'];

									lng = outlet.geometry.coordinates[0];
									lat = outlet.geometry.coordinates[1];

									$popup?.remove();
									outlet.geometry.coordinates[0] !== undefined ? flyTo(10, [lng, lat]) : null;
								}}><MapPinIcon strokeColor="rgba(var(--green), 1)" /> Find on map</button
							>
						{/if}
					</div>

					<!-- City -->
					<p class="location">
						{#if outlet.properties['CITY']}
							{outlet.properties['CITY']}, {outlet.properties['STATE']
								.replace('New York', 'NY')
								.replace('New Jersey', 'NJ')
								.replace('Connecticut', 'CT')}
						{:else}
							<span style="color: gray;">Location unavailable</span>
						{/if}
					</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Page buttons -->
	<div class="page-btns-container">
		<!-- previous button -->
		<button
			aria-label="Previous page of outlets"
			on:click={scrollToTop}
			on:click={() => (currentPage = Math.max(currentPage - 1, 0))}
			disabled={currentPage === 0}
			class:disabled={currentPage === 0}
		>
			<LeftArrowIcon />
		</button>

		<!-- # of # -->
		<span
			><strong>{filteredDirectoryBySearch.length === 0 ? currentPage : currentPage + 1}</strong> of
			<strong>{Math.ceil(filteredDirectoryBySearch.length / itemsPerPage)}</strong></span
		>

		<!-- next button -->
		<button
			aria-label="Next page of outlets"
			on:click={scrollToTop}
			on:click={() =>
				(currentPage = Math.min(
					currentPage + 1,
					Math.ceil(filteredDirectoryBySearch.length / itemsPerPage) - 1
				))}
			disabled={currentPage === Math.ceil(filteredDirectoryBySearch.length / itemsPerPage) - 1}
			class:disabled={currentPage ===
				Math.ceil(filteredDirectoryBySearch.length / itemsPerPage) - 1}
		>
			<RightArrowIcon />
		</button>
	</div>
</section>

<style>
	/* intro + search bar */
	.header {
		font-size: 0.85rem;
		padding: 1rem;
		/* box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1); */
	}

	.header p {
		margin-bottom: 5px;
	}

	/* filter tags */
	.filter-applied {
		font-family: 'Roboto Condensed';
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
	}

	.tags-container {
		/* flex-wrap: wrap; */
		row-gap: 6px;
		column-gap: 8px;
	}

	.filter-tag {
		padding: 0 0 0 5px;
		border-radius: 2px;
		background-color: rgba(var(--light-yellow), 0.25);
		border: 1px solid rgba(var(--gold), 0.5);
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		font-family: 'Roboto Condensed', sans-serif;
		font-weight: 600;
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		gap: 3px;
	}

	/* remove filter tag button */
	.filter-tag button {
		font-size: 1.25rem;
		padding: 0 5px 0 5px;
		margin: 0 0 0 5px;
		border-left: 0.5px solid rgba(var(--gold), 1);
		/* color: #743b0f; */
		width: fit-content;
		background-color: rgba(var(--light-yellow), 0.75);
	}

	.filter-tag button:hover {
		filter: saturate(175%);
	}

	/* search field */
	.search-field {
		margin-top: 1rem;
		font-family: 'Roboto Condensed', sans-serif;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.8rem;
	}

	.search-field input {
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid rgba(var(--gray), 0.25);
		border-radius: 4px;
		margin-top: 2px;
	}

	/* cards */
	.cards-container {
		padding: 1rem 1rem 0.25rem;
		background-color: rgba(var(--light-gray), 0.5);
		border-top: 0.5px solid rgba(var(--gray), 0.5);
		border-bottom: 0.5px solid rgba(var(--gray), 0.5);
		box-shadow: rgba(var(--gray), 0.15) 0px 3px 6px -2px inset;
	}

	.cards-container > p {
		font-size: 0.8rem;
		padding-bottom: 1rem;
	}

	.outlet-card {
		background-color: rgba(var(--white), 1);
		/* border: 1px solid #dee2e6; */
		border: 0.5px solid rgba(var(--gray), 0.5);
		border-radius: 3px;
		margin-bottom: 1.75rem;
		box-shadow: 0 2px 2px rgba(var(--black), 0.1);
		font-family: 'Roboto Condensed', 'sans-serif';
		position: relative; /* to add card number */
	}

	.outlet-name {
		font-size: 1rem;
		font-weight: 600;
		font-family: 'Roboto Condensed', sans-serif;
		line-height: 1;
	}

	.header-row,
	.footer-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.header-row {
		border-bottom: 1px solid rgba(var(--cerulean), 0.25);
		padding: 0.4rem 0.5rem;
		position: relative;
	}

	.footer-row {
		align-items: center;
		/* background-color: #f0f0f0; */
		background-color: rgba(var(--light-gray), 0.9);
		padding: 0.45rem 0.5rem;
		border-top: 0.5px solid rgba(var(--gray), 0.4);
		border-radius: 0 0 3px 3px;
		/* box-shadow: rgba(var(--gray), 0.1) 0px 3px 6px -2px inset; */
	}

	.body-container {
		padding: 0.25rem 0.5rem;
	}

	.body-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
	}

	.category-label {
		/* font-weight: 600; */

		/* text-transform: uppercase; */
		line-height: 1;
		color: rgba(var(--gray), 1);
		flex-basis: 50%;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.category-value {
		font-weight: 600;
		text-align: right;
	}

	.founded,
	.location {
		font-size: 0.75rem;
		font-weight: 400;
		text-transform: uppercase;
		font-family: 'Roboto Condensed', sans-serif;
	}

	.founded {
		font-weight: 400;
		min-width: fit-content;
		text-align: right;
	}

	.action-btns {
		display: flex;
		justify-content: space-between;
		gap: 6px;
	}

	.location {
		/* width: 24%; */
		text-align: right;
		flex: 1;
		text-wrap: balance;
		color: rgba(var(--darker-green), 1);
	}

	.card-btn {
		border-radius: 3px;
		font-size: 0.75rem;
		padding: 5px 8px;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 3px;
		/* font-family: 'DM Sans', sans-serif; */
		font-family: 'Roboto Condensed', sans-serif;
		text-align: left;
		line-height: 1;
		font-weight: 800;
	}

	/* visit website button */
	.website-btn {
		background-color: rgba(var(--off-white), 1);
		border: 0.5px solid rgba(var(--cerulean), 1);
		color: rgba(var(--cerulean), 1);
		box-shadow: rgba(var(--cerulean), 0.5) 0 -2px 0 inset;
	}

	.website-btn:hover {
		/* background-color: rgba(var(--cerulean), 0.01); */
		transition: 0.5s;
		box-shadow: rgba(var(--cerulean), 1) 0 -2px 0 inset;
		filter: saturate(150%);
	}

	/* find on map button */
	.map-btn {
		background-color: rgba(var(--off-white), 1);
		border: 0.5px solid rgba(var(--green), 1);
		color: rgba(var(--green), 1);
		box-shadow: rgba(var(--green), 0.5) 0 -2px 0 inset;
	}

	.map-btn:hover {
		/* background-color: #f2f9f9; */
		transition: 0.5s;
		box-shadow: rgba(var(--green), 1) 0 -2px 0 inset;
		filter: saturate(150%);
		transition: 0.5s;
	}

	/* pagination */
	.page-btns-container {
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Roboto Condensed', sans-serif;
		box-shadow: rgba(var(--gray), 0.15) 0px 3px 6px -2px inset;
	}

	.page-btns-container button.disabled {
		visibility: hidden;
	}

	/* Visually hidden label for screen readers */
	/* .visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	} */

	.clear-form-btn {
		float: inline-end;
		/* position: absolute;
		top: 50%; */
		transform: translateY(-150%);
		margin-right: 3px;
		font-weight: 800;
	}

	.clear-form-btn:hover {
		color: rgba(var(--black), 0.8);
	}

	/* outlet card number: */
	/* create variable for counter */
	:root {
		counter-reset: outlet-cards;
	}

	/* increment counter */
	.outlet-name {
		counter-increment: outlet-cards;
	}

	.outlet-name::before {
		position: absolute;
		top: -10px;
		left: 8px;
		background-color: rgba(var(--cerulean), 0.9);
		border-radius: 2px;
		padding: 2px 4px;
		font-size: 0.7rem;
		color: rgba(var(--white), 1);
		font-weight: 600;
		content: counter(outlet-cards);
	}
</style>
