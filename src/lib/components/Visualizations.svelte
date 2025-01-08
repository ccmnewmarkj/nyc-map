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
	let toggleReligionChart = false;
	let toggleSubjectChart = false;
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

	// Buttons to serve as horizontal scrollbar
	let scrollContainer;

	function scrollLeft() {
		scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
		//console.log('left:', scrollContainer?.scrollWidth);
	}

	function scrollRight() {
		scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
		//console.log('right:', scrollContainer?.scrollWidth);
	}

	let showLeftButton;
	let showRightButton;
	function updateButtonVisibility() {
		if (!scrollContainer) return;
		showLeftButton = scrollContainer.scrollLeft > 0;
		showRightButton =
			scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth - 1;
	}

	// Call updateButtonVisibility() when component is mounted
	import { onMount } from 'svelte';
	onMount(() => {
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', updateButtonVisibility);
			updateButtonVisibility(); // initial check after mount
		}

		return () => {
			// Clean up event listener on unmount
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', updateButtonVisibility);
			}
		};
	});
</script>

<div class="header">
	<button on:click={setToggleVisState} class="close-vis">✕</button>
	<p>
		Select a category to see charts of the {filteredOutletCount}
		{filteredOutletCount < $outletCount ? `(out of ${$outletCount})` : ''} outlets.
	</p>

	<div class="btn-scroll-container">
		<button on:click={scrollLeft} class="left {showLeftButton ? 'active' : 'inactive'}">«</button>

		<div class="button-container" bind:this={scrollContainer}>
			<button
				on:click={() => {
					toggleFormatChart = !toggleFormatChart;
					toggleEthnicityChart = null;
					toggleReligionChart = null;
					toggleLanguageChart = null;
				}}
				class:active={toggleFormatChart}>Format</button
			>
			<button
				on:click={() => {
					toggleEthnicityChart = !toggleEthnicityChart;
					toggleReligionChart = null;
					toggleSubjectChart = null;
					toggleLanguageChart = null;
					toggleFormatChart = null;
				}}
				class:active={toggleEthnicityChart}
				class="audience-btn-gp first">Ethnicity</button
			>
			<button
				on:click={() => {
					toggleReligionChart = !toggleReligionChart;
					toggleSubjectChart = null;
					toggleLanguageChart = null;
					toggleFormatChart = null;
					toggleEthnicityChart = null;
				}}
				class:active={toggleReligionChart}
				class="audience-btn-gp second">Religion</button
			>
			<button
				on:click={() => {
					toggleSubjectChart = !toggleSubjectChart;
					toggleLanguageChart = null;
					toggleFormatChart = null;
					toggleEthnicityChart = null;
					toggleReligionChart = null;
				}}
				class:active={toggleSubjectChart}
				class="audience-btn-gp third">Subject</button
			>
			<button
				on:click={() => {
					toggleLanguageChart = !toggleLanguageChart;
					toggleEthnicityChart = null;
					toggleReligionChart = null;
					toggleSubjectChart = null;
					toggleFormatChart = null;
				}}
				class:active={toggleLanguageChart}>Language</button
			>
		</div>

		<button on:click={scrollRight} class="right {showRightButton ? 'active' : 'inactive'}">»</button
		>
	</div>
</div>

