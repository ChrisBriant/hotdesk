<script>
  import { createEventDispatcher } from 'svelte';
  import authStoreActions from '../stores/authstore';
  import Button from '../components/Button.svelte';
  import Spacer from '../components/Spacer.svelte';

  const dispatch = createEventDispatcher();
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

  .home-panel {
  	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  	border-radius: 5px;
  	background: rgba(255, 255, 255, 0.75);
  	padding: 2%;
  	width: 90%;
    margin-left: 2%;
  }


</style>

{#if authStoreActions.isAuthenticated()}
  <div class="org-options">
    <div class="row">
      <div class="col home-panel">
        <h2>What would you like to do? </h2>
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
