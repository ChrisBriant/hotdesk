<script>
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';
  import orgStoreActions from '../stores/orgstore';
  import { createEventDispatcher } from "svelte";

  let name = '';
  let searched = false;
  let promise;
  let message = '';

  const dispatch = createEventDispatcher();

  const findOrg = async () => {
    //Call provider
    searched = true;
    let success = orgStoreActions.orgSearch(name);
    if(!success) {
      message = 'Something went wrong fetching the organisations.';
    }
  }

</script>

<style>
  .search-box-home {
    padding : 20px;
  }
</style>

<div class = "search-box-home">
  <p>Type the name of your organisation and click search to see if it exists.</p>
  <TextInput
    id="name"
    label="Organisation Name"
    value={name}
    on:input = {e => {name = e.target.value } }
  />
  {#if searched && ($orgStoreActions.orgSearch.length > 0)}
    <p>Do you belong to any of these organisations?</p>
    {#each $orgStoreActions.orgSearch as org,i }
      <div class="row">
        <div class="col-md-3">
          {org.name}
        </div>
        <div class="col-md-3">
          {org.org_id}
        </div>
        <div class="col-md-3">
          {org.employee_count}
        </div>
        <div class="col-md-3">
          <a href={null} class="link" on:click={() => {dispatch('nav','login')}}>sign in</a> or
          <a href={null} class="link" on:click={() => {dispatch('nav','register')}}>register</a> to join.
        </div>
      </div>
    {/each}
  {/if}
  {#if searched && ($orgStoreActions.orgSearch.length <= 0)}
    <p>Sorry no organisations have been found.</p>
    <p>
      <a href={null} class="link" on:click={() => {dispatch('nav','login')}}>sign in</a> or
      <a href={null} class="link" on:click={() => {dispatch('nav','register')}}>register</a> to join
      and set up this organisation.</p>
  {/if}
  <p class='error'>{message}</p>
  <Button type="button"
    id="search"
    on:click={findOrg}
  >Search</Button>
</div>
