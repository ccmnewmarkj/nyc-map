<script>
	// Import components
	import FormatSearch from '$lib/components/FormatSearch.svelte';
	import CommunitySearch from '$lib/components/CommunitySearch.svelte';
	import LanguageSearch from '$lib/components/LanguageSearch.svelte';
	import OutletSearch from '$lib/components/OutletSearch.svelte';

	// Import stores
	import {
		map,
		directoryData,
		filteredDirectory,
		selectedFormat,
		selectedCommunity,
		selectedLanguage
	} from '$lib/stores.js';

	// Filter data (filter dropdown selections, map markers, outlet list tab) based on selections from multiple dropdowns
	$: {
		if ($selectedFormat || $selectedCommunity || $selectedLanguage) {
			$filteredDirectory = {
				type: 'FeatureCollection',
				features: $directoryData.features?.filter((d) => {
					// FORMAT
					let formatState = !$selectedFormat || $selectedFormat === d.properties['PRIMARY FORMAT'];

					// COMMUNITY
					let communityState =
						!$selectedCommunity ||
						(($selectedCommunity.ethnicity?.length
							? $selectedCommunity.ethnicity.every(
									(ethnicity) =>
										d.properties['TARGET ETHNICITY'] &&
										d.properties['TARGET ETHNICITY']?.includes(ethnicity)
								)
							: true) &&
							($selectedCommunity.religion?.length
								? $selectedCommunity.religion.every(
										(religion) =>
											d.properties['TARGET RELIGION'] &&
											d.properties['TARGET RELIGION']?.includes(religion)
									)
								: true) &&
							($selectedCommunity.theme?.length
								? $selectedCommunity.theme.every(
										(theme) =>
											d.properties['TARGET THEME'] && d.properties['TARGET THEME']?.includes(theme)
									)
								: true));
					// 	&&
					// ($selectedCommunity.geography?.length
					// 	? $selectedCommunity.geography.every((geography) => {
					// 			d.properties['TARGET LOCATION'] &&
					// 				d.properties['TARGET LOCATION']?.includes(geography);
					// 		})
					// 	: true)

					let geographyState =
						!$selectedCommunity ||
						($selectedCommunity.geography?.length
							? $selectedCommunity.geography.every(
									(geography) =>
										d.properties['TARGET LOCATION'] &&
										d.properties['TARGET LOCATION']?.includes(geography)
								)
							: true);

					// LANGUAGE
					let languageState =
						!$selectedLanguage ||
						$selectedLanguage?.every((language) =>
							d.properties['PRIMARY LANGUAGE'].includes(language)
						);

					return formatState && communityState && geographyState && languageState;
				})
			};
			// Update points on map
			$map.getSource('outlets').setData($filteredDirectory);
		} else {
			// Reset filtered data source
			$map.getSource('outlets').setData($directoryData);
		}
	}

	// Receive selected value from CommunitySearch tab
	// let communityType = '';
</script>

<!-- Intro -->
<section id="search-filters" aria-labelledby="search-btn">
	<p style="font-size: 0.85rem;">
		Select options from one or more of the three filters to narrow down your search. Once you make a
		selection, the three filters will only show the remaining options based on the option(s) you
		have chosen.
	</p>

	<!-- Filters -->

	<!-- Filter by format -->
	<div class="filter">
		<FormatSearch />
	</div>

	<!-- <hr /> -->

	<!-- Filter by community -->
	<div class="filter">
		<CommunitySearch />
	</div>

	<!-- <hr /> -->

	<!-- Filter by language -->
	<div class="filter">
		<LanguageSearch />
	</div>

	<hr style="width: 100%;" />

	<!-- Outlet search -->
	<div class="filter">
		<OutletSearch />
	</div>
</section>

<style>
	p:not(:first-of-type) {
		margin-top: 1rem;
	}

	.filter {
		margin-top: 1rem;
		margin-bottom: 1.5rem;
	}

	hr {
		width: 90%;
		margin: 0rem auto;
		border-top: 0.5px solid rgba(0, 0, 0, 0.2);
	}
</style>
