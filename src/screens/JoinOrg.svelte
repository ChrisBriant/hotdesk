<script>
    import { createEventDispatcher } from 'svelte';
    import authStoreActions from "../stores/authstore";
    import orgStoreActions from '../stores/orgstore';
    import {homeURL} from '../helpers/connections.js';

    export let orgId = '';

    const dispatch = createEventDispatcher();

    let success = false;
    let promise;

    const joinOrg = async () => {
      promise = await orgStoreActions.joinOrganisation({orgId});
      if(promise.success) {
        success=true;
      }
    }

    if(authStoreActions.isAuthenticated() && orgId !== '') {
      joinOrg();
    }
</script>

<style>
</style>

<div>
  <h1>Joining Organisation</h1>
  {#if !authStoreActions.isAuthenticated()}
    <p>Sorry you are not logged in, please
    <a href={null} class="link" on:click={() => {dispatch('nav','login')}}>login here</a>
     and try the link again.</p>
    <p>Don't have an account? Click
    <a href={null} class="link" on:click={() => {dispatch('nav','register')}}>here</a>
    to register.</p>
  {:else}
    {#await promise}
      <p>Trying to join...</p>
    {:then}
      {#if success}
        <p>{promise.message}</p>
        <p>Click <a href={homeURL}>here </a>to view your organisations.</p>
      {:else}
        <p>Something went wrong trying to join. Please try again or see your organisation
        administrator.</p>
      {/if}
    {/await}
  {/if}
</div>
