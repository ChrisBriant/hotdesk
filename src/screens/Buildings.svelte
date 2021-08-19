<script>
  import { createEventDispatcher } from 'svelte';
  import {URLROOT} from '../helpers/settings';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';
  import SpinInput from '../components/SpinInput.svelte';
  import Spacer from '../components/Spacer.svelte';
  import orgStoreActions from "../stores/orgstore";
  import {deskStoreActions} from "../stores/deskstore";
  import BinaryChoice from '../dialogs/BinaryChoice.svelte';

  const dispatch = createEventDispatcher();

  let promise;
  let displayAddBuilding=false;
  let buildingName = '';
  let buildings = $orgStoreActions.currentOrg.buildings;
  let displayAddFloor=false;
  let floorName = '';
  let floorNumber = 1;
  let buildingId;
  let selectedBuildingName = '';
  let selectedBuildingId;
  let selectedFloorName= '';
  let selectedFloorId=null;
  let selectedFloorPlan=null;
  let floorPromise = true;
  let showDialog = false;
  let dialogMessage="Are you sure you want to delete this floor?";


  $: buildFormIsValid = buildingName.length > 3;
  $: floorFormIsValid = floorName.length > 3;


  $: console.log('displayAddBuilding', displayAddBuilding);

  $: console.log('Floor ID', selectedFloorId);
  $: console.log('Buildings', $orgStoreActions.currentOrg.buildings);

  const setBuildings = () => {
    buildings = $orgStoreActions.currentOrg.buildings;
  }

  const submitBuilding = async () => {
    console.log('Submitting Building',$orgStoreActions.currentOrg.id,buildingName);
    promise = await orgStoreActions.addBuilding({
      orgId: $orgStoreActions.currentOrg.id,
      name: buildingName
    });
    if(promise) {
      setBuildings();
      displayAddBuilding=false;
    }
  }

  const setExpanded = (i) => {
    buildings[i].expanded=true;
    console.log('Expanding',i, buildings[i].floor);
  }

  const setUnexpanded = (i) => {
    buildings[i].expanded=false;
    console.log('unexpanding',i);
  }

  const addFloor = (id) => {
    buildingId = id;
    displayAddFloor=true;
  }

  const submitFloor = async (buildiingId) => {
    console.log('submitting floor',buildingId,floorName, floorNumber);
    promise = await orgStoreActions.addFloor({
      buildingId,
      name: floorName,
      level: floorNumber
    });
    if(promise) {
      setBuildings();
      displayAddFloor=false;
    }
  }

  const goToFloor = () => {
    deskStoreActions.clearStore();
    if(selectedFloorPlan) {
      deskStoreActions.loadPlan(selectedFloorPlan);
      deskStoreActions.setFloorPreLoaded(true);
    }
    dispatch('nav',{dest:'addPlan',floorId:selectedFloorId});
  }

  const deleteFloor = async () => {
    floorPromise = await orgStoreActions.deleteFloor({
      floorId: selectedFloorId
    });
    showDialog=false;
    setBuildings();
    selectedBuildingName = '';
    selectedBuildingId;
    selectedFloorName= '';
    selectedFloorId=null;
    selectedFloorPlan=null;
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

  .sm-link {
    font-size: 80%;
  }

  .floor-plan-img {
    display:block;
    margin:auto;
    width: 200px;
    height: 150px;
  }

  .space {
    height: 1rem;
  }
</style>

<section>
  {#if showDialog}
    <BinaryChoice
      message={dialogMessage}
      on:cancel={() => {showDialog = false}}
      on:no={() => {showDialog = false}}
      on:yes={deleteFloor}
    />
  {/if}
  <h3>Manage Buildings</h3>
  <p>Here you can add new buildings to the organisation and manage them by uploading
  floor plans.</p>
  {#if buildings.length > 0}
    <div class="row">
      <div class="col">
        <div class="panel">
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
              {#each building.floor as floor,i (i)}
                <div class="row">
                  <div class="col left-align-txt">
                    <span
                            class="building indent"
                            on:click={()=> {selectedFloorId=floor.id;
                                            selectedBuildingId=building.id;
                                            selectedBuildingName=building.name;
                                            selectedFloorName=floor.name;
                                            selectedFloorPlan=floor.plan;
                                            }}
                    >
                      {floor.name}
                    </span>
                  </div>
                </div>
              {/each}
            {/if}
            {#if displayAddFloor && buildingId === building.id}
              <div class="space"></div>
              <div class="panel">
                <form on:submit|preventDefault={submitFloor}>
                    <TextInput
                      id="build-name-txt"
                      label="Enter Floor Name"
                      value={floorName}
                      on:input={event => (floorName = event.target.value)}
                    />
                    <SpinInput
                      id="building-floor-number2"
                      label="Enter floor number"
                      on:change={(e) => {floorNumber = e.target.value} }
                    />
                </form>
                <Button id="submit-floor-btn" type="button" on:click={() => {submitFloor(building.id)}} disabled={!floorFormIsValid}>Add</Button>
                <Button id="cancel-floor-btn" type="button" on:click={()=>{displayAddFloor=false}} >Cancel</Button>
              </div>
              <div class="space"></div>
            {:else}
              <Button
                id="add-floor-btn"
                type="button"
                on:click={() => {addFloor(building.id)}}
                size="small"
              >Add Floor</Button>
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
      <div class="col">
        {#if selectedBuildingName !== "" && selectedFloorName !== ""}
          <div class="panel">
            <h3>{selectedBuildingName}: {selectedFloorName}:{selectedFloorId}</h3>
            {#if !selectedFloorPlan}
              <!-- A building and floor has been selected -->
              {#if selectedFloorId}
                <a href={null} class="link" on:click|preventDefault={(e) => goToFloor()}>Create Floor Plan</a>
              {/if}
            {:else}
              {#await floorPromise}
                <p>Deleting...</p>
              {:then}
                <img
                  class="floor-plan-img"
                  alt={selectedFloorName}
                  src={`${URLROOT}${selectedFloorPlan.picture}`}
                />
                <Spacer />
                <Button
                  id="edt-floor-plan-btn"
                  type="button"
                  on:click={(e) => goToFloor()}
                  size="small"
                >
                Edit Floor Plan</Button>
                <Button
                  id="del-floor-btn"
                  type="button"
                  on:click={(e) => {showDialog=true}}
                  size="small"
                >
                Delete Floor</Button>
              {/await}
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <p>Click &quot;add building&quot; below to get started!</p>
  {/if}
  <Spacer />
  {#if displayAddBuilding}
    <div class="space"></div>
    <div class="panel">
      <form on:submit|preventDefault={submitBuilding}>
          <TextInput
            id="build-name-txt"
            label="Enter Building Name"
            value={buildingName}
            on:input={event => (buildingName = event.target.value)}
          />
      </form>
      <Button id="submit-building-btn" type="button" on:click={submitBuilding} disabled={!buildFormIsValid}>Create</Button>
      <Button
        id="add-building"
        on:click={() => {displayAddBuilding=!displayAddBuilding}}
      >
        { displayAddBuilding ? 'Cancel' : 'Add New' }
      </Button>
    </div>
    <div class="space"></div>
  {:else}
    <Button
      id="add-building"
      on:click={() => {displayAddBuilding=!displayAddBuilding}}
    >
      { displayAddBuilding ? 'Cancel' : 'Add New' }
    </Button>
  {/if}
</section>
