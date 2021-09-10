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
    .topnav {
      background-color: #00aaff;
      overflow: hidden;
    }

    /* Style the links inside the navigation bar */
    .topnav a, span {
        float: left;
        color: #fff;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 100%;
        font-weight: 700;
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
</style>

{#if authenticated}
    <nav class="topnav">
        <span>Hotdesk</span>
        <a class="{active === 'home' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('home')}>Home</a>
        <a class="{active === 'logout' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('logout')}>Logout</a>
        <a class="{active === 'contact' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('contact')}>Contact</a>
    </nav>
{:else}
    <nav class="topnav">
        <span>Hotdesk</span>
        <a class="{active === 'home' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('home')} >Home</a>
        <a class="{active === 'login' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('login')}>Login</a>
        <a class="{active === 'register' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('register')}>Register</a>
        <a class="{active === 'forgot' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('forgot')}>Forgot</a>
        <a class="{active === 'contact' ? 'active' : ''}" {href} on:click|preventDefault={() => navigate('contact')}>Contact</a>
    </nav>
{/if}
