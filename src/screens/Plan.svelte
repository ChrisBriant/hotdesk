<script>
	//Screen to display the options for joining a room and lists other users
  import Button from '../components/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import {isFileTypeValid} from '../helpers/validation';
  import {URLROOT} from '../helpers/settings';
  import {isEmpty} from '../helpers/helpers';
  import Canvas from '../components/Canvas.svelte';
  import FloorPanel from '../components/FloorPanel.svelte';
  import {deskStoreActions} from "../stores/deskstore";

  const dispatch = createEventDispatcher();

  export let floorId;

  let image = null;
  let imageChanged = false;
  let uploadDisabled = false;
  let editMode = false;

  //For redrawing the canvas
  let redrawCommand = false;

  const uploadDrawing = async () => {
    let fileUpload = document.getElementById('plan-upload');
    image = fileUpload.files[0];
    editMode = false;
  }

  //Callback function to reset load flag
  const setLoadedImage = () => {
    imageChanged = false;
    uploadDisabled = true;
  }

  $:if(image) {
    imageChanged = true;
  };

  const loadImageFromURL = async (url) => {
    await fetch(url)
      .then(res => res.blob())
      .then(blob => {
        image = blob;
        editMode=true;
    });
  }

  $:if($deskStoreActions.floorPreLoaded) {
    deskStoreActions.setFloorPreLoaded(false);
    //Add the base URL
    loadImageFromURL(URLROOT+$deskStoreActions.plan.picture);
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

  .upload-box {
      display:block;
      padding: 1rem;
      position: absolute;
      top: 40vh;
      left: 20%;
      right: 20%;
      width: 60%;
      background: white;
      z-index: 50;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
      overflow: hidden;
  }

</style>


<div class="panel">
  {#if !uploadDisabled}
    <div class="backdrop" on:click="{() => dispatch('cancel')}" ></div>

    <div class="upload-box">
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
      {#if editMode}
        <Button
          id="upload-plan"
          on:click={() => {uploadDisabled=true;}}
        >Cancel</Button>
      {/if}
    </div>
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
