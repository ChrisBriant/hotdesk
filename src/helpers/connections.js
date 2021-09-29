import axios from 'axios';

//const baseURL = 'https://hotdeskapi.chrisbriant.uk';
const baseURL = 'https://hotdeskapi.chrisbriant.uk';
const homeURL = 'https://hotdesk.chrisbriant.uk';

const conn = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    }
});

const multipartConn = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});


const authConn = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("hotdesk_token")}`
    }
});

export {conn, multipartConn, authConn, baseURL, homeURL};
