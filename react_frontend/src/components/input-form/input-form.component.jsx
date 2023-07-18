
import './input-form.styles.css'

import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'

import * as Yup from "yup"

import React, { useEffect, useState } from 'react'
import axiosIntance from '../../axiosApi'

import { useNavigate } from 'react-router-dom'

import { useParams } from 'react-router-dom'

import { useAuth, authFetch } from '../../axiosApi'


const course = await axiosIntance.get("http://127.0.0.1:5000/select_all/1")
console.log("Courses******************", course.data.data)
const allCourses = course.data.data

const language = await axiosIntance.get("http://127.0.0.1:5000/select_all/2")
console.log("allLanguages", language.data.data)
const allLanguages = language.data.data

const technology = await axiosIntance.get("http://127.0.0.1:5000/select_all/3")
console.log("allTechnology", technology.data.data)
const allTechnologies = technology.data.data

const prefer_location = await axiosIntance.get("http://127.0.0.1:5000/select_all/4")
console.log("allPreferLocation", prefer_location.data.data)
const allPreferLocations = prefer_location.data.data

const department = await axiosIntance.get("http://127.0.0.1:5000/select_all/5")
console.log("allDepartment", department.data.data)
const allDepartments = department.data.data

const state = await axiosIntance.get("http://127.0.0.1:5000/fetch_state/")
console.log("allState", state.data.data)
const allStates = state.data.data


