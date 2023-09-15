import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const RegForm = () => {
    // form info stored in state variables
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const navigate = useNavigate()

    const [token, setToken] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('token');

        if (!token && hash) {
            token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

            window.location.hash = '';
            window.localStorage.setItem('token', token);
        }

        setToken(token);

    }, []);

    const handleRegister = (e) => {
        const clientId = "33bccc55613d450fa0989687179fff2d"
        const redirectUrl = "http://localhost:3000/"
        const apiUrl = "https://accounts.spotify.com/authorize"
        const scope = [
            'user-read-email',
            'user-read-private',
            'user-modify-playback-state',
            'user-read-playback-state',
            'user-read-currently-playing',
            'user-read-recently-played',
            'user-read-playback-position',
            'user-top-read', 
            'playlist-read-private',
            'playlist-modify-private',
            'playlist-modify-public',
            'playlist-read-collaborative',
            'user-follow-modify',
            'user-follow-read',
            'user-library-read',
            'user-library-modify'

        ]
        e.preventDefault()
        axios.post(`http://localhost:8000/api/users/register`, {firstName, lastName, email, password, confirm}, {withCredentials: true})
        .then(res => {
            console.log('res after registering', res)
            if(res.data.errors) {
                setFormErrors(res.data.errors)
            }else{
                navigate('/dashboard')
            }
        })
        .catch(err => {
            console.log('err while registering', err)
        })
    }


    return (
        <div>
            <h1 className='text-center'>Register</h1>
            <form onSubmit={handleRegister}>
                <div className='register'>
                    <div className='form-group'>
                        <label className='form-label'>First Name:</label>
                        <input type='text' name='firstName' value={firstName} onChange={(e)=>setFirstName(e.target.value)} className='form-control'/>
                        <p className='text-danger'>{formErrors.firstName?.message}</p>
                    </div>
                    <div>
                        <label className='form-label'>Last Name:</label>
                        <input type='text' name='lastName' value={lastName} onChange={(e)=>setLastName(e.target.value)}className='form-control'/>
                        <p className='text-danger'>{formErrors.lastName?.message}</p>
                    </div>
                    <div>
                        <label className='form-label'>Email:</label>
                        <input type='text' name='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='form-control'/>
                        <p className='text-danger'>{formErrors.email?.message}</p>            
                    </div>
                    <div>
                        <label className='form-label'>Password:</label>
                        <input type='password' name='password' value={password} onChange={(e)=>setPassword(e.target.value)} className='form-control'/>
                        <p className='text-danger'>{formErrors.password?.message}</p>
                    </div>
                    <div>
                        <label className='form-label'>Confirm Password:</label>
                        <input type='password' name='confirm' value={confirm} onChange={(e)=>setConfirm(e.target.value)} className='form-control'/>
                        <p className='text-danger'>{formErrors.confirm?.message}</p>
                    </div>
                    <input type="submit" value="Register" className='btn btn-primary mt-3'/>
                </div>
            </form>
        </div>
    )
}

export default RegForm