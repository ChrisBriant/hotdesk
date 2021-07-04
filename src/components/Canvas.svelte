<script>
	import { onMount } from 'svelte';
	import { Desk } from '../classes/Desk';
  import DeskInput from '../dialogs/DeskInput.svelte';
	import { deskStoreActions } from '../stores/deskstore';
	import { getMousePos } from '../helpers/helpers';

  let ctx;

  export let width = 800;
  export let height = 600;
	export let drawMode = false;
  export let image = null;

	let canvas = null;
  let m = { x: 0, y: 0, pos:'' };
  let draw = false;
	let drawing = false;
  let launchDeskDialog = false;
	let imgObj;
	let imgLoaded = false;

  let xPos = 0;
  let yPos = 0;

  //Saved rects
	let currentRect = null;

	$:console.log('desk store', $deskStoreActions.desks)

  $:if(image){
		if(!imgLoaded) {
	    imgObj = new Image();
	    let reader = new FileReader();
	    reader.readAsDataURL(image);
	    reader.onload = (e) => {
	      imgObj.src =  e.target.result;
				imgLoaded = true;
				//For Firefox it has to be called below as well - don't know why
				ctx.drawImage(imgObj, 0, 0, width,height);
	    };
		} else {
			ctx.drawImage(imgObj, 0, 0, width,height);
		}
  };

	onMount(() => {
		ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#edeae6';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 4;
	});

	//Find the first rectangle mouse click is in
	const insideRect = (x,y) => {
		for(let i=0;i<$deskStoreActions.desks.length;i++) {
			if($deskStoreActions.desks[i].contains(x,y)) {
				return $deskStoreActions.desks[i];
			}
		}
		return null;
	}

  const redraw = () => {
    ctx.fillRect(0, 0, width, height);
		ctx.drawImage(imgObj, 0, 0, width,height)
    //Draw the saved rects
    for(let i=0;i<$deskStoreActions.desks.length;i++) {
			$deskStoreActions.desks[i].draw();
    }
  }

  const handleDrag = (e) => {
    if(draw) {
			let mousePos = getMousePos(e);
			let rectWidth =  mousePos.x - xPos;
			let rectHeight = mousePos.y - yPos;
      redraw();
			currentRect = new Desk(xPos,yPos,rectWidth,rectHeight,ctx);
			currentRect.draw();
			drawing = true;
    }
  }

  const handleClick = (e) => {
		let canvasDims = e.target.getBoundingClientRect();

		if(image) {
			let mousePos = getMousePos(e);
			xPos = mousePos.x;
			yPos = mousePos.y;
			let clickedRect = insideRect(xPos,yPos);
			if(clickedRect) {
				currentRect = clickedRect;
	      launchDeskDialog = true;
	      draw = false;
	    } else {
	      draw = true;
	    };
		}
  }

  const handleUnClick = (e) => {
		let mousePos = getMousePos(e);
		let rectWidth =  mousePos.x - xPos;
		let rectHeight = mousePos.y - yPos;
    draw = false;
    //Save the rect
		if(drawing) {
			//Only save if the user has dragged
			deskStoreActions.addDesk(currentRect);
			drawing = false;
			launchDeskDialog = true;
		}
  }

  const closeDialog = () => {
    launchDeskDialog = false;
		redraw();
  }



</script>

<style>
	.canvas-drawing {
		cursor:crosshair;
	}

	/* .canvas-nocursor {
		cursor:none;
	} */

</style>

<div>
  {#if launchDeskDialog}
    <DeskInput on:cancel={closeDialog} desk={currentRect} name={currentRect.getName()} />
  {/if}
	<canvas
		class="canvas-drawing"
	  bind:this={canvas}
		width={width}
		height={height}
    on:mousemove={(e) => handleDrag(e)}
    on:mousedown={(e) => handleClick(e)}
    on:mouseup={(e) => handleUnClick(e)}
	>
	</canvas>

</div>
