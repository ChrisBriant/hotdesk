//Stores desk data components
import {authConn} from '../helpers/connections.js';
import { transformMonthData } from '../helpers/helpers';
import { writable } from 'svelte/store';

const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const year = date.getFullYear();

const defaultStore = {
  bookings:{},
  calendar:[],
  selectedDay : {
    'date': new Date(year,month-1,day)
  }
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
    setDay: async (day) => {
      bookingStore.update(st => {
        st.selectedDay = day;
        return st;
      });
    },
    bookDesk: async (data) => {
      bookingStore.update(st => {
        let bookingDay = st.bookings.out_slots[data.date];
        console.log('HERE IS THE STORE',st.bookings.out_slots,bookingDay,data.date);
        return st;
      });
    }
};


export {bookingStoreActions};
