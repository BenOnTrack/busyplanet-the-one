<!-- LayerColorSwitcher -->
<script lang="ts">
    export let map; // map to apply the style to
    export let layerColorSwitcherIds; //  value/label for the layers
    import {changeLayerColor} from "../utils/MapFunctions.svelte";

    // LayerColorSwitcher
	let selectedLayer:string = 'water';

    let Layercolors:string[] = [
		'#ffffcc',
		'#a1dab4',
		'#41b6c4',
		'#2c7fb8',
		'#253494',
		'#fed976',
		'#feb24c',
		'#fd8d3c',
		'#f03b20',
		'#bd0026'
	];
</script>

<div class="map-overlay top">
	<div class="map-overlay-inner">
		<fieldset>
			<!-- <label for="layer">Layer Style</label> -->
			<select id="layer" bind:value={selectedLayer}>
				{#each layerColorSwitcherIds as layerId (layerId.text)}
					<option value={layerId.text}>{layerId.text}</option>
				{/each}
			</select>
		</fieldset>
		<fieldset>
			<!-- <label for="color">Choose a color</label> -->
			<div id="swatches">
				{#each Layercolors as color}
					<button
						on:click={() => changeLayerColor(map, selectedLayer, color)}
						style="background-color: {color}"
					/>
				{/each}
			</div>
		</fieldset>
	</div>
</div>

<style>
	.map-overlay {
		font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
		position: absolute;
		width: 200px;
		top: 0;
		left: 0;
		padding: 10px;
	}

	.map-overlay .map-overlay-inner {
		background-color: #fff;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		padding: 10px;
		margin-bottom: 10px;
	}

	.map-overlay-inner fieldset {
		border: none;
		padding: 0;
		margin: 0 0 5px;
	}

	.map-overlay-inner fieldset:last-child {
		margin: 0;
	}

	.map-overlay-inner select {
		width: 100%;
	}
</style>
