<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { Desk } from '../classes/Desk';
  import DeskInput from '../dialogs/DeskInput.svelte';
	import { deskStoreActions } from '../stores/deskstore';
	import { getMousePos, stringGen } from '../helpers/helpers';

  let ctx;

	const dispatch = createEventDispatcher();

  export let width = 800;
  export let height = 600;
  export let image = null;
	export let imageChanged = false;
	export let floorId;
	export let editMode;
	//For signaling a redraw
	export let redrawCommand = false;

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

	const DEFAULTSTROKESTYLE = '#000000';
	const SELECTEDSTROKECOLOR = '#fc5e03';

	$: if(redrawCommand) {
		redraw();
	}

	$: if(imageChanged) {
		if(!editMode) {
	    imgObj = new Image();
	    let reader = new FileReader();
	    reader.readAsDataURL(image);
	    reader.onload = (e) => {
	      imgObj.src =  e.target.result;
	    };
			reader.onloadend = async (e) => {
				imgObj.onload = async () => {
					ctx.fillRect(0, 0, width, height);
					ctx.drawImage(imgObj, 0, 0, width,height);
					//Construct the file to send to backend
					await fetch(canvas.toDataURL())
						.then(res => res.blob())
						.then(blob => {
							const fd = new FormData();
							const ext = blob.type.split('/')[1];
							const file = new File([blob], `filename.${ext}`);
							fd.append('floorId',floorId);
							fd.append('picture', file);
							deskStoreActions.saveImage(fd);
							for (var value of fd.values()) {
							}
							redraw();
					});
				}
			}
		} else {
			imgObj = new Image();
			let reader = new FileReader();
	    reader.readAsDataURL(image);
			reader.onload = async (e) => {
				imgObj.src = e.target.result;
				ctx.drawImage(imgObj, 0, 0, width,height);
			}
			reader.onloadend = async (e) => {
				imgObj.onload = () => {
					//Loads image and the rectangles
					redraw();
				}
			}
		}
		dispatch('loaded');
	}

	onMount(() => {
		//Get the context and store it
		ctx = canvas.getContext('2d');
		deskStoreActions.setContext(ctx);
		//Initial setup
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
		dispatch('resetRedraw');
    ctx.fillRect(0, 0, width, height);
		ctx.drawImage(imgObj, 0, 0, width,height)
    //Draw the saved rects
    for(let i=0;i<$deskStoreActions.desks.length;i++) {
			if(currentRect) {
				if(currentRect.id === $deskStoreActions.desks[i].id) {
					ctx.strokeStyle = SELECTEDSTROKECOLOR;
				} else {
					ctx.strokeStyle = DEFAULTSTROKESTYLE;
				}
			}
			$deskStoreActions.desks[i].draw(ctx);
    }
  }

  const handleDrag = (e) => {
    if(draw) {
			let mousePos = getMousePos(e);
			let rectWidth =  mousePos.x - xPos;
			let rectHeight = mousePos.y - yPos;
      redraw();
			currentRect = new Desk(xPos,yPos,rectWidth,rectHeight);
			ctx.strokeStyle = SELECTEDSTROKECOLOR;
			currentRect.draw(ctx);
			ctx.strokeStyle = DEFAULTSTROKESTYLE;
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
		redraw();
  }

  const handleUnClick = (e) => {
		let mousePos = getMousePos(e);
		let rectWidth =  mousePos.x - xPos;
		let rectHeight = mousePos.y - yPos;
    draw = false;
    //Save the rect
		if(drawing) {
			//Only save if the user has dragged
			const deskId = stringGen(16);
			currentRect.setId(deskId);
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

	canvas {
		border-bottom: 1px solid #000;
		border-left: 1px solid #000;
		border-right: 1px solid #000;
	}
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
