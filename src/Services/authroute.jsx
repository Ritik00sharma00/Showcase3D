import axios from 'axios'

const api = axios.create({
    baseURL: 'https://qul3dmodel.onrender.com/api/v1', // Replace with your API base URL
   
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;