<script>
  import authStoreActions from '../stores/authstore';
  import Button from '../components/Button.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();



  $:console.log('Authenticated',authStoreActions.isAuthenticated());
</script>

<style>
</style>


<section>
  {#if authStoreActions.isAuthenticated()}
    <div class="row">
      <div class="col">
        <h2>Welcome to the hotdesk booking system. What would you like to do? </h2>
      </div>
    </div>
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
        <Button>
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
  {:else}
    <p>You are not logged on.</p>
  {/if}
</section>
