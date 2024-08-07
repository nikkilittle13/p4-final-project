import axios from 'axios';

// Create an instance of axios with your API's base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:5555/', // Replace with your Flask server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export axios instance
export default api;
