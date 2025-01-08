<script>
	// Import components
	import FormatSearch from '$lib/components/FormatSearch.svelte';
	import AudienceSearch from '$lib/components/AudienceSearch.svelte';
	import LanguageSearch from '$lib/components/LanguageSearch.svelte';
	import OutletSearch from '$lib/components/OutletSearch.svelte';

	// Import stores
	import {
		map,
		directoryData,
		filteredDirectory,
		selectedFormat,
		selectedAudience,
		selectedLanguage,
		popup
	} from '$lib/stores.js';

	// Filter data (filter dropdown selections, map markers, outlet list tab) based on selections from multiple dropdowns
	$: {
		if (
			$selectedFormat ||
			$selectedAudience?.ethnicity ||
			$selectedAudience?.religion ||
			$selectedAudience?.theme ||
			$selectedAudience?.geography ||
			$selectedLanguage
		) {
			// Update points on map
			$map.getSource('outlets').setData($filteredDirectory);
		} else {
			// Reset filtered data source
			$map.getSource('outlets').setData($directoryData);
		}
	}

	// Audience type selection stored in Sidebar (parent) so value persists when switching between panels
	export let audienceTypeSelection;
	// And for tab set for selecting type of community
	export let selectedCommunityType;

	// Import transition
	import { fade } from 'svelte/transition';
</script>

<!-- Intro -->
<section id="search-filters" aria-labelledby="search-btn">
	<div class="header" in:fade>
		<p>
			Select options from one or more of the three filters to narrow down your search. Once you make
			a selection, the three filters will only show the remaining options.
		</p>
	</div>

	<!-- Filters -->
	<div class="filters-container">
		<!-- Filter by format -->
		<div class="filter">
			<FormatSearch />
		</div>

		<hr />

		<!-- Filter by community -->
		<div class="filter">
			<AudienceSearch bind:audienceTypeSelection bind:selectedCommunityType />
		</div>

		<hr />

		<!-- Filter by language -->
		<div class="filter">
			<LanguageSearch />
		</div>

		<!-- error msg: -->
		{#if $filteredDirectory?.features.length === 0}
			<hr />
			<div class="error-msg" transition:fade={{ duration: 100 }}>
				<p>No outlets found. Please change the filter selections.</p>
			</div>
		{/if}

		<!-- Clear multiple filters -->
		{#if ($selectedFormat && ($selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme)) || ($selectedFormat && $selectedLanguage) || (($selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme) && $selectedLanguage) || ($selectedAudience?.ethnicity && $selectedAudience?.religion) || ($selectedAudience?.ethnicity && $selectedAudience?.theme) || ($selectedAudience?.ethnicity && $selectedAudience?.geography) || ($selectedAudience?.religion && $selectedAudience?.theme) || ($selectedAudience?.religion && $selectedAudience?.geography) || ($selectedAudience?.theme && $selectedAudience?.geography)}
			{#if $filteredDirectory?.features.length !== 0}<hr />{/if}
			<div class="reset-container" transition:fade={{ duration: 100 }}>
				<button
					aria-label="Clear any applied filters"
					on:click|stopPropagation={() => {
						$selectedFormat = undefined;
						$selectedAudience = undefined;
						$selectedLanguage = undefined;
						//filteredDirectory.set($directoryData);
						$popup?.remove();
						//$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
						//$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
						$map.getSource('outlets').setData($filteredDirectory);
					}}>Clear filters <span style="color: rgba(var(--light-red), 1);">✕</span></button
				>
			</div>
		{/if}
	</div>

	<!-- Outlet search -->
	<div class="outlet-search-container">
		<OutletSearch />
	</div>
</section>

<style>
	.header {
		padding: 1rem;
	}

	.filters-container {
		background-color: rgba(var(--light-gray), 0.5);
		padding: 1rem;
		position: relative;
		border-top: 0.5px solid rgba(var(--gray), 0.5);
		border-bottom: 0.5px solid rgba(var(--gray), 0.5);
		box-shadow: rgba(var(--gray), 0.15) 0px 3px 6px -2px inset;
	}

	.filter:not(:first-of-type) {
		margin-top: 1rem;
	}

	hr {
		width: 95%;
		margin: 1rem auto;
		border-top: 0.5px solid rgba(var(--blue-gray), 0.5);
	}

	.outlet-search-container {
		padding: 1rem;
		box-shadow: rgba(var(--gray), 0.15) 0px 3px 6px -2px inset;
	}

	.error-msg {
		color: rgba(var(--light-red), 1);
		font-size: 0.8rem;
	}
</style>
