<script>
  import CookiesDialog from './dialogs/CookiesDialog.svelte';
  import OrganisationOptions from './components/OrganisationOptions.svelte';
  import Plan from './screens/Plan.svelte';
  import Nav from './screens/Nav.svelte';
  import Forgot from './screens/Forgot.svelte';
  import Login from './screens/Login.svelte';
  import Home from './screens/Home.svelte';
  import Organisation from './screens/Organisation.svelte';
  import Register from './screens/Register.svelte';
  import RegisterOrg from './screens/RegisterOrg.svelte';
  import authStoreActions from "./stores/authstore";


  let loggedIn = authStoreActions.isAuthenticated();
  let route = 'home';
  let floorId;
  let cookiesAccepted = false;

  $: console.log('Logged In',loggedIn);
  $: console.log('ROUTE',route);
  $: console.log('Floor ID App',floorId);
  $: console.log('COOKIES', authStoreActions.getCookiesAccepted());
  $: if(authStoreActions.getCookiesAccepted()) {
      cookiesAccepted = true;
      console.log('Cookes');
  }

  function logout() {
    console.log('logging out');
    authStoreActions.logOut();
    loggedIn = false;
  }
</script>

<style>
	main {
		text-align: center;
    margin: 0;
    padding:0;
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
      margin: 0;
      padding:0;
      min-height: 100vh;
		}
	}

  header.hero {
      background-image: url(/assets/hero.png);
      /* background-image: linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url(/assets/hero.png);*/
      height:100vh;
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
  }

  header.non-hero {
      height:10vh;
  }

  footer {
    background-color: #93B5C6;
    min-height: 10vh;
    text-align: center;
    padding:10px;
    margin-top: 10px;
  }


  .hero-text {
    color:#fff;
    font-family: 'Encode Sans SC', sans-serif;
    size: 250%;
    /* font-family: 'Fuggles', cursive; */
  }

  .space {
    height: 10vh;
  }
</style>


<main>
  {#if !cookiesAccepted}
    <CookiesDialog
      title = "Cookies"
      on:cancel = { () => { cookiesAccepted= true; }}
    />
  {/if}
  <header class="{ route === 'home' ? 'hero' : 'non-hero' }">
    <Nav
      authenticated={loggedIn}
      logout={logout}
      active={route}
      on:nav={(r) => { route = r.detail}}
    />
    {#if route === 'home'}
      <div class="hero">
        <div class='space'></div>
        <h1 class="hero-text">Hotdesk Booking System</h1>
        <div class='space'></div>

        {#if loggedIn }
            <!-- <Home
              on:nav={(r) => {console.log(r.detail);route = r.detail;}}
            /> -->
            <OrganisationOptions
              on:nav={(r) => { route = r.detail}}
            />
        {/if}

      </div>
    {/if}
  </header>

  <div class="space"></div>

  {#if route === 'home'}
    <Home
      on:nav={(r) => {console.log(r.detail);route = r.detail;}}
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
  {:else if route === 'org'}
    <Organisation
      on:nav={(r)=> {route = r.detail.dest;floorId=r.detail.floorId;}}
    />
  {:else if route === 'addPlan'}
    <Plan
      {floorId}
      on:nav={(r) => {route = r.detail;}}
    />
  {/if}
</main>

<footer>
  <a href="https://chrisbriant.uk/" target="_blank">My Work</a> |

</footer>
