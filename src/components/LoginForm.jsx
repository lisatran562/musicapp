import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../views/Dashboard'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginErrors, setLoginErrors] = useState('')

    const navigate = useNavigate();

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

    const handleLogin = (e) => {
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
        e.preventDefault();
        axios.post(`http://localhost:8000/api/users/login`, { email, password }, { withCredentials: true })
            .then(res => {
                console.log('response when logging in', res)
                if (res.data.error) {
                    setLoginErrors(res.data.error)
                } else {
                    navigate('/dashboard')
                }
            })
            .catch(err => console.log('error when logging in', err))
        // window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join(
        //     " "
        // )}&response_type=token&show_dialog=true`
        
        navigate('/dashboard')    
    }

    return (
        <div>
            <h1 className='text-center'>Login</h1>
            <form onSubmit={handleLogin}>
                <div className='login'>
                    <div className="form-group">
                        <label className='form-label'>Email:</label>
                        <input type='text' name='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Password:</label>
                        <input type='password' name='password' value={password} className='form-control' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <p className='text-danger'>{loginErrors}</p>
                    <input type="submit" value="Login" className='btn btn-secondary mt-3' />
                </div>
            </form>
        </div>
    )
}

export default LoginForm