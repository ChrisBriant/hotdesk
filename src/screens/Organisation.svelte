<script>
  import Button from '../components/Button.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import orgStoreActions from "../stores/orgstore";
  import BinaryChoice from "../dialogs/BinaryChoice.svelte";

  //export let orgId;

  const dispatch = createEventDispatcher();

  let href=null;
  let showDialog=false;
  let approving=false;
  let diagMessage='';
  let selectedEmployee = {};
  //let pendingMembers = [];
  //let promise;

  onMount( async () => {
    //console.log('pending',getPendingApproval());
    //pendingMembers = getPendingApproval();
    //promise = orgStoreActions.loadOrganisation(orgId);
  });

  const getPendingApproval = () => {
    return $orgStoreActions.currentOrg.memberships.filter(itm => (!itm.approved))
  }

  const approve = (emp) => {
    showDialog = true;
    approving = true;
    selectedEmployee = emp;
    diagMessage = `Are you sure you want to approve ${emp.name}?`
  }


  const reject = () => {

  }
</script>


<style>
</style>


<section>
    {#if showDialog}
      <BinaryChoice
        message={diagMessage}
        on:no={() => {showDialog=false,approving=false;}}
      />
    {/if}
    <h2>{$orgStoreActions.currentOrg.name}</h2>
    {#if getPendingApproval().length > 0 }
      <h3>You have the following staff awaiting approval</h3>
    {/if}
    {#each getPendingApproval() as memb,i (memb.id) }
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
            on:click={() => reject(memb.employee_data.id)}
          >
            Reject
          </Button>
        </div>
      </div>
    {/each}
</section>
