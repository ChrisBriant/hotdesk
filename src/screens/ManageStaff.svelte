<script>
  import { createEventDispatcher,onMount } from 'svelte';
  import orgStoreActions from "../stores/orgstore";
  import authStoreActions from "../stores/authstore";
  import BinaryChoice from "../dialogs/BinaryChoice.svelte";

  const dispatch = createEventDispatcher();

  let showDialog = false;
  let diagMessage = '';
  let promise;
  let cancelId;
  let userId;

  onMount( async () => {
    userId = authStoreActions.getTokenDecoded().user_id;
  });

</script>

<style>
</style>

<section>
  {#if showDialog}
    <BinaryChoice
      message={diagMessage}
      on:no={() => {showDialog=false}}
      on:yes={() => {console.log('HERE')}}
    />
  {/if}
  <div class="tab-box-header">
    <h3>Manage Staff</h3>
    <p>This is where you can manage your staff members who have access to your organisations. Here you can approve join requests,
     send invites and remove staff from the organisation.</p>
   </div>
   <div class="tab-box-body">
      {#if $orgStoreActions.currentOrg.memberships.length > 0}
        <div class="row table-header">
          <div class="col-md-3 left-align-txt">
            Name
          </div>
          <div class="col-md-3 left-align-txt">
            Email
          </div>
          <div class="col-md-3 left-align-txt">
            Status
          </div>
          <div class="col-md-3 left-align-txt">
            Remove
          </div>
        </div>
        {#each $orgStoreActions.currentOrg.memberships as member,i (i)}
          <div class="row">
            <div class="col-md-3 left-align-txt">
              {member.employee_data.name}
            </div>
            <div class="col-md-3 left-align-txt">
              {member.employee_data.email}
            </div>
            <div class="col-md-3 left-align-txt">
              {#if userId === member.id}
                Org Admin
              {:else}
                {#if member.approved}
                  Approved
                {:else}
                  <a href={null}
                    class="link"
                    on:click={() => {dispatch('approve',member.employee_data)}}
                  >
                    approve
                  </a>/
                  <a href={null}
                    class="link"
                    on:click={() => {dispatch('reject',member.employee_data)}}
                  >reject
                  </a>
                {/if}
              {/if}
            </div>
            <div class="col-md-3 left-align-txt">
              {#if userId !== member.employee_data.id }
                 <a href={null}
                    class="link"
                    on:click={() => {dispatch('reject',member.employee_data)}}
                  >
                  remove
                  </a>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>

</section>
