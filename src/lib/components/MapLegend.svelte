<script>
	// Color by format
	export let newspaperFormat, tvFormat, radioFormat, magazineFormat, digitalFormat;

	const legendItems = [
		{ label: 'Newspaper', color: newspaperFormat },
		{ label: 'TV', color: tvFormat },
		{ label: 'Radio', color: radioFormat },
		{ label: 'Magazine', color: magazineFormat },
		{ label: 'Digital-only', color: digitalFormat }
	];

	// Import store
	import { selectedFormat } from '$lib/stores.js';
</script>

<div class="legend-container">
	<p style="text-transform: uppercase; font-weight: 600; text-align: center; text-align: right;">
		Legend
	</p>
	<div class="legend">
		{#each legendItems as item}
			<button class="legend-item" on:click={() => ($selectedFormat = item.label)}>
				<span class="label">{item.label}</span>
				<span
					class="bullet"
					style="color: rgb({item.color}); background-color: rgba({item.color}, 0.1); text-shadow: 1px 0px 5px rgba(var(--white), 1);"
					>●</span
				>
			</button>
		{/each}
	</div>
</div>

<style>
	.legend-container {
		font-family: 'Roboto Condensed', 'sans-serif;';
		font-size: 0.8rem;
	}
	.legend {
		padding: 5px 0 5px 5px;
		width: 125px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 2px;
	}

	.legend-item {
		line-height: 1.15;
		text-shadow:
			0 0 5px #fff,
			0 0 10px #fff,
			0 0 20px #fff,
			0 0 30px #fff,
			0 0 40px #fff;
	}

	.bullet {
		font-size: 1rem;
		margin-left: 5px;
		padding: 0 2px;
	}
</style>
