<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { deskStoreActions } from '../stores/deskstore';
  import { validDesks, allSaved } from '../helpers/validation';
  import Button from '../components/Button.svelte';
  import DeskInput from '../dialogs/DeskInput.svelte';
  import BinaryChoice from '../dialogs/BinaryChoice.svelte';
  import GeneralMessage from '../dialogs/GeneralMessage.svelte';

  const dispatch = createEventDispatcher();

  let selectedDesk = null;
  let launchDeskDialog = false;
  let launchCreatedDialog = false;
  let successMessage = '';
  let success;
  let showExitDialog = false;

  $:console.log('desk store', $deskStoreActions.desks);
  $:console.log('desks valid', validDesks($deskStoreActions.desks));

  $: if($deskStoreActions.desks) {
    console.log('Desks Updated');
    //deskStoreActions.resetDeskChange();
  }

  $: desksAreValid = validDesks($deskStoreActions.desks);

  const saveDesks = async () => {
    console.log('save');

    success = await deskStoreActions.saveDeskPlan();
    if(success) {
      launchCreatedDialog = true;
      successMessage = 'Successfully added desks';
    } else {
      launchCreatedDialog = false;
      successMessage = 'Something went wrong adding desks';
    }
  }

  const performExit = () => {
    console.log('EXITING');
    dispatch('nav','org');
  }

  const exit = () => {
    if(!allSaved($deskStoreActions.desks)) {
      showExitDialog = true;
    } else {
      performExit();
    }
  }
</script>

<style>
  li {
    list-style-type: none;
  }

  .pill-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 5px;
  }

  .pill {
  	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  	border-radius: 15px;
  	background: white;
  	padding: 8px;
  	margin-left: auto;
    margin-right: auto;
    margin-bottom: 8px;
  }

  .pill:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.26);
    background-color: #fbffb0;
  }

  .flat-panel {
    margin: auto;
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    background-color: #FFE3E3;
    width: 802px;
  }

</style>

<div class="flat-panel">
  {#if launchCreatedDialog}
    <GeneralMessage
        message={successMessage}
        title =""
        on:cancel={() => {launchCreatedDialog=false}}
    />
  {/if}
  {#if showExitDialog}
    <BinaryChoice
      message="You have unsaved changes, do you still want to exit?"
      on:no={() => {showExitDialog=false;}}
      on:yes={() => {performExit()}}
    />
  {/if}
  {#if launchDeskDialog}
    <DeskInput on:cancel={() => {launchDeskDialog=false;dispatch('redraw');}} desk={selectedDesk} name={selectedDesk.getName()} />
  {/if}
  <div class="row">
    <div class="col">
      <h4>Desks</h4>
      <div class="pill-container">
        {#each $deskStoreActions.desks as desk,i (desk.id) }
          <div class="pill">
            {#if desk.name !== ''}
              <a class="link" href={null} on:click={() => {selectedDesk=desk;launchDeskDialog=true;}}>{desk.name}</a>
            {:else}
              <a class="link" href={null} on:click={() => {selectedDesk=desk;launchDeskDialog=true;}}>{desk.id}</a>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
        <Button
          id="save-desks-btn"
          on:click={() => saveDesks()}
          disabled={allSaved($deskStoreActions.desks)}
          size="small"
        >Save Desks
        </Button>
        <Button
          id="save-desks-btn"
          on:click={() => exit()}
          size="small"
        >Exit
        </Button>
    </div>
  </div>
</div>
