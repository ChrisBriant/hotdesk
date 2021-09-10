<script>
    import Spacer from "../components/Spacer.svelte";
    import TextInput from "../components/TextInput.svelte";
    import Button from "../components/Button.svelte";
    import authStoreActions from "../stores/authstore";
    import orgStoreActions from "../stores/orgstore";
    import { isEmpty, isValidEmail } from "../helpers/validation.js";
    import { createEventDispatcher } from "svelte";

    let password = '';
    let email = '';
    let error = '';
    let promise;

    $: passwordValid = !isEmpty(password);
    $: emailValid = isValidEmail(email);
    $: formIsValid =
    passwordValid &&
    emailValid;

    const dispatch = createEventDispatcher();

    const submitForm = async () => {
        promise  = await authStoreActions.login({email,password});
        if(promise.success) {
            orgStoreActions.addOrganisations(promise.org_data);
            dispatch('loggedIn');
        }  else {
             error = "Error logging in";
        }
    }
</script>

<style>

</style>

<section>
  <Spacer />
  <div class="dialog">
      {#await promise}
          <p>Logging in...</p>
      {:then}
        <div class="panel">
          <h1>Login</h1>
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
              <TextInput
                id="password"
                label="Password"
                type="password"
                orientation="inline"
                valid={passwordValid}
                validityMessage="Please enter a password."
                value={password}
                on:input={event => (password = event.target.value)}
              />
          </form>
          <Button id="login-btn" type="button" on:click={submitForm} disabled={!formIsValid}>Login</Button>
          <p class="message">{error}</p>
        </div>
      {/await}
  </div>
</section>
