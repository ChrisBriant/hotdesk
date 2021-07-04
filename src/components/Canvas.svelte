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
  //let rects = [];

	$:console.log('desk store', $deskStoreActions.desks)

  $:if(image){
		if(!imgLoaded) {
	    console.log('Here is your file', typeof image);
	    imgObj = new Image();
	    let reader = new FileReader();
	    reader.readAsDataURL(image);
	    reader.onload = (e) => {
	      imgObj.src =  e.target.result;
	      console.log('I should draw the image',ctx,imgObj);
				// ctx.fillRect(0, 0, width, height);
				//ctx.drawImage(imgObj, 0, 0, width,height);
				imgLoaded = true;
				//For Firefox it has to be called below as well - don't know why
				ctx.drawImage(imgObj, 0, 0, width,height);
	    };
		} else {
			ctx.drawImage(imgObj, 0, 0, width,height);
		}
  };

	// $:if(imgLoaded) {
	//
	// }

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
      // ctx.beginPath();
      // ctx.rect(rects[i].x, rects[i].y,rects[i].rectWidth,rects[i].rectHeight);
      // ctx.stroke();
    }
  }

  const handleDrag = (e) => {
    if(draw) {
      //console.log('This is a drag!',xPos,yPos,e.x - e.target.offsetLeft,e.y  - e.target.offsetTop);
      //let rectWidth =  (e.x - e.target.offsetLeft) -xPos;
      //let rectHeight = (e.y - e.target.offsetTop) - yPos;
			let mousePos = getMousePos(e);
			let rectWidth =  mousePos.x - xPos;
			let rectHeight = mousePos.y - yPos;
      redraw();
			currentRect = new Desk(xPos,yPos,rectWidth,rectHeight,ctx);
			currentRect.draw();
			drawing = true;
      // ctx.beginPath();
      // ctx.rect(xPos, yPos,rectWidth,rectHeight);
      // ctx.stroke();

    }
  }

  const handleClick = (e) => {
		let canvasDims = e.target.getBoundingClientRect();
		console.log('click',Math.floor(e.y - e.target.offsetTop), Math.floor(e.y - canvasDims.top));
		if(image) {
			console.log('click',e.y - e.target.offsetTop);
	    //xPos = e.x - e.target.offsetLeft;
	    //yPos = e.y - e.target.offsetTop;
			let mousePos = getMousePos(e);
			xPos = mousePos.x;
			yPos = mousePos.y;
			let clickedRect = insideRect(xPos,yPos);
			if(clickedRect) {
	      console.log('Inside a rect');
				currentRect = clickedRect;
	      launchDeskDialog = true;
	      draw = false;
	    } else {
	      draw = true;
	    };
		}
  }

  const handleUnClick = (e) => {
    //let rectWidth =  (e.x - e.target.offsetLeft) -xPos;
    //let rectHeight = (e.y - e.target.offsetTop) - yPos;
		let mousePos = getMousePos(e);
		console.log('');
		let rectWidth =  mousePos.x - xPos;
		let rectHeight = mousePos.y - yPos;
		//let rectWidth =  (e.x - e.offsetX) -xPos;
		//let rectHeight = (e.y - e.offsetY) - yPos;
    draw = false;
    //Save the rect
		if(drawing) {
			//Only save if the user has dragged
			deskStoreActions.addDesk(currentRect);
			drawing = false;
			launchDeskDialog = true;
		}
		//rects.push(currentRect);
    // rects.push({
    //     x:xPos,
    //     y:yPos,
    //     rectWidth,
    //     rectHeight,
    //     geo: new Polygon()
    //   }
    // );
  }

  const closeDialog = () => {
    launchDeskDialog = false;
		console.log('Desks',$deskStoreActions.desks);
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

  <!-- on:mousemove={(e) => handleDrag(e)}
  on:mousedown={(e) => handleClick(e)}
  on:mouseup={(e) => handleUnClick(e)} -->
</div>
