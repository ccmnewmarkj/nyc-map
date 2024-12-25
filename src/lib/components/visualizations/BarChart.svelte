<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';

	// Import components
	import Table from '$lib/components/visualizations/Table.svelte';

	// Import stores
	import { filteredDirectory, directoryData } from '$lib/stores.js';

	// Props
	export let dataField = '';

	// Get count of each primary item from $directoryData (i.e. full dataset)
	function roundUp(number) {
		// Round up to nearest multiple of 5
		return Math.ceil(number / 5) * 5;
	}

	// Use format counts from unfiltered directory to establish x-axis width
	let originalitemCount = roundUp(
		max(
			Object.values(
				$directoryData.features?.reduce((acc, outlet) => {
					const item = outlet.properties[dataField];
					acc[item] = (acc[item] || 0) + 1;
					return acc;
				}, {})
			)
		)
	);

	// Get count of each item
	$: itemCount = $filteredDirectory.features?.reduce((acc, outlet) => {
		const item = outlet.properties[dataField];
		acc[item] = (acc[item] || 0) + 1;
		return acc;
	}, {});

	// Sort itemLabels based on itemCount
	$: sortedItemLabels = itemLabels[0].sort((a, b) => (itemCount[b] || 0) - (itemCount[a] || 0));

	const margin = { top: 0, right: 30, bottom: 0, left: 2 };
	const chartHeight = 200;
	const chartWidth = 225;
	const innerWidth = chartWidth - margin.left - margin.right;
	const innerHeight = chartHeight - margin.top - margin.bottom;

	let itemLabels = Array([
		...new Set($directoryData.features?.map((outlet) => outlet.properties[dataField]))
	]);

	$: xScale = scaleLinear().domain([0, originalitemCount]).range([0, innerWidth]);
	$: yScale = scaleBand().domain(sortedItemLabels).range([0, innerHeight]).padding(0.5);

	// Swap to table version of data
	export let toggleTable;

	// Import transition
	import { fade } from 'svelte/transition';
</script>

{#if !toggleTable}
	<div id="bar-chart-container" in:fade>
		<svg id="bar-chart" width={chartWidth} height={chartHeight}>
			<g transform="translate({margin.left}, {margin.top})">
				{#each sortedItemLabels as item}
					<rect
						x={0}
						y={yScale(item)}
						width={xScale(itemCount[item] || 0)}
						height={yScale.bandwidth()}
						stroke="rgba(var(--gold), 1)"
						stroke-width="0.75"
						fill="rgba(var(--gold), 0.65)"
					/>

					<!-- Count labels -->
					<text
						x={(itemCount[item] || 0) === 0
							? xScale(itemCount[item] || 0)
							: xScale(itemCount[item] || 0) + 5}
						y={yScale(item) + yScale.bandwidth() / 2}
						text-anchor="start"
						alignment-baseline="middle"
						fill="rgba(var(--gold), 1)">{itemCount[item] || 0}</text
					>

					<!-- item labels -->
					<text
						x={0}
						y={yScale(item) + yScale.bandwidth() / 2 - 14}
						text-anchor="start"
						alignment-baseline="middle"
						fill="rgba(var(--gold), 1)"
						class="item-labels">{item}</text
					>
					<title>{item}: {itemCount[item] || 0}</title>
				{/each}
			</g>
		</svg>
	</div>
{:else}
	<div id="table-container" in:fade>
		<Table data={itemCount} filter={'Format'} />
	</div>
{/if}

<style>
	.item-labels {
		font-size: 12px;
		fill: rgba(var(--black), 1);
	}

	rect {
		transition: all 0.5s;
	}

	#bar-chart-container,
	#table-container {
		padding: 3px;
	}
</style>
