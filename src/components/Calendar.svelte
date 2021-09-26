<script>
  import moment from 'moment';
  import { createEventDispatcher } from 'svelte';
  import { bookingStoreActions } from '../stores/bookingstore';
  import { getMonthName,simpleDateCompare } from '../helpers/helpers';
  import CalendarButton from '../components/CalendarButton.svelte';
  import Spacer from './Spacer.svelte';

  const dispatch = createEventDispatcher();

  export let orgId;
  export let floorId = null;
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  let selectedDate = new Date(year,month-1,1);
  let disabled = false;
  let promise;
  let allowLoad = false;

  const getBookings = async () => {
    promise = await bookingStoreActions.getBookings({
      orgId,
      floorId,
      month,
      year
    });
    if(promise) {
      dispatch('loadFloorPlan');
    }
  }

  $:if(floorId) {
    getBookings();
    allowLoad = true;
  } else {
    allowLoad = false;
  }

  $:if(selectedDate < Date.now()) {
    disabled = true;
  } else {
    disabled = false;
  }

  const changeMonth = async (direction) => {
    if(direction==="fwd") {
      if(month === 12) {
        month = 1;
        year = year + 1;
      } else {
        month++;
      }
    } else {
      if(month === 1) {
        month = 12;
        year--;
      } else {
        month--;
      }
    }
    const dateStr = `${year}-${month}-1`;
    selectedDate = new Date(dateStr);
    bookingStoreActions.setDay({date:selectedDate});
    promise = await bookingStoreActions.getBookings({
      orgId,
      floorId,
      month,
      year
    });
    if(promise) {
      dispatch('dayChanged');
    }
  }
</script>

<style>
  .week {
    display:flex;
    align-items: center;
    justify-content: center;
  }

  .day {
    width:2rem;
    height: 2rem;
  }

  .day span {
    font-size: 60%;
  }

  .active-day {
    background-color: #f2bd68;
    border: 1px solid #b8b8b8;
    cursor: pointer;
  }

  .active-day:hover {
    background-color: #ffc870;
  }

  .selected-day {
    background-color: #ab751f;
    border: 1px solid #b8b8b8;
    cursor: pointer;
  }

  .inactive-day {
    background-color: #e6e6e6;
    border: 1px solid #b8b8b8;
  }

  .passed-day {
    background: repeating-linear-gradient(
      45deg,
        #e6e6e6,
        #e6e6e6 2px,
        #b8b8b8 2px,
        #b8b8b8 4px
    );
    border: 1px solid #b8b8b8;
  }
</style>

<div>
  {#if allowLoad}
    <div class="row">
      <div class="col">
        <CalendarButton
          id="back"
          direction="back"
          on:click={() => changeMonth('bk')}
          {disabled}
        >
          back
        </CalendarButton>
      </div>
      <div class="col">
        <p>{getMonthName(month)} {year}</p>
      </div>
        <div class="col">
          <CalendarButton
            id="forward"
            direction="forward"
            on:click={() => changeMonth('fwd')}
          >
            forward
          </CalendarButton>
        </div>
    </div>
    {#await promise}
      <p>Loading...</p>
    {:then}
      {#each $bookingStoreActions.calendar as week,i }
        <div class="week">
          {#each week as day,j }
            {#if simpleDateCompare($bookingStoreActions.selectedDay.date,day.date)}
              <div
                class="day selected-day"
              >
                <span>{day.day}</span>
              </div>
            {:else}
              <div
                class={`day ${day.className}`}
                on:click={() => {bookingStoreActions.setDay(day); dispatch('dayChanged');}}

              >
                <span>{day.day}</span>
              </div>
            {/if}
          {/each}
        </div>
      {/each}
    {/await}
    <Spacer />
  {/if}
</div>
