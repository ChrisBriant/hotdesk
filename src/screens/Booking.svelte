<script>
  import { createEventDispatcher } from 'svelte';
  import {URLROOT} from '../helpers/settings';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';
  import SpinInput from '../components/SpinInput.svelte';
  import Calendar from '../components/Calendar.svelte';
  import DeskSelect from '../components/DeskSelect.svelte';
  import BookingCanvas from '../components/BookingCanvas.svelte';
  import orgStoreActions from "../stores/orgstore";
  import Spacer from '../components/Spacer.svelte';
  import {deskStoreActions} from "../stores/deskstore";

  const dispatch = createEventDispatcher();

  let promise;
  let buildingName = '';
  let buildings = $orgStoreActions.currentOrg.buildings;
  let buildingId;
  let selectedBuildingId;
  let selectedFloorName= '';
  let selectedFloorId=null;
  let selectedFloorPlan=null;
  let planChanged = false;
  let redraw = false;
  let loadFloor = false;

  const setExpanded = (i) => {
    buildings[i].expanded=true;
  }

  const setUnexpanded = (i) => {
    buildings[i].expanded=false;
  }

</script>

<style>
  .building {
    font-size: 80%;
    cursor: pointer;
  }

  .building img {
    width: 0.5rem;
  }

  .indent {
    margin-left:1rem;
  }
</style>

<section>
  <div class="tab-box-header">
    <h3>Make a Booking</h3>
    <p>This is where you can book a desk by selecting the building and chosing and available desk.</p>
  </div>
  <Spacer />
  {#if buildings.length > 0}
    <div class="row">
      <div class="col-4">
        {#if selectedFloorId}
          <div class="panel">
            <div class="row">
              <div class="col">
                <Calendar
                  orgId={$orgStoreActions.currentOrg.id}
                  floorId={selectedFloorId}
                  on:dayChanged={() => {redraw = true;planChanged=true;}}
                  on:loadFloorPlan={() => {loadFloor = true}}
                />
              </div>
            </div>
          </div>
          <Spacer />
        {/if}
        <div class="row">
          <div class="col">
            <div class="panel">
              <h3>Select a Building</h3>
              {#each buildings as building,i}
                {#if building.expanded}
                  <div class="row">
                    <div class="col left-align-txt">
                      <span class="building" on:click={() => setUnexpanded(i)}>
                        <img alt="deflate" src="/assets/deflate.svg"/>
                        {building.name}
                      </span>
                    </div>
                  </div>
                  {#if building.floor.length > 0}
                    {#each building.floor as floor,i}
                      <div class="row">
                        <div class="col left-align-txt">
                          <span
                                  class="building indent"
                                  on:click={()=> {selectedFloorId=floor.id;
                                                  selectedBuildingId=building.id;
                                                  selectedFloorName=floor.name;
                                                  planChanged=true;
                                                  loadFloor=false;
                                                  selectedFloorPlan=floor.plan;
                                                  }}
                          >
                            {floor.name}
                          </span>
                        </div>
                      </div>
                    {/each}
                  {/if}
                {:else}
                  <div class="row">
                    <div class="col left-align-txt">
                      <span class="building" on:click={() => setExpanded(i)}>
                        <img alt="expand" src="/assets/expand.svg"/>
                        {building.name}
                      </span>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        </div>
      </div>
      <div class="col-8">
        {#if loadFloor}
          <div class="panel">
            <h3>{selectedFloorName}</h3>
            <DeskSelect
              on:deskChanged={() => {redraw = true}}
              {planChanged}
            />
            {#if !selectedFloorPlan}
              <p>This floor does not have a plan added.</p>
            {:else}
              <BookingCanvas
                {planChanged}
                plan={selectedFloorPlan}
                on:resetchange={() => {planChanged=false}}
                {redraw}
                on:reDrawn={() => {redraw = false}}
              />
            {/if}
          </div>
        {/if}
      </div>
    </div>
    <Spacer />
  {:else}
    <p>Buildings have not yet been added to this organisation, please contact
     <a href={null} class="link">org admin</a> for help with this.</p>
  {/if}

</section>
