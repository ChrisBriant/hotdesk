//Stores desk data components
import {authConn} from '../helpers/connections.js';
import { transformMonthData } from '../helpers/helpers';
import { writable } from 'svelte/store';


const defaultStore = {
  bookings:{},
  calendar:[]
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

const bookingStore = writable({
  ...defaultStore
});


const bookingStoreActions = {
    subscribe: bookingStore.subscribe,
    getBookings: async (data) => {
      let success = false;
      await authConn.post('/api/booking/getbookings/',data,getConfig())
      .then(res => {
          console.log(res);
          console.log(res.data);
          bookingStore.update(st => {
            st.bookings = res.data;
            st.calendar = transformMonthData(data.year,data.month,res.data);
            return st;
          });
          success = true
      });
      return success;
    },
};


export {bookingStoreActions};
