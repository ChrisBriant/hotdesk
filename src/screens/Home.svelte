<script>
  import authStoreActions from '../stores/authstore';
  import Button from '../components/Button.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import orgStoreActions from "../stores/orgstore";

  const dispatch = createEventDispatcher();

  let href=null;
  let promise;

  onMount(() => {
    orgStoreActions.loadOrganisations();
  });

  const goToOrg = async (orgId) => {

    promise = await orgStoreActions.loadOrganisation(orgId);
    if(promise) {
      console.log('Go to the org');
      dispatch('nav','org');
    }
  }

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
    {#if $orgStoreActions.organisations.length > 0}
      <h2>My Organisations</h2>
      {#each $orgStoreActions.organisations as org,i (org.id)}
        <div class="row">
          <div class="col left-align-txt">
            <a class="link" {href} on:click|preventDefault={(e) => goToOrg(org.id)} >
              {org.organisation.name}
            </a>
          </div>
          <div class="col left-align-txt">{org.organisation.org_id}</div>
          {#if org.is_owner}
              <div class="col left-align-txt">Owner</div>
          {:else}
              <div class="col left-align-txt">Employee</div>
          {/if}
          <div class="col left-align-txt">{org.status}</div>
        </div>
      {/each}
    {/if}
  {:else}
    <p>You are not logged on.</p>
  {/if}
</section>
