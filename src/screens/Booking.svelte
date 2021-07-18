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
  import {deskStoreActions} from "../stores/deskstore";

  //import expand from '../assets/expand.svg';
  const dispatch = createEventDispatcher();

  let promise;
  //let displayAddBuilding=false;
  let buildingName = '';
  let buildings = $orgStoreActions.currentOrg.buildings;
  //let displayAddFloor=false;
  //let floorName = '';
  //let floorNumber = 1;
  let buildingId;
  let selectedBuildingId;
  let selectedFloorName= '';
  let selectedFloorId;
  let selectedFloorPlan=null;
  let planChanged = false;
  let redraw = false;

  const setExpanded = (i) => {
    buildings[i].expanded=true;
  }

  const setUnexpanded = (i) => {
    buildings[i].expanded=false;
  }

  // const goToFloor = () => {
  //   deskStoreActions.clearStore();
  //   if(selectedFloorPlan) {
  //     deskStoreActions.loadPlan(selectedFloorPlan);
  //     deskStoreActions.setFloorPreLoaded(true);
  //   }
  //   dispatch('nav',{dest:'addPlan',floorId:selectedFloorId});
  // }

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

  .sm-link {
    font-size: 80%;
  }

  .floor-plan-img {
    display:block;
    margin:auto;
    width: 200px;
    height: 150px;
  }


</style>

<section>
  <h3>Make a Booking</h3>
  {#if buildings.length > 0}
    <div class="row">
      <div class="col-4">
        <div class="row">
          <div class="col">
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
        <div class="row">
          <div class="col">
            <Calendar
              orgId={$orgStoreActions.currentOrg.id}
              floorId={selectedFloorId}
            />
          </div>
        </div>
      </div>
      <div class="col-8">
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
    </div>

  {/if}
</section>


<!-- <div class="row">
  <div class="col">
    <Calendar
      orgId={$orgStoreActions.currentOrg.id}
      floorId={selectedFloorId}
    />
  </div>
</div> -->
