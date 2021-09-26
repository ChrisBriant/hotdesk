<script>
  import Button from '../components/Button.svelte';
  import TextInput from '../components/TextInput.svelte';

  let name = '';

  const findOrg = () => {
    //Call provider
    console.log(name);
  }

</script>

<style>
</style>

<div>
  <p>Type the name of your organisation and click search to see if it exists.</p>
  <TextInput
    id="name"
    label="Organisation Name"
    value={name}
    on:input = {e => {name = e.target.value } }
  />
  <Button type="button"
    id="search"
    on:click={findOrg}
  >Search</Button>
</div>