const InputForm = () => {
    


    var isCreate = true
    const [allData, setAllData] = useState([]) // for update

    let dateOfBirth;

    const navigate = useNavigate()
    const { candidate_id } = useParams()
    candidate_id ? isCreate = false : isCreate = true

    const [logged] = useAuth()

  


    useEffect(() => {
        // if (!(localStorage.getItem("access_token") && axiosIntance.defaults.headers['Authorization'])) {
        //     navigate("/login/")

        // }
       if (!localStorage.getItem("REACT_TOKEN_AUTH_KEY"))
       {
        navigate("/login/")
       }

    }, [])



    useEffect(() => {
        !isCreate && (async () => {

            const res = await fetchCandidate()

            setAllData(res)
        }

        )()

    }, [])





    const getCity = async (state) => {


        var cities = []

        try {
            const city = await axiosIntance.post("http://127.0.0.1:5000/fetch_city/", {
                state: state
            })

            cities = city.data.data


        } catch (error) {
            console.log("Error while fetching cities in front end", error)
        }

        return cities

    }


    const initialValuesForCreate = {
        fname: "",
        lname: "",
        surname: "",
        email: "",
        phone: "",
        gender: "",
        state: "",
        cities: [],
        city: "",
        dob: "",

        academics: [
            {
                courseName: "",
                nameOfBoardUniversity: "",
                passingYear: "",
                percentage: "",
            }
        ],

        experiences: [
            {
                companyName: "",
                designation: "",
                from: "",
                to: ""
            }
        ],

        languages: [
            {
                languageName: "",
                read: "",
                write: "",
                speak: ""
            }

        ],

        technologies: [
            {
                technologyName: "",
                rating: ""
            }
        ],

        references: [
            {
                name: "",
                contactNo: "",
                relation: ""
            },
            {
                name: "",
                contactNo: "",
                relation: ""
            }
        ],


        noticePeriod: "",
        expectedCTC: "",
        currentCTC: "",
        department: "",


        demoLocation: []

    }





    const createCandidate = async (values) => {
        try {


            const resCand = await authFetch("http://127.0.0.1:5000/create_candidate",{
                method:'POST',
                headers : {
                    'Content-Type':'application/json',                   
                },
                body:JSON.stringify(values),
            
            })
           
            const res_cand = await resCand.json()

            console.log("Response candidate created:", res_cand.data)


            if (values.academics.length != 0) {
                const ress = values.academics.map(async (academic) => {
                 
                    const obj = {
                        academic:academic,
                        candidate: res_cand.data

                    }
                    console.log("in academic:::", obj)
                    const resAcad = await authFetch("http://127.0.0.1:5000/create_academic",{
                        method:'POST',
                        headers : {
                            'Content-Type':'application/json',                   
                        },
                        body:JSON.stringify(obj),
                    
                    })
                   console.log("after fetch call", resAcad)
                    const res = await resAcad.json()
        
                    console.log("Response academic created:", res.data)
        
                })


            }


            if (values.experiences.length != 0) {
                const res = values.experiences.map(async (experience) => {

                    const obj = {
                        experience:experience,
                        candidate: res_cand.data

                    }
                    console.log("in experience:::", obj)
                    const resExpe = await authFetch("http://127.0.0.1:5000/create_experience",{
                        method:'POST',
                        headers : {
                            'Content-Type':'application/json',                   
                        },
                        body:JSON.stringify(obj),
                    
                    })
                   console.log("after fetch call", resExpe)
                    const res = await resExpe.json()
        
                    console.log("Response experience created:", res.data)


                   
                })


            }





            if (values.languages.length != 0) {
                const res = values.languages.map(async (language) => {
                    if (language != undefined && language.languageName.length != 0) {


                        const obj = {
                            language:language,
                            candidate: res_cand.data
    
                        }
                        console.log("in language:::", obj)
                        const resLang = await authFetch("http://127.0.0.1:5000/create_language",{
                            method:'POST',
                            headers : {
                                'Content-Type':'application/json',                   
                            },
                            body:JSON.stringify(obj),
                        
                        })
                       console.log("after fetch call", resLang)
                        const res = await resLang.json()
            
                        console.log("Response language created:", res.data)
    


                    }

                })


            }



            if (values.technologies.length != 0) {
                const res = values.technologies.map(async (technology) => {
                    if (technology != undefined && technology.technologyName.length != 0) {


                        const obj = {
                            technology:technology,
                            candidate: res_cand.data
    
                        }
                        console.log("in technology:::", obj)
                        const resTech = await authFetch("http://127.0.0.1:5000/create_technology",{
                            method:'POST',
                            headers : {
                                'Content-Type':'application/json',                   
                            },
                            body:JSON.stringify(obj),
                        
                        })
                       console.log("after fetch call", resTech)
                        const res = await resTech.json()
            
                        console.log("Response technology created:", res.data)


                      
                    }

                })


            }




            if (values.references.length != 0) {
                const res = values.references.map(async (reference) => {



                    const obj = {
                        reference:reference,
                        candidate: res_cand.data

                    }
                    console.log("in reference:::", obj)
                    const resRefe = await authFetch("http://127.0.0.1:5000/create_reference",{
                        method:'POST',
                        headers : {
                            'Content-Type':'application/json',                   
                        },
                        body:JSON.stringify(obj),
                    
                    })
                   console.log("after fetch call", resRefe)
                    const res = await resRefe.json()
        
                    console.log("Response reference created:", res.data)



                })


            }


            if (values.demoLocation.length != 0) {
                const res = values.demoLocation.map(async (location) => {


                    const obj = {
                        location:location,
                        noticePeriod: values.noticePeriod,
                        expectedCTC : values.expectedCTC,
                        currentCTC : values.currentCTC,
                        department: values.department,
                        candidate: res_cand.data

                    }
                    console.log("in preference:::", obj)
                    const resRefe = await authFetch("http://127.0.0.1:5000/create_preference",{
                        method:'POST',
                        headers : {
                            'Content-Type':'application/json',                   
                        },
                        body:JSON.stringify(obj),
                    
                    })
                   console.log("after fetch call", resRefe)
                    const res = await resRefe.json()
        
                    console.log("Response preference created:", res.data)

                })


            }

            alert("SUCCESSFULLY CREATED!!!!")
            navigate("/show-candidate/")



        } catch (error) {
            console.log("Error while creating candidate : ", error)

        }



    }







    // ..................................................................update ....................................

    const fetchCandidate = async () => {

        try {
            const candidate_fetched = await axiosIntance.get(`http://127.0.0.1:8000/job/candidate_all/${candidate_id}/`)

            const candidate = candidate_fetched.data
            const state = candidate.state
            const cities = await getCity(state)
            console.log("Fetched cities:", cities);
            const res = fetchAllData(candidate, cities)
            console.log("RESPONSE:::", res);
            return res

        } catch (error) {
            console.log("Error while fetching candidate all", error)
        }

    }





    const fetchAllData = (candidates, cities) => {

        var acade = []
        var expe = []
        var lang = []
        var tech = []
        var refe = []
        var pref_loc = []

        // backend academic data

        candidates.academics != undefined && candidates.academics.length != 0 && candidates.academics.map((ac) => {

            const aca_obj = {
                courseName: ac.course_name,
                nameOfBoardUniversity: ac.name_of_board_university,
                passingYear: ac.passing_year,
                percentage: ac.percentage
            }

            acade.push(aca_obj)

        })


        //backend experience data
        candidates.experiences != undefined && candidates.experiences.length != 0 && candidates.experiences.map((ex) => {
            const ex_obj = {
                companyName: ex.company_name,
                designation: ex.designation,
                from: ex.from_date,
                to: ex.to_date
            }

            expe.push(ex_obj)

        })



        // backend languages data
        for (var i = 0; i < allLanguages.length; i++) {

            var lang_obj = {}
            if (candidates.languages != undefined && candidates.languages.length != 0) {

                for (var j = 0; j < candidates.languages.length; j++) {

                    if (candidates.languages[j].language === allLanguages[i].option_key) {
                        lang_obj = {
                            languageName: [candidates.languages[j].language],
                            read: candidates.languages[j].read,
                            write: candidates.languages[j].write,
                            speak: candidates.languages[j].speak
                        }
                        break

                    }
                    else {
                        lang_obj = {
                            languageName: [],
                            read: null,
                            write: null,
                            speak: null
                        }

                    }

                }
            }

            lang.push(lang_obj)

        }


        // backend technology data

        for (var i = 0; i < allTechnologies.length; i++) {

            var tech_obj = {}
            if (candidates.technologies != undefined && candidates.technologies.length != 0) {
                for (var j = 0; j < candidates.technologies.length; j++) {

                    if (candidates.technologies[j].technology === allTechnologies[i].option_key) {
                        tech_obj = {

                            technologyName: [candidates.technologies[j].technology],
                            rating: candidates.technologies[j].ranting.toString(),
                        }
                        break

                    }
                    else {
                        tech_obj = {
                            technologyName: [],
                            rating: null,

                        }

                    }

                }
            }


            tech.push(tech_obj)

        }


        //backend reference data

        candidates.references != undefined && candidates.references.length != 0 && candidates.references.map((rf) => {
            const rf_obj = {
                name: rf.refe_name,
                contactNo: rf.refe_contact_no,
                relation: rf.refe_relation
            }
            refe.push(rf_obj)

        })


        // backend preference  location data       
        candidates.preferences != undefined && candidates.preferences.length != 0 && candidates.preferences.map((pr) => {

            pref_loc.push(pr.prefer_location)

        })

        return [acade, expe, lang, tech, refe, pref_loc, candidates, cities]

    }


    console.log("acade::", allData[0], "expe::", allData[1], "lang:;", allData[2], "tech ::", allData[3], "refe::", allData[4], "pref_loc", allData[5], "candidate_all", allData[6], "cities", allData[7])





    const acde_ids = allData[6] && allData[6].academics.map((ac) => ac.id)
    // console.log("ACADEMICS IDDDDD:", acde_ids);

    const expe_ids = allData[6] && allData[6].experiences.map((ex) => ex.id)
    // console.log("EXPERIENCES IDDDDD:", expe_ids);

    const lang_ids = allData[6] && allData[6].languages.map((ln) => ln.id)
    // console.log("LANGUAGES IDDDDD:", lang_ids);

    const tech_ids = allData[6] && allData[6].technologies.map((tn) => tn.id)
    // console.log("TECHNOLOGY IDDDDD:", tech_ids);

    const refe_ids = allData[6] && allData[6].references.map((rf) => rf.id)
    // console.log("REFERENCES IDDDDD:", refe_ids);

    const pref_ids = allData[6] && allData[6].preferences.map((pr) => pr.id)





    const updateCandidate = async (values) => {
        console.log("form data of update :", values);


        try {

            const resCand = await axiosIntance.put(`http://127.0.0.1:8000/job/candidate/${candidate_id}/`, {
                fname: values.fname,
                lname: values.lname,
                surname: values.surname,
                email: values.email,
                contact_no: values.phone,
                city: values.city,
                state: values.state,
                gender: values.gender,
                dob: values.dob
            })
            console.log("Response candidate updated:", resCand)


            //academics

            if (values.academics.length != 0) {

                // update 
                if (values.academics.length === acde_ids.length) {

                    for (var i = 0; i < values.academics.length; i++) {
                        const resAcademics = await axiosIntance.put(`http://127.0.0.1:8000/job/academic/${acde_ids[i]}/`, {
                            course_name: values.academics[i].courseName,
                            name_of_board_university: values.academics[i].nameOfBoardUniversity,
                            passing_year: values.academics[i].passingYear,
                            percentage: values.academics[i].percentage,
                            candidate: candidate_id

                        })

                        console.log("Response academic updated:", resAcademics)
                    }
                }

                // update & insert

                else if (values.academics.length >= acde_ids.length) {

                    for (var i = 0; i < acde_ids.length; i++) {
                        const resAcademics = await axiosIntance.put(`http://127.0.0.1:8000/job/academic/${acde_ids[i]}/`, {
                            course_name: values.academics[i].courseName,
                            name_of_board_university: values.academics[i].nameOfBoardUniversity,
                            passing_year: values.academics[i].passingYear,
                            percentage: values.academics[i].percentage,
                            candidate: candidate_id

                        })

                        console.log("Response academic updated:", resAcademics)
                    }


                    for (var i = acde_ids.length; i < values.academics.length; i++) {

                        const resAcademics = await axiosIntance.post("http://127.0.0.1:8000/job/academic/", {
                            course_name: values.academics[i].courseName,
                            name_of_board_university: values.academics[i].nameOfBoardUniversity,
                            passing_year: values.academics[i].passingYear,
                            percentage: values.academics[i].percentage,
                            candidate: candidate_id
                        })

                        console.log("Response academic created:", resAcademics)
                    }
                }


                //update & delete
                else if (values.academics.length <= acde_ids.length) {
                    for (var i = 0; i < values.academics.length; i++) {
                        const resAcademics = await axiosIntance.put(`http://127.0.0.1:8000/job/academic/${acde_ids[i]}/`, {
                            course_name: values.academics[i].courseName,
                            name_of_board_university: values.academics[i].nameOfBoardUniversity,
                            passing_year: values.academics[i].passingYear,
                            percentage: values.academics[i].percentage,
                            candidate: candidate_id

                        })

                        console.log("Response academic updated:", resAcademics)
                    }


                    for (var i = values.academics.length; i < acde_ids.length; i++) {
                        const resAcademics = await axiosIntance.delete(`http://127.0.0.1:8000/job/academic/${acde_ids[i]}/`)

                        console.log("Response academic deleted:", resAcademics)
                    }

                }
            }


            // experinces

            if (values.experiences.length != 0) {

                if (values.experiences.length === expe_ids.length) {
                    console.log("CAND IDDD AND EXPE IDD IN IF", candidate_id, expe_ids);
                    for (var i = 0; i < values.experiences.length; i++) {
                        const resExpe = await axiosIntance.put(`http://127.0.0.1:8000/job/experience/${expe_ids[i]}/`, {
                            company_name: values.experiences[i].companyName,
                            designation: values.experiences[i].designation,
                            from_date: values.experiences[i].from,
                            to_date: values.experiences[i].to,
                            candidate: candidate_id

                        })

                        console.log("Response experince updated :", resExpe)
                    }
                }


                else if (values.experiences.length >= expe_ids.length) {

                    for (var i = 0; i < expe_ids.length; i++) {
                        const resExpe = await axiosIntance.put(`http://127.0.0.1:8000/job/experience/${expe_ids[i]}/`, {
                            company_name: values.experiences[i].companyName,
                            designation: values.experiences[i].designation,
                            from_date: values.experiences[i].from,
                            to_date: values.experiences[i].to,
                            candidate: candidate_id

                        })

                        console.log("Response experience updated:", resExpe)
                    }


                    for (var i = expe_ids.length; i < values.experiences.length; i++) {

                        const resExpe = await axiosIntance.post("http://127.0.0.1:8000/job/experience/", {
                            company_name: values.experiences[i].companyName,
                            designation: values.experiences[i].designation,
                            from_date: values.experiences[i].from,
                            to_date: values.experiences[i].to,
                            candidate: candidate_id

                        })

                        console.log("Response exxperience created:", resExpe)

                    }



                }

                else if (values.experiences.length <= expe_ids.length) {
                    for (var i = 0; i < values.experiences.length; i++) {
                        const resExpe = await axiosIntance.put(`http://127.0.0.1:8000/job/experince/${expe_ids[i]}/`, {
                            company_name: values.experiences[i].companyName,
                            designation: values.experiences[i].designation,
                            from_date: values.experiences[i].from,
                            to_date: values.experiences[i].to,
                            candidate: candidate_id
                        })

                        console.log("Response experience updated :", resExpe)
                    }


                    for (var i = values.experiences.length; i < expe_ids.length; i++) {
                        const resExpe = await axiosIntance.delete(`http://127.0.0.1:8000/job/experience/${expe_ids[i]}/`)

                        console.log("Response experience  deleted:", resExpe)
                    }

                }
            }



            //languages 

            if (values.languages.length != 0) {

                if (values.languages.length === lang_ids.length) {

                    for (var i = 0; i < values.languages.length; i++) {

                        if (values.languages[i].languageName.length !== 0) {

                            const resLang = await axiosIntance.put(`http://127.0.0.1:8000/job/language/${lang_ids[i]}/`, {
                                language: values.languages[i].languageName[0],
                                read: values.languages[i].read,
                                write: values.languages[i].write,
                                speak: values.languages[i].speak,
                                candidate: candidate_id
                            })

                            console.log("Response language updated:", resLang)

                        } else {
                            const resLang = await axiosIntance.delete(`http://127.0.0.1:8000/job/language/${lang_ids[i]}/`)

                            console.log("Response language deleted :", resLang)

                        }

                    }

                }



                else if (values.languages.length > lang_ids.length) {

                    for (var i = 0; i < lang_ids.length; i++) {

                        if (values.languages[i].languageName.length !== 0) {

                            const resLang = await axiosIntance.put(`http://127.0.0.1:8000/job/language/${lang_ids[i]}/`, {
                                language: values.languages[i].languageName[0],
                                read: values.languages[i].read,
                                write: values.languages[i].write,
                                speak: values.languages[i].speak,
                                candidate: candidate_id
                            })

                            console.log("Response language updated:", resLang)

                        } else {
                            const resLang = await axiosIntance.delete(`http://127.0.0.1:8000/job/language/${lang_ids[i]}/`)

                            console.log("Response language deleted :", resLang)

                        }
                    }


                    for (var i = lang_ids.length; i < values.languages.length; i++) {

                        if (values.languages[i].languageName.length !== 0) {

                            const resLang = await axiosIntance.post("http://127.0.0.1:8000/job/language/", {
                                language: values.languages[i].languageName[0],
                                read: values.languages[i].read,
                                write: values.languages[i].write,
                                speak: values.languages[i].speak,
                                candidate: candidate_id
                            })

                            console.log("Response language created:", resLang)

                        }
                    }
                }

            }


            // technology    

            if (values.technologies.length != 0) {

                if (values.technologies.length === tech_ids.length) {

                    for (var i = 0; i < values.technologies.length; i++) {

                        if (values.technologies[i].technologyName.length !== 0) {

                            const resTech = await axiosIntance.put(`http://127.0.0.1:8000/job/technology/${tech_ids[i]}/`, {
                                technology: values.technologies[i].technologyName[0],
                                ranting: values.technologies[i].rating,
                                candidate: candidate_id
                            })

                            console.log("Response technology updated:", resTech)

                        } else {
                            const resTech = await axiosIntance.delete(`http://127.0.0.1:8000/job/technology/${tech_ids[i]}/`)

                            console.log("Response technology deleted :", resTech)

                        }

                    }

                }


                else if (values.technologies.length > tech_ids.length) {

                    for (var i = 0; i < tech_ids.length; i++) {

                        if (values.technologies[i].technologyName.length !== 0) {

                            const resTech = await axiosIntance.put(`http://127.0.0.1:8000/job/technology/${tech_ids[i]}/`, {
                                technology: values.technologies[i].technologyName[0],
                                ranting: values.technologies[i].rating,
                                candidate: candidate_id
                            })

                            console.log("Response technology updated:", resTech)

                        } else {
                            const resTech = await axiosIntance.delete(`http://127.0.0.1:8000/job/technology/${tech_ids[i]}/`)

                            console.log("Response technology deleted :", resTech)

                        }
                    }


                    for (var i = tech_ids.length; i < values.technologies.length; i++) {
                        if (values.technologies[i].technologyName.length !== 0) {


                            const resTech = await axiosIntance.post("http://127.0.0.1:8000/job/technology/", {
                                technology: values.technologies[i].technologyName[0],
                                ranting: values.technologies[i].rating,
                                candidate: candidate_id
                            })

                            console.log("Response techmology created:", resTech)


                        }

                    }
                }
            }


            // references 

            if (values.references.length != 0) {
                if (values.references.length === refe_ids.length) {
                    for (var i = 0; i < values.references.length; i++) {
                        const resRefe = await axiosIntance.put(`http://127.0.0.1:8000/job/reference/${refe_ids[i]}/`, {
                            refe_name: values.references[i].name,
                            refe_contact_no: values.references[i].contactNo,
                            refe_relation: values.references[i].relation,
                            candidate: candidate_id
                        })

                        console.log("Response reference updated:", resRefe)
                    }
                }

                else if (values.references.length >= refe_ids.length) {

                    for (var i = 0; i < refe_ids.length; i++) {
                        const resRefe = await axiosIntance.put(`http://127.0.0.1:8000/job/reference/${refe_ids[i]}/`, {
                            refe_name: values.references[i].name,
                            refe_contact_no: values.references[i].contactNo,
                            refe_relation: values.references[i].relation,
                            candidate: candidate_id
                        })

                        console.log("Response reference updated:", resRefe)
                    }


                    for (var i = refe_ids.length; i < values.references.length; i++) {

                        const resRefe = await axiosIntance.post("http://127.0.0.1:8000/job/reference/", {
                            refe_name: values.references[i].name,
                            refe_contact_no: values.references[i].contactNo,
                            refe_relation: values.references[i].relation,
                            candidate: candidate_id
                        })

                        console.log("Response reference created:", resRefe)
                    }
                }



                else if (values.references.length <= refe_ids.length) {
                    for (var i = 0; i < values.references.length; i++) {
                        const resRefe = await axiosIntance.put(`http://127.0.0.1:8000/job/reference/${refe_ids[i]}/`, {
                            refe_name: values.references[i].name,
                            refe_contact_no: values.references[i].contactNo,
                            refe_relation: values.references[i].relation,
                            candidate: candidate_id
                        })

                        console.log("Response reference updated:", resRefe)
                    }


                    for (var i = values.references.length; i < refe_ids.length; i++) {
                        const resRefe = await axiosIntance.delete(`http://127.0.0.1:8000/job/reference/${refe_ids[i]}/`)

                        console.log("Response reference deleted:", resRefe)
                    }

                }
            }

            // preferences


            if (values.demoLocation.length != 0) {
                if (values.demoLocation.length === pref_ids.length) {
                    for (var i = 0; i < values.demoLocation.length; i++) {
                        const resPref = await axiosIntance.put(`http://127.0.0.1:8000/job/preference/${pref_ids[i]}/`, {
                            prefer_location: values.demoLocation[i],
                            notice_period: values.noticePeriod,
                            expected_ctc: values.expectedCTC,
                            current_ctc: values.currentCTC,
                            department: values.department,
                            candidate: candidate_id
                        })

                        console.log("Response preference updated:", resPref)
                    }
                }


                else if (values.demoLocation.length >= pref_ids.length) {

                    for (var i = 0; i < pref_ids.length; i++) {
                        const resPref = await axiosIntance.put(`http://127.0.0.1:8000/job/preference/${pref_ids[i]}/`, {
                            prefer_location: values.demoLocation[i],
                            notice_period: values.noticePeriod,
                            expected_ctc: values.expectedCTC,
                            current_ctc: values.currentCTC,
                            department: values.department,
                            candidate: candidate_id
                        })

                        console.log("Response preference updated:", resPref)
                    }


                    for (var i = pref_ids.length; i < values.demoLocation.length; i++) {

                        const resPref = await axiosIntance.post("http://127.0.0.1:8000/job/preference/", {
                            prefer_location: values.demoLocation[i],
                            notice_period: values.noticePeriod,
                            expected_ctc: values.expectedCTC,
                            current_ctc: values.currentCTC,
                            department: values.department,
                            candidate: candidate_id
                        })

                        console.log("Response preference created:", resPref)

                    }
                }


                else if (values.demoLocation.length <= pref_ids.length) {
                    for (var i = 0; i < values.demoLocation.length; i++) {
                        const resPref = await axiosIntance.put(`http://127.0.0.1:8000/job/preference/${pref_ids[i]}/`, {
                            prefer_location: values.demoLocation[i],
                            notice_period: values.noticePeriod,
                            expected_ctc: values.expectedCTC,
                            current_ctc: values.currentCTC,
                            department: values.department,
                            candidate: candidate_id
                        })

                        console.log("Response preference updated:", resPref)
                    }


                    for (var i = values.demoLocation.length; i < pref_ids.length; i++) {
                        const resPref = await axiosIntance.delete(`http://127.0.0.1:8000/job/preference/${pref_ids[i]}/`)

                        console.log("Response preference deleted:", resPref)
                    }

                }
            }

            alert("SUCCESSFULLY UPDATED !!!!!!!!")
            navigate("/show-candidate/")


        } catch (error) {
            console.log("Error while updating candidate : ", error)

        }



    }






    const initialValuesForUpdate = {
        fname: allData[6] && allData[6].fname,
        lname: allData[6] && allData[6].lname,
        surname: allData[6] && allData[6].surname,
        email: allData[6] && allData[6].email,
        phone: allData[6] && allData[6].contact_no,
        gender: allData[6] && allData[6].gender,
        state: allData[6] && allData[6].state,
        cities: allData[7] && allData[7],
        city: allData[6] && allData[6].city,
        dob: allData[6] && allData[6].dob,

        academics: allData[0] && allData[0],

        experiences: allData[1] && allData[1],

        languages: allData[2] && allData[2],

        technologies: allData[3] && allData[3],

        references: allData[4] && allData[4],

        noticePeriod: allData[6] && allData[6].preferences[0].notice_period,
        expectedCTC: allData[6] && allData[6].preferences[0].expected_ctc,
        currentCTC: allData[6] && allData[6].preferences[0].current_ctc,
        department: allData[6] && allData[6].preferences[0].department,

        demoLocation: allData[5] && allData[5]


    }









    const initialValues = isCreate ? initialValuesForCreate : initialValuesForUpdate

    const validationSchema = Yup.object().shape({
        fname: Yup.string().required("this field is required!!")
            .matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! ")
            .max(20, "Maximum characters allowed for this field is 20!!"),

        lname: Yup.string().required("this field is required!!")
            .matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! ")
            .max(20, "Maximum characters allowed for this field is 20!!"),

        surname: Yup.string().required("this field is required!!")
            .matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! ")
            .max(20, "Maximum characters allowed for this field is 20!!"),


        email: Yup.string().email("Please enter a valid email address!!")
            .required("this field is required!!"),


        phone: Yup.number().required("this field is required!!").typeError("Enter number!!!")
            .integer("phone no does not containes decimals!!")
            .positive("phone no can not be negative!!")
            .max(10000000000, "phone no should be of 10 digit!!")
            .min(1000000000, "phone no should be of 10 digit!!"),

        gender: Yup.string().required("this field is required!!!"),

        state: Yup.string().required("this field is required!!!"),

        city: Yup.string().required("this field is required!!!"),

        dob: Yup.date().required("this field is required!!!")
            .max('2005-01-01', "your age must be 18 or greater!!")
            .test('dateOfBirth', 'assign value to variable', (value) => {
                dateOfBirth = value;
                return true;
            }),


        academics: Yup.array().of(Yup.object().shape(
            {
                courseName: Yup.string().required("this field is required!!"),


                nameOfBoardUniversity: Yup.string().required("this field is required!!").matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! "),


                passingYear: Yup.number().required("this field is required!!").typeError("Enter number!!!")
                    .max(new Date().getFullYear(), "you can not pass in future!!!")


                    .test('passingYear', 'passing year is greater then dob!!', (value, ctx) => {
                        const pYear = value
                        const dob = new Date(dateOfBirth).getFullYear()
                        console.log("passsing year curr", pYear, "dob", dob, "date to tmp", dateOfBirth);
                        return pYear > dob
                    }),

                percentage: Yup.number().required("this field is required!!").typeError("Enter number!!!")
                    .min(0, "Minimum percentage is 0")
                    .max(100, "maximum percentage is 100")
            }
        )),



        experiences: Yup.array().of(Yup.object().shape({

            companyName: Yup.string().required("this field is required!!")
                .matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! "),

            designation: Yup.string().required("this field is required!!")
                .matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! "),

            from: Yup.date().required("this field is required!!")
                .max(new Date(), "Not possible")
                .test('from', 'from date must be greater then dob!!', (value) => {

                    const dob = dateOfBirth
                    console.log("from date", value, "dob", dob);
                    return value > dob
                }),

            to: Yup.date().required("this field is required!!")
                .max(new Date(), "Not possible!!!").min(Yup.ref('from'), "To date must be greater than from date!!")

        })),


        references: Yup.array().of(Yup.object().shape({
            name: Yup.string().required("this field is required!!")
                .matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! "),

            contactNo: Yup.number().required("this field is required!!").typeError("Enter number!!!")
                .min(1000000000, "Contact no must be of 10 digits!!")
                .max(10000000000, "Contact no must be of 10 digits!!"),

            relation: Yup.string().required("this field is required!!")
                .matches(/^[aA-zZ]+$/, "This field should only contains alphabets!! ")

        })),

        noticePeriod: Yup.number().required("this field is required!!").typeError("Enter number!!!")
            .min(1, "minimum notice period is 1 !!!")
            .max(10, "maximum notice period is 10 !!"),

        expectedCTC: Yup.number().required("this field is required!!").typeError("Enter number!!!"),

        currentCTC: Yup.number().required("this field is required!!").typeError("Enter number!!!"),

        department: Yup.string().required("this field is required!!!"),

        demoLocation: Yup.array().test('demolocation', "this field is required  !!!", (value) => {

            return value.length > 0
        }),



        languages: Yup.array().test('languages', "Select atleast one language!!", (value) => {

            var arr = []
            for (var i = 0; i < value.length; i++) {
                if (value[i].languageName != undefined && value[i].languageName.length !== 0) {
                    arr.push(true)
                    break

                }
                else {
                    arr.push(false)
                }

            }
            return arr.includes(true)

        }),


        technologies: Yup.array().test('technologies', "Select atleast one technology!!", (value) => {

            var arr = []
            for (var i = 0; i < value.length; i++) {
                if (value[i].technologyName != undefined && value[i].technologyName.length !== 0) {
                    arr.push(true)
                    break

                }
                else {
                    arr.push(false)
                }

            }
            return arr.includes(true)

        })


    })

    return (
        <div>
            <Formik initialValues={initialValues}
                enableReinitialize


                onSubmit={async (values) => {

                    console.log("Form data : ", values, "isCreate", isCreate)

                    isCreate ? createCandidate(values) : updateCandidate(values)

                }

                }

                validationSchema={validationSchema}

            >




                {(props) => {


                    const { values, setFieldValue } = props


                    return (<Form ><br /><br />
                        <h3>Basic Details</h3>

                        First Name:   <Field type="text" name="fname" id="fname" /><br /><br />
                        <ErrorMessage name="fname" /><br /><br />

                        Last Name:   <Field type="text" name="lname" id="lname" /><br /><br />
                        <ErrorMessage name="lname" className='error' /><br /><br />

                        Surname:   <Field type="text" name="surname" id="surname" /><br /><br />
                        <ErrorMessage name="surname" /><br /><br />

                        Email :   <Field type="text" name="email" id="email" /><br /><br />
                        <ErrorMessage name="email" /><br /><br />

                        Phone:   <Field type="text" name="phone" id="phone" /><br /><br />
                        <ErrorMessage name="phone" /><br /><br />

                        Gender : <Field type="radio" name="gender" value="Male" /> Male
                        <Field type="radio" name="gender" value="Female" />  Female
                        <Field type="radio" name="gender" value="Other" /> Other
                        <br /><br />
                        <ErrorMessage name="gender" /><br /><br />

                        State : <Field as="select" name="state" onClick={async (e) => {
                            console.log("called");
                            const state = e.target.value
                            const cities = await getCity(state)
                            console.log("state value", state, "city value", cities);
                            setFieldValue("cities", cities)

                        }}>
                            <option selected hidden >Select State</option>

                            {
                                allStates && allStates.map((state) => <option value={state.name} >{state.name}</option>)

                            }

                        </Field><br /><br />
                        <ErrorMessage name="state" /><br /><br />



                        City : <Field as="select" name="city">
                            <option selected hidden>Select city</option>
                            {
                                values.cities && values.cities.length != 0 ? values.cities.map((city) => <option value={city.name}>{city.name}</option>) : null
                            }


                        </Field><br /><br />
                        <ErrorMessage name="city" /><br /><br />



                        Date of Birth : <Field type="date" name="dob" /><br /><br />
                        <ErrorMessage name="dob" /><br /><br />
                        <hr /><br /><br />



                        <h3>Acedamics Details</h3>
                        <FieldArray name='academics' >
                            {
                                ({ insert, push, remove }) => (
                                    <div>

                                        {
                                            values.academics && values.academics.length > 0 && values.academics.map((academic, index) => (

                                                <div>

                                                    Course Name : <Field as="select" name={`academics.${index}.courseName`}>
                                                        <option selected hidden>Select course</option>
                                                      
                                                        {
                                                            allCourses.map((course) => <option value={course.option_key}>{course.option_key}</option>)
                                                        }


                                                    </Field><br /><br />
                                                    <ErrorMessage name={`academics.${index}.courseName`} /><br /><br />

                                                    Name of board or university : <Field type="text" name={`academics.${index}.nameOfBoardUniversity`} id={`academics.${index}.nameOfBoardUniversity`} /><br /><br />

                                                    <ErrorMessage name={`academics.${index}.nameOfBoardUniversity`} /><br /><br />




                                                    Passing Year : <Field type="text" name={`academics.${index}.passingYear`} id={`academics.${index}.passingYear`} /><br /><br />
                                                    <ErrorMessage name={`academics.${index}.passingYear`} /><br /><br />


                                                    Percentage : <Field type="text" name={`academics.${index}.percentage`} id={`academics.${index}.percentage`} /><br /><br />
                                                    <ErrorMessage name={`academics.${index}.percentage`} /><br /><br />

                                                    {
                                                        values.academics.length > 1 ? <div><button type='button' onClick={() => remove(index)} >-</button><br /><br /></div> : null
                                                    }


                                                    <button type='button' onClick={() => insert(index + 1, { nameOfBoardUniversity: '', passingYear: '', percentage: '' })}>+</button><br /><br />
                                                </div>

                                            ))
                                        }


                                        <br /><br />

                                    </div>
                                )
                            }
                        </FieldArray> <hr /><br /><br />
                        <h3>Experience Details</h3>



                        <FieldArray name='experiences' >
                            {
                                ({ insert, push, remove }) => (
                                    <div>
                                        {
                                            values.experiences && values.experiences.length > 0 && values.experiences.map((experience, index) => (
                                                <div>
                                                    Company Name : <Field type='text' name={`experiences.${index}.companyName`} id={`experiences.${index}.companyName`} /><br /><br />
                                                    <ErrorMessage name={`experiences.${index}.companyName`} /><br /><br />

                                                    Designation : <Field type='text' name={`experiences.${index}.designation`} id={`experiences.${index}.designation`} /><br /><br />
                                                    <ErrorMessage name={`experiences.${index}.designation`} /><br /><br />

                                                    From : <Field type='date' name={`experiences.${index}.from`} id={`experiences.${index}.from`} /><br /><br />
                                                    <ErrorMessage name={`experiences.${index}.from`} /><br /><br />

                                                    To : <Field type='date' name={`experiences.${index}.to`} id={`experiences.${index}.to`} /><br /><br />
                                                    <ErrorMessage name={`experiences.${index}.to`} /><br /><br />
                                                    
                                                    {
                                                        values.experiences.length > 1 ? <div><button type='button' onClick={() => remove(index)} >-</button><br /><br /></div> : null
                                                    }

                                                    <button type='button' onClick={() => insert(index + 1, { companyName: "", designation: "", from: "", to: "" })}>+</button><br /><br />
                                                </div>

                                            ))


                                        }

                                       

                                    </div>
                                )


                            }



                        </FieldArray><hr /><br /><br />
                        <h4>Language Known</h4>
                        <FieldArray name='languages' >
                            {
                                () => (
                                    <div>{

                                        allLanguages && allLanguages.map((language, index) => (
                                            <div>
                                                <Field name={`languages.${index}.languageName`} type='checkbox' value={language.option_key} onClick={
                                                    v => {
                                                        console.log("checkbox  value of  language", v, v.target.checked)
                                                        if (!v.target.checked) {
                                                            setFieldValue(`languages.${index}.read`, false)
                                                            setFieldValue(`languages.${index}.write`, false)
                                                            setFieldValue(`languages.${index}.speak`, false)

                                                        }

                                                    }}
                                                />{language.option_key}
                                                <Field name={`languages.${index}.read`} id={`languages.${index}.read`} type='checkbox' />Read
                                                <Field name={`languages.${index}.write`} id={`languages.${index}.write`} type='checkbox' />Write
                                                <Field name={`languages.${index}.speak`} id={`languages.${index}.speak`} type='checkbox' />Speak
                                                <ErrorMessage name={`languages.${index}.languageName`} />


                                                <br /><br /></div>
                                        ))

                                    }
                                        <ErrorMessage name='languages' />

                                    </div>
                                )


                            }

                        </FieldArray><hr /><br /><br />
                        <h3>Technology Known</h3>

                        <FieldArray name='technologies'>
                            {
                                () => (
                                    <div>
                                        {
                                            allTechnologies && allTechnologies.map((technology, index) => (
                                                <div>

                                                    <Field name={`technologies.${index}.technologyName`} value={technology.option_key} type='checkbox'
                                                        onClick={
                                                            v => {
                                                                console.log("checkbox  value of  technology", v, v.target.checked)
                                                                if (!v.target.checked) {
                                                                    setFieldValue(`technologies.${index}.rating`, false)
                                                                }

                                                            }}
                                                    />{technology.option_key}
                                                    <Field type='radio' name={`technologies.${index}.rating`} value='3' />Begginer
                                                    <Field type='radio' name={`technologies.${index}.rating`} value='6' />Mediator
                                                    <Field type='radio' name={`technologies.${index}.rating`} value='10' />Expert


                                                </div>
                                            ))
                                        }
                                        <ErrorMessage name='technologies' />
                                    </div>
                                )
                            }

                        </FieldArray><hr /><br /><br />
                        <h3>References</h3>
                        <FieldArray name='references'>
                            {
                                () => (
                                    <div>
                                        {
                                            values.references && values.references.map((reference, index) => (
                                                <div>

                                                    Name : <Field name={`references.${index}.name`} type='text' /><br /><br />
                                                    <ErrorMessage name={`references.${index}.name`} /><br /><br />

                                                    Contact No : <Field name={`references.${index}.contactNo`} type='text' /><br /><br />
                                                    <ErrorMessage name={`references.${index}.contactNo`} /><br /><br />


                                                    Relation : <Field name={`references.${index}.relation`} type='text' /><br /><br />
                                                    <ErrorMessage name={`references.${index}.relation`} /><br /><br />

                                                </div>
                                            ))
                                        }
                                    </div>
                                )


                            }



                        </FieldArray><hr /><br /><br />
                        <h3>Prefernces</h3>

                        Notice Period :  <Field name='noticePeriod' type='text' /><br /><br />
                        <ErrorMessage name='noticePeriod' /><br /><br />

                        Expected CTC :  <Field name='expectedCTC' type='text' /><br /><br />
                        <ErrorMessage name='expectedCTC' /><br /><br />


                        Current CTC : <Field name='currentCTC' type='text' /><br /><br />
                        <ErrorMessage name='currentCTC' /><br /><br />


                        Departmnet : <Field name='department' as='select'  >
                            <option selected hidden>Select department</option>
                            {
                                allDepartments && allDepartments.map((department) => <option value={department.option_key}>{department.option_key}</option>)
                            }

                        </Field><br /><br />
                        <ErrorMessage name='department' />


                        Prefer Location : <Field as='select' name='demoLocation' multiple >


                            {
                                allPreferLocations && allPreferLocations.map((preferLocation) => (

                                    <option value={preferLocation.option_key}>{preferLocation.option_key}</option>

                                ))

                            }



                        </Field><br /><br />
                        <ErrorMessage name='demoLocation' /><br /><br />

                        <button type='submit'>Submit</button>

                    </Form>)
                }}
            </Formik>

        </div>
    )
}

export default InputForm

