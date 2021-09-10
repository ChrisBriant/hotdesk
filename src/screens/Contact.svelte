<script>
    import Spacer from "../components/Spacer.svelte";
    import TextInput from "../components/TextInput.svelte";
    import Button from "../components/Button.svelte";
    import orgStoreActions from "../stores/orgstore";
    import authStoreActions from "../stores/authstore";
    import { isEmpty, isValidEmail } from "../helpers/validation.js";
    import { createEventDispatcher } from "svelte";

    let subject = '';
    let promise;
    let sendMessage='';

    $: subjectValid = !isEmpty(subject);
    $: sendMessageValid = !isEmpty(sendMessage);
    $: formIsValid = sendMessageValid && subjectValid;


    const dispatch = createEventDispatcher();

    const submitForm = async () => {
        let payload = {
          subject,
          message: sendMessage
        }
        subject = '';
        sendMessage= '';
        promise  = await orgStoreActions.contact(authStoreActions.isAuthenticated(),payload);
    }
</script>

<style>

</style>

<section>
  <Spacer />
  <div class="dialog">
      {#await promise}
          <p>Sending...</p>
      {:then}
        {#if !promise}
          <div class="panel">
            <h1>Contact</h1>
            <p>Send a message to the author of this website.</p>
            <form on:submit|preventDefault={submitForm}>
                <TextInput
                  id="txt-input-subject"
                  label="Subject:"
                  valid={subjectValid}
                  validityMessage="Please enter a subject."
                  value={subject}
                  on:input={event => (subject = event.target.value)}
                />
                <TextInput
                  id="txt-input-message"
                  label="Message:"
                  controlType="textarea"
                  valid={sendMessageValid}
                  validityMessage="Please type a message."
                  value={sendMessage}
                  on:input={e => (sendMessage = e.target.value)}
                />
            </form>
            <Button id="contact-btn" type="button" on:click={submitForm} disabled={!formIsValid}>Send</Button>
          </div>
        {:else}
          <p>A contact message has been successfully sent.</p>
          <p>Click here to go back the
          <a
            href={null}
            class="link"
            on:click={() => {dispatch('nav','home')}} >home</a> screen.</p>
        {/if}
      {/await}
  </div>
</section>
