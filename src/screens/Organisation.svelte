<script>
  import Button from '../components/Button.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import orgStoreActions from "../stores/orgstore";
  import BinaryChoice from "../dialogs/BinaryChoice.svelte";
  //Sub screens
  import Buildings from './Buildings.svelte';
  import Booking from './Booking.svelte';
  import MyBookings from './MyBookings.svelte';
  import ManageBookings from './ManageBookings.svelte';
  import ManageStaff from './ManageStaff.svelte';

  const dispatch = createEventDispatcher();

  let href=null;
  let showDialog=false;
  let approving=false;
  let diagMessage='';
  let selectedEmployee = {};
  let promise;
  let pendingApprovals = $orgStoreActions.currentOrg.memberships.filter(itm => (!itm.approved));
  let openTab;

  if($orgStoreActions.currentOrg.is_admin) {
    openTab = "man-staff"
  } else {
    openTab = "make-booking"
  }


  onMount( async () => {
    orgStoreActions.loadOrganisation($orgStoreActions.currentOrg.id);
  });

  const getPendingApproval = () => {
    pendingApprovals =  $orgStoreActions.currentOrg.memberships.filter(itm => (!itm.approved));
  }

  const approve = (emp) => {
    approving = true;
    selectedEmployee = emp;
    diagMessage = `Are you sure you want to approve ${emp.name}?`
    showDialog = true;
  }

  const reject = (emp) => {
    approving = false;
    selectedEmployee = emp;
    diagMessage = `Are you sure you want to reject ${emp.name}?`
    showDialog = true;
  }

  const performAcceptReject = async () => {
    showDialog = false;
    if(approving) {
      promise = await orgStoreActions.acceptEmployee({
        orgId: $orgStoreActions.currentOrg.id,
        empId: selectedEmployee.id,
      });
    } else {
      promise = await orgStoreActions.rejectEmployee({
        orgId: $orgStoreActions.currentOrg.id,
        empId: selectedEmployee.id,
      });
    }
    if(promise) {
      getPendingApproval();
    }
  }
</script>


<style>
  /* Style the tab */
  .tab-container {
    margin: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    background-color: #E4D8DC;
  }

  .tab {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
  }

  /* Style the buttons inside the tab */
  .tab button {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 14px 16px;
    transition: 0.3s;
    font-size: 17px;
  }

  /* Change background color of buttons on hover */
  .tab button:hover {
    background-color: #ddd;
  }

  /* Style the tab content */
  .tabcontent {
    /*padding: 6px 12px; */
    border: 1px solid #ccc;
    border-top: none;
  }
</style>


<section>
    {#if showDialog}
      <BinaryChoice
        message={diagMessage}
        on:no={() => {showDialog=false,approving=false;}}
        on:yes={() => {performAcceptReject()}}
      />
    {/if}
    <h2>{$orgStoreActions.currentOrg.name}</h2>
    {#if !$orgStoreActions.currentOrg.is_admin}
      <p>Organisation admin: {$orgStoreActions.currentOrg.owner.name} </p>
      <Button
        id="approve-btn"
        on:click={() => console.log('contact')}
      >
        Contact
      </Button>
    {/if}
    {#if pendingApprovals.length > 0 }
      <h3>You have the following staff awaiting approval</h3>
    {/if}
    {#each pendingApprovals as memb,i (memb.id) }
      <div class="row">
        <div class="col">{memb.employee_data.name}</div>
        <div class="col">{memb.employee_data.email}</div>
        <div class="col">
          <Button
            id="approve-btn"
            on:click={() => approve(memb.employee_data)}
          >
            Approve
          </Button>
        </div>
        <div class="col">
          <Button
            id="reject-btn"
            on:click={() => reject(memb.employee_data)}
          >
            Reject
          </Button>
        </div>
      </div>
    {/each}
    <!-- ADMIN MENU -->
    <div class="tab-container">
      <div class="tab">
        {#if $orgStoreActions.currentOrg.is_admin }
          <button class="tablinks" on:click={() => {openTab='man-staff'}}>Manage Employees</button>
          <button class="tablinks" on:click={() => {openTab='man-buildings'}}>Manage Buildings</button>
          <button class="tablinks" on:click={() => {openTab='man-bookings'}}>Manage Bookings</button>
        {/if}
        <button class="tablinks" on:click={() => {openTab='make-booking'}}>Make Booking</button>
        <button class="tablinks" on:click={() => {openTab='my-bookings'}}>My Bookings</button>
      </div>
      {#if openTab === 'man-staff' && $orgStoreActions.currentOrg.is_admin}
        <div id="man-staff" class="tabcontent">
          <ManageStaff
            on:approve={(r)=>{approve(r.detail)}}
            on:reject={(r)=>{reject(r.detail)}}
          />
        </div>
      {:else if openTab === 'man-buildings' && $orgStoreActions.currentOrg.is_admin}
        <div id="man-buildings" class="tabcontent">
          <Buildings
            on:nav
          />
        </div>
      {:else if openTab === 'make-booking' }
        <div id="make-booking" class="tabcontent">
          <Booking />
        </div>
      {:else if openTab === 'my-bookings' }
        <div id="my-bookings" class="tabcontent">
          <MyBookings />
        </div>
      {:else if openTab === 'man-bookings' && $orgStoreActions.currentOrg.is_admin}
        <div id="manage-bookings" class="tabcontent">
          <ManageBookings />
        </div>
      {/if}
    </div>
</section>
