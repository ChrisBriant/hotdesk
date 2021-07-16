<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import {URLROOT} from '../helpers/settings';
	//import { Desk } from '../classes/Desk';
  //import DeskInput from '../dialogs/DeskInput.svelte';
	import { deskStoreActions } from '../stores/deskstore';
	import { getMousePos, stringGen } from '../helpers/helpers';

  let ctx;

	const dispatch = createEventDispatcher();

  export let width = 400;
  export let height = 300;
  export let plan = null;
	export let planChanged = false;

	let canvas = null;
  let m = { x: 0, y: 0, pos:'' };
	let imgObj;
	let imgLoaded = false;

  let xPos = 0;
  let yPos = 0;

	$:if(planChanged) {
		setupCanvas();
	}

	const setupCanvas = async () => {
		deskStoreActions.clearStore();
		deskStoreActions.setContext(ctx);
		deskStoreActions.loadPlan(plan);
		//Initial setup
		await fetch(URLROOT+plan.picture)
			.then(res => res.blob())
			.then(blob => {
				imgObj = new Image();
				let reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onload = async (e) => {
					imgObj.src = e.target.result;
				}
				reader.onloadend = async (e) => {
					ctx.imageSmoothingEnabled = true;
					ctx.fillStyle = '#edeae6';
					ctx.fillRect(0, 0, width, height);
					ctx.lineWidth = 4;
					ctx.drawImage(imgObj, 0, 0, width,height)
					for(let i=0;i<$deskStoreActions.desks.length;i++) {
						$deskStoreActions.desks[i].drawScale(ctx,2);
					}
				}
				//image = blob;
				dispatch('resetchange');
		});
	}

	onMount( async () => {
		//Get the context and store it
		ctx = canvas.getContext('2d');
		setupCanvas();
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

  // const redraw = () => {
	// 	dispatch('resetRedraw');
  //   ctx.fillRect(0, 0, width, height);
	// 	ctx.drawImage(imgObj, 0, 0, width,height)
  //   //Draw the saved rects
  //   for(let i=0;i<$deskStoreActions.desks.length;i++) {
	// 		$deskStoreActions.desks[i].draw(ctx);
  //   }
  // }

  const handleClick = (e) => {
		let canvasDims = e.target.getBoundingClientRect();

		if(image) {
			let mousePos = getMousePos(e);
			xPos = mousePos.x;
			yPos = mousePos.y;
			let clickedRect = insideRect(xPos,yPos);
			if(clickedRect) {
        console.log('CLICK INSIDE RECT');
	    }
		}
  }

  const handleUnClick = (e) => {
    console.log('UNCLICKED');
  }

  // const closeDialog = () => {
  //   launchDeskDialog = false;
	// 	redraw();
  // }



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
	<canvas
		class="canvas-drawing"
	  bind:this={canvas}
		width={width}
		height={height}
    on:mousedown={(e) => handleClick(e)}
    on:mouseup={(e) => handleUnClick(e)}
	>
	</canvas>

</div>
