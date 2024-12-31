<script>
	// Stores
	import { map } from '$lib/stores.js';

	export let checked;
	export let polygonType;

	function showPolygons() {
		if (polygonType === 'Neighborhoods') {
			$map?.setLayoutProperty('nta-border-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('nta-labels', 'visibility', 'visible');
		}
		if (polygonType === 'Counties') {
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('county-labels', 'visibility', 'visible');
		}
	}

	function clearPolygons() {
		if (polygonType === 'Neighborhoods') {
			$map?.setLayoutProperty('nta-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('nta-labels', 'visibility', 'none');
		}
		if (polygonType === 'Counties') {
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-labels', 'visibility', 'none');
		}
	}
</script>

<!-- Toggle switch based on https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/ -->
<label
	for={polygonType}
	class="toggle"
	aria-label={checked ? `Hide boundaries for ${polygonType}` : `Show boundaries for ${polygonType}`}
	><span class="toggle-text">Show {polygonType}</span>
	<input
		type="checkbox"
		role="switch"
		id={polygonType}
		bind:checked
		on:change={() => {
			if (checked) {
				showPolygons();
			} else {
				clearPolygons();
			}
		}}
	/><span class="toggle-state">
		<span class="toggle-container" class:ntaToggle={polygonType === 'Neighborhoods'}>
			<span class="text" class:active={checked} aria-hidden="true"
				>{#if checked}On
				{:else}Off{/if}</span
			>
			<span class="switch"> </span></span
		>
	</span></label
>

<style>
	label {
		display: block;
		padding: 4px 0 4px;
		cursor: pointer;
		font-family: 'Roboto Condensed', 'sans-serif;';
	}

	label > .toggle-text {
		margin-right: 0.2rem;
		text-transform: uppercase;
		font-size: 0.8rem;
		font-weight: 800;
		text-shadow:
			0 0 5px rgba(var(--white), 1),
			0 0 10px rgba(var(--white), 1),
			0 0 20px rgba(var(--white), 1),
			0 0 30px rgba(var(--white), 1),
			0 0 40px rgba(var(--white), 1);
	}

	/* checkbox */
	input[role='switch'] {
		width: 0;
		height: 0;
	}

	/* toggle-container when "off" */
	label input[role='switch'] ~ .toggle-state > .toggle-container {
		position: relative;
		top: 1px;
		display: inline-block;
		border: 1.5px solid rgba(var(--white), 1);
		background-color: rgba(204, 204, 204, 0.75);
		/* background-color: rgba(var(--blue-gray), 0.5); */
		width: 42px;
		height: 21px;
		border-radius: 10px;
	}

	/* toggle-container when switch checked */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container {
		/* background: rgba(var(--cerulean), 0.6); */
		background-color: rgba(var(--blue-gray), 1);
	}

	/* change toggle color for NTAs */
	/* label input[role='switch'] ~ .toggle-state > .ntaToggle {
		background-color: rgba(var(--gold), 0.5);
	} */

	label input[role='switch']:checked ~ .toggle-state > .ntaToggle {
		background-color: rgba(var(--gold), 0.75);
	}

	/* switch */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .switch {
		position: relative;
		top: 2px;
		left: 3px;
		display: inline-block;
		border-radius: 9px;
		width: 14px;
		height: 14px;
		border: 1px solid rgba(var(--gray), 1);
		background: rgba(var(--white), 1);
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	/* switch on/off label */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .text {
		font-size: 0.7rem;
		text-transform: uppercase;
		position: absolute;
		top: 2.5px;
		right: 3px;
	}

	/* switch on/off label when checked */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .active {
		right: auto;
		left: 4px;
		color: rgba(var(--white), 1);
	}

	/* switch checked */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container > .switch {
		left: 22px;
	}

	/* label:focus-within {
		padding: 2px 2px 4px 4px;
		border-width: 2px;
		border-radius: 10px;
	} */

	/* focus outline */
	label input[role='switch']:focus-visible ~ .toggle-state > .toggle-container {
		outline: 2px solid rgba(var(--cerulean), 1);
		outline-offset: 2px;
	}
</style>
