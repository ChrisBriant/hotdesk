<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import TextArea from '../components/TextArea.svelte';

  const dispatch = createEventDispatcher();

  export let desk;
  export let name = "";


  const saveDesk = () => {
    console.log('Desk is callled', name);
    desk.setName(name);
    dispatch('cancel');
  }
</script>


<style>
  /* .modal-scroll {
    overflow-y: auto;
    max-height: 8rem;
    overflow-x: hidden;
  } */
</style>

<div>
  <Modal on:cancel="{() => dispatch('cancel')}"
    on:close="{() => dispatch('cancel')}">
    <div slot="header" class="modal-title">
        <h3>Edit Desk</h3>
    </div>
    <div slot="content">
      <div class="row">
        <div class="col">
          <TextArea
            id="deskName"
            label="Desk Name"
            value={name}
            on:input = {e => {name = e.target.value} }
          />

        </div>
      </div>
    </div>
    <div slot="footer">
        <br/>
        <Button type="button"
          id="continue"
          on:click={saveDesk}
        >
            save
        </Button>
    </div>
  </Modal>
</div>

<!-- on:input = {e => {name = e.target.value} } -->
