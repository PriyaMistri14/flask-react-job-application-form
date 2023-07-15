
import axios from 'axios'


const axiosIntance = axios.create({
    baseURL:'http://127.0.0.1:5000/',
    timeout:5000,
    headers:{
        'Authorization': 'JWT ' + localStorage.getItem("access_token"),
        'Content-Type':'application/json',
        'accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
       
        'Access-Control-Allow-Credentials':true
    }
})


// ..........................
// import axios from 'axios'

// const axiosInstance = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api/',
//     timeout: 5000,
//     headers: {
//         'Authorization': "JWT " + localStorage.getItem('access_token'),
//         'Content-Type': 'application/json',
//         'accept': 'application/json'
//     }
// });


// ......................


export default axiosIntance
