<script>
  export let id;
  export let label;
  export let min = 1;
  export let max = 1000;

</script>

<style>
  .input-container {
    display: flex;
  }

  input {
    width: 20%;
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  input:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    margin-bottom: 0.5rem;
    width: 80%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
    border: 0;
  }

</style>

<div class="form-control input-container">
  <label for={id}>{label}</label>
  <input type="number" on:change id={id} min={min} max={max} value={min}>
</div>
