
import './update-form.styles.css'

import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'

import * as Yup from "yup"

import React, { useEffect, useState } from 'react'
import axiosIntance from '../../axiosApi'

import { useParams } from 'react-router-dom'








let dateToTmp;
let fromDate;

var allCourses = []
var allLanguages = []
var allDepartments = []
var allStates = []
var allTechnologies = []

var allPreferLocations = []


// const course = await axiosIntance.get("http://127.0.0.1:8000/job/select_all/1/")
// console.log("Courses", course.data.options)
// const allCourses = course.data.options

// const language = await axiosIntance.get("http://127.0.0.1:8000/job/select_all/2/")
// console.log("allLanguages", language.data.options)
// const allLanguages = language.data.options


// const technology = await axiosIntance.get("http://127.0.0.1:8000/job/select_all/3/")
// console.log("allTechnology", technology.data.options)
// const allTechnologies = technology.data.options



// const prefer_location = await axiosIntance.get("http://127.0.0.1:8000/job/select_all/4/")
// console.log("allPreferLocation", prefer_location.data.options)
// const allPreferLocations = prefer_location.data.options



// const department = await axiosIntance.get("http://127.0.0.1:8000/job/select_all/5/")
// console.log("allDepartment", department.data.options)
// const allDepartments = department.data.options


// const state = await axiosIntance.get("http://127.0.0.1:8000/job/state/")
// console.log("allState", state.data)
// const allStates = state.data




