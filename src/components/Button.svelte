<script>
  export let id;
  export let type = "button";
  export let href = null;
  export let mode = null;
  export let color = null;
  export let disabled = false;
  export let size = 'btn-std';
</script>

<style>
  button,
  a {
    border: 1px solid #4E9852;
    background: #3FA644;
    color: white;
    border-radius: 5px;
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
    background: #3FA644;
    border-color: #6EC872;
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

  .btn-std {
    font: inherit;
    padding: 0.5rem 1rem;
  }

  /* small button */
  button.btn-sm,
  a.btn-sm {
    font-size: 70%;
    padding: 0.25rem 0.5rem;
  }

  .success {
    background: #01a129;
    border-color: #01a129;
  }

  .success:hover,
  .success:active {
    background: #1ac745;
    border-color: #1ac745;
  }

  .outline {
    background: transparent;
    color: #cf0056;
    box-shadow: none;
  }

  .outline:hover,
  .outline:active {
    background: #ffc7de;
    box-shadow: none;
  }

  .outline:disabled,
  .outline:disabled:hover,
  .outline:disabled:active {
    background: transparent;
    color: #ccc;
  }

  .outline.success {
    border-color: #01a129;
    color: #01a129;
  }

  .outline.success:hover,
  .outline.success:active {
    background: #c2ffd1;
  }

  .expand {
    width: 90%;
  }
</style>

{#if href}
  <a class="{size}" {id} {href}>
    <slot />
  </a>
{:else}
  <button {id} class="{size} {mode} {color}" {type} on:click {disabled}>
    <slot />
  </button>
{/if}
