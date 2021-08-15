<script>
    import { createEventDispatcher, onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
    import Button from '../components/Button.svelte';
    import authStoreActions from '../stores/authstore';

    const dispatch = createEventDispatcher();

    let agreed = false;
    let autoscroll = false;
    export let title = '';

    beforeUpdate(() => {
        autoscroll = agreed;
    });

    afterUpdate(() => {
        if(autoscroll) {
            const modal = document.querySelector('.modal');
            modal.scrollTo(0,modal.scrollHeight);
        }
    });

    const acceptCookies = () => {
      authStoreActions.setCookiesAccepted();
      dispatch('cancel');
    }

</script>

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        z-index: 10;
     }

    .modal {
        display:block;
        padding: 1rem;
        position: fixed;
        top: 5vh;
        left: 20%;
        width: 60%;
        height: auto;
        max-height: 80%;
        background: white;
        border-radius: 5px;
        z-index: 100;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        overflow: hidden;
    }

    .scroller {
      overflow-y: scroll;
      max-height: 15rem;
    }

    header {
        border-bottom: 1px solid #ccc;
    }

    modal-title {
      text-align: center;
      padding-bottom: 1rem;
    }

    h3.modal-title {
      color: red;
    }

    .space {
      min-height: 1rem;
    }

</style>

<div class="backdrop" on:click="{() => dispatch('cancel')}" ></div>

<div class="modal">
    <header>
          <h3>{title}</h3>
    </header>
    <div class="content">
      <div class="scroller">
        <p>We use a minimal amount of cookies to enchance your experience of this website.
          Cookies are used to store your session data to reduce the need for logging in repeatedly.
          No cookies are used for traking purposes and we do not send data to third parties.
        </p>
        <p>Please confirm your acceptance of cookies by clicking the "accept" button below.</p>
        <p>
          Click <a href="https://www.aboutcookies.org/" target="_blank">here</a> to read more about cookies.
        </p>
      </div>
    </div>
    <footer>
      <div class="space"></div>
      <Button type="button"
        id="cancel"
        on:click={acceptCookies}
      >
          I Accept
      </Button>
    </footer>
</div>
