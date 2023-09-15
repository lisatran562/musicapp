import React from 'react'
import RegForm from '../components/RegForm'
import LoginForm from '../components/LoginForm'




const Index = () => {
    return (
        <div className='container-fluid'>
            <h1 className="title text-center">Music App</h1>
            <div className='row mt-5'>
                <div className='col-md-6'>
                    <RegForm/>
                </div>
                <div className='col-md-6'>
                    <LoginForm/>
                </div>
            </div>
        </div>
    )
}

export default Index