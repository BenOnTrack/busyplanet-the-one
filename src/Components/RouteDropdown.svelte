<!-- RouteDropdown.svelte -->


<script>
    export let map;
    export let filteredRouteDataSetFeatures;
    export let groupedFilteredRouteDataSetFeatures;
    import {
        Dropdown,
        DropdownItem,
        DropdownMenu,
        DropdownToggle    } from "sveltestrap";
    import {
        toggleRouteAndSetMapView,
    } from "../utils/MapFunctions.svelte";

</script>

<div class="map-overlay top">
	<div class="map-overlay-inner">
<Dropdown >
  <DropdownToggle caret>Select Category</DropdownToggle>
  <DropdownMenu class="map-overlay top">
      {#each Object.keys(groupedFilteredRouteDataSetFeatures) as subclass (subclass)}
          <Dropdown direction="right">
              <DropdownToggle caret class="dropdown-item">
                  {subclass}
              </DropdownToggle>
              <DropdownMenu style="max-height: 200px; overflow-y: auto;">
                  {#each groupedFilteredRouteDataSetFeatures[subclass] as feature (feature.id)}
                      <DropdownItem
                          on:click={() =>
                             toggleRouteAndSetMapView(map,filteredRouteDataSetFeatures,feature.id)
                              }>{feature.name}</DropdownItem
                      >
                  {/each}
              </DropdownMenu>
          </Dropdown>
      {/each}
  </DropdownMenu>
</Dropdown>
</div>
</div>

<style>
	.map-overlay {
		font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
		position: absolute;
		width: 300px;
		top: 110px;
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
