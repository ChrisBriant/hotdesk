<script>
    import { createEventDispatcher, onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';

    const dispatch = createEventDispatcher();

    let agreed = false;
    let autoscroll = false;

    beforeUpdate(() => {
        autoscroll = agreed;
    });

    afterUpdate(() => {
        if(autoscroll) {
            const modal = document.querySelector('.modal');
            modal.scrollTo(0,modal.scrollHeight);
        }
    });
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
        max-height: 60%;
        height: auto;
        background: white;
        border-radius: 5px;
        z-index: 100;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        overflow: hidden;
    }

    header {
        border-bottom: 1px solid #ccc;
    }
</style>

<div class="backdrop" on:click="{() => dispatch('cancel')}" ></div>

<div class="modal">
    <header>
        <slot name="header" />
    </header>
    <div class="content">
        <slot name="content" />
    </div>
    <footer>
        <slot name="footer" didAgree={agreed}>

        </slot>
    </footer>
</div>
