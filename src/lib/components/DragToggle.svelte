<script>
	export let checked;

	let dragName = 'dragOptionToggle';

	// Toggle (show/hide) table
	// export let toggleTable = false;

	// function setToggleTableState() {
	// 	toggleTable = !toggleTable;
	// }
</script>

<label
	for={dragName}
	class="toggle"
	aria-label={checked ? `Turn off option to drag the window` : `Turn on option to drag the window`}
	><span class="toggle-text">Move window</span>
	<input type="checkbox" role="switch" name={dragName} id={dragName} bind:checked /><span
		class="toggle-state"
	>
		<span class="toggle-container">
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
		display: flex;
		align-items: center;
		/* padding: 2px 0; */
		cursor: pointer;
		font-family: 'Roboto Condensed', 'sans-serif;';
	}

	label > .toggle-text {
		margin-right: 0.2rem;
		margin-top: 1px;
		text-transform: uppercase;
		font-size: 0.7rem;
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
		width: 40px;
		height: 18px;
		border-radius: 10px;
	}

	/* toggle-container when switch checked */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container {
		/* background: rgba(var(--cerulean), 0.6); */
		background-color: rgba(var(--blue-gray), 1);
	}

	/* switch */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .switch {
		position: relative;
		top: 0;
		left: 2px;
		display: inline-block;
		border-radius: 9px;
		width: 12px;
		height: 12px;
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
		top: 1px;
		right: 4px;
	}

	/* switch on/off label when checked */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .active {
		right: auto;
		left: 5px;
		color: rgba(var(--white), 1);
	}

	/* switch checked */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container > .switch {
		left: 23px;
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
