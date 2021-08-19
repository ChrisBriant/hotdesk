<script>
	//Screen to display the options for joining a room and lists other users
  //let roomName = '';
  import Button from '../components/Button.svelte';
  import {isFileTypeValid} from '../helpers/validation';
  import {URLROOT} from '../helpers/settings';
  import {isEmpty} from '../helpers/helpers';
  import Canvas from '../components/Canvas.svelte';
  import FloorPanel from '../components/FloorPanel.svelte';
  import {deskStoreActions} from "../stores/deskstore";

  export let floorId;

  let image = null;
  let imageChanged = false;
  let uploadDisabled = false;
  let editMode = false;

  //For redrawing the canvas
  let redrawCommand = false;

  $: console.log('Desk Store',$deskStoreActions.plan);

  const uploadDrawing = async () => {
    let fileUpload = document.getElementById('plan-upload');
    console.log(fileUpload.files[0]);
    image = fileUpload.files[0];
    console.log('IMAGE HERE', image);
    if(isFileTypeValid(image)) {
     console.log('File is valid');
    }
    editMode = false;

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

  const loadImageFromURL = async (url) => {
    await fetch(url)
      .then(res => res.blob())
      .then(blob => {
        console.log('this is the image',blob);
        image = blob;
        editMode=true;
        //return blob;
    });
  }

  $:if($deskStoreActions.floorPreLoaded) {
    deskStoreActions.setFloorPreLoaded(false);
    console.log('LOad the drawing',$deskStoreActions.plan);
    //Add the base URL
    loadImageFromURL(URLROOT+$deskStoreActions.plan.picture);
    //image = URLROOT+$deskStoreActions.plan.picture;
    //editMode=true;
    //image = $deskStoreActions.plan.picture;
  }

  $: console.log('Floor ID', floorId);


</script>

<style>

</style>


<div class="panel">
  {#if !uploadDisabled}
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
  {:else}
    <Button
      id="upload-plan"
      on:click={() => {uploadDisabled = false}}
      disabled={false}
    >Change Plan</Button>
  {/if}
  <FloorPanel
    on:redraw={()=> {redrawCommand=true}}
    on:nav
  />
  <Canvas
    {imageChanged}
    {floorId}
    {redrawCommand}
    {editMode}
    on:loaded={(e)=>{imageChanged=false;uploadDisabled = true;}}
    on:resetRedraw={()=> {redrawCommand=false}}
    bind:image
  />
</div>
