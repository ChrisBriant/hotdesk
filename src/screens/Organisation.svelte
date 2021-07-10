<script>
  import Button from '../components/Button.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import orgStoreActions from "../stores/orgstore";
  import BinaryChoice from "../dialogs/BinaryChoice.svelte";
  //Sub screens
  import Buildings from './Buildings.svelte';

  //export let orgId;

  const dispatch = createEventDispatcher();

  let href=null;
  let showDialog=false;
  let approving=false;
  let diagMessage='';
  let selectedEmployee = {};
  let promise;
  let pendingApprovals = $orgStoreActions.currentOrg.memberships.filter(itm => (!itm.approved));
  let openTab = 'man-staff';
  //let pendingMembers = [];
  //let promise;

  $:console.log($orgStoreActions.currentOrg);

  onMount( async () => {
    //console.log('pending',getPendingApproval());
    //pendingMembers = getPendingApproval();
    //promise = orgStoreActions.loadOrganisation(orgId);
  });

  const getPendingApproval = () => {
    //console.log('Pending Approval', $orgStoreActions.currentOrg.memberships.filter(itm => (!itm.approved)));
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
    console.log("ACTION", selectedEmployee.id,$orgStoreActions.currentOrg.id,approving);
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

  /* Create an active/current tablink class */
  .tab button.active {
    background-color: #ccc;
  }

  /* Style the tab content */
  .tabcontent {
    padding: 6px 12px;
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
    {#if $orgStoreActions.currentOrg.is_admin }
    <!-- ADMIN MENU -->
      <div class="tab">
        <button class="tablinks" on:click={() => {openTab='man-staff'}}>Manage Employees</button>
        <button class="tablinks" on:click={() => {openTab='man-buildings'}}>Manage Buildings</button>
        <button class="tablinks" on:click={() => {openTab='make-booking'}}>Make Booking</button>
        <button class="tablinks" on:click={() => {openTab='man-bookings'}}>Manage Bookings</button>
      </div>

      {#if openTab === 'man-staff'}
        <div id="man-staff" class="tabcontent">
          <h3>Manage Employees</h3>
          <p>London is the capital city of England.</p>
        </div>
      {:else if openTab === 'man-buildings' }
        <div id="man-buildings" class="tabcontent">
          <Buildings />
        </div>
      {:else if openTab === 'make-booking' }
        <div id="make-booking" class="tabcontent">
          <h3>Make Booking</h3>
          <p>Tokyo is the capital of Japan.</p>
        </div>
      {:else}
        <div id="manage-bookings" class="tabcontent">
          <h3>Manage Bookings</h3>
          <p>Tokyo is the capital of Japan.</p>
        </div>
      {/if}
    {/if}


</section>
