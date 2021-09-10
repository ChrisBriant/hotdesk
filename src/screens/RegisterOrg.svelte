<script>
  import { createEventDispatcher } from 'svelte';
  import authStoreActions from '../stores/authstore';
  import orgStoreActions from '../stores/orgstore';
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';
  import GeneralMessage from '../dialogs/GeneralMessage.svelte';

  const dispatch = createEventDispatcher();

  export let regType = 'registering';

  let orgName = '';
  let orgId = '';
  let promise;
  let formIsValid = false;
  let joinFormIsValid = false;
  let error = '';
  //Dialog
  let showMessageDiag = false;
  let diagMessage = '';
  let diagTitle = '';
  let diagRedirect = false;
  let diagLink = '';
  let diagRedirectLinkTxt = '';

  $: formIsValid = orgName.length > 3;
  $: joinFormIsValid = orgId.length == 16;


  const submitForm = async () => {
    promise = await orgStoreActions.createOrganisation({orgName});
    if(promise.success) {
      showMessageDiag=true;
      diagTitle='Create Organisation';
      diagMessage=promise.message;
      diagRedirect=true;
      diagRedirectLinkTxt='View my organisations'
      diagLink = 'home'
    } else {
      showMessageDiag=true;
      diagTitle='Create Organisation';
      diagMessage=promise.message;
      diagRedirect=false;
      diagRedirectLinkTxt=''
      diagLink = ''
    }
  }

  const submitJoinForm = async () => {
    promise = await orgStoreActions.joinOrganisation({orgId});
    if(promise.success) {
      showMessageDiag=true;
      diagTitle='Join Organisation';
      diagMessage=promise.message;
      diagRedirect=true;
      diagRedirectLinkTxt='View my organisations'
      diagLink = 'home'
    } else {
      showMessageDiag=true;
      diagTitle='Join Organisation';
      diagMessage=promise.message;
      diagRedirect=false;
      diagRedirectLinkTxt=''
      diagLink = ''
    }

  }

  const navigate = () => {
    showMessageDiag = false;
    dispatch('nav','home');
  }


</script>

<style>
</style>

<section>
    {#if showMessageDiag}
      <GeneralMessage
          message={diagMessage}
          title ={diagTitle}
          redirect={diagRedirect}
          redirectLink={diagLink}
          redirectLinkText={diagRedirectLinkTxt}
          on:cancel={() => {showMessageDiag=false}}
          on:nav={(r) => {navigate(r.detail)}}
      />
    {/if}
    {#if regType === 'registering'}
      <div class= "panel">
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
      </div>
    {:else}
      <div class="panel">
        <h1>Join Organisation</h1>
        <form on:submit|preventDefault={submitJoinForm}>
            <TextInput
              id="org-name"
              label="Enter the organisation ID to send a join request."
              value={orgId}
              on:input={event => (orgId = event.target.value)}
            />
        </form>
        <Button id="regorg-btn" type="button" on:click={submitJoinForm} disabled={!joinFormIsValid}>Join</Button>
        <p class="message">{error}</p>
      </div>
    {/if}
</section>
