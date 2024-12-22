<script>
	export let left = 40;
	export let top = 25;

	let dragging = false;

	function startDragging() {
		dragging = true;
	}

	function stopDragging() {
		dragging = false;
	}

	function dragElement(e) {
		if (dragging) {
			left += e.movementX;
			top += e.movementY;
		}
	}
</script>

<div
	on:mousedown={startDragging}
	style="margin-left: {left}px; margin-top: {top}px;"
	class="draggable"
>
	<slot />
</div>

<svelte:window on:mouseup={stopDragging} on:mousemove={dragElement} />

<style>
	.draggable {
		position: absolute;
		user-select: none;
		cursor: move;
	}
</style>
