import React from 'react'
import Signup from './SIgnup'
import Login from './Login'

const Homepage = () => {
function ToSignup (){
  window.location.href = '/signup'; 
}

  return (
   <div>
    <Login/>
    
   </div>
    

  )
}

export default Homepage