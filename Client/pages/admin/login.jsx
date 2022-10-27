import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from '../../styles/login.module.css'
import axios from 'axios'


const Login = () => {

const[username, setUsername] = useState()
const[password, setPassword] = useState()
const router = useRouter()





const handleUser = async () => {

  
  try{
    const res = await axios.post("http://localhost:3000/api/login", {username, password, isApp:true})
if(res.data){
  const cookieRes = await axios.post("http://localhost:3000/api/login/cookie", {adminMatch:true})
  if(cookieRes.data){
    router.push("/")
  }
}
} catch(err){
  console.log(err);
  alert("Error logging in")
}

  }



  return (
    <div className={styles.container}>
        <span className={styles.login_container}>
            <h1 className={styles.hdr}>Admin Login</h1>
            <label htmlFor="username" className={styles.label}>username:</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} className={styles.input}/>
            <label htmlFor="input" className={styles.label}>password:</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)}  className={styles.input}/>
            <button className={styles.submit} type='submit' onClick={() => handleUser()} >Login</button>
        </span>

    </div>
  )
  }

export default Login
