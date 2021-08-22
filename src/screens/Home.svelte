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
    if(authStoreActions.isAuthenticated()) {
      orgStoreActions.loadOrganisations();
    }
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
            <div class="col left-align-text">
              <a href={`mailto:?subject=You%20are%20invited%20to%20join%20${org.organisation.name}&body=your%20body`}>Invite People</a>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="home-page-txt">
      <h1>Welcome to the Hotdesk Booking System</h1>
      <p>This is an app which allows you to add your organisation and allow your users
      to book desks.</p>
      <p>We are living in challenging times and now it is essential that businesses comply
      with the latest regulations. With office spaces getting smaller and with the constant
      changes to the way in which people work, every business needs to keep up with current times.</p>
      <p><strong>It's not just about abiding by restrictions it's about embrasing a whole new working philosophy!</strong><p>
      <h4>This app will allow you to do the following:</h4>

      <ul>
        <li>Create an Organisation.</li>
        <li>Join an organisation as a non-admin user.</li>
        <li>Add a building and add muliple floors. </li>
        <li>Add desks to every floor plan which will be bookable.</li>
        <li>Make and manage bookings.</li>
      </ul>

      <p>Already have an account? Click
      <a href={null} class="link" on:click={() => {dispatch('nav','login')}}>here</a>
      to login.</p>
      <p>Don't have an account? Click
      <a href={null} class="link" on:click={() => {dispatch('nav','register')}}>here</a>
      to register.</p>
    </div>
  {/if}
</section>
