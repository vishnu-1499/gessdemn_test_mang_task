import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProtectedRoutes(props) {
  const [loggedIn, setLoggedIn] = useState(true)
  const navigate = useNavigate()
  
  const CheckToken = () => {
    const token = localStorage.getItem("token")
    if( !token || token === "undefined" ) {
      setLoggedIn(false)
      return navigate("/")
    }
  }

  useEffect(()=>{
    CheckToken()
  })

  return (
      <>
        {
          loggedIn ? props.children : null
        }
      </>
  )
}

export default ProtectedRoutes