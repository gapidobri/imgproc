<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Spinner,
    Range,
    P,
    Input,
  } from 'flowbite-svelte';
  import { applyFilter, grayscale } from './lib/engine/processor';
  import {
    type FilterFn,
    sharpeningFilter,
    laplaceFilter,
    sobelFilter,
    gaussianBlurFilter,
    boxBlurFilter,
    removeColorChannelFilter,
    thresholdFilter,
    enhanceColorChannelFilter,
    setBrightnessFilter,
    customMatrixFilter,
  } from './lib/engine/filters';
  import 'chart.js/auto';
  import ImageUpload from './lib/components/ImageUpload.svelte';
  import demoImage from './assets/image.jpeg';
  import { ColorChannel } from './lib/engine/types';
  import Preview from './lib/components/Preview.svelte';
  import type { Selection } from './lib/components/types';
  import Matrix from './lib/components/Matrix.svelte';
  import Histogram from './lib/components/Histogram.svelte';

  let originalSrc: string | null = demoImage;
  let src: string | null = demoImage;
  let processing = false;

  let thresholdValue = 128;
  let brightnessValue = 1;

  let selection: Selection;

  type Filter = {
    name: string;
    src: string;
  };

  let filters: Filter[] = [];

  async function apply(name: string, filter: FilterFn) {
    processing = true;
    src = await applyFilter(src, filter, selection);
    filters = [...filters, { name, src }];
    processing = false;
  }

  function handleUpload(e: CustomEvent) {
    src = e.detail.src;
    originalSrc = e.detail.src;
  }

  function undo() {
    filters = filters.slice(0, -1);
    src = filters[filters.length - 1]?.src || originalSrc;
  }

  function reset() {
    filters = [];
    src = originalSrc;
  }
</script>

<div class="p-4 space-y-2 h-screen flex flex-col">
  <div class="w-max">
    <ImageUpload on:upload={handleUpload} />
  </div>

  {#if src}
    <P>Filters</P>
    <div class="flex">
      <ButtonGroup>
        <Button on:click={() => apply('Box blur', boxBlurFilter)}
          >Box blur</Button
        >
        <Button on:click={() => apply('Gaussian blur', gaussianBlurFilter)}>
          Gaussian blur
        </Button>
        <Button on:click={() => apply('Laplace', laplaceFilter)}>
          Laplace
        </Button>
        <Button on:click={() => apply('Sobel', sobelFilter)}>Sobel</Button>
        <Button on:click={() => apply('Sharpening', sharpeningFilter)}>
          Sharpening
        </Button>
        <Button on:click={() => apply('Grayscale', grayscale)}>
          Grayscale
        </Button>
      </ButtonGroup>

      <div class="grow" />

      <div class="gap-y-2">
        <Button on:click={undo}>Undo</Button>
        <Button color="red" on:click={reset}>Reset</Button>
      </div>
    </div>
    <div class="flex space-x-4">
      <div class="space-y-2">
        <div class="flex items-center gap-x-4 w-96">
          <Button
            on:click={() =>
              apply(
                `Threshold: ${thresholdValue}`,
                thresholdFilter(thresholdValue),
              )}
          >
            Threshold
          </Button>
          <P class="w-16">{thresholdValue}</P>
          <Range bind:value={thresholdValue} min={0} max={255} />
        </div>
        <div>
          <ButtonGroup>
            <Button
              color="red"
              on:click={() =>
                apply('Remove Red', removeColorChannelFilter(ColorChannel.red))}
            >
              Remove Red
            </Button>
            <Button
              color="green"
              on:click={() =>
                apply(
                  'Remove Green',
                  removeColorChannelFilter(ColorChannel.green),
                )}
            >
              Remove Green
            </Button>
            <Button
              color="blue"
              on:click={() =>
                apply(
                  'Remove Blue',
                  removeColorChannelFilter(ColorChannel.blue),
                )}
            >
              Remove Blue
            </Button>
          </ButtonGroup>
        </div>
        <div>
          <ButtonGroup>
            <Button
              color="red"
              on:click={() =>
                apply(
                  'Enhance Red',
                  enhanceColorChannelFilter(ColorChannel.red),
                )}
            >
              Enhance Red
            </Button>
            <Button
              color="green"
              on:click={() =>
                apply(
                  'Enhance Green',
                  enhanceColorChannelFilter(ColorChannel.green),
                )}
            >
              Enhance Green
            </Button>
            <Button
              color="blue"
              on:click={() =>
                apply(
                  'Enhance Blue',
                  enhanceColorChannelFilter(ColorChannel.blue),
                )}
            >
              Enhance Blue
            </Button>
          </ButtonGroup>
        </div>
        <div class="flex items-center gap-x-4 w-96">
          <Button
            on:click={() =>
              apply(
                `Brightness: ${brightnessValue}`,
                setBrightnessFilter(brightnessValue),
              )}
          >
            Brightness
          </Button>
          <P class="w-16">{brightnessValue}</P>
          <Range bind:value={brightnessValue} min={0} max={5} step={0.1} />
        </div>
      </div>
      <div>
        <Matrix
          on:apply={(e) => apply('Custom matrix', customMatrixFilter(e.detail))}
        />
      </div>
    </div>
  {/if}

  <div class="grow flex">
    <div class="w-32" />
    <div class="grow flex justify-center items-center">
      <Preview {src} bind:selection />
      {#if processing}
        <div class="absolute">
          <Spinner />
        </div>
      {/if}
    </div>
    <div class="w-32">
      {#each filters as filter}
        <P>{filter.name}</P>
      {/each}
    </div>
  </div>
</div>

<div class="flex justify-center mb-16">
  <div class="w-2/3">
    <Histogram {src} />
  </div>
</div>
