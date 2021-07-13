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
</style>

<div>
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
      <ul>
        {#each $deskStoreActions.desks as desk,i (desk.id) }
          <li>
            {#if desk.name !== ''}
              <a class="link" href={null} on:click={() => {selectedDesk=desk;launchDeskDialog=true;}}>{desk.name}</a>
            {:else}
              <a class="link" href={null} on:click={() => {selectedDesk=desk;launchDeskDialog=true;}}>{desk.id}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    <div class="col">
        <Button
          id="save-desks-btn"
          on:click={() => saveDesks()}
          disabled={!desksAreValid}
        >Save Desks
        </Button>
        <Button
          id="save-desks-btn"
          on:click={() => exit()}
        >Exit
        </Button>
    </div>
  </div>
</div>
