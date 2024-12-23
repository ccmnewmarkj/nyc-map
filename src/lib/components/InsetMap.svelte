<script>
	// Import icon components
	import BarChartOpenIcon from './icons/BarChartOpen.svelte';
	import BarChartCloseIcon from './icons/BarChartClose.svelte';

	// Toggle inset map
	let toggleInsetMap = true;
</script>

{#if toggleInsetMap}
	<div class="inset-btn-container">
		Inset <button on:click={() => (toggleInsetMap = !toggleInsetMap)}><BarChartCloseIcon /></button>
	</div>
	<div id="mapInset"></div>
{:else}
	<div class="inset-btn-container">
		Inset <button on:click={() => (toggleInsetMap = !toggleInsetMap)}><BarChartOpenIcon /></button>
	</div>
{/if}

<style>
	.inset-btn-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.inset-btn-container button {
		background: rgba(var(--black), 1);
		border-radius: 20px;
		padding: 5px 5px 3px 5px;
		width: fit-content;
		box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1); /* outer glow */
	}
</style>
