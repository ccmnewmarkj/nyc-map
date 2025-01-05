<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';

	// Import components
	import Table from '$lib/components/visualizations/Table.svelte';
	import VisHeader from '$lib/components/visualizations/VisHeader.svelte';

	// Import stores
	import { filteredDirectory, directoryData } from '$lib/stores.js';

	// Props
	export let dataField = '';

	// Get count of each primary item from $directoryData (i.e. full dataset)
	function roundUp(number) {
		// Round up to nearest multiple of 5
		return Math.ceil(number / 5) * 5;
	}

	// Use max of format counts (rounded up) from unfiltered directory to establish x-axis width
	let originalItemCount = $directoryData.features?.reduce((acc, outlet) => {
		const items = outlet.properties[dataField];
		if (Array.isArray(items)) {
			items.forEach((item) => {
				if (item !== undefined) {
					acc[item] = (acc[item] || 0) + 1;
				}
			});
		} else if (items !== undefined) {
			acc[items] = (acc[items] || 0) + 1;
		}
		return acc;
	}, {});
	let originalitemCountMax = roundUp(max(Object.values(originalItemCount)));

	// Get count of each item
	$: itemCount = $filteredDirectory.features?.reduce((acc, outlet) => {
		const items = outlet.properties[dataField];
		if (Array.isArray(items)) {
			items.forEach((item) => {
				if (item !== undefined) {
					acc[item] = (acc[item] || 0) + 1;
				}
			});
		} else if (items !== undefined) {
			acc[items] = (acc[items] || 0) + 1;
		}
		return acc;
	}, {});
	// Format:
	// $: itemCount = $filteredDirectory.features?.reduce((acc, outlet) => {
	// 	const item = outlet.properties[dataField];
	// 	acc[item] = (acc[item] || 0) + 1;
	// 	return acc;
	// }, {});

	const margin = { top: 20, right: 10, bottom: 0, left: 2 };

	export let category;

	$: itemLabels = Array([
		...new Set(
			$directoryData?.features
				.flatMap((outlet) => outlet.properties[dataField])
				.filter((item) => item !== undefined)
		)
	]);

	// let itemLabels = Array([
	// 	...new Set($directoryData.features?.map((outlet) => outlet.properties[dataField]))
	// ]);

	// Sort itemLabels based on itemCount
	$: sortedItemLabels = itemLabels[0].sort((a, b) => (itemCount[b] || 0) - (itemCount[a] || 0));

	const chartWidth = 225;
	$: chartHeight = itemLabels[0]?.length * 40;
	const innerWidth = chartWidth - margin.left - margin.right;
	$: innerHeight = chartHeight - margin.top - margin.bottom;

	$: xScale = scaleLinear().domain([0, originalitemCountMax]).range([0, innerWidth]);
	$: yScale = scaleBand().domain(sortedItemLabels).range([0, innerHeight]).paddingInner(0.55);

	// Swap to table version of data
	export let toggleTable;

	// Import transition
	import { fade } from 'svelte/transition';
</script>

<VisHeader filterCategory={category} />
{#if !toggleTable}
	<div id="bar-chart-container" in:fade>
		<svg id="bar-chart" width={chartWidth} height={chartHeight}>
			<g transform="translate({margin.left}, {margin.top})">
				{#each sortedItemLabels as item}
					<!-- Gray background bars, at width of unfiltered directory format counts -->
					<rect
						x={0}
						y={yScale(item)}
						width={xScale(originalItemCount[item] || 0)}
						height={yScale.bandwidth()}
						fill="rgba(var(--light-gray), 1)"
					/>

					<!-- Filtered format bars -->
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
							: xScale(itemCount[item]) > innerWidth - 10
								? xScale(itemCount[item] || 0) - 25
								: xScale(itemCount[item] || 0) + 5}
						y={yScale(item) + yScale.bandwidth() / 2 + 1}
						text-anchor="start"
						alignment-baseline="middle"
						fill="rgba(var(--black), 1)"
						class="count-labels">{itemCount[item] || 0}</text
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
		<Table data={itemCount} filter={category} />
	</div>
{/if}

<style>
	#bar-chart-container,
	#table-container {
		padding: 0 5px;
	}

	.count-labels {
		font-size: 0.8rem;
		font-weight: 600;
	}

	.item-labels {
		font-size: 0.85rem;
		fill: rgba(var(--black), 1);
		font-family: 'DM Sans', sans-serif;
	}

	rect {
		transition: all 0.5s;
	}
</style>
