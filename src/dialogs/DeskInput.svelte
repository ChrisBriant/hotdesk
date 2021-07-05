<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { stringGen } from '../helpers/helpers';
  import { deskStoreActions } from '../stores/deskstore';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';

  const dispatch = createEventDispatcher();

  export let desk;
  export let name = "";
  let id;

  onMount(() => {
    id = stringGen(16);
    desk.setId(id);
    console.log('Random ID', stringGen(16));
  });

  const saveDesk = () => {
    console.log('Desk is callled', name);
    desk.setName(name);
    dispatch('cancel');
  }

  const deleteDesk = () => {
    console.log('Deleting Desk', desk);
    deskStoreActions.deleteDesk(desk);
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
          id="delete"
          on:click={deleteDesk}
        >
            delete
        </Button>
        <Button type="button"
          id="save"
          on:click={saveDesk}
        >
            save
        </Button>
        <Button type="button"
          id="cancel"
          on:click={() => dispatch('cancel')}
        >
            cancel
        </Button>
    </div>
  </Modal>
</div>

<!-- on:input = {e => {name = e.target.value} } -->
