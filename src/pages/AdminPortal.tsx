import React from 'react'
import AdminLogin from '../components/AdminLogin'

const AdminPortal = () => {
  const handleLogin = () => {
    // Handle login logic here
  }

  return (
    <div className='flex justify-center items-center h-screen text-white'>
      <h1 className='text-white text-lg font-extrabold'> HELLO</h1>
     <AdminLogin onLogin={handleLogin}/>
    </div>
  )
}

export default AdminPortal
