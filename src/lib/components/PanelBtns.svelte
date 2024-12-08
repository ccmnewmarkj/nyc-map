<script>
	// Import icon components
	import InfoIcon from '$lib/components/icons/InfoCircle.svelte';
	import SearchIcon from '$lib/components/icons/Search.svelte';
	import ListIcon from '$lib/components/icons/List.svelte';

	// Import stores
	import {
		aboutPanelVisible,
		searchPanelVisible,
		outletPanelVisible,
		filteredDirectory,
		selectedOutlet,
		popup,
		map
	} from '$lib/stores.js';
</script>

<div class="btn-container">
	<!-- About -->
	<button
		id="about-btn"
		class:active={$aboutPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = true;
			$searchPanelVisible = false;
			$outletPanelVisible = false;
			if ($selectedOutlet) {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}
		}}><InfoIcon />About</button
	>

	<!-- Search -->
	<button
		id="search-btn"
		class:active={$searchPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = false;
			$searchPanelVisible = true;
			$outletPanelVisible = false;
			if ($selectedOutlet) {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}
		}}><SearchIcon />Search</button
	>

	<!-- Outlets -->
	<button
		id="outlet-btn"
		class:active={$outletPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = false;
			$searchPanelVisible = false;
			$outletPanelVisible = true;
			if ($selectedOutlet) {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}
		}}
		><ListIcon />Outlets
		<span class="badge-count">{$filteredDirectory.features?.length}</span>
	</button>
</div>

<style>
	.btn-container {
		display: flex;
		/* border-top: 1px solid rgba(248, 181, 0, 0.5); */
		/* border-top: 1px solid var(--alice-blue); */
		border-bottom: 1px solid rgba(248, 181, 0, 0.5);
	}

	button {
		background-color: rgba(var(--light-gray), 1);
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		padding: 7px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		flex: 1; /* make buttons equal width */
	}

	button:last-child {
		flex: 1.2; /* make the last button slightly larger */
	}

	button:not(:last-child) {
		border-right: 1px solid #fffffd;
	}

	button.active {
		background-color: rgba(var(--white), 1);
		cursor: auto;
	}

	button:not(.active) {
		border-top: 2px solid #fff2bc;
	}

	/* Add hover effect to buttons that are not active */
	button:not(.active):hover {
		background-color: rgba(var(--light-blue-gray), 1);
		transition: 0.5s;
	}

	/* .badge-count {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 0.1rem;
		font-size: 0.7rem;
		color: white;
		text-align: center;
		background-color: var(--dark-cerulean);
		border-radius: 50%;
		width: 23px;
		height: 23px;
	} */

	.badge-count {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.1rem 0.35rem;
		margin-left: 0.1rem;
		font-size: 0.75rem;
		line-height: 1.4;
		color: rgba(var(--white), 1);
		text-align: center;
		background-color: rgba(var(--dark-cerulean), 1);
		border-radius: 10px;
	}

	button:focus-visible {
		outline: 2px solid rgba(var(--cerulean), 1);
		outline-offset: -2px;
	}
</style>
