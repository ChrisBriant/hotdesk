<script>
  import authStoreActions from '../stores/authstore';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';

  let orgName = '';
  let promise;
  let formIsValid = false;
  let error = '';

  $: formIsValid = orgName.length > 3;

  $:console.log('Authenticated',authStoreActions.isAuthenticated());

  const submitForm = async () => {
    console.log('Create organisation', orgName);
  }
</script>

<style>
</style>

<section>
    <h1>Register Organisation</h1>
    <form on:submit|preventDefault={submitForm}>
        <TextInput
          id="org-name"
          label="Enter the name of your organisation below to get started."
          value={orgName}
          on:input={event => (orgName = event.target.value)}
        />
    </form>
    <Button id="regorg-btn" type="button" on:click={submitForm} disabled={!formIsValid}>Register</Button>
    <p class="message">{error}</p>
</section>
