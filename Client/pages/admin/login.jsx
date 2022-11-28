import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from '../../styles/login.module.css'
import axios from 'axios'
import SelectBtn from '../../components/buttons/selectBtn'
import cookie from "cookie"
import { useEffect } from 'react'


const Login = (prod) => {

const[username, setUsername] = useState()
const[password, setPassword] = useState()
const router = useRouter()


// Production skip log in process
useEffect(()=>{
if (prod){
  router.push("/")
}
},[])


const handleUser = async () => {

  
  try{
    const res = await axios.post("/api/login", {username, password, isApp:true})
if(res.data){
  const cookieRes = await axios.post("/api/login/cookie", {adminMatch:true})
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
            <div className={styles.btn_container}>
              <SelectBtn innerTxt={"Login"} btnFucntion={handleUser} btnStyle={"S"} /> 
            </div>
        </span>

    </div>
  )
  }

export default Login


// Production skip log in process
export const getServerSideProps = async (ctx) => {
  
  ctx.res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", process.env.TOKEN, {
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      path: "/",
    })
  ); 
  return {

    props:{
      prod: true
    }
  }
}
