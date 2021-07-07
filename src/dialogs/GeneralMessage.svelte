<script>
  import { createEventDispatcher } from 'svelte';
  import { stringGen } from '../helpers/helpers';
  import Modal from '../components/Modal.svelte';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';

  const dispatch = createEventDispatcher();

  export let message = '';
  export let title = '';
  export let redirect = false;
  export let redirectLink = '';
  export let redirectLinkText ='';

</script>


<style>

</style>

<div>
  <Modal on:cancel="{() => dispatch('cancel')}"
    on:close="{() => dispatch('cancel')}">
    <div slot="header" class="modal-title">
        <h3>{title}</h3>
    </div>
    <div slot="content">
      <div class="row">
        <div class="col">
          <p>{message}</p>
          {#if redirect}
            <a
              href={null}
              class="link"
              on:click={() => dispatch('nav',redirectLink)}
            >{redirectLinkText}</a>
          {/if}
        </div>
      </div>
    </div>
    <div slot="footer">
        <br/>
        <Button type="button"
          id="cancel"
          on:click={() => dispatch('cancel')}
        >
            Ok
        </Button>
    </div>
  </Modal>
</div>
