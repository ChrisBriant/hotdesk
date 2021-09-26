<script>
  import { createEventDispatcher } from 'svelte';
  import { deskStoreActions } from '../stores/deskstore';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';

  const dispatch = createEventDispatcher();

  export let desk;
  export let name = "";
  let id;
  let errorMessage='';

  const saveDesk = () => {
    if(name !== '') {
      errorMessage='';
      desk.setName(name);
      deskStoreActions.replaceDesk(desk);
      dispatch('cancel');
    } else {
      errorMessage='Please enter a name for the desk.'
    }

  }

  const deleteDesk = () => {
    deskStoreActions.deleteDesk(desk);
    dispatch('cancel');
  }
</script>


<style>
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
          <TextInput
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
            done
        </Button>
        <Button type="button"
          id="cancel"
          on:click={() => dispatch('cancel')}
        >
            cancel
        </Button>
        <p class="error">{errorMessage}</p>
    </div>
  </Modal>
</div>
