<script>
  import { createEventDispatcher } from 'svelte';
  import { bookingStoreActions } from '../stores/bookingstore';

  const dispatch = createEventDispatcher();

  export let orgId;
  export let floorId = null;
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();

  $:console.log('MONTH DATA', orgId,floorId,month,day);

  $:if(floorId) {
    bookingStoreActions.getBookings({
      orgId,
      floorId,
      month,
      year
    });
  }


</script>

<style>
  .week {
    display:flex;
  }

  .day {
    width:1rem;
  }

  .day span {
    font-size: 60%;
  }

  .active-day {
    background-color: #f7f3f2;
    border: 1px solid #b8b8b8;
  }

  .inactive-day {
    background-color: #e6e6e6;
    border: 1px solid #b8b8b8;
  }

  .passed-day {
    background: repeating-linear-gradient(
      45deg,
        #e6e6e6,
        #e6e6e6 10px,
        #b8b8b8 10px,
        #b8b8b8 20px
    );
    border: 1px solid #b8b8b8;
    /*background-color: #b8b8b8;*/
  }
</style>

<div>
  <p>{month}</p>
  {#each $bookingStoreActions.calendar as week,i }
    <div class="week">
      {#each week as day,j }
        <div class={`day ${day.className}`}>
          <span>{day.day}</span>
        </div>
      {/each}
    </div>
  {/each}
</div>
