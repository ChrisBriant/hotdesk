<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { deskStoreActions } from '../stores/deskstore';
  import { validDesks } from '../helpers/validation';
  import Button from '../components/Button.svelte';
  import DeskInput from '../dialogs/DeskInput.svelte';

  let selectedDesk = null;
  let launchDeskDialog = false;

  $:console.log('desk store', $deskStoreActions.desks);
  $:console.log('desks valid', validDesks($deskStoreActions.desks));

  $: if($deskStoreActions.desks) {
    console.log('Desks Updated');
    //deskStoreActions.resetDeskChange();
  }

  $: desksAreValid = validDesks($deskStoreActions.desks);

  const saveDesks = () => {
    console.log('save');
  }
</script>

<style>
</style>

<div>
  {#if launchDeskDialog}
    <DeskInput on:cancel={launchDeskDialog=false} desk={selectedDesk} name={selectedDesk.getName()} />
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
    </div>
  </div>
</div>
