<script lang="ts">
  import { Line } from 'svelte-chartjs';

  type HistogramData = {
    red: number[];
    green: number[];
    blue: number[];
  };

  export let histogram: HistogramData;
</script>

<Line
  data={{
    labels: new Array(256).fill(0).map((_, i) => i),
    datasets: [
      {
        fill: true,
        label: 'Red',
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        data: histogram.red,
      },
      {
        fill: true,
        label: 'Green',
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        data: histogram.green,
      },
      {
        fill: true,
        label: 'Blue',
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        data: histogram.blue,
      },
    ],
  }}
/>
