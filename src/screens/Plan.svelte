<script>
	//Screen to display the options for joining a room and lists other users
  //let roomName = '';
  import Button from '../components/Button.svelte';
  import {isFileTypeValid} from '../validation/validation';
  import Canvas from '../components/Canvas.svelte';
  import FloorPanel from '../components/FloorPanel.svelte';

  export let floorId;

  let image = null;
  let imageChanged = false;
  let uploadDisabled = false;

  //For redrawing the canvas
  let redrawCommand = false;

  const uploadDrawing = async () => {
    let fileUpload = document.getElementById('plan-upload');
    console.log(fileUpload.files[0]);
    image = fileUpload.files[0];
    if(isFileTypeValid(image)) {
     console.log('File is valid');
    }

  }

  //Callback function to reset load flag
  const setLoadedImage = () => {
    imageChanged = false;
    uploadDisabled = true;
  }

  $:if(image) {
    console.log('There is an image');
    imageChanged = true;
  };

  $: console.log('Floor ID', floorId);
</script>

<style>

</style>


<div>
  <p>Upload a File</p>
  <input type="file"
       id="plan-upload" name="plan-upload"
       accept="image/png, image/jpeg"
       disabled={uploadDisabled}
  >
  <Button
    id="upload-plan"
    on:click={uploadDrawing}
    disabled={uploadDisabled}
  >Upload</Button>
  <FloorPanel
    on:redraw={()=> {redrawCommand=true}}
    on:nav
  />
  <Canvas
    {imageChanged}
    {floorId}
    {redrawCommand}
    on:loaded={(e)=>{imageChanged=false;uploadDisabled = true;}}
    on:resetRedraw={()=> {redrawCommand=false}}
    bind:image
  />
</div>
