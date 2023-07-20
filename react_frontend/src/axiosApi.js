
import axios from 'axios'
import {createAuthProvider} from 'react-token-auth'

const baseURL = 'http://127.0.0.1:5000/'


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



export const authFetchGET = async(url)=>{
    const res = await authFetch(baseURL + url)
    return res
}

export const authFetchPOST = async(url, payload)=>{
    const res = await authFetch(baseURL+ url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),

    })
    return res

}


export const authFetchDELETE = async(url) =>{
    const res = await authFetch( baseURL + url, {
        method:'DELETE'
    })

    return res
}



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