const UpdateForm = () => {

    const [candidateAll, setCandidateAll] = useState({})

    const { candidate } = useParams()
    console.log("Candidate main |||||||||||||", candidate)

    useEffect(() => {
        const fetchCandidateAll = async () => {
            try {
                const candidate_fetched = await axiosIntance.get(`http://127.0.0.1:8000/job/candidate_all/${candidate}/`)
                //setCandidateAll(candidate_fetched.data)
                console.log("Candidate alllllll in use effect:", candidate_fetched.data)
                setCandidateAll(candidate_fetched.data)

            } catch (error) {
                console.log("Error while fetching candidate all", error)
            }

        }

        fetchCandidateAll()

    }, [])





    const getCity = async (state) => {
        console.log("called with state", state);
        var cities = []
    
        try {
            const citiessss = await axiosIntance.post("http://127.0.0.1:8000/job/getCities/", {
                state: state
            })
            console.log("cities in front end::", citiessss.data.fetched_cities)
            cities = citiessss.data.fetched_cities
    
    
    
        } catch (error) {
            console.log("Error while fetching cities in front end", error)
    
        }
    
    
        return cities
    
    }

    // try {
    //     const candidate_fetched = axiosIntance.get(`http://127.0.0.1:8000/job/candidate_all/${candidate}/`)
    //     //setCandidateAll(candidate_fetched.data)
    //     console.log("Candidate alllllll in use effect:", candidate_fetched)
    // } catch (error) {
    //     console.log("Error while fetching candidate all", error)
    // }

    // useEffect(() => {
    //     (async () => {
    //         console.log("In use effect")
    //         try{
    //         const candidate_fetched = await axiosIntance.get(`http://127.0.0.1:8000/job/candidate_all/${candidate}/`)
    //         setCandidateAll(candidate_fetched.data)
    //         console.log("Candidate alllllll in use effect:", candidateAll)
    //         }catch(error){
    //             console.log("Error while fetching candidate all", error)
    //         }

    //     }

    //     )()

    // }, [])


    console.log("Candidate alllllll:", candidateAll)

    var acade = []
    var expe = []
    var lang = []
    var tech = []
    var refe = []
    var pref_loc = []

    // candidate_all.map((candidate) => {

    // candidateAll.academics.map((ac) => {
    //     const aca_obj = {
    //         courseName: ac.course_name,
    //         nameOfBoardUniversity: ac.name_of_board_university,
    //         passingYear: ac.paasing_year,
    //         percentage: ac.percentage
    //     }

    //     acade.push(aca_obj)
    // })


    // candidateAll.experiences.map((ex) => {
    //     const ex_obj = {
    //         companyName: ex.company_name,
    //         designation: ex.designation,
    //         from: ex.from_date,
    //         to: ex.to_date
    //     }

    //     expe.push(ex_obj)
    // })


    // candidateAll.languages.map((ln) => {
    //     const ln_obj = {
    //         languageName: ln.language,
    //         read: ln.read,
    //         write: ln.write,
    //         speak: ln.speak
    //     }

    //     lang.push(ln_obj)
    // })


    // candidateAll.technologies.map((tn) => {
    //     const tn_obj = {
    //         technologyName: tn.technology,
    //         rating: tn.ranting,

    //     }

    //     tech.push(tn_obj)
    // })



    // candidateAll.references.map((rf) => {
    //     const rf_obj = {
    //         name: rf.refe_name,
    //         contactNo: rf.refe.refe_contact_no,
    //         relation: rf.refe_relation

    //     }

    //     refe.push(rf_obj)
    // })



    // candidateAll.preferences.map((pr) => {

    //     pref_loc.push(pr.prefer_location)
    // })

    // })


    console.log("acade::", acade, "expe::", expe, "lang:;", lang, "tech ::", tech, "refe::", refe, "pref_loc", pref_loc)



    const initialValues = {
        fname: candidateAll.fname,
        lname: candidateAll.lname,
        surname: candidateAll.surname,

        email: candidateAll.email,
        phone: candidateAll.contact_no,
        gender: candidateAll.gender,
        state: candidateAll.state,
        cities: [],
        city: candidateAll.city,

        dob: candidateAll.dob,

        academics: acade,

        experiences: expe,

        languages: lang,

        technologies: tech,

        references: refe,



        noticePeriod: candidateAll.preferences[0].notice_period,
        expectedCTC: candidateAll.preferences[0].expected_ctc,
        currentCTC: candidateAll.preferences[0].current_ctc,
        department: candidateAll.preferences[0].department,


        demoLocation: pref_loc


    }




    return (
        <div>
            <Formik initialValues={initialValues}



                onSubmit={async (values) => {
                    alert("Successfull!!")
                    console.log("Form data : ", values)
                    // try {
                    //     // uncomment this
                    //     const resCand = await axiosIntance.post("http://127.0.0.1:8000/job/candidate/", {
                    //         fname: values.fname,
                    //         lname: values.lname,
                    //         surname: values.surname,
                    //         email: values.email,
                    //         contact_no: values.phone,
                    //         city: values.city,
                    //         state: values.state,
                    //         gender: values.gender,
                    //         dob: values.dob
                    //     })
                    //     console.log("Response candidate created:", resCand)

                    //     // uncommint this
                    //     if (values.academics.length != 0) {
                    //         const res = values.academics.map(async (academic) => {

                    //             const resAcademics = await axiosIntance.post("http://127.0.0.1:8000/job/academic/", {
                    //                 course_name: academic.courseName,
                    //                 name_of_board_university: academic.nameOfBoardUniversity,
                    //                 passing_year: academic.passingYear,
                    //                 percentage: academic.percentage,
                    //                 //    candidate: resCand.data.id  // uncomment this
                    //                 candidate: 12
                    //             })

                    //             console.log("Response academic created:", resAcademics)
                    //         })

                    //         console.log("Main response academics", res)
                    //     }


                    //     if (values.experiences.length != 0) {
                    //         const res = values.experiences.map(async (experience) => {

                    //             const resExperience = await axiosIntance.post("http://127.0.0.1:8000/job/experience/", {
                    //                 company_name: experience.companyName,
                    //                 designation: experience.designation,
                    //                 from_date: experience.from,
                    //                 to_date: experience.to,
                    //                 //    candidate: resCand.data.id  // uncomment this
                    //                 candidate: 12
                    //             })

                    //             console.log("Response experience created:", resExperience)
                    //         })

                    //         console.log("Main response experience", res)
                    //     }





                    //     if (values.languages.length != 0) {
                    //         const res = values.languages.map(async (language) => {
                    //             if(language != undefined && language.languageName.length != 0){ 

                    //             const resLanguage = await axiosIntance.post("http://127.0.0.1:8000/job/language/", {
                    //                 language: language.languageName[0],
                    //                 read: language.read,
                    //                 write: language.write,
                    //                 speak: language.speak,
                    //                 //    candidate: resCand.data.id  // uncomment this
                    //                 candidate: 12
                    //             })
                    //             console.log("Response language created:", resLanguage)
                    //         }

                    //         })

                    //         console.log("Main response language", res)
                    //     }



                    //     if (values.technologies.length != 0) {
                    //         const res = values.technologies.map(async (technology) => {
                    //             if(technology != undefined && technology.technologyName.length != 0 ){ 

                    //             const resTechnology = await axiosIntance.post("http://127.0.0.1:8000/job/technology/", {
                    //                 technology: technology.technologyName[0],
                    //                 ranting: technology.rating,                                    
                    //                 //    candidate: resCand.data.id  // uncomment this
                    //                 candidate: 12
                    //             })
                    //             console.log("Response technology created:", resTechnology)
                    //         }

                    //         })

                    //         console.log("Main response technology", res)
                    //     }




                    //     if (values.references.length != 0) {
                    //         const res = values.references.map(async (reference) => {                               

                    //             const resReference = await axiosIntance.post("http://127.0.0.1:8000/job/reference/", {
                    //                 refe_name: reference.name,
                    //                 refe_contact_no: reference.contactNo,
                    //                 refe_relation : reference.relation,
                    //                 //    candidate: resCand.data.id  // uncomment this
                    //                 candidate: 12
                    //             })
                    //             console.log("Response relation created:", resReference)


                    //         })

                    //         console.log("Main response relation ", res)
                    //     }





                    //     if (values.demoLocation.length != 0) {
                    //         const res = values.demoLocation.map(async (location) => {

                    //             const resPreference = await axiosIntance.post("http://127.0.0.1:8000/job/preference/", {
                    //                 prefer_location: location,
                    //                 notice_period: values.noticePeriod,
                    //                 expected_ctc: values.expectedCTC,
                    //                 current_ctc: values.currentCTC,
                    //                 department: values.department,
                    //                 //    candidate: resCand.data.id  // uncomment this
                    //                 candidate: 12
                    //             })
                    //             console.log("Response preferences created:", resPreference)


                    //         })

                    //         console.log("Main response  preferences ", res)
                    //     }


                    // } catch (error) {
                    //     console.log("Error while creating candidate : ", error)

                    // }

                }

                }

                validationSchema={Yup.object().shape({
                    fname: Yup.string().required("this field is required!!")
                        .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! ")
                        .max(10, "Maximum characters allowed for this field is 10!!"),

                    lname: Yup.string().required("this field is required!!")
                        .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! ")
                        .max(10, "Maximum characters allowed for this field is 10!!"),

                    surname: Yup.string().required("this field is required!!")
                        .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! ")
                        .max(10, "Maximum characters allowed for this field is 10!!"),

                    designation: Yup.string().required("this field is required!!")
                        .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! "),


                    email: Yup.string().email("Please enter a valid email address!!")
                        .required("this field is required!!"),


                    phone: Yup.number().required("this field is required!!")
                        .integer("phone no does not containes decimals!!")
                        .positive("phone no can not be negative!!")
                        .max(10000000000, "phone no should be of 10 digit!!")
                        .min(1000000000, "phone no should be of 10 digit!!"),

                    gender: Yup.string().required("this field is required!!!"),

                    state: Yup.string().required("this field is required!!!"),

                    city: Yup.string().required("this field is required!!!"),

                    relationshipStatus: Yup.string().required("this field is required!!!"),

                    dob: Yup.date().required("this field is required!!!")
                        .max('2005-01-01', "your age must be 18 or greater!!")
                        .test('dateToTmp', 'assign value to variable', (value) => {
                            dateToTmp = value;
                            return true;
                        }),

                    zipcode: Yup.number().required("this field is required!!")
                        .integer("Please enter integer values!!")
                        .positive("zip code should be positive!!")
                        .min(100000, "zip code is of 6 digits!!")
                        .max(999999, "zip code is of 6 digits!!"),

                    academics: Yup.array().of(Yup.object().shape(
                        {
                            courseName: Yup.string().required("this field is required!!"),


                            nameOfBoardUniversity: Yup.string().required("this field is required!!").matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! "),


                            passingYear: Yup.number().required("this field is required!!")
                                .max(new Date().getFullYear(), "you can not pass in future!!!")


                                .test('passingYear', 'passing year is greater then dob!!', (value, ctx) => {
                                    const pYear = value
                                    const dob = new Date(dateToTmp).getFullYear()
                                    console.log("passsing year curr", pYear, "dob", dob, "date to tmp", dateToTmp);
                                    return pYear > dob
                                }),

                            percentage: Yup.number().required("this field is required!!")
                                .min(0, "Minimum percentage is 0")
                                .max(100, "maximum percentage is 100")
                        }
                    )),



                    experiences: Yup.array().of(Yup.object().shape({

                        companyName: Yup.string().required("this field is required!!")
                            .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! "),

                        designation: Yup.string().required("this field is required!!")
                            .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! "),

                        from: Yup.date().required("this field is required!!")
                            .max(new Date(), "Not possible")
                            .test('from', 'from date must be greater then dob!!', (value) => {
                                fromDate = value
                                const dob = dateToTmp
                                console.log("from date", fromDate, "dob", dob);
                                return fromDate > dob
                            }),

                        to: Yup.date().required("this field is required!!")
                            .max(new Date(), "Not possible!!!")
                            .test('to', 'To date must be greater than from date!!', (value) => {
                                const to = value
                                const from = fromDate
                                return to > from

                            })


                    })),


                    references: Yup.array().of(Yup.object().shape({
                        name: Yup.string().required("this field is required!!")
                            .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! "),

                        contactNo: Yup.number().required("this field is required!!")
                            .min(1000000000, "Contact no must be of 10 digits!!")
                            .max(10000000000, "Contact no must be of 10 digits!!"),

                        relation: Yup.string().required("this field is required!!")
                            .matches(/^[aA-zZ\s]+$/, "This field should only contains alphabets!! ")

                    })),

                    noticePeriod: Yup.number().required("this field is required!!")
                        .min(1, "minimum notice period is 1 !!!")
                        .max(10, "maximum notice period is 10 !!"),

                    expectedCTC: Yup.number().required("this field is required!!"),

                    currentCTC: Yup.number().required("this field is required!!"),

                    department: Yup.string().required("this field is required!!!"),



                    demoLocation: Yup.array().test('demolocation', "this field is required  !!!", (value) => {

                        return value.length > 0
                    })


                })


                }

            >




                {(props) => {

                    console.log("props of formik", props);
                    const { values, setFieldValue } = props

                    return (<Form ><br /><br />

                        First Name:   <Field type="text" name="fname" id="fname" /><br /><br />
                        <ErrorMessage name="fname" /><br /><br />

                        Last Name:   <Field type="text" name="lname" id="lname" /><br /><br />
                        <ErrorMessage name="lname" className='error' /><br /><br />

                        Surname:   <Field type="text" name="surname" id="surname" /><br /><br />
                        <ErrorMessage name="surname" /><br /><br />

                        Desination :   <Field type="text" name="designation" id="designation" /><br /><br />
                        <ErrorMessage name="designation" /><br /><br />

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
                                allStates.map((state) => <option value={state.name} >{state.name}</option>)

                            }

                        </Field><br /><br />
                        <ErrorMessage name="state" /><br /><br />



                        City : <Field as="select" name="city">
                            <option selected hidden>Select city</option>
                            {
                                values.cities.length != 0 ? values.cities.map((city) => <option value={city.name}>{city.name}</option>) : null
                            }


                        </Field><br /><br />
                        <ErrorMessage name="city" /><br /><br />



                        Relationship Status : <Field as="select" name="relationshipStatus" id="relationshipStatus" >
                            <option selected hidden> Select Realtionship Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="wido">Wido</option>

                        </Field><br /><br />
                        <ErrorMessage name="relationshipStatus" /><br /><br />


                        Date of Birth : <Field type="date" name="dob" /><br /><br />
                        <ErrorMessage name="dob" /><br /><br />


                        Zip Code : <Field type="text" name="zipcode" id="zipcode" /><br /><br />
                        <ErrorMessage name="zipcode" /><br /><br />
                        <hr /><br /><br />



                        <FieldArray name='academics' >
                            {
                                ({ insert, push, remove }) => (
                                    <div>

                                        {
                                            values.academics.length > 0 && values.academics.map((academic, index) => (

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
                                                        index == 0 ? null : <div><button type='button' onClick={() => remove(index)} >-</button><br /><br /></div>
                                                    }



                                                </div>

                                            ))
                                        }
                                        <button type='button' onClick={() => push({ nameOfBoardUniversity: '', passingYear: '', percentage: '' })}>+</button>

                                        <br /><br />

                                    </div>
                                )
                            }
                        </FieldArray> <hr /><br /><br />



                        <FieldArray name='experiences' >
                            {
                                ({ insert, push, remove }) => (
                                    <div>
                                        {
                                            values.experiences.length > 0 && values.experiences.map((experience, index) => (
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
                                                        index == 0 ? null : <div><button type='button' onClick={() => remove(index)}>-</button><br /><br /></div>
                                                    }
                                                </div>
                                            ))


                                        }

                                        <button type='button' onClick={() => push({ companyName: "", designation: "", from: "", to: "" })}>+</button><br /><br />

                                    </div>
                                )


                            }



                        </FieldArray><hr /><br /><br />
                        <FieldArray name='languages' >
                            {
                                () => (
                                    <div>{

                                        allLanguages.map((language, index) => (
                                            <div>
                                                <Field name={`languages.${index}.languageName`} type='checkbox' value={language.option_key} />{language.option_key}
                                                <Field name={`languages.${index}.read`} id={`languages.${index}.read`} type='checkbox' />Read
                                                <Field name={`languages.${index}.write`} id={`languages.${index}.write`} type='checkbox' />Write
                                                <Field name={`languages.${index}.speak`} id={`languages.${index}.speak`} type='checkbox' />Speak

                                                <br /><br /></div>
                                        ))

                                    }

                                    </div>
                                )


                            }

                        </FieldArray><hr /><br /><br />

                        <FieldArray name='technologies'>
                            {
                                () => (
                                    <div>
                                        {
                                            allTechnologies.map((technology, index) => (
                                                <div>

                                                    <Field name={`technologies.${index}.technologyName`} value={technology.option_key} type='checkbox' />{technology.option_key}


                                                    <Field name={`technologies.${index}.rating`}>
                                                        {
                                                            ({ Field, meta, form }) => (
                                                                <div>

                                                                    <input type='radio' name={`technologyRadio${index}`} value='3' {...Field} onClick={() => setFieldValue(`technologies.${index}.rating`, 3)} />Begginer
                                                                    <input type='radio' name={`technologyRadio${index}`} value='6' {...Field} onClick={() => setFieldValue(`technologies.${index}.rating`, 6)} />Mediator
                                                                    <input type='radio' name={`technologyRadio${index}`} value='10' {...Field} onClick={() => setFieldValue(`technologies.${index}.rating`, 10)} />Expert

                                                                </div>

                                                            )
                                                        }

                                                    </Field>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }

                        </FieldArray><hr /><br /><br />
                        <FieldArray name='references'>
                            {
                                () => (
                                    <div>
                                        {
                                            values.references.map((reference, index) => (
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

                        Notice Period :  <Field name='noticePeriod' type='text' /><br /><br />
                        <ErrorMessage name='noticePeriod' /><br /><br />

                        Expected CTC :  <Field name='expectedCTC' type='text' /><br /><br />
                        <ErrorMessage name='expectedCTC' /><br /><br />


                        Current CTC : <Field name='currentCTC' type='text' /><br /><br />
                        <ErrorMessage name='currentCTC' /><br /><br />


                        Departmnet : <Field name='department' as='select'  >
                            <option selected hidden>Select department</option>
                            {
                                allDepartments.map((department) => <option value={department.option_key}>{department.option_key}</option>)
                            }

                        </Field><br /><br />
                        <ErrorMessage name='department' />



                        Prefer Location : <Field as='select' name='demoLocation' multiple >
                            {/* <option selected hidden >Select location</option> */}

                            {
                                allPreferLocations.map((preferLocation) => (

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

export default UpdateForm




