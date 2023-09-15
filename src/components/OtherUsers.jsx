import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const OtherUsers = () => {
    const [otherUsers, setOtherUsers] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000/api/users')
            .then(res => {
                if(res.data.results){
                    setOtherUsers(res.data.results)
                }
            })
            .catch(err => {
                console.log('error')

            })
    }, [])


    return (
        <div>
            <h3>Find Friends</h3>
            <div>
                {
                    otherUsers.map((eachUser, i) => {
                        return(
                            <div key={i}>
                                <p>{eachUser.firstName}</p>
                                <p>{eachUser.lastName}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default OtherUsers