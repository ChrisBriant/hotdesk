<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';

  const dispatch = createEventDispatcher();

  export let message = '';
  export let title = '';

</script>


<style>

</style>

<div>
  <Modal on:cancel="{() => dispatch('cancel')}"
    on:close="{() => dispatch('cancel')}">
    <div slot="header" class="modal-title">
      {#if title !== ''}
        <h3>{title}</h3>
      {:else}
        <h3>Please Confirm</h3>
      {/if}
    </div>
    <div slot="content">
      <div class="row">
        <div class="col">
          <p>{message}</p>
        </div>
      </div>
    </div>
    <div slot="footer">
        <br/>
        <Button type="button"
          id="yes"
          on:click={() => dispatch('yes')}
        >
            Yes
        </Button>
        <Button type="button"
          id="no"
          on:click={() => dispatch('no')}
        >
            No
        </Button>
    </div>
  </Modal>
</div>
