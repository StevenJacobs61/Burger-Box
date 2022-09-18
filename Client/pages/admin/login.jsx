import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/login.module.css'
import {addUser, reset, setAdmin} from '../../redux/userSlice'
import axios from 'axios'


const Login = ({admins}) => {

const [isAdmin, setIsAdmin] = useState(false)
const router = useRouter()
const dispatch = useDispatch()
const user = useSelector((state) => state.user)


const handleLogIn = async (adminMatch) => {
  try {
    await axios.post("http://localhost:3000/api/login", {adminMatch});
    router.push("/");
  } catch (err) {
    console.log(err);
  }
};


const handleUser = (event) => {
  
  event.preventDefault()

const data = {
    username: event.target.username.value,
      password: event.target.password.value,
     }; 
const username = data.username;
const password = data.password; 
dispatch(addUser({username, password}));


const matchAdmin = admins.map((admin) => username === admin.username &&  password === admin.password ? true : false);
const matchRes = (matchAdmin.filter(res => res === true));
const matchString = matchRes.toString()
const adminMatch = (matchString === "true")

 if (adminMatch){
  dispatch(setAdmin({adminMatch}));
  handleLogIn(adminMatch)
 }else {
   return alert("Wrong Login Credentials")
 }

  }




  return (
    <div className={styles.container}>
        <form className={styles.login_container} onSubmit={handleUser}>
            <h1 className={styles.hdr}>Admin Login</h1>
            <label htmlFor="username" className={styles.label}>username:</label>
            <input type="text" id='username' name='username' className={styles.input}/>
            <label htmlFor="input" className={styles.label}>password:</label>
            <input type="password"  id='password' name='password' className={styles.input}/>
            <button className={styles.submit} type='submit'>Login</button>
        </form>

    </div>
  )
  }

export default Login

export const getServerSideProps =  async () => {
     const res = await axios.get("http://localhost:3000/api/admin");
     return {
      props:{
        admins:res.data
      }
     }

}