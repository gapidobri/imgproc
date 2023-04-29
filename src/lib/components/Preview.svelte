<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  export let src: string;

  let image: HTMLImageElement;

  export let selected = false;
  export let selection = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };

  let x = 0;
  let y = 0;
  let width = 50;
  let height = 50;

  let mouseDown = false;

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
  });

  onDestroy(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
  });

  function handleMouseMove(e: MouseEvent) {
    if (mouseDown) {
      selection.x2 = clampX(e.clientX);
      selection.y2 = clampY(e.clientY);
      selected = true;
    }
    x = Math.min(selection.x1, selection.x2);
    y = Math.min(selection.y1, selection.y2);
    width = Math.abs(selection.x1 - selection.x2);
    height = Math.abs(selection.y1 - selection.y2);
  }

  function handleMouseDown(e: MouseEvent) {
    selection.x1 = clampX(e.clientX);
    selection.y1 = clampY(e.clientY);
    selection.x2 = clampX(e.clientX);
    selection.y2 = clampY(e.clientY);
    mouseDown = true;
    selected = false;
  }

  function handleMouseUp(e: MouseEvent) {
    mouseDown = false;
  }

  function clampX(value: number) {
    const pos = image.getBoundingClientRect();
    return Math.max(pos.x, Math.min(value, pos.x + image.width));
  }

  function clampY(value: number) {
    const pos = image.getBoundingClientRect();
    return Math.max(pos.y, Math.min(value, pos.y + image.height));
  }
</script>

<img {src} class="pointer-events-none select-none" bind:this={image} alt="" />

{#if selected}
  <div
    class="absolute border border-white border-dashed"
    style="width: {width}px; height: {height}px; left: {x}px; top: {y}px;"
  />
{/if}
