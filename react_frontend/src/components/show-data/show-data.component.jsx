import './show-data.styles.css'

import React from 'react'

const ShowData = (props) => {
  const { candidate } = props
  return (
    <div key={candidate.id}><hr />
      <table border='1px' >
        <tr>
          <td>First Name</td>
          <td>Last Name</td>
          <td>Surname</td>
          <td>Contact No</td>
          <td>City</td>
          <td>State</td>
          <td>Email</td>
          <td>Gender</td>
          <td>DOB</td>
          <td>Academics</td>
          <td>Experiences</td>
          <td>Languages</td>
          <td>Technologies</td>
          <td>References</td>
          <td>Preferences</td>
         
        </tr>
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

          <td>
            {
            candidate.academics &&  candidate.academics.map((academic) => (
                <>
                  course_name: {academic.course_name}<br />
                  name_of_board_university : {academic.name_of_board_university}<br />
                  passing_year :  {academic.passing_year}<br />
                  percentage : {academic.percentage}<br /><hr />
                </>

              ))
            }
          </td>
          <td>
            {
           candidate.experiences && candidate.experiences.map((experience) => (
            <>
              company_name : {experience.company_name}<br />
              designation : {experience.designation}<br />
              from_date : {experience.from_date}<br />
              to_date : {experience.to_date}<br /><hr />

            </>
          ))}</td>
          <td> {
            candidate.languages && candidate.languages.map((language) => (
              <>
                language : {language.language}<br />
                read : {language.read ? "True" : "False"}<br />
                write :  {language.write ? "True" : "False"}<br />
                speak : {language.speak ? "True" : "False"}<br /><hr />

              </>
            ))
          }
          </td>
          <td> {
           candidate.technologies && candidate.technologies.map((technology) => (
              <>
                technology : {technology.technology}<br />
                ranting : {technology.ranting}<br /><hr />

              </>
            ))
          }</td>
          <td>  {
            candidate.references && candidate.references.map((reference) => (
              <>
                refe_name : {reference.refe_name}<br />
                refe_contact_no : {reference.refe_contact_no}<br />
                refe_relation :  {reference.refe_relation}<br /><hr />
              </>
            ))
          }</td>
          <td> {
           candidate.preferences && candidate.preferences.map((preference) => (
              <>
                prefer_location : {preference.prefer_location}<br />
                notice_period : {preference.notice_period}<br />
                expected_ctc :  {preference.expected_ctc}<br />
                current_ctc : {preference.current_ctc}<br />
                department : {preference.department} <br /><hr />

              </>
            ))
          }</td>
        </tr>
      </table>
      {/* First Name : {candidate.fname} <br />
      Last Name : {candidate.lname}<br />
      Surname : {candidate.surname}<br />
      Contact No. : {candidate.contact_no}<br />
      City :  {candidate.city}<br />
      State : {candidate.state}<br />
      Email : {candidate.email}<br />
      Gender :{candidate.gender}<br />
      DOB :  {candidate.dob}<br />

      academics : <br />
      {
        candidate.academics.map((academic) => (
          <>
            <ul>
              <li>course_name : {academic.course_name}</li>
              <li>name_of_board_university : {academic.name_of_board_university}</li>
              <li>passing_year :  {academic.passing_year}</li>
              <li>percentage : {academic.percentage}</li>
            </ul>
          </>
        ))

      }


      experiences :
      {
        candidate.experiences.map((experience) => (
          <>
            company_name : {experience.company_name}<br />
            designation : {experience.designation}<br />
            from_date : {experience.from_date}<br />
            to_date : {experience.to_date}<br />

          </>
        ))
      }



      languages :
      {
        candidate.languages.map((language) => (
          <>
            language : {language.language}<br />
            read : {language.read ? "True" : "False"}<br />
            write :  {language.write ? "True" : "False"}<br />
            speak : {language.speak ? "True" : "False"}<br />

          </>
        ))
      }


      technologies :
      {
        candidate.technologies.map((technology) => (
          <>
            technology : {technology.technology}<br />
            ranting : {technology.ranting}<br />

          </>
        ))
      }




      references :
      {
        candidate.references.map((reference) => (
          <>
            refe_name : {reference.refe_name}<br />
            refe_contact_no : {reference.refe_contact_no}<br />
            refe_relation :  {reference.refe_relation}<br />
          </>
        ))
      }




      preferences :
      {
        candidate.preferences.map((preference) => (
          <>
            prefer_location : {preference.prefer_location}<br />
            notice_period : {preference.notice_period}<br />
            expected_ctc :  {preference.expected_ctc}<br />
            current_ctc : {preference.current_ctc}<br />
            department : {preference.department} <br />

          </>
        ))
      } */}

    </div>
  )
}


export default ShowData
