<script>
    import Spacer from "../components/Spacer.svelte";
    import TextInput from "../components/TextInput.svelte";
    import Button from "../components/Button.svelte";
    import authStoreActions from "../stores/authstore";
    import { isEmpty, isValidEmail } from "../helpers/validation.js";
    import { createEventDispatcher } from "svelte";

    let email = '';
    let promise = true;
    let submittedSuccess = false;
    $: emailValid = isValidEmail(email);
    $: promise;


    const dispatch = createEventDispatcher();

    const submitForm = async () => {
        promise  = await authStoreActions.forgotPassword({email});
        submittedSuccess = promise.success;
    }
</script>

<style>

</style>

<section>
  <Spacer />
  <div class="panel">
      {#await promise}
          <p>Sending...</p>
      {:then result}
          {#if submittedSuccess}
              <h1>Forgot Password</h1>
              <p>{promise.message}</p>
              <p>You will receive an email to the registered email address. Please click on the link contained
                  within that email to rest your password.</p>
              <a href="{null}" class="link" on:click="{() => {dispatch('forgotten','login')}}">Click here to login</a>
          {:else}
              <h1>Forgot Password</h1>
              <p>Please enter the email address you registered with. We will send you an email with rest instructions.</p>
              <form on:submit|preventDefault={submitForm}>
                  <TextInput
                      id="email"
                      label="Email Address"
                      orientation="inline"
                      valid={emailValid}
                      validityMessage="Please enter a valid email address."
                      value={email}
                      on:input={event => (email = event.target.value)}
                  />
              </form>
              <Button type="button" on:click={submitForm} disabled={!emailValid}>Send</Button>
          {/if}
      {/await}
  </div>
</section>
