<script>
  import { createEventDispatcher } from 'svelte';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';
  import SpinInput from '../components/SpinInput.svelte';
  import orgStoreActions from "../stores/orgstore";

  //import expand from '../assets/expand.svg';
  const dispatch = createEventDispatcher();

  let promise;
  let displayAddBuilding=false;
  let buildingName = '';
  let buildings = $orgStoreActions.currentOrg.buildings;
  let displayAddFloor=false;
  let floorName = '';
  let floorNumber = 1;
  let buildingId;
  let selectedBuildingId;
  let selectedFloorName= '';
  let selectedFloorId;


  $: buildFormIsValid = buildingName.length > 3;
  $: floorFormIsValid = floorName.length > 3;
  $: console.log('displayAddBuilding', displayAddBuilding);

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
</style>

<section>
  <h3>Manage Buildings</h3>
  {#if buildings.length > 0}
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
                                            selectedFloorName=floor.name;}}
                    >
                      {floor.name}
                    </span>
                  </div>
                </div>
              {/each}
            {/if}
            {#if displayAddFloor && buildingId === building.id}
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
            {:else}
              <a href={null} class="link sm-link" on:click={() => {addFloor(building.id)}}>Add Floor</a>
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
      <div class="col">
        <h3>{selectedFloorName}</h3>
        <a href={null} class="link" on:click|preventDefault={(e) => dispatch('nav',{dest:'addPlan',floorId:selectedFloorId})}>Create Floor Plan</a>
      </div>
    </div>
  {/if}
  {#if displayAddBuilding}
    <form on:submit|preventDefault={submitBuilding}>
        <TextInput
          id="build-name-txt"
          label="Enter Building Name"
          value={buildingName}
          on:input={event => (buildingName = event.target.value)}
        />
    </form>
    <Button id="submit-building-btn" type="button" on:click={submitBuilding} disabled={!buildFormIsValid}>Create</Button>
  {/if}
  <Button
    id="add-building"
    on:click={() => {displayAddBuilding=!displayAddBuilding}}
  >
    { displayAddBuilding ? 'Cancel' : 'Add New' }
  </Button>
</section>
