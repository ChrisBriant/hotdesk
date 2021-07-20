<script>
  import { onMount } from 'svelte';
  import {bookingStoreActions} from "../stores/bookingstore";

  let promise;

  onMount( async () => {
    promise = await bookingStoreActions.getMyBookings();

  });

  $: console.log('BOOKING STORE',$bookingStoreActions);
</script>

<style>
</style>

<section>
  {#await promise}
    <p>Loading...</p>
  {:then}
    {#each $bookingStoreActions.myBookings as booking,i (i)}
      <div class="row">
        <div class="col">
          {booking.desk.desk_building}
        </div>
        <div class="col">
          {booking.desk.desk_floor}
        </div>
        <div class="col">
          {booking.desk.name}
        </div>
        <div class="col">
          {booking.desk.date_str}
        </div>
        <div class="col">
          <a href={null}>Cancel Booking</a>
        </div>
      </div>
    {/each}
  {/await}
</section>
