<script>
	import { map } from '$lib/stores.js';

	export let centerMap;
	export let isMobile;
</script>

<button
	class="reset-map"
	aria-label="Reset map to initial position"
	on:click|stopPropagation={() => {
		$map.flyTo({
			center: [centerMap.lng, centerMap.lat],
			essential: true, // "this animation is considered essential with respect to prefers-reduced-motion"
			zoom: !isMobile ? 7.25 : 8,
			speed: 1,
			curve: 1
		});
	}}><slot /></button
>

<style>
	button.reset-map {
		background-color: rgba(var(--white), 1);
		padding: 2px;
		border-radius: 4px;
		margin-left: auto;
		/* display: flex; */ /* if applied, doesn't appear on mobile */
		/* justify-content: center; */
		/* align-items: center; */
		width: 30px;
		height: 30px;
		/* box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.15); */
		border: 1px solid rgba(var(--black), 0.2);
		cursor: pointer;
		box-shadow: 0 0 4px 4px rgba(var(--black), 0.05);
	}
</style>
