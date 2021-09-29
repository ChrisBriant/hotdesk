<script>
  import { onMount } from 'svelte';
  import CookiesDialog from './dialogs/CookiesDialog.svelte';
  import OrganisationOptions from './components/OrganisationOptions.svelte';
  import FindOrganisation from './components/FindOrganisation.svelte';
  import Plan from './screens/Plan.svelte';
  import Nav from './screens/Nav.svelte';
  import Forgot from './screens/Forgot.svelte';
  import Login from './screens/Login.svelte';
  import Home from './screens/Home.svelte';
  import JoinOrg from './screens/JoinOrg.svelte';
  import Contact from './screens/Contact.svelte';
  import Organisation from './screens/Organisation.svelte';
  import Register from './screens/Register.svelte';
  import RegisterOrg from './screens/RegisterOrg.svelte';
  import authStoreActions from "./stores/authstore";
  import orgStoreActions from './stores/orgstore';
  import Spacer from './components/Spacer.svelte';


  let loggedIn = authStoreActions.isAuthenticated();
  let route = 'home';
  let floorId;
  let cookiesAccepted = false;
  let queryParam = window.location.search;

  $: if(authStoreActions.getCookiesAccepted()) {
      cookiesAccepted = true;
  }


  $: if(queryParam.split('=')[0] === '?joinorg') {
      route = 'joinorgurl';
  }

  //Load the organisations if logged on
  onMount(() => {
    if(authStoreActions.isAuthenticated()) {
      orgStoreActions.loadOrganisations();
    }
  });

  function logout() {
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
      min-height:120vh;
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

  .hero-box {
    margin: auto;
    margin-bottom: 25px;
    padding: 20px;
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
            <OrganisationOptions
              organisations = {$orgStoreActions.organisations}
              on:nav={(r) => { route = r.detail}}
            />
            <Spacer />
        {:else}
          <div class="row">
            <div class="col-md-12 home-panel hero-box">
              <FindOrganisation
                on:nav={(r) => { route = r.detail}}
              />
              <a href="#homepageafterhero">Click Here to Read More</a>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </header>

  <div class="space"></div>

  {#if route === 'home'}
    <Home
      organisations = {$orgStoreActions.organisations}
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
  {:else if route === 'org'}
    <Organisation
      on:nav={(r)=> {route = r.detail.dest;floorId=r.detail.floorId;}}
    />
  {:else if route === 'addPlan'}
    <Plan
      {floorId}
      on:nav={(r) => {route = r.detail;}}
    />
  {:else if route === 'contact'}
    <Contact
      on:nav={(r) => {route = r.detail;}}
    />
  {:else if route === 'joinorgurl'}
    <JoinOrg
      orgId={queryParam.split('=')[1]}
      on:nav={(r) => {route = r.detail;}}
    />
  {/if}
</main>

<footer>
  <a href="https://chrisbriant.uk/" target="_blank">My Work</a> |
  <a href={null} class="link" on:click={() => {route = 'contact'}}>Contact</a> |
  <a href="https://github.com/ChrisBriant" target="_blank">Git Hub</a>
</footer>
