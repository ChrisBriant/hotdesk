import { writable } from 'svelte/store';
import axios from 'axios';
import decode from 'jwt-decode';
import {conn, multipartConn} from '../helpers/connections.js';


//Whenever this runs it will retrieve the token
const authStore = writable({
    token: localStorage.getItem("quiz_token")
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
        let success = false;
        console.log(credentials);
        await conn.post('/api/account/authenticate/',
            {
                email: credentials.email, password: credentials.password
            })
        .then(res => {
            console.log(res);
            console.log(res.data);
            if(res.data.access) {
                authStore.set({
                    token : res.data.access
                });
                localStorage.setItem("hotdesk_token", res.data.access);
                // conn.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                // multipartConn.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                success = true;
            }
        })
        .catch(err => {
            console.log('I am error',err);
            success = false;
        });
        return success;
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
            if (item) {
                if(!isTokenExpired(item.token)) {
                    authenticated = true;
                    //conn.defaults.headers.common['Authorization'] = `Bearer ${item.token}`;
                    //multipartConn.defaults.headers.common['Authorization'] = `Bearer ${item.token}`;
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
    }
  };


  export default authStoreActions;
