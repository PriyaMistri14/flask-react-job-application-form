
import axios from 'axios'
import {createAuthProvider} from 'react-token-auth'


const axiosIntance = axios.create({
    baseURL:'http://127.0.0.1:5000/',
    timeout:5000,
    headers:{
        'Authorization': 'JWT ' + localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
        'Content-Type':'application/json',
        'accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
       
        'Access-Control-Allow-Credentials':true
    }
})






export const {useAuth, authFetch, login, logout } = createAuthProvider({
    accessTokenKey: 'access_token',
    getAccessToken: session => session.access_token,
    onUpdateToken:(token) => fetch('/refresh', {
        method : 'POST',
        body: token.access_token
    }).then(r => r.json())
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
