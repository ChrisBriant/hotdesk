//Stores desk data components
import {authConn,multipartConn} from '../helpers/connections.js';
import { writable } from 'svelte/store';

const defaultStore = {
  desks:[],
  plan:{},
  //deskChanged: false
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
    // resetDeskChange: () => {
    //   deskStore.update(ds => {
    //     ds.deskChanged = false;
    //     return ds;
    //   });
    // },
    addDesk: (desk) => {
      deskStore.update(ds => {
        let newDesks = [...ds.desks];
        newDesks.push(desk);
        ds.desks = newDesks;
        //ds.deskChanged = true;
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
    replaceDesk: (desk) => {
      deskStore.update(ds => {
        let newDesks = [...ds.desks];
        const dIdx = newDesks.findIndex(d => d.id === desk.id);
        console.log(dIdx);
        newDesks[dIdx] = desk;
        ds.desks = newDesks;
        //ds.deskChanged = true;
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
