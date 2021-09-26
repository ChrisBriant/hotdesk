<script>
  import { createEventDispatcher,onMount } from 'svelte';
  import { bookingStoreActions } from '../stores/bookingstore';
  import {deskStoreActions} from "../stores/deskstore";
  import Button from '../components/Button.svelte';
  import moment from 'moment';
  import BinaryChoice from "../dialogs/BinaryChoice.svelte";

  export let planChanged = false;

  let showDialog = false;
  let diagMessage = '';
  let promise;

  const dispatch = createEventDispatcher();

  $:if(planChanged) {
		  deskStoreActions.setDesk($deskStoreActions.desks[0]);
	}

  const changeDesk = (e) => {
    deskStoreActions.setDesk($deskStoreActions.desks.filter(d => d.id === e.target.value)[0]);
    dispatch('deskChanged');
  }

  const makeBooking = () => {
    let dateStr = moment($bookingStoreActions.selectedDay.date).format('LL');
    let deskNm = $deskStoreActions.selectedDesk.name;
    diagMessage = `Book desk ${deskNm} on ${dateStr}?`;
    showDialog = true;
  }

  const sendBooking = async () => {
    showDialog = false;
    let dateStr = moment($bookingStoreActions.selectedDay.date).format('DD/MM/YYYY');
    let payload = {
      deskId: $deskStoreActions.selectedDesk.apiId,
      date: dateStr
    }
    promise = await bookingStoreActions.bookDesk(payload,$deskStoreActions.selectedDesk.name);
    if(promise) {
      dispatch('deskChanged');
    }

  }


</script>

<style>
  .desk-select {
    vertical-align: middle;
  }

</style>


<div>
  {#if showDialog}
    <BinaryChoice
      message={diagMessage}
      on:no={() => {showDialog=false}}
      on:yes={() => {sendBooking()}}
    />
  {/if}
  <p>{moment($bookingStoreActions.selectedDay.date).format('LL')}</p>
  {#if $deskStoreActions.desks.length > 0}
    <div class="desk-select">
      <select
        name="desks"
        id="desks"
        on:change={(e) => {changeDesk(e)}}
      >
          {#each $deskStoreActions.desks as desk, i (i)}
            {#if !bookingStoreActions.isBooked(desk)}
              <option
                value="{desk.id}"
                selected={$deskStoreActions.selectedDesk.id === desk.id}
              >{desk.name}</option>
            {/if}
          {/each}
      </select>
      <Button
        id="book-btn"
        type="button"
        on:click={makeBooking}
        size="small"
      >
        Book
      </Button>
    </div>
  {/if}
</div>
