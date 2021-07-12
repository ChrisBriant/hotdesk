//Stores desk data components
import {authConn,multipartConn} from '../helpers/connections.js';
import { writable } from 'svelte/store';

const defaultStore = {
  desks:[],
  plan:{}
}

const getConfigMulti = () => {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem("hotdesk_token")}`
    }
  }
  return config;
}

const deskStore = writable({
  ...defaultStore
});

const deskStoreActions = {
    subscribe: deskStore.subscribe,
    addDesk: (desk) => {
      deskStore.update(ds => {
        let newDesks = [...ds.desks];
        newDesks.push(desk);
        ds.desks = newDesks;
        console.log('New Desks',newDesks);
        return ds;
      });
    },
    deleteDesk: (desk) => {
      deskStore.update(ds => {
        let newDesks = [...ds.desks];
        let deskId = desk.getId();
        //console.log('New Desks',newDesks);
        //let deskIdx = newDesks.findIndex(i => i.getId() === deskId);
        newDesks = newDesks.filter(d => d.getId() !== deskId);
        ds.desks = newDesks;
        console.log('New Desks',newDesks);
        return ds;
      });
    },
    saveImage: async (formData) => {
      let success = false;
      await multipartConn.post('/api/desks/addplan/',formData,getConfigMulti())
      .then(res => {
          console.log(res);
          console.log(res.data);
          deskStore.update(st => {
            st.plan = res.data;
            return st;
          });
          success = true
      });
      return success;
    }
};


export {deskStoreActions};
