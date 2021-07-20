<script>
  import { onMount } from 'svelte';
  import {bookingStoreActions} from "../stores/bookingstore";
  import orgStoreActions from "../stores/orgstore";
  import BinaryChoice from "../dialogs/BinaryChoice.svelte";


  let showDialog = false;
  let diagMessage = '';
  let promise;
  let cancelId;

  onMount( async () => {
    let payload = {
      orgId: $orgStoreActions.currentOrg.id
    }
    console.log("Payload IS",  $orgStoreActions.currentOrg);
    promise = await bookingStoreActions.getMyBookings(payload);

  });


  const cancelBooking = (bookingId, deskNm,deskDate) => {
    diagMessage = `Are you sure you want to cancel ${deskNm} on ${deskDate}?`;
    cancelId = bookingId;
    showDialog = true;
  }

  const deleteBooking = async () => {
    const payload = {
      orgId : $orgStoreActions.currentOrg.id,
      bookingId : cancelId
    };
    promise = await bookingStoreActions.cancelBooking(payload);
    showDialog = false;
  }

  $: console.log('BOOKING STORE',$bookingStoreActions);
</script>

<style>
</style>

<section>
  {#if showDialog}
    <BinaryChoice
      message={diagMessage}
      on:no={() => {showDialog=false}}
      on:yes={() => {deleteBooking()}}
    />
  {/if}
  <h2>Bookings for {$orgStoreActions.currentOrg.name}</h2>
  {#await promise}
    <p>Loading...</p>
  {:then}
    {#if $bookingStoreActions.myBookings.length === 0}
      <p>No bookings exist for this organisation.</p>
    {:else}
      <div class="row">
        <div class="col left-align-txt">
          Building
        </div>
        <div class="col left-align-txt">
          Floor
        </div>
        <div class="col left-align-txt">
          Desk Name
        </div>
        <div class="col left-align-txt">
          Date Booked
        </div>
        <div class="col left-align-txt">
          Cancel
        </div>
      </div>
      {#each $bookingStoreActions.myBookings as booking,i (i)}
        <div class="row">
          <div class="col left-align-txt">
            {booking.desk.desk_building}
          </div>
          <div class="col left-align-txt">
            {booking.desk.desk_floor}
          </div>
          <div class="col left-align-txt">
            {booking.desk.name}
          </div>
          <div class="col left-align-txt">
            {booking.date_str}
          </div>
          <div class="col left-align-txt">
            <a href={null}
               class="link"
               on:click={() => {cancelBooking(booking.id,booking.desk.name,booking.date_str)}}
            >
              Cancel Booking
            </a>
          </div>
        </div>
      {/each}
    {/if}
  {/await}
</section>
