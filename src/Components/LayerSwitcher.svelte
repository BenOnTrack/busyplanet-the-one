<!-- LayerColorSwitcher -->
<script lang="ts">
	import { MultiSelect } from 'carbon-components-svelte';
    import {handleSelect} from '../utils/MapFunctions.svelte';

    interface StyleLayer {
		id: number;
		text: string;
		visibility: string;
	}

    export let map; // map to apply the style to
	export let layerSwitcherIds: StyleLayer[] = [];; //  value/label for the layers
    export let layerSwitcherSelectedIds
    
</script>

<div class="map-overlay top">
	<div class="map-overlay-inner">
		<MultiSelect
			selectedIds={layerSwitcherSelectedIds}
			label="Layers to be displayed"
			items={layerSwitcherIds}
			on:select={(e) => handleSelect(map, e)}
		/>
	</div>
</div>

<style>
	.map-overlay {
		font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
		position: absolute;
		width: 300px;
		top: 65px;
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
</style>
