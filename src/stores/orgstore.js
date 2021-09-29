import { writable } from 'svelte/store';
//import axios from 'axios';
import decode from 'jwt-decode';
import {authConn} from '../helpers/connections.js';
import {conn} from '../helpers/connections.js';

//Whenever this runs it will retrieve the token
const orgStore = writable({
    organisations:[],
    currentOrg:{},
    orgSearch: []
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
        orgStore.update(orgs => {
          orgs.organisations = res.data;
          return orgs;
        });
    })
    .catch(err => {
        success = false;
    });
    return success;
  },
  joinOrganisation: async (org) => {
    let response = {success:false,message:''}
    await authConn.post('/api/desks/joinorganisation/',org,getConfig())
    .then(res => {
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
    });
    return response;
  },
  createOrganisation: async (org) => {
    let response = {success:false,message:''}
    await authConn.post('/api/desks/createorg/',org,getConfig())
    .then(res => {
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
    });
    return response;
  },
  loadOrganisation: async (orgId) => {
    let success = false;
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
  deleteFloor: async (data) => {
    let success = false;
    await authConn.delete('/api/desks/deletefloor/',{data:data})
    .then(res => {
        orgStore.update(st => {
          st.currentOrg = res.data;
          return st;
        });
    })
    .catch(err => {
        success = false;
    });
    return success;
  },
  contact: async (authed,data) => {
    let success = false;
    if(authed) {
      await authConn.post('/api/desks/contact/',data,getConfig())
      .then(res => {
          success = true;
      })
      .catch(err => {
          success = false;
      });
    } else {
      await conn.post('/api/desks/contact/',data)
      .then(res => {
          success = true;
      })
      .catch(err => {
          success = false;
      });
    }
    return success;
  },
  orgSearch: async (name) => {
    let success = false;
    await conn.get(`/api/desks/findorganisations?name=${name}`)
    .then(res => {
        orgStore.update(st => {
          st.orgSearch = res.data;
          return st;
        });
        success = true;
    })
    .catch(err => {
        success = false;
    });
    return success;
  },

};


export default orgStoreActions;
