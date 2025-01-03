<script>
	// Import vis components
	import BarChart from '$lib/components/visualizations/BarChart.svelte';
	import DragToggle from '$lib/components/DragToggle.svelte';

	// Import icon components
	import TableIcon from '$lib/components/icons/DataTable.svelte';
	import BarChartIcon from '$lib/components/icons/BarChart.svelte';

	// Import stores
	import {
		filteredDirectory,
		selectedFormat,
		selectedAudience,
		selectedLanguage,
		outletCount
	} from '$lib/stores.js';

	// Import transition
	import { fade } from 'svelte/transition';

	// Button variables, default status dependent on any filter selections
	let toggleFormatChart = true;
	let toggleEthnicityChart = false;
	let toggleLanguageChart = false;

	$: filteredOutletCount = $filteredDirectory?.features.length;

	// Toggle (show/hide) vis
	export let toggleVis;

	function setToggleVisState() {
		toggleVis = !toggleVis;
	}

	// Toggle option to drag vis panel (and export to Map parent)
	export let toggleDrag;

	// Toggle table
	let toggleTable = false;
</script>

<div class="header">
	<button on:click={setToggleVisState} class="close-vis">✕</button>
	<p>
		Select a category to see different visual overviews of the {filteredOutletCount}
		{filteredOutletCount < $outletCount ? `(out of ${$outletCount})` : ''} outlets.
	</p>
	<div class="button-container">
		<button
			on:click={() => {
				toggleFormatChart = !toggleFormatChart;
				toggleEthnicityChart = null;
				toggleLanguageChart = null;
			}}
			class:active={toggleFormatChart}>Format</button
		>
		<button
			on:click={() => {
				toggleEthnicityChart = !toggleEthnicityChart;
				toggleLanguageChart = null;
				toggleFormatChart = null;
			}}
			class:active={toggleEthnicityChart}>Ethnicity</button
		>
		<button
			on:click={() => {
				toggleLanguageChart = !toggleLanguageChart;
				toggleEthnicityChart = null;
				toggleFormatChart = null;
			}}
			class:active={toggleLanguageChart}>Language</button
		>
	</div>
</div>

