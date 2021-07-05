<script>
    import { createEventDispatcher } from 'svelte';

    //export let login;
    export let authenticated;

    export let active='home';
    //Functions
    export let logout;
    const href=null;
    const dispatch = createEventDispatcher();

    function navigate(location) {
        switch(location) {
            case 'logout':
                logout();
                dispatch('nav', 'home');
                break;
            default:
                active = location;
                dispatch('nav', location);
        }
    }
</script>

<style>
    /* Add a black background color to the top navigation */
    .topnav {
    /* background-color: #333; */
    background-color: #361219;
    overflow: hidden;
    }

    /* Style the links inside the navigation bar */
    .topnav a, span {
        float: left;
        color: #FF916C;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 100%;
    }

    /* Change the color of links on hover */
    .topnav a:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    /* Add a color to the active/current link */
    .topnav a.active {
        color: white;
        text-decoration: underline;
    }

    #spacer {
        height:10px;
    }


</style>

{#if authenticated}
    <nav class="topnav">
        <span>Quiz Master</span>
        <a class="{active === 'home' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('home')}>Home</a>
        <a class="{active === 'logout' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('logout')}>Logout</a>
        <a class="{active === 'about' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('about')}>About</a>
    </nav>
{:else}
    <nav class="topnav">
        <span>Quiz Master</span>
        <a class="{active === 'home' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('home')} >Home</a>
        <a class="{active === 'login' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('login')}>Login</a>
        <a class="{active === 'register' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('register')}>Register</a>
        <a class="{active === 'forgot' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('forgot')}>Forgot</a>
        <a href="#about">About</a>
    </nav>
{/if}
