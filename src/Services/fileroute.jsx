import axios from 'axios';

const filesApi = axios.create({
    baseURL: 'https://qul3dmodel.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

filesApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// filesApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
     
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default filesApi;