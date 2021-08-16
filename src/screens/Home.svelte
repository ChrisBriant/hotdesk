<script>
  import authStoreActions from '../stores/authstore';
  import Button from '../components/Button.svelte';
  import Spacer from '../components/Spacer.svelte';
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

  $: console.log('ORGANISATIONS', $orgStoreActions.organisations);

</script>

<style>
</style>


<section>
  {#if authStoreActions.isAuthenticated()}
    <!-- <div class="row">
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
    </div> -->
    {#if $orgStoreActions.organisations.length > 0}
      <div class="panel">
      <h2>My Organisations</h2>
        {#each $orgStoreActions.organisations as org,i (org.id)}
          <div class="row">
            <div class="col left-align-txt">
              {#if org.status === 'Approved' || org.status === "Admin"}
                <a class="link" {href} on:click|preventDefault={(e) => goToOrg(org.organisation.id)} >
                  {org.organisation.name}
                </a>
              {:else}
                {org.organisation.name}
              {/if}
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
      </div>
    {/if}
  {:else}
    <p>You are not logged on.</p>
  {/if}
</section>
