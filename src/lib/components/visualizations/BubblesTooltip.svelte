<script>
	export let data;
	const width = 225;
	let tooltipWidth;

	$: x = data.x;
	$: y = data.y;

	$: xPosition = x - 50 + tooltipWidth > width ? x - 50 - tooltipWidth : x - 50;
	$: yPosition = y - 25;

	// Import transitions
	import { fly } from 'svelte/transition';

	export let category;
</script>

<div
	class="tooltip"
	transition:fly={{ y: 10 }}
	style="position: absolute; top: {yPosition}px; left: {xPosition}px"
	bind:clientWidth={tooltipWidth}
>
	<p class="category">{category}</p>
	<p class="name">{data.data.name}</p>
	<p class="value">
		<strong>{data.data.value}</strong>
		{data.data.value > 1 ? 'outlets' : 'outlet'}
	</p>
</div>

<style>
	.tooltip {
		padding: 8px;
		background: white;
		box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.05);
		border: 0.5px solid silver;
		border-radius: 3px;
		pointer-events: none;
		transition: 0.5s ease;
		/* max-width: fit-content; */

		display: inline-block; /* Fits content width for single word */
		white-space: nowrap; /* Keeps single word on one line */
		overflow-wrap: break-word; /* Allows breaking for multi-word */
		max-width: 125px; /* Set a maximum width to enforce breaking */
		/*text-align: center; /* Optional: centers text if it wraps */
	}

	.category {
		font-family: 'Roboto Condensed', sans-serif;
		font-size: 0.65rem;
		text-transform: uppercase;
		color: rgba(var(--gray), 1);
		font-weight: 600;
	}

	.name {
		font-family: 'DM Sans Serif', sans-serif;
		font-size: 0.9rem;
		text-transform: uppercase;
		font-weight: 600;
		color: rgba(var(--gold), 1);
	}

	.value {
		font-family: 'Roboto Condensed', sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
	}

	/* .language {
		font-family: 'Roboto Condensed', sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		font-weight: 600;
	} */
</style>
