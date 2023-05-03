<script lang="ts">
  import { Button, Input } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatcher = createEventDispatcher();

  type Cell = {
    value: string;
    index: number;
  };

  let size = 3;
  $: if (size < 3) size = 3;

  let matrix: Cell[][];

  $: matrix = Array(size)
    .fill(0)
    .map((_, i1) =>
      Array(size)
        .fill(0)
        .map((_, i2) => ({ value: '0', index: i1 * size + i2 })),
    );

  function handleApply() {
    const matrixValues = matrix.map((row) =>
      row.map((cell) => Number(cell.value)),
    );
    dispatcher('apply', matrixValues);
  }
</script>

<div class="space-y-2">
  <div class="flex gap-2">
    <table>
      {#each matrix as row}
        <tr>
          {#each row as cell (cell.index)}
            <td><Input bind:value={cell.value} defaultClass="w-8" /></td>
          {/each}
        </tr>
      {/each}
    </table>
    {#if size > 3}
      <Button size="xs" color="red" on:click={() => (size -= 2)}>-</Button>
    {/if}
    <Button size="xs" color="green" on:click={() => (size += 2)}>+</Button>
  </div>

  <Button on:click={handleApply}>Apply Matrix</Button>
</div>
