<script>
  import { createEventDispatcher } from 'svelte';
  import authStoreActions from '../stores/authstore';
  import Button from '../components/Button.svelte';
  import Spacer from '../components/Spacer.svelte';

  const dispatch = createEventDispatcher();
</script>

<style>
</style>

{#if authStoreActions.isAuthenticated()}
  <div class="panel">
    <div class="row">
      <div class="col">
        <h2>What would you like to do? </h2>
      </div>
    </div>
    <Spacer />
    <div class="row">
        <div class="col">
          <Button
            id="regorg-btn"
            on:click={() => dispatch('nav','regorg')}
          >
            Register Organisation
          </Button>
        </div>
        <div class="col">
          <Button
            id="joinorg-btn"
            on:click={() => dispatch('nav','joinorg')}
          >
            Join Organisation
          </Button>
        </div>
     </div>
     <div class="row">
       <div class="col">
         <p>Register an organisation so that you can upload
         floor plans and have employees book desks.</p>
       </div>
       <div class="col">
         <p>Join as an employee of an organisation. This will
         allow you to make desk bookings.</p>
       </div>
     </div>
    </div>
  {/if}
