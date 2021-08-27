import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000';
const homeURL = 'http://localhost:5000';

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

export {conn, multipartConn, authConn, baseURL, homeURL};
