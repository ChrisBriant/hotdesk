<script>
  import { createEventDispatcher,onMount } from 'svelte';
  import { bookingStoreActions } from '../stores/bookingstore';
  import {deskStoreActions} from "../stores/deskstore";
  import moment from 'moment';

  export let planChanged = false;

  const dispatch = createEventDispatcher();

  $:if(planChanged) {
		  deskStoreActions.setDesk($deskStoreActions.desks[0]);
	}

  // $:if($deskStoreActions.desks.length > 0) {
  //   deskStoreActions.setDesk($deskStoreActions.desks[0]);
  // }

  const changeDesk = (e) => {
    deskStoreActions.setDesk($deskStoreActions.desks.filter(d => d.id === e.target.value)[0]);
    dispatch('deskChanged');
  }



</script>

<style>
</style>


<div>
  <p>{moment($bookingStoreActions.selectedDate).format('LL')}</p>
  {#if $deskStoreActions.desks.length > 0}
    <select
      name="desks"
      id="desks"
      on:change={(e) => {changeDesk(e)}}

    >
        {#each $deskStoreActions.desks as desk, i }
          <option
            value="{desk.id}"
            selected={$deskStoreActions.selectedDesk.id === desk.id}
          >{desk.name}</option>
        {/each}
    </select>
  {/if}
</div>
