<script lang="ts">
  import { Fileupload } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleFileChange(e) {
    const src = URL.createObjectURL(e.currentTarget.files[0]);
    dispatch('upload', { src });
  }
</script>

<Fileupload on:change={handleFileChange} />
