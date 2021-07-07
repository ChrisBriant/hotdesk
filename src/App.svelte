<script>
  import Plan from './screens/Plan.svelte';
  import Nav from './screens/Nav.svelte';
  import Forgot from './screens/Forgot.svelte';
  import Login from './screens/Login.svelte';
  import Home from './screens/Home.svelte';
  import Register from './screens/Register.svelte';
  import RegisterOrg from './screens/RegisterOrg.svelte';
  import authStoreActions from "./stores/authstore";


  let loggedIn = authStoreActions.isAuthenticated();
  let route = 'home';

  $: console.log('Logged In',loggedIn);
  $: console.log('ROUTE',route);

  function logout() {
    console.log('logging out');
    authStoreActions.logOut();
    loggedIn = false;
  }
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>


<main>
  <header class="{ route === 'home' ? 'hero' : '' }">
    <Nav
      authenticated={loggedIn}
      logout={logout}
      active={route}
      on:nav={(r) => { route = r.detail}}
    />
    {#if route == 'home'}
      <p class="hero-text">Header Goes Here</p>
    {/if}
  </header>

  {#if route === 'home'}
    <Home
      on:nav={(r) => {route = r.detail;}}
    />
  {:else if route === 'login'}
    <Login login={authStoreActions.login} on:loggedIn={() => {loggedIn = true; route = 'home'}} />
  {:else if route === 'register'}
    <Register
      on:registered={() => {route = "login";}}
      />
  {:else if route === 'forgot'}
    <Forgot
      on:forgotten={() => {route = "login";}}
      />
  {:else if route === 'regorg'}
    <RegisterOrg
      regType="registering"
      on:nav={(r) => {route = r.detail;}}
    />
  {:else if route === 'joinorg'}
    <RegisterOrg
      regType="joining"
      on:nav={(r) => {route = r.detail;}}
    />
  {/if}
</main>
