
import './login-form.styles.css'

import React from 'react'

import { Formik, Field, Form, ErrorMessage } from 'formik'

import * as Yup from 'yup'
import axiosIntance, { authFetchPOST, login } from '../../axiosApi'

import axios from 'axios'

import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

const baseURL = "http://127.0.0.1:5000/"



function LoginForm() {

    const navigate = useNavigate()




    const initialValues = {
        username: "",
        password: ""
    }


    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Required!!"),
        password: Yup.string().required('Required!!')
    })


    const onSubmit = async (values, form) => {
        console.log('form values::', values, "form::", form)
        try {

            // const res = await axiosIntance.post( baseURL +'login/', {
            //     username: values.username,
            //     password: values.password
            // })
            const payload = {
                username: values.username,
                password: values.password
            }

            const res = await authFetchPOST("login/", payload)
            const result = await res.json()

            console.log("RESPONSEE:   ", result)
            if (result.access_token) {
                login(result.access_token)
                navigate("/input-form/")
            }
            else {
                form.setFieldError("password", "No active account found with the given credentials")
            }

        } catch (err) {
            console.log("Error while login : ", err)
        }

        // try {

        //     const res = await axiosIntance.post('http://127.0.0.1:5000/login/', {
        //         username: values.username,
        //         password: values.password
        //     })

        //     // const res = await axiosIntance.post('http://127.0.0.1:8000/login/', {
        //     //     username: values.username,
        //     //     password: values.password
        //     // })


        //     if (res.data.message === "No active account found with the given credentials!") {
        //         form.setFieldError("password", "No active account found with the given credentials")
        //     }
        //     else {
        //         console.log(' response tokens:', JSON.parse(res.data.data).token)

        //         axiosIntance.defaults.headers['Authorization'] = 'JWT ' + JSON.parse(res.data.data).token
        //         localStorage.setItem("access_token", JSON.parse(res.data.data).token)
        //         // localStorage.setItem("refresh_token", res.data.refresh)
        //         navigate("/input-form/")

        //     }

        //     // axiosIntance.defaults.headers['Authorization'] = 'JWT ' + res.data.access
        //     // localStorage.setItem("access_token", res.data.access)
        //     // localStorage.setItem("refresh_token", res.data.refresh)

        //     // navigate("/input-form/")

        // } catch (error) {
        //     console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR:", error)
        //     // console.log("Error while login with invalid credential:", error.response.data.detail)

        //     // if (error.response.data.detail === "No active account found with the given credentials") {
        //     //     form.setFieldError("password", "No active account found with the given credentials")

        //     // }

        // }
    }




    return (
        <div>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
                <Form><br /><br />



                    Username :  <Field name='username' id='username' type='text' /><br /><br />
                    <ErrorMessage name='username' /><br /><br />
                    Password :  <Field name='password' id='password' type='password' /><br /><br />
                    <ErrorMessage name='password' /><br /><br />
                    <button type='submit' >Login</button>




                </Form>
            </Formik>
            <p>Don't have an account ? <Link to="/register/">Register</Link></p>

        </div>
    )
}

export default LoginForm








