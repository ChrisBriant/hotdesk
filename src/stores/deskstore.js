//Stores desk data components
import {authConn,multipartConn} from '../helpers/connections.js';
import { writable } from 'svelte/store';
	import { Desk } from '../classes/Desk';

const defaultStore = {
  desks:[],
  plan:{},
  context: null,
  floorPreLoaded: false,
	selectedDesk: {}
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

const getConfig = () => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("hotdesk_token")}`
    }
  }
  return config;
}

const deskStore = writable({
  ...defaultStore
});

//Generiate the desk objects from the JSON data
const generateDesks = (deskData,context) => {
  let newDesks = [];
  for(let i=0;i < deskData.length;i++) {
      let newDesk = new Desk(deskData[i].x,deskData[i].y,deskData[i].w,deskData[i].h);
      newDesk.name = deskData[i].name;
      newDesk.id= deskData[i].desk_id;
      newDesk.saved=true;
      newDesks.push(newDesk);
  }
  return newDesks;
}

const deskStoreActions = {
    subscribe: deskStore.subscribe,
    // resetDeskChange: () => {
    //   deskStore.update(ds => {
    //     ds.deskChanged = false;
    //     return ds;
    //   });
    // },
    setContext: (ctx) => {
      deskStore.update(ds => {
        ds.context = ctx;
        return ds;
      });
    },
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
    },
    saveDeskPlan: async () => {
      //Prepare the data
      let payload = {
        desks:[]
      };
      const unsubscribe = deskStore.subscribe(st => {
          payload.planId = st.plan.id;
          for(let i=0;i<st.desks.length;i++) {
            payload.desks.push(st.desks[i].toJson());
          }
      });
      //console.log("PAYLOAD",JSON.stringify(payload));
      unsubscribe();
      //Send payload to backend
      let success = false;
      await authConn.post('/api/desks/adddeskplan/',payload,getConfig())
      .then(res => {
          deskStore.update(st => {
            st.plan = res.data;
            let newDesks = [];
            //Construct new desk objects
            let deskData = res.data.desks;
            console.log('Desk Data', deskData);
            for(let i=0;i < deskData.length;i++) {

                let newDesk = new Desk(deskData[i].x,deskData[i].y,deskData[i].w,deskData[i].h);
                newDesk.name = deskData[i].name;
                newDesk.id= deskData[i].desk_id;
                newDesk.saved=true;
                console.log('I am a new desk', newDesk);
                newDesks.push(newDesk);
            }
            st.desks = newDesks;
            return st;
          });
          success = true;
      })
      .catch(err => {
          success = false;
      });
      console.log('AM I SUCCESSFUL',success);
      return success;
    },
    loadPlan: (plan) => {
      deskStore.update(st => {
        st.plan = plan;

        //Construct new desk objects
        //let deskData = res.data.desks;
        //console.log('Desk Data', deskData);

        st.desks = generateDesks(plan.desks,st.context);
        return st;
      });
    },
    clearStore: () => {
      deskStore.update(st => {
        st.desks=[],
        st.plan={},
        st.context=null,
        st.floorPreLoaded=false
        return st;
      });
    },
    setFloorPreLoaded: (status) => {
      deskStore.update(st => {
        st.floorPreLoaded=status;
        return st;
      });
    },
		setDesk: (desk) => {
			deskStore.update(st => {
				st.selectedDesk=desk;
				return st;
			});
		}
};


export {deskStoreActions};
