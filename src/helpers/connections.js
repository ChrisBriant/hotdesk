import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000';

const conn = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${localStorage.getItem("quiz_token")}`
    }
});

const multipartConn = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'multipart/form-data',
        //'Authorization': `Bearer ${localStorage.getItem("quiz_token")}`
    }
});


const authConn = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("hotdesk_token")}`
    }
});

//const AUTH_TOKEN = localStorage.getItem("quiz_token");

//Set the authorisation tokens for the connections
// conn.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// multipartConn.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export {conn, multipartConn, authConn, baseURL};
