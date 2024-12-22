<script>
	import { hierarchy, pack } from 'd3-hierarchy';

	// Import component
	import BubblesTooltip from '$lib/components/visualizations/BubblesTooltip.svelte';

	// Import stores
	import { filteredDirectory } from '$lib/stores.js';

	let width = 400;
	let height = 200;

	// ex. Ethnicity, language
	export let dataField = '';

	// Find count of each category item
	$: itemCount = Object.entries(
		$filteredDirectory.features?.reduce((acc, outlet) => {
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
		}, {})
	).map(([name, value]) => ({ name, value })); // set for hierarchy()

	let nodes = [];

	const plotPack = pack().size([width, height]).padding(1.5);

	$: if (itemCount) {
		const root = hierarchy({ children: itemCount }).sum((d) => d.value);
		nodes = plotPack(root).leaves();
	}

	// Variable for when mouse hovers over bubble
	let hoverData;

	// Prop from tooltip, to add to label (ethnicity, language)
	export let category;
</script>

<svg {width} {height}>
	{#each nodes as node}
		<g
			transform={`translate(${node.x - 75},${node.y + 0})`}
			on:mouseover={() => {
				hoverData = node;
			}}
			on:mouseleave={() => (hoverData = null)}
		>
			<circle r={node.r}></circle>

			<text dy="0.3em">
				<!-- Add label to bubble if bubble radius is certain width -->
				{#if node.r >= 15}
					<!-- Split label onto two lines if it contains more than one word -->
					{#if node.data.name.split(' ').length > 1}
						<tspan x="0" dy="0">{node.data.name.split(' ')[0]}</tspan>
						<tspan x="0" dy="0.75rem">{node.data.name.split(' ').slice(1).join(' ')}</tspan>
					{:else}
						{node.data.name}
					{/if}
				{/if}
			</text>
		</g>
	{/each}
</svg>

{#if hoverData}
	<BubblesTooltip {category} data={hoverData} />
{/if}

<style>
	svg {
		display: block;
		margin: auto;
	}
	circle,
	text {
		cursor: pointer;
	}

	circle {
		fill: rgba(var(--gold), 0.8);
		/* stroke: rgba(var(--gold), 1);
		stroke-width: 1.1; */
	}

	text {
		font-family: 'Roboto Condensed', sans-serif;
		font-size: 12px;
		fill: rgba(var(--black), 1);
		text-anchor: middle;
	}
</style>
