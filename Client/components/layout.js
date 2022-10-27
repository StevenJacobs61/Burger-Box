import React from 'react'
import Footer from './footer'
import Navbar from './navbar'

const Layout = ({ children, admin }) => {
  return (
    <>
        <Navbar admin={admin}/>
        {children}
        <Footer/>
    </>
  )
}

export default Layout