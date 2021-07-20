import { writable } from 'svelte/store';
//import axios from 'axios';
import decode from 'jwt-decode';
import {authConn} from '../helpers/connections.js';


//Whenever this runs it will retrieve the token
const orgStore = writable({
    organisations:[],
    currentOrg:{}
});

const getConfig = () => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("hotdesk_token")}`
    }
  }
  return config;
}



const orgStoreActions = {
  subscribe: orgStore.subscribe,
  addOrganisations: (orgData) => {
    orgStore.update(orgs => {
      orgs.organisations = orgData;
      return orgs;
    });
  },
  loadOrganisations: async () => {
    let success = false;
    await authConn.post('/api/desks/myorganisations/',{},getConfig())
    .then(res => {
        console.log(res);
        console.log(res.data);
        orgStore.update(orgs => {
          orgs.organisations = res.data;
          return orgs;
        });
    })
    .catch(err => {
        console.log('I am error',err);
        success = false;
    });
    return success;
  },
  joinOrganisation: async (org) => {
    let response = {success:false,message:''}
    console.log('AUTHCONN' , authConn, getConfig());
    await authConn.post('/api/desks/joinorganisation/',org,getConfig())
    .then(res => {
        console.log(res);
        console.log(res.data);
        response = {success:res.data.success,message:res.data.message}
    })
    .catch(err => {
        if(err.response.status === 401) {
          response = {success:false,message:'Please login to perform this action.'}
        } else {
            response = {
              success:err.response.data.success,
              message:err.response.data.message
           }
        }
        console.log('I am error',err.response);
    });
    return response;
  },
  createOrganisation: async (org) => {
    let response = {success:false,message:''}
    console.log('AUTHCONN' , authConn, getConfig());
    await authConn.post('/api/desks/createorg/',org,getConfig())
    .then(res => {
        console.log(res);
        console.log(res.data);
        response = {success:true,message:`Successfully created ${res.data.name}.`}
    })
    .catch(err => {
        if(err.response.status === 401) {
          response = {success:false,message:'Please login to perform this action.'}
        } else {
            response = {
              success:err.response.data.success,
              message:err.response.data.message
           }
        }
        console.log('I am error',err.response);
    });
    return response;
  },
  loadOrganisation: async (orgId) => {
    let success = false;
    console.log('CONFIG',getConfig());
    await authConn.post('/api/desks/getorganisation/',{'orgId':orgId},getConfig())
    .then(res => {
        orgStore.update(st => {
          st.currentOrg = res.data;
          return st;
        });
        success = true;
    })
    .catch(err => {
        success = false;
    });
    return success;
  },
  acceptEmployee: async (data) => {
    let success = false;
    await authConn.post('/api/desks/accept/',
                      data,
                      getConfig())
    .then(res => {
        orgStore.update(st => {
          st.currentOrg = res.data;
          return st;
        });
        success = true;
    })
    .catch(err => {
        success = false;
    });
    return success;
  },
  rejectEmployee: async (data) => {
    let success = false;
    await authConn.post('/api/desks/reject/',
                      data,
                      getConfig())
    .then(res => {
        orgStore.update(st => {
          st.currentOrg = res.data;
          return st;
        });
        success = true;
    })
    .catch(err => {
        success = false;
    });
    return success;
  },
  addBuilding: async (data) => {
    let success = false;
    await authConn.post('/api/desks/addbuilding/',
                      data,
                      getConfig())
    .then(res => {
        orgStore.update(st => {
          st.currentOrg = res.data;
          return st;
        });
        success = true;
    })
    .catch(err => {
        success = false;
    });
    return success;
  },
  addFloor: async (data) => {
    let success = false;
    await authConn.post('/api/desks/addfloor/',
                      data,
                      getConfig())
    .then(res => {
        orgStore.update(st => {
          st.currentOrg = res.data;
          return st;
        });
        success = true;
    })
    .catch(err => {
        success = false;
    });
    return success;
  },
  getStaff: async (data) => {
    console.log('GET THE STAFF');
  }
};


export default orgStoreActions;
