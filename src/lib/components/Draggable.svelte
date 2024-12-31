<script>
	export let left = 0;
	export let top = 0;

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
	role="dialog"
	aria-label="Drag window"
	on:mousedown={startDragging}
	style="margin-left: {left}px; margin-top: {top}px;"
	class="draggable-element"
>
	<slot />
</div>

<svelte:window on:mouseup={stopDragging} on:mousemove={dragElement} />

<style>
	.draggable-element {
		position: absolute;
		user-select: none;
		cursor: move;
	}
</style>
