import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const CLIENT_ID = '33bccc55613d450fa0989687179fff2d';
    const REDIRECT_URI = 'http://localhost:3000/';
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';

    const [token, setToken] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [recs, setRecs] = useState([]);
    const [user, setUser] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        let accessToken = window.localStorage.getItem('token');

        if (!accessToken && hash) {
            accessToken = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

            window.location.hash = '';
            window.localStorage.setItem('token', accessToken);
        }

        setToken(accessToken);

        // Automatically fetch data when the component mounts
        if (accessToken) {
            fetchData(accessToken);
        }
    }, []);

    const fetchData = async (accessToken) => {
        try {
            const [userResponse, playlistsResponse, recsResponse] = await Promise.all([
                axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
                axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
                axios.get('https://api.spotify.com/v1/recommendations?seed_artists=4ClziihVpBeFXNyDH83Lde', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            ]);

            setUser(userResponse.data);
            setPlaylists(playlistsResponse.data.items);
            setRecs(recsResponse.data.tracks);

            // Obtain the user ID from the userResponse
            const userId = userResponse.data.id;

            // Fetch user's playlists using the user ID
            const userPlaylistsResponse = await axios.get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setUserPlaylists(userPlaylistsResponse.data.items);
        } catch (err) {
            setError(err.message);
        }
    };

    const logout = () => {
        setToken('');
        window.localStorage.removeItem('token');
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="d-flex justify-content-end">
                    {!token ? (
                        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
                    ) : (
                        <button onClick={logout} className='btn btn-warning mt-3 me-3'>Logout</button>
                    )}
                </div>
                <h1>Music App!</h1>
            </header>

            <div className='name'>
                <div>
                    <p>Hello {user?.display_name}</p>
                </div>
            </div>

            {token && (
                <div className='container-fluid'>
                    <div className="mt-5">
                        {error ? (
                            <p>Error: {error}</p>
                        ) : (
                            <div className='text-center'>
                                <h2 className='text-info'>Featured Playlists</h2>
                                <div className='d-flex flex-wrap gap-3 col-12 m-5 text-center align-items-center'>
                                    {userPlaylists && userPlaylists.length > 0 ? (
                                        userPlaylists.map((userPlaylist, i) => (
                                            <div key={i} className="playlist-card">
                                                <h6>{userPlaylist.name}</h6>
                                                {userPlaylist.images && userPlaylist.images.length > 0 && (
                                                    <img src={userPlaylist.images[0].url} alt={userPlaylist.name} width="150" height="150" />
                                                )}
                                                <p><a href={userPlaylist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                                    Listen on Spotify
                                                </a></p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No featured playlists available</p>
                                    )}
                                </div>
                                <h2 className='text-info'>Recommended Tracks</h2>
                                <div className='d-flex flex-wrap gap-3 col-12 m-5 text-center align-items-center'>
                                    {recs && recs.length > 0 ? (
                                        recs.map((rec, i) => (
                                            <div key={i} className="rec-card">
                                                <h6>{rec.name}</h6>
                                                {rec.album.images && rec.album.images.length > 0 && (
                                                    <img src={rec.album.images[0].url} alt={rec.name} width="150" height="150" />
                                                )}
                                                <p><a href={rec.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                                    Listen on Spotify
                                                </a></p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No recommended tracks available</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
