import axios from 'axios';

const baseURL = 'https://hotdeskapi.chrisbriant.uk';
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
    baseURL: 'https://hotdeskapi.chrisbriant.uk',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("hotdesk_token")}`
    }
});

export {conn, multipartConn, authConn, baseURL, homeURL};
