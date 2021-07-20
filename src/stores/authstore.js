import { writable } from 'svelte/store';
import axios from 'axios';
import decode from 'jwt-decode';
import {conn, multipartConn} from '../helpers/connections.js';


//Whenever this runs it will retrieve the token
const authStore = writable({
    token: localStorage.getItem("hotdesk_token")
});

function isTokenExpired(token) {
    try {
        const decoded = decode(token);

        if (decoded.exp > Date.now() / 1000) { // Checking if token is expired. N
            return false;
        } else return true;
    }
    catch (err) {
        console.log('erm', err);
        return true;
    }
}

function getTokenExpiry() {
  const token = this.getToken();
  return decode(token).exp;
}

const authStoreActions = {
    subscribe: authStore.subscribe,
    login: async (credentials) => {
        let response = {success:false};
        console.log(credentials);
        await conn.post('/api/account/authenticate/',
            {
                email: credentials.email, password: credentials.password
            })
        .then(res => {
            console.log(res);
            console.log(res.data);
            if(res.data.access) {
                const decoded = decode(res.data.access);
                authStore.set({
                    token : res.data.access
                });
                localStorage.setItem("hotdesk_token", res.data.access);
                response = res.data;
                response.success = true;
            }
        })
        .catch(err => {
            console.log('I am error',err);
            response = {success:false};
        });
        return response;
    },
    logOut: () => {
        authStore.set({
            token: null
        });
        localStorage.removeItem("hotdesk_token");
    },
    isAuthenticated: () => {
        let authenticated = false;
        const unsubscribe = authStore.subscribe(item => {
            console.log('Here is the item', item);
            if (item) {
                if(!isTokenExpired(item.token)) {
                    authenticated = true;
                } else {
                    authenticated = false;
                }
            } else {
                authenticated = false;
            }
        });
        unsubscribe();
        return authenticated;
    },
    register: async (regData) => {
        let responseObj = {};
        await conn.post('/api/account/register/', regData)
        .then(res => {
            console.log(res);
            console.log(res.data);
            responseObj.success = true;
            responseObj.message = 'Successful!'
        }).catch(err => {
            console.log('I am error',err.response);
            responseObj.success = false;
            responseObj.message = err.response.data.message
        });
        return responseObj;
    },
    forgotPassword: async (forgotData) => {
        let responseObj = {};
        await conn.post('/api/account/forgotpassword/', forgotData)
        .then(res => {
            console.log(res);
            console.log(res.data);
            responseObj.success = true;
            responseObj.message = 'Successful!'
        }).catch(err => {
            console.log('I am error',err.response);
            responseObj.success = false;
            responseObj.message = err.response.data.message
        });
        return responseObj;
    },
    getTokenDecoded: () => {
      let tokenData = null;
      const unsubscribe = authStore.subscribe(st => {
        tokenData = decode(st.token);
      });
      unsubscribe();
      return tokenData
    }
  };


  export default authStoreActions;
