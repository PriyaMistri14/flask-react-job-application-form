// import logo from './logo.svg';
import './App.css';

import InputForm from './components/input-form/input-form.component';

import React from 'react';


import  { logout, useAuth, authFetch } from './axiosApi';

import LoginForm from './components/login-from/login-form.component';
import RegistrationForm from './components/registration-form/registration-form.component';
import ShowCandidate from './components/show-candidate/show-candidate.component';
import HomePage from './components/home-page/home-page.component';


import { Routes, Route, Link } from "react-router-dom";

import { useNavigate } from 'react-router-dom';



function App() {

  const navigate = useNavigate()
  const [ logged ] = useAuth()
  console.log("TOKEENN:  ", localStorage.getItem("REACT_TOKEN_AUTH_KEY").slice(1,-1));

 
 

  return (
    <div className="App">
      <nav className='nav-bar'>
        {
             !logged ? <Link to="/login/" className='nav-link'><strong>Login</strong></Link>
             : <span onClick={()=>{logout()
            navigate("/login/")}}><strong>Log Out</strong></span>

         

        }

       
        <Link to="/input-form/" className='nav-link' ><strong>Input Form</strong></Link>
        <Link to="/show-candidate/" className='nav-link' ><strong>Show Candidate</strong></Link>       
       

      </nav>

      <Routes >
        <Route path="/" element={<HomePage />} />
        <Route path="/login/" element={<LoginForm />} />
        <Route path="/register/" element={<RegistrationForm />} />
        <Route path="/input-form/" element={<InputForm />} />
        <Route path="/show-candidate/" element={<ShowCandidate />} />
       
        <Route path="/update_form/:candidate_id" element={<InputForm />} />

      </Routes>



    </div>
  );
}

export default App;
