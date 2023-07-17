// import logo from './logo.svg';
import './App.css';

import InputForm from './components/input-form/input-form.component';

import React from 'react';


import axiosIntance, { logout, useAuth, authFetch } from './axiosApi';

import LoginForm from './components/login-from/login-form.component';
import RegistrationForm from './components/registration-form/registration-form.component';
import ShowCandidate from './components/show-candidate/show-candidate.component';
import HomePage from './components/home-page/home-page.component';


import { Routes, Route, Link } from "react-router-dom";

import { useNavigate } from 'react-router-dom';

import Update from './components/update/update.component';

function App() {

  const navigate = useNavigate()
  const [ logged ] = useAuth()


  const logoutHandler = async () => {

    try {

      const res = await axiosIntance.post("http://127.0.0.1:8000/job/logout/", {
        refresh_token: localStorage.getItem("refresh_token")
      })

    }
    catch (error) {
      console.log("Error while blacklisting tthe token :::::", error)
    }


    axiosIntance.defaults.headers["Authorization"] = null
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    navigate("/login/")


  }




  const fetch_home = async()=>{
    const resCand = await authFetch("http://127.0.0.1:5000/home")
    const res =  await resCand.json()
    console.log("Fetched home ::", res)
    // console.log("Fetched home ::", resCand.data.data, resCand.data.message)
  }




  return (
    <div className="App">
      <nav className='nav-bar'>
        {
             !logged ? <Link to="/login/" className='nav-link'><strong>Login</strong></Link>
             : <span onClick={()=>{logout()
            navigate("/login/")}}><strong>Log Out</strong></span>

          // localStorage.getItem("access_token")
          // && axiosIntance.defaults.headers['Authorization']
          // && <span onClick={logoutHandler}><strong>Log Out</strong></span> || <Link to="/login/" className='nav-link'><strong>Login</strong></Link>




        }

        {/* <Link to="/register/" className='nav-link' >Register</Link> */}
        <Link to="/input-form/" className='nav-link' ><strong>Input Form</strong></Link>
        <Link to="/show-candidate/" className='nav-link' ><strong>Show Candidate</strong></Link>
        <p onClick={fetch_home}>Home</p>

      </nav>

      <Routes >
        <Route path="/" element={<HomePage />} />
        <Route path="/login/" element={<LoginForm />} />
        <Route path="/register/" element={<RegistrationForm />} />
        <Route path="/input-form/" element={<InputForm />} />
        <Route path="/show-candidate/" element={<ShowCandidate />} />
        {/* <Route path="/update/:candidate_id" element={<Update />} /> */}
        <Route path="/update_form/:candidate_id" element={<InputForm />} />

      </Routes>



    </div>
  );
}

export default App;
