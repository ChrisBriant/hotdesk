<script>
  import { createEventDispatcher } from 'svelte';
  import authStoreActions from '../stores/authstore';
  import Button from '../components/Button.svelte';
  import Spacer from '../components/Spacer.svelte';

  const dispatch = createEventDispatcher();

  export let organisations;
</script>

<style>
  .org-options {
    width: 80vw;
    margin: auto;
  }

  .org-options > div {
    margin-left: 2px;
    margin-right: 2%;
  }
</style>

{#if authStoreActions.isAuthenticated()}
  <div class="org-options">
    <div class="row">
      <div class="col home-panel">
        <h2>What would you like to do? </h2>
        {#if organisations.length > 0 }
          <br/>
          <a href='#homepageafterhero'>View my Organisations</a>
        {/if}
      </div>
    </div>
    <Spacer />
    <div class="row">
        <div class="col home-panel">
          <Button
            id="regorg-btn"
            on:click={() => dispatch('nav','regorg')}
          >
            Register Organisation
          </Button>
          <div class="col">
            <p>Register an organisation so that you can upload
            floor plans and have employees book desks.</p>
          </div>
        </div>
        <div class="col home-panel">
          <Button
            id="joinorg-btn"
            on:click={() => dispatch('nav','joinorg')}
          >
            Join Organisation
          </Button>
          <div class="col">
            <p>Join as an employee of an organisation. This will
            allow you to make desk bookings.</p>
          </div>
        </div>
     </div>
     <div class="row">


     </div>
    </div>
  {/if}
