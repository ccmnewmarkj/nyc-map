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

	// Move modal using arrow keys
	function handleKeydown(e) {
		if (e.key === 'ArrowRight') left += 10;
		if (e.key === 'ArrowLeft') left -= 10;
		if (e.key === 'ArrowDown') top += 10;
		if (e.key === 'ArrowUp') top -= 10;
	}
</script>

<div
	role="dialog"
	aria-label="Movable popup window"
	aria-modal="true"
	tabindex="0"
	on:mousedown={startDragging}
	on:keydown={handleKeydown}
	style="margin-left: {left}px; margin-top: {top}px;"
	class="draggable-element"
>
	<p hidden>Drag this window using the mouse or arrow keys</p>
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
