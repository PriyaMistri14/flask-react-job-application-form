
import React from 'react'

import './show-candidate.styles.css'

import axiosIntance from '../../axiosApi'

import { useState, useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { authFetch, authFetchDELETE, authFetchGET, authFetchPOST } from '../../axiosApi'







function ShowCandidate() {
    console.log("RE RENDER");
    const [candidates, setCandidates] = useState([])  // paginated data
    const [no_of_pages, setNo_of_pages] = useState(1)
    const [pageArr, setPageArr] = useState([])
    const [states, setStates] = useState([])
    const [order, setOrder] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState('id')
    const [search, setSearch] = useState("")


   


    const navigate = useNavigate()

    const goToLogin = () => {
        navigate("/login/")
    }



    const deleteCandidate = async (candidate) => {
        if (window.confirm("Are you sure to delete this record ??")) {
            console.log("/////////////////////", candidate);
            const candidate_id = candidate.id
            const academics = candidate.academics
            const experiences = candidate.experiences
            const languages = candidate.languages
            const technologies = candidate.technologies
            const references = candidate.references
            const preferences = candidate.preferences

            console.log("candidate to delete:  ", candidate, candidate_id, academics, experiences, languages, technologies, references, preferences);

            try {

                const res = await authFetchDELETE(`delete_candidate/${candidate_id}`
                )
                const data = await res.json()
                console.log("DATATAT:   ", data);

                academics.map(async (academic) => {
                    const academic_id = academic.id
                    console.log("academic id", academic_id)
                    const res = await authFetchDELETE(`delete_academic/${academic_id}`)
                    const data = await res.json()
                    console.log("DATATAT ACDA:   ", data);
                })


                experiences.map(async (experience) => {
                    const experience_id = experience.id
                    console.log("experience id", experience_id)
                    const res = await authFetchDELETE(`delete_experience/${experience_id}`)
                    const data = await res.json()
                    console.log("DATATAT EXPE:   ", data);
                })

                languages.map(async (language) => {
                    const language_id = language.id
                    console.log("language id", language_id)
                    const res = await authFetchDELETE(`delete_language/${language_id}`)

                    const data = await res.json()
                    console.log("DATATAT LANG:   ", data);
                })


                technologies.map(async (technology) => {
                    const technology_id = technology.id
                    console.log("technology id", technology_id)
                    const res = await authFetchDELETE(`delete_technology/${technology_id}`)

                    const data = await res.json()
                    console.log("DATATAT TECH:   ", data);
                })


                references.map(async (reference) => {
                    const reference_id = reference.id
                    console.log("reference id", reference_id)
                    const res = await authFetchDELETE(`delete_reference/${reference_id}`)

                    const data = await res.json()
                    console.log("DATATAT REFE:   ", data);

                })

                preferences.map(async (preference) => {
                    const preference_id = preference.id
                    console.log("preference id", preference_id)
                    const res = await authFetchDELETE(`delete_preference/${preference_id}`)

                    const data = await res.json()
                    console.log("DATATAT PREFE:   ", data);

                })

                alert("SUCCESSFULLY DELETED !!!!!!")
               

            } catch (error) {
                console.log("Error while deleting !!", error);
            }
        }

    }


    const changePage = async (e) => {
        const page_no = e.target.name
        console.log("]]]]]]]]]]]]", page_no, sort, order, search);
        try {

            const paginated_data = await authFetchGET(`pagination/?page=${page_no}&order=${order}&sort=${sort}&search=${search}`)

            const res = await paginated_data.json()

            console.log("Paginated_dataaaaa:  ", paginated_data, "rESSSSS:    ", res.data.data);

            setCandidates(res.data.data)
            setCurrentPage(page_no)


        } catch (error) {
            console.log("Error", error);
        }

    }




    const onSearchChangeHandler = async (e) => {

        const search = e.target.value
        setSearch(search)

        try {
            const paginated_data = await authFetchGET(`pagination/?page=1&sort=${sort}&order=${order}&search=${search}`)

            const res = await paginated_data.json()

            console.log("Paginated_dataaaaa after search :  ", paginated_data, "rESSSSS:    ", res.data.data);

            setCandidates(res.data.data)
            setNo_of_pages(res.data.no_of_pages)

            setCurrentPage(1)


            var arr = []

            for (var i = 0; i < res.data.no_of_pages; i++) {
                console.log("iii", i);
                arr.push(i + 1)

            }
            setPageArr(arr)




        } catch (err) {
            console.log("Error", err)
        }



    }




    const filterByState = async (e) => {
        const state = e.target.value
        setSearch(state)

        try {
            const paginated_data = await authFetchGET(`pagination/?page=1&sort=${sort}&order=${order}&search=${state}`)

            const res = await paginated_data.json()

            console.log("Paginated_dataaaaa after search state:  ", paginated_data, "rESSSSS:    ", res.data.data);

            setCandidates(res.data.data)
            setNo_of_pages(res.data.no_of_pages)

            setCurrentPage(1)


            var arr = []

            for (var i = 0; i < res.data.no_of_pages; i++) {
                console.log("iii", i);
                arr.push(i + 1)

            }
            setPageArr(arr)




        } catch (err) {
            console.log("Error", err)
        }
    }




    const sorting = async (e) => {
        // order == 'asc' ? setOrder("desc") : setOrder('asc')
        // currentPage === 1 && order == 'asc' ? setOrder("desc") : setOrder('asc')
        console.log("EEEE", e.target.getAttribute('value'));
        console.log("ORDERRRRRRRRR:   ", order, "CURRENT PAGEEE:    ", currentPage);
        const field = e.target.getAttribute('value')

        switch (field) {
            case 'fname':
                setSort('fname')
                const paginated_data_fname = await authFetchGET(`pagination/?page=1&order=${order}&sort=fname&search=${search}`)

                const res_fname = await paginated_data_fname.json()

                console.log("Paginated_dataaaaa:  ", paginated_data_fname, "rESSSSS:    ", res_fname.data.data);

                setCandidates(res_fname.data.data)
                setCurrentPage(1)
                break

            case 'lname':
                setSort('lname')
                const paginated_data_lname = await authFetchGET(`pagination/?page=1&order=${order}&sort=lname&search=${search}`)

                const res_lname = await paginated_data_lname.json()

                console.log("Paginated_dataaaaa:  ", paginated_data_lname, "rESSSSS:    ", res_lname.data.data);

                setCandidates(res_lname.data.data)
                setCurrentPage(1)
                break

            case 'surname':
                setSort('surname')
                const paginated_data_surname = await authFetchGET(`pagination/?page=1&order=${order}&sort=surname&search=${search}`)

                const res_surname = await paginated_data_surname.json()

                console.log("Paginated_dataaaaa:  ", paginated_data_surname, "rESSSSS:    ", res_surname.data.data);

                setCandidates(res_surname.data.data)
                setCurrentPage(1)
                break


            case 'contact_no':
                setSort('contact_no')

                const paginated_data_contact_no = await authFetchGET(`pagination/?page=1&order=${order}&sort=contact_no&search=${search}`)

                const res_contact_no = await paginated_data_contact_no.json()

                console.log("Paginated_dataaaaa:  ", paginated_data_contact_no, "rESSSSS:    ", res_contact_no.data.data);

                setCandidates(res_contact_no.data.data)
                setCurrentPage(1)

                break


            case 'email':
                setSort('email')
                const paginated_data_email = await authFetchGET(`pagination/?page=1&order=${order}&sort=email&search=${search}`)

                const res_email = await paginated_data_email.json()

                console.log("Paginated_dataaaaa:  ", paginated_data_email, "rESSSSS:    ", res_email.data.data);

                setCandidates(res_email.data.data)
                setCurrentPage(1)

                break


            case 'state':
                setSort('state')
                const paginated_data_state = await authFetchGET(`pagination/?page=1&order=${order}&sort=state&search=${search}`)

                const res_state = await paginated_data_state.json()

                console.log("Paginated_dataaaaa:  ", paginated_data_state, "rESSSSS:    ", res_state.data.data);

                setCandidates(res_state.data.data)
                setCurrentPage(1)
                break

            case 'city':
                setSort('city')
                const paginated_data_city = await authFetchGET(`pagination/?page=1&order=${order}&sort=city&search=${search}`)

                const res_city = await paginated_data_city.json()

                console.log("Paginated_dataaaaa:  ", paginated_data_city, "rESSSSS:    ", res_city.data.data);

                setCandidates(res_city.data.data)
                setCurrentPage(1)
                break


            default:
                setSort('id')
                console.log("No match found for sorting!!")

        }
   
        order == 'asc' ? setOrder("desc") : setOrder('asc')



    }



    useEffect(() => {
        console.log("use effect is called");
        (async () => {
            try {
                if (localStorage.getItem("REACT_TOKEN_AUTH_KEY")) {

                    try {
                        const paginated_data = await authFetchGET("pagination/?page=1")

                        const res = await paginated_data.json()

                        console.log("Paginated_dataaaaa:  ", paginated_data, "rESSSSS:    ", res.data.data);

                        setCandidates(res.data.data)
                        setNo_of_pages(res.data.no_of_pages)
                        setOrder('asc')


                        var arr = []

                        for (var i = 0; i < res.data.no_of_pages; i++) {
                            console.log("iii", i);
                            arr.push(i + 1)

                        }
                        setPageArr(arr)



                        const state = await authFetchGET("fetch_state/")
                        const s = await state.json()
                        console.log("allState", s.data)
                        setStates(s.data)




                    } catch (err) {
                        console.log("Error", err)
                    }
                   
                }
                else {
                    goToLogin()

                }

            } catch (error) {
                console.log("Error", error)
            }
        }
        )()
    }, [])

    console.log("no of pages:::::", no_of_pages, "CURRENTTTTTTTTTTTTTTTT PAGE :   ", currentPage);
    console.log("candidatesssss:  ", candidates, ";;;", "::::no of pages", no_of_pages, "pageArr::", pageArr);

    return (
        <div><br /><br />

            <input className='search' type='search' name='search' onChange={(e) => onSearchChangeHandler(e)} placeholder="Search Here!" />


            Filter By : <select onChange={(e) => filterByState(e)}>
                <option selected hidden>Select state</option>
                {
                    states.map(state => <option value={state.name}>{state.name}</option>)
                }
            </select><br /><br /><br /><br />

            <table border='1px' align='center'>
                <tr>
                    <td onClick={(e) => sorting(e)} value='fname' >First Name </td>
                    <td onClick={(e) => sorting(e)} value='lname'>Last Name</td>
                    <td onClick={(e) => sorting(e)} value='surname'>Surname</td>
                    <td onClick={(e) => sorting(e)} value='contact_no'>Contact No</td>
                    <td onClick={(e) => sorting(e)} value='city'>City</td>
                    <td onClick={(e) => sorting(e)} value='state'>State</td>
                    <td onClick={(e) => sorting(e)} value='email'>Email</td>
                    <td >Gender</td>
                    <td >DOB</td>
                    <td >DELETE</td>
                    <td >UPDATE</td>


                </tr>


                {
                    candidates.length != 0 ? candidates.map((candidate) => (
                     
                        // <div key={candidate.id}>
                        <>
                            <tr>
                                <td> {candidate.fname}</td>
                                <td> {candidate.lname}</td>
                                <td>{candidate.surname}</td>
                                <td>{candidate.contact_no}</td>
                                <td>{candidate.city}</td>
                                <td>{candidate.state}</td>
                                <td>{candidate.email}</td>
                                <td>{candidate.gender}</td>
                                <td>{candidate.dob}</td>
                                <td>  <a href='/show-candidate/' onClick={() => deleteCandidate(candidate)}>Delete </a></td>
                              
                                <td>  <Link to={`/update_form/${candidate.id}`} >Update</Link></td>

                            </tr></>




                    )
                    ) : <h3>NO DATA FOUND!!!</h3>

                }
            </table><br /><br />
            <div className='page-numbers'>
                {
                    pageArr.map(page => currentPage == page ? <a className='page' onClick={(e) => changePage(e)} name={page} >{page}</a>
                        : <a style={{ color: 'red' }} className='page' onClick={(e) => changePage(e)} name={page} >{page}</a>)

                }
            </div>

            <br /> </div>
    )
}

export default ShowCandidate

