<script>
    import Spacer from "../components/Spacer.svelte";
    import TextInput from "../components/TextInput.svelte";
    import Button from "../components/Button.svelte";
    import authStoreActions from "../stores/authstore";
    import { isEmpty, isValidEmail } from "../helpers/validation.js";
    import { createEventDispatcher } from "svelte";


    let username = '';
    let password = '';
    let passchk = '';
    let email = '';
    let error = '';
    let promise = {
        success : false,
        message : ''
    };

    $: usernameValid = !isEmpty(username);
    $: passchkValid = !isEmpty(passchk);
    $: passwordValid = !isEmpty(password);
    $: emailValid = isValidEmail(email);
    $: passwordMatch = (password === passchk);
    $: formIsValid = passwordValid && emailValid && passchkValid && usernameValid && passwordMatch;

    const dispatch = createEventDispatcher();

    const submitForm = async () => {
        promise  = await authStoreActions.register({email,password,passchk,username});
        console.log(promise);
        if(promise) {
            console.log('dispatched')
        }  else {
             error = "Error Registering";
        }
    }
</script>

<style>

</style>

<section>
  <Spacer />
  <div class="dialog">
      {#await promise}
          <p>Registering...</p>
      {:then}
          {#if promise.success}
              <h1>Register</h1>
              <p>{promise.message}</p>
              <p>You will receive an email to the registered email address. Please click on the link contained
                  within that email to complete the registration process.</p>
              <a href="#" on:click="{() => {dispatch('registered','login')}}">Click here to login</a>
          {:else}
              <h1>Register</h1>
              <form on:submit|preventDefault={submitForm}>
                  <TextInput
                      id="username"
                      label="User Name"
                      orientation="inline"
                      valid={usernameValid}
                      validityMessage="Please enter a valid user name."
                      value={username}
                      on:input={event => (username = event.target.value)}
                  />
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
                  <TextInput
                      id="passchk"
                      label="Confirm Password"
                      type="password"
                      orientation="inline"
                      valid={passchkValid && passwordMatch}
                      validityMessage="Please enter a matching password."
                      value={passchk}
                      on:input={event => (passchk = event.target.value)}
                  />
              </form>
              <Button id="register" type="button" on:click={submitForm} disabled={!formIsValid}>Register</Button>
              <p class="message">{promise.message}</p>
          {/if}
      {/await}
  </div>
</section>