<div class="vis-element" in:fade={{ duration: 100 }}>
	{#if $filteredDirectory?.features.length > 0}
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

		{#if toggleReligionChart && !$selectedAudience?.religion}
			<BarChart {toggleTable} category={'religion'} dataField={'TARGET RELIGION'} />
		{/if}
		{#if toggleReligionChart && $selectedAudience?.religion}
			<p>To see the chart, clear the <span class="tab">Religion</span> filter.</p>
		{/if}

		{#if toggleSubjectChart && !$selectedAudience?.theme}
			<BarChart {toggleTable} category={'theme'} dataField={'TARGET THEME'} />
		{/if}
		{#if toggleSubjectChart && $selectedAudience?.theme}
			<p>To see the chart, clear the <span class="tab">Subject</span> filter.</p>
		{/if}

		{#if toggleLanguageChart && !$selectedLanguage}
			<BarChart {toggleTable} category={'language'} dataField={'PRIMARY LANGUAGE'} />
		{/if}
		{#if toggleLanguageChart && $selectedLanguage}
			<p>To see the chart, clear the <span class="tab">Language</span> filter.</p>
		{/if}
	{:else}
		<p>No outlets found. Please change the filter selections.</p>
	{/if}
</div>

<div class="footer">
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
	.header {
		padding-top: 2px;
		background-color: rgba(111, 196, 236, 0.75);
		border-radius: 8px 8px 0 0;
		border-bottom: 1px solid rgba(111, 196, 236, 1);
		border-bottom: 0.5px solid #4bb6e5;
		position: relative;
	}

	.close-vis {
		padding: 0 5px;
		float: right; /* Source: K. Powell: youtube.com/watch?v=nZ05Oqccq6g */
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
		font-size: 0.75rem;
		line-height: 1.1;
		font-family: 'Roboto Condensed', sans-serif;
	}

	/* horizontally scroll buttons */
	.header > .btn-scroll-container {
		padding: 0 5px 1px;
		overflow: hidden;

		display: flex;
		align-items: baseline;
		position: relative;
	}

	.header > .btn-scroll-container > button {
		font-size: 1rem;
		padding: 0 5px;
		/* cursor: auto;
		user-select: none;
		color: rgba(var(--white), 1); */

		/* position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10; */
	}

	.header > .btn-scroll-container > button.active {
		color: rgba(var(--black), 1);
		cursor: pointer;
		pointer-events: all;
	}

	.header > .btn-scroll-container > button.inactive {
		display: none;
	}

	.header > .btn-scroll-container > button.left {
		left: 0;
	}

	.header > .btn-scroll-container > button.right {
		right: 0;
	}

	/* category buttons */
	.header > .btn-scroll-container > .button-container {
		padding: 0 1px 3px;
		overflow-x: auto; /* enables horizontal scrolling */
		overflow-y: hidden;
		white-space: nowrap; /* makes content flow horizontally */

		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.header > .btn-scroll-container > .button-container::-webkit-scrollbar {
		display: none;
	}

	.header > .btn-scroll-container > .button-container > button {
		background-color: rgba(var(--white), 1);
		border-radius: 10px;
		color: rgba(var(--black), 1);
		border: 1px solid rgba(var(--black), 1);
		padding: 1px 8px;
		font-size: 0.75rem;
		font-weight: 600;
		width: fit-content;
		transition: all 0.25s;

		/* flex: 0 0 auto; */

		/* display: flex;
		justify-content: center;
		align-items: center; */
	}

	.header > .btn-scroll-container > .button-container > button.active {
		background-color: rgba(var(--black), 1);
		color: rgba(var(--white), 1);
		cursor: auto;
		border: 1px solid rgba(var(--black), 1);
	}

	/* show scrollbars on mobile */
	@media (hover: none) and (pointer: coarse) {
		.button-container {
			overflow-x: scroll;
			scrollbar-width: auto;
		}

		.header > .btn-scroll-container > button {
			display: none;
		}
	}

	/* audience button group: ethnicity, religion, subject */
	.header > .btn-scroll-container > .button-container > button.first {
		border-radius: 10px 0 0 10px;
		margin-right: -5px;
	}

	.header > .btn-scroll-container > .button-container > button.second {
		border-radius: 0;
		margin-right: -5px;
	}

	.header > .btn-scroll-container > .button-container > button.third {
		border-radius: 0 10px 10px 0;
	}

	/* bar chart */
	.vis-element {
		padding: 5px;
		overflow-y: auto;
		overflow-x: hidden; /* Prevents horizontal scrolling */
		box-shadow: rgba(111, 196, 236, 0.75) 0px 3px 6px -2px inset;
		background-color: rgba(var(--off-white), 1);
		/* pointer-events: all;
		user-select: text;
		cursor: text; */
		flex-grow: 1;
	}

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
