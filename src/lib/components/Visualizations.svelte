<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';
	//import { axisBottom, axisLeft } from 'd3-axis';

	// Import stores
	import { filteredDirectory, directoryData } from '$lib/stores.js';

	// Get count of each primary format from $directoryData (i.e. full dataset)
	function roundUp(number) {
		// Round up to nearest multiple of 5
		return Math.ceil(number / 5) * 5;
	}

	let originalFormatCount = roundUp(
		max(
			Object.values(
				$directoryData.features?.reduce((acc, outlet) => {
					const format = outlet.properties['PRIMARY FORMAT'];
					acc[format] = (acc[format] || 0) + 1;
					return acc;
				}, {})
			)
		)
	);

	// Get count of each format
	$: formatCount = $filteredDirectory.features?.reduce((acc, outlet) => {
		const format = outlet.properties['PRIMARY FORMAT'];
		acc[format] = (acc[format] || 0) + 1;
		return acc;
	}, {});

	const margin = { top: 0, right: 30, bottom: 0, left: 0 };
	const chartHeight = 200;
	const chartWidth = 200;
	const innerWidth = chartWidth - margin.left - margin.right;
	const innerHeight = chartHeight - margin.top - margin.bottom;

	const formatLabels = Array([
		...new Set($directoryData.features?.map((outlet) => outlet.properties['PRIMARY FORMAT']))
	]);

	$: yScale = scaleBand().domain(formatLabels[0]).range([0, innerHeight]).padding(0.5);
	$: xScale = scaleLinear().domain([0, originalFormatCount]).range([0, innerWidth]);

	// $: yAxisTransform = `translate(${margin.left}, 0)`;

	// Import transition
	import { fade, slide } from 'svelte/transition';
</script>

<div id="bar-chart-container">
	<svg id="bar-chart" width={chartWidth} height={chartHeight}>
		<g transform="translate({margin.left}, {margin.top})">
			{#each formatLabels[0] as format}
				<rect
					x={0}
					y={yScale(format)}
					width={xScale(formatCount[format] || 0)}
					height={yScale.bandwidth()}
					stroke="rgba(var(--gold), 1)"
					stroke-width="0.75"
					fill="rgba(var(--gold), 0.35)"
				/>

				<!-- Count labels -->
				<text
					x={(formatCount[format] || 0) === 0
						? xScale(formatCount[format] || 0)
						: xScale(formatCount[format] || 0) + 5}
					y={yScale(format) + yScale.bandwidth() / 2}
					text-anchor="start"
					alignment-baseline="middle"
					fill="rgba(var(--gold), 1)">{formatCount[format] || 0}</text
				>

				<!-- Format labels -->
				<text
					x={0}
					y={yScale(format) + yScale.bandwidth() / 2 - 14}
					text-anchor="start"
					alignment-baseline="middle"
					fill="rgba(var(--gold), 1)"
					class="format-labels">{format}</text
				>
				<title>{format}: {formatCount[format] || 0}</title>
			{/each}

			<!-- <g class="y-axis" transform={yAxisTransform}>
				{#each formatLabels as format, i}
					<text
						x="-5"
						y={yScale(format) + yScale.bandwidth() / 2}
						text-anchor="end"
						alignment-baseline="middle"
						transition:fade
					>
						{format}
					</text>
				{/each}
			</g> -->
		</g>
	</svg>
</div>

<style>
	#bar-chart {
		display: block;
		margin: 0 auto;
	}

	.format-labels {
		font-size: 12px;
		/* font-weight: 600; */
		fill: rgba(var(--black), 1);
	}

	rect {
		transition: all 0.5s;
	}
</style>