<div class="vis-element" in:fade={{ duration: 100 }}>
	{#if toggleFormatChart && !$selectedFormat}
		<BarChart {toggleTable} category={'format'} dataField={'PRIMARY FORMAT'} />
	{/if}
	{#if toggleFormatChart && $selectedFormat}
		<p>To see the chart, clear the <span class="tab">Format</span> filter.</p>
	{/if}

	{#if toggleEthnicityChart && !$selectedAudience?.ethnicity}
		<BarChart {toggleTable} category={'ethnicity'} dataField={'TARGET ETHNICITY'} />
	{/if}
	{#if toggleEthnicityChart && $selectedAudience?.ethnicity}
		<p>To see the chart, clear the <span class="tab">Ethnicity</span> filter.</p>
	{/if}

	{#if toggleLanguageChart && !$selectedLanguage}
		<BarChart {toggleTable} category={'language'} dataField={'PRIMARY LANGUAGE'} />
	{/if}
	{#if toggleLanguageChart && $selectedLanguage}
		<p>To see the chart, clear the <span class="tab">Language</span> filter.</p>
	{/if}
</div>

<div class="footer">
	<!-- If on Format slide with no format selected in filter -->
	<!-- {#if (toggleFormatChart && !$selectedFormat) || (toggleEthnicityChart && !$selectedAudience?.ethnicity) || (toggleLanguageChart && !$selectedLanguage)}
		<p>
			{filteredOutletCount !== $outletCount
				? `Chart based on ${filteredOutletCount} ${filteredOutletCount > 1 ? 'outlets' : 'outlet'}, with ${($selectedFormat && ($selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme)) || ($selectedFormat && $selectedLanguage) || (($selectedAudience?.ethnicity || $selectedAudience?.religion || $selectedAudience?.theme) && $selectedLanguage) || ($selectedAudience?.ethnicity && $selectedAudience?.religion) || ($selectedAudience?.ethnicity && $selectedAudience?.theme) || ($selectedAudience?.ethnicity && $selectedAudience?.geography) || ($selectedAudience?.religion && $selectedAudience?.theme) || ($selectedAudience?.religion && $selectedAudience?.geography) || ($selectedAudience?.theme && $selectedAudience?.geography) ? 'filters' : 'filter'} applied`
				: `Chart based on ${filteredOutletCount} ${filteredOutletCount > 1 ? 'outlets' : 'outlet'}`}
		</p>
	{/if} -->

	<!-- Toggles -->
	<span
		><button class="table-btn" on:click={() => (toggleTable = !toggleTable)}>
			{#if !toggleTable}
				<span><TableIcon /> Table view</span>
			{:else}
				<span><BarChartIcon /> Chart view</span>
			{/if}
		</button></span
	>
	<span><DragToggle bind:checked={toggleDrag} /></span>
</div>

<style>
	p {
		font-size: 0.75rem;
		line-height: 1.1;
		font-family: 'Roboto Condensed', sans-serif;
	}

	.header {
		padding-top: 2px;
		background-color: rgba(111, 196, 236, 0.75);
		border-radius: 8px 8px 0 0;
		border-bottom: 1px solid rgba(111, 196, 236, 1);
		border-bottom: 0.5px solid #4bb6e5;
	}

	.close-vis {
		padding: 0 5px;
		float: inline-end; /* Source: K. Powell: youtube.com/watch?v=nZ05Oqccq6g */
		margin-inline-start: 0.5rem;
		/* position: absolute;
		top: 1px;
		right: 5px; */
		font-weight: 600;
	}

	.close-vis:hover {
		color: rgba(var(--black), 0.75);
	}

	.header > p {
		font-weight: 600;
		padding: 5px 8px 2px;
	}

	.header > .button-container {
		padding: 0 5px 5px;
	}

	.header > .button-container > button {
		background-color: rgba(var(--white), 1);
		border-radius: 10px;
		color: rgba(var(--black), 1);
		border: 1px solid rgba(var(--black), 1);
		padding: 1px 8px;
		font-size: 0.75rem;
		font-weight: 600;
		width: fit-content;
		transition: all 0.25s;
	}

	.header > .button-container > button.active {
		background-color: rgba(var(--black), 1);
		color: rgba(var(--white), 1);
		cursor: auto;
		border: 1px solid rgba(var(--black), 1);
	}

	.vis-element {
		padding: 5px;
		overflow-y: auto; /* Enables vertical scrolling */
		overflow-x: hidden; /* Prevents horizontal scrolling */
		box-shadow: rgba(111, 196, 236, 0.75) 0px 3px 6px -2px inset;
		background-color: rgba(var(--off-white), 1);
		/* pointer-events: all;
		user-select: text;
		cursor: text; */

		/* fill up window height regardless of amount of content */
		height: 100%;
		/* display: flex;
		flex: 1; */
	}

	/* .vis-element {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	} */

	/* clear filter msg */
	.vis-element > p {
		padding: 10px;
		text-align: center;
		font-family: 'DM Sans', sans-serif;
	}

	.footer {
		background-color: rgba(var(--gray), 0.15);
		border-radius: 0 0 8px 8px;
		border-top: 0.5px solid rgba(var(--gray), 0.5);
		box-shadow: rgba(var(--gray), 0.25) 0px 3px 6px -2px inset;
		padding: 0 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* .footer > p {
		font-size: 0.7rem;
		padding: 4px 8px;
	} */

	/* footer buttons */
	.table-btn > span {
		display: flex;
		align-items: end;
		gap: 3px;
		font-family: 'Roboto Condensed', 'sans-serif;';
		text-transform: uppercase;
		font-size: 0.7rem;
		font-weight: 800;
	}
</style>
