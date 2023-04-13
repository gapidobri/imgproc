<script lang="ts">
  import { Button, ButtonGroup, Fileupload, Spinner } from 'flowbite-svelte';
  import { applyFilter, getHistogram } from './lib/processor';
  import {
    boxFilter,
    sharpening,
    type FilterFn,
    edgeDetection,
    sobel,
  } from './lib/filters';
  import { Line } from 'svelte-chartjs';
  import 'chart.js/auto';

  let files: FileList;
  let originalSrc: string;
  let filterSrc: string;
  let processing = false;
  let histogram: { red: number[]; green: number[]; blue: number[] };

  $: if (files) {
    originalSrc = URL.createObjectURL(files[0]);
    getHistogram(originalSrc).then((h) => (histogram = h));
  }

  async function apply(filter: FilterFn) {
    processing = true;
    filterSrc = await applyFilter(originalSrc, filter);
    processing = false;
  }
</script>

<div class="p-4 space-y-2 w-screen">
  <Fileupload bind:files />

  <ButtonGroup>
    <Button on:click={() => apply(boxFilter(2))}>Box Filter</Button>
    <Button on:click={() => apply(sharpening)}>Sharpening</Button>
    <Button on:click={() => apply(edgeDetection)}>Edge detection</Button>
    <Button on:click={() => apply(sobel)}>Sobel</Button>
  </ButtonGroup>

  <div class="flex space-x-2 w-full">
    <img src={originalSrc} alt="" class="w-1/2" />

    {#if processing}
      <div class="flex items-center justify-center w-1/2">
        <Spinner />
      </div>
    {:else if filterSrc}
      <img src={filterSrc} alt="" class="w-1/2" />
    {/if}
  </div>

  <div class="w-1/2">
    <Line
      data={{
        labels: new Array(256).fill(0).map((_, i) => i),
        datasets: [
          {
            fill: true,
            label: 'Red',
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            data: histogram?.red,
          },
          {
            fill: true,
            label: 'Green',
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            data: histogram?.green,
          },
          {
            fill: true,
            label: 'Blue',
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            data: histogram?.blue,
          },
        ],
      }}
    />
  </div>
</div>
