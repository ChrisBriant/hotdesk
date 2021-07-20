<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import {URLROOT} from '../helpers/settings';
	//import { Desk } from '../classes/Desk';
  //import DeskInput from '../dialogs/DeskInput.svelte';
	import { deskStoreActions } from '../stores/deskstore';
	import { bookingStoreActions } from '../stores/bookingstore';
	import { getMousePos, stringGen } from '../helpers/helpers';

  let ctx;

	const dispatch = createEventDispatcher();

  export let width = 400;
  export let height = 300;
  export let plan = null;
	export let planChanged = false;
	export let redraw;

	let canvas = null;
  let m = { x: 0, y: 0, pos:'' };
	let imgObj;
	let imgLoaded = false;

  let xPos = 0;
  let yPos = 0;

	const SCALE = 2;

	$:if(planChanged) {
		setupCanvas();
	}

	$:if(redraw) {
		draw();
		dispatch('reDrawn');
	}


	const draw = () => {
		console.log('BOOKINGS STATE',$bookingStoreActions.bookings);
		ctx.imageSmoothingEnabled = true;
		ctx.fillStyle = '#edeae6';
		ctx.fillRect(0, 0, width, height);
		ctx.lineWidth = 4;
		ctx.drawImage(imgObj, 0, 0, width,height)
		for(let i=0;i<$deskStoreActions.desks.length;i++) {
			let drawColor = '#000000';
			if($deskStoreActions.selectedDesk.id===$deskStoreActions.desks[i].id) {
				drawColor = '#ab751f';
			}
			if(bookingStoreActions.isBooked($deskStoreActions.desks[i])) {
				drawColor = '#f55742';
			}
			$deskStoreActions.desks[i].drawScale(ctx,SCALE,drawColor);
		}
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
					draw();
				}
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
			if($deskStoreActions.desks[i].containsScale(x,y,SCALE)) {
				if(!bookingStoreActions.isBooked($deskStoreActions.desks[i])) {
					return $deskStoreActions.desks[i];
				} else {
					return null;
				}
			}
		}
		return null;
	}


  const handleClick = (e) => {
		let canvasDims = e.target.getBoundingClientRect();

		let mousePos = getMousePos(e);
		xPos = mousePos.x;
		yPos = mousePos.y;
		let clickedRect = insideRect(xPos,yPos);
		if(clickedRect) {
			deskStoreActions.setDesk(clickedRect);
			draw();
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
