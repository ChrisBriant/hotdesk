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
  },
  myBookings:[]
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
          bookingStore.update(st => {
            st.bookings = res.data;
            st.calendar = transformMonthData(data.year,data.month,res.data);
            return st;
          });
          success = true;
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
          const dateIdx = moment(st.selectedDay.date).format('DD/MM/YYYY');
          const bookings = st.bookings.out_slots[dateIdx];
          for(let i=0;i<bookings.length;i++) {
            if(bookings[i].id===desk.apiId) {
              found = true;
            }
          }
        }
      });
      unsubscribe();
      return found;
    },
    getMyBookings: async (data) => {
      let success = false;
      await authConn.post('/api/booking/mybookings/',data,getConfig())
      .then(res => {
        bookingStore.update(st => {
          st.myBookings = res.data;
          return st;
        });
      });
      return success;
    },
    getBookingsForOrg: async (data) => {
      let success = false;
      await authConn.post('/api/booking/bookingsfororg/',data,getConfig())
      .then(res => {
        bookingStore.update(st => {
          st.myBookings = res.data;
          return st;
        });
      });
      return success;
    },
    cancelBooking: async (data) => {
      let success = false;
      await authConn.delete('/api/booking/cancelbooking/',{data})
      .then(res => {
        bookingStore.update(st => {
          st.myBookings = res.data;
          return st;
        });
      });
      return success;
    }
};


export {bookingStoreActions};
