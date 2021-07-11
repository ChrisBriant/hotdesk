<script>
	//Screen to display the options for joining a room and lists other users
  //let roomName = '';
  import Button from '../components/Button.svelte';
  import {isFileTypeValid} from '../validation/validation';
  import Canvas from '../components/Canvas.svelte';

  export let floorId;

  let image = null;

  const uploadDrawing = async () => {
    let fileUpload = document.getElementById('plan-upload');
    console.log(fileUpload.files[0]);
    image = fileUpload.files[0];
    if(isFileTypeValid(image)) {
     console.log('File is valid');
    }

  }

  $:console.log('image changed', image);
</script>

<style>

</style>


<div>
  <p>Upload a File</p>
  <input type="file"
       id="plan-upload" name="plan-upload"
       accept="image/png, image/jpeg">
  <Button id="upload-plan" on:click={uploadDrawing}>Upload</Button>
  <Canvas bind:image/>
</div>
