//Stores desk data components
import {authConn} from '../helpers/connections.js';
import { transformMonthData } from '../helpers/helpers';
import { writable } from 'svelte/store';
import moment from 'moment';

const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const year = date.getFullYear();

const defaultStore = {
  bookings:null,
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
            success = true
            return st;
          });
      });
      return success;
    },
    setDay: async (day) => {
      bookingStore.update(st => {
        st.selectedDay = day;
        return st;
      });
    },
    bookDesk: async (data,name) => {
      let success = false;
      await authConn.post('/api/booking/makebooking/',data,getConfig())
      .then(res => {
        bookingStore.update(st => {
          let bookingDay = [...st.bookings.out_slots[data.date],{
            name:res.data.desk.name,
            id: res.data.desk.id
          }];
          st.bookings.out_slots[data.date] = bookingDay;
          console.log('HERE IS THE STORE',st.bookings.out_slots,bookingDay,data.date);
          success = true;
          return st;
        });
      });

      return success;
    },
    isBooked: (desk) => {
      let found = false;
      const unsubscribe = bookingStore.subscribe(st => {
        if(st.bookings) {
          console.log('STATE OF THE STORE', st);
          const dateIdx = moment(st.selectedDay.date).format('DD/MM/YYYY');
          const bookings = st.bookings.out_slots[dateIdx];
          console.log('CHINX',bookings)
          for(let i=0;i<bookings.length;i++) {
            if(bookings[i].id===desk.apiId) {
              found = true;
            }
          }
        } else {
          console.log('WHERE ARE THE BOOKINGS');
        }
      });
      unsubscribe();
      return found;
    }
};


export {bookingStoreActions};
