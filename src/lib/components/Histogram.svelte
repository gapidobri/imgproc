<script lang="ts">
  import { Bar } from 'svelte-chartjs';
  import { getHistogram } from '../engine/processor';
  import type { HistogramData } from '../engine/workers/getHistogram';

  export let src: string;

  let histogram: HistogramData;

  $: if (src) {
    getHistogram(src).then((h) => {
      histogram = h;
    });
  }
</script>

{#if histogram}
  <Bar
    data={{
      labels: histogram.labels,

      datasets: [
        {
          label: 'Red',
          backgroundColor: 'red',
          data: histogram.data.red,
        },
        {
          label: 'Green',
          backgroundColor: 'lime',
          data: histogram.data.red,
        },
        {
          label: 'Blue',
          backgroundColor: 'blue',
          data: histogram.data.red,
        },
      ],
    }}
  />
{/if}
