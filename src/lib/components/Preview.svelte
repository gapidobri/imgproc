<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Selection } from './types';

  export let src: string;

  export let selection: Selection = {
    selected: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  let points = { x1: 0, y1: 0, x2: 0, y2: 0 };
  let scaledWidth = 0;
  let scaledHeight = 0;

  let image: HTMLImageElement;
  let wrapper: HTMLDivElement;

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
    if (e.target !== wrapper) return;

    if (mouseDown) {
      points.x2 = e.offsetX;
      points.y2 = e.offsetY;
      selection.selected = true;
    }

    selection.x = Math.min(points.x1, points.x2);
    selection.y = Math.min(points.y1, points.y2);

    scaledWidth = Math.abs(points.x1 - points.x2);
    scaledHeight = Math.abs(points.y1 - points.y2);
    selection.width = scaledWidth * (image.naturalWidth / image.width);
    selection.height = scaledHeight * (image.naturalHeight / image.height);
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.target !== wrapper) return;

    points.x1 = e.offsetX;
    points.y1 = e.offsetY;

    mouseDown = true;
    selection.selected = false;
  }

  function handleMouseUp(e: MouseEvent) {
    mouseDown = false;
  }
</script>

<div bind:this={wrapper}>
  <img {src} class="pointer-events-none select-none" bind:this={image} alt="" />

  {#if selection.selected}
    <div
      class="absolute pointer-events-none select-none border border-white border-dashed"
      style="width: {scaledWidth}px; height: {scaledHeight}px; left: {image.offsetLeft +
        selection.x}px; top: {image.offsetTop + selection.y}px;"
    />
  {/if}
</div>
