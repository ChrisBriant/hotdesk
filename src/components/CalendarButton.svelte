<script>
  export let id;
  export let type = "button";
  export let href = null;
  export let mode = null;
  export let color = null;
  export let disabled = false;
  export let direction = 'forward';
</script>

<style>
  button,
  a {
    font: inherit;
    border: 1px solid #8c6f3f;
    background: #f2bd68;
    padding: 0.25rem;
    color: white;
    border-radius: 0px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.26);
    cursor: pointer;
    text-decoration: none;
  }

  button:focus {
    outline: none;
  }

  button:hover,
  button:active,
  a:hover,
  a:active {
    background: #ffc870;
    border-color: #8c6f3f;
    box-shadow: 1px 1px 8px rgba(77, 51, 51, 0.26);
  }

  button:disabled,
  button:disabled:hover,
  button:disabled:active {
    background: #ccc;
    border-color: #ccc;
    color: #959595;
    box-shadow: none;
    cursor: not-allowed;
  }


  img {
    width: 1rem;
  }

</style>

{#if href}
  <a {id} {href}>
    <slot />
  </a>
{:else}
  <button {id} class="{mode} {color}" {type} on:click {disabled}>
    {#if direction==='forward'}
      {#if disabled}
        <img alt="calendar go forward" src="/assets/arrowfwdgr.svg"/>
      {:else}
        <img alt="calendar go forward" src="/assets/arrowfwdwh.svg"/>
      {/if}
    {:else}
      {#if disabled}
        <img alt="calendar go back" src="/assets/arrowbkgr.svg"/>
      {:else}
        <img alt="calendar go forward" src="/assets/arrowbkwh.svg"/>
      {/if}
    {/if}
  </button>
{/if}
