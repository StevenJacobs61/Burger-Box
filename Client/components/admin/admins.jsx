import React, { useState } from 'react'
import styles from '../../styles/admins.module.css'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


const Admins = ({admins}) => {

 const [reveal, setReveal] = useState([])
const router = useRouter()

const handleReveal = (adminNumber) => {
  if (reveal.some((user) => user === adminNumber)){
    setReveal(reveal.filter((user) => user !== adminNumber));
  }
  if(!reveal.some((user) => user === adminNumber)) {
    setReveal((prev) => ([...prev, adminNumber]))
  }
}
 
 const handleSubmit = async (event) => {
     event.preventDefault()
     const data = {
         username: event.target.username.value,
         password: event.target.password.value,
        }; 
try{
        
       
            const JSONdata = JSON.stringify(data)
            
            const endpoint = '/api/admin'         
            
            const response = await axios.post(endpoint, JSONdata, {
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            
            const result = await response
            router.push("/admin");
            alert (`Admin Added`)
        } catch(err) {
            console.log(err),
            alert('username already in use')
        }
                                                 
        
    }

    const handleAdminDelete = async (id) => {
      if (admins.length < 2){
        return alert("Admin must have at least one user")
      }else{
           try {
             const res = await axios.delete(
               "http://localhost:3000/api/admin/" + id,
               alert (`Admin Deleted`)
              
             );
           } catch (err) {
             console.log(err);
           };
           router.push("/admin");
         };

        }
         
  return (
   
           <div className={styles.container}>
                <h1 className={styles.hdr}>Add Admins</h1>
            <div className={styles.login_container}>
                <form className={styles.submit_containter} onSubmit={handleSubmit}>
                    <label htmlFor="username" className={styles.label}>username:</label>
                    <input type="text" id='username' name='username' className={styles.input}/>
                    <label htmlFor="input" className={styles.label}>password:</label>
                    <input type="password"  id='password' name='password' className={styles.input}/>
                    <button className={styles.btn_submit} type='submit'>Submit</button>
                </form>
            </div>
            <div className={styles.list_container}>
                <h1 className={styles.admin_hdr}>Delete Admins</h1>
                {admins.map((admin) =>
                <div key={admin._id} className={styles.admin} >
                  <h2 className={styles.username}>Admin Number: {admins.indexOf(admin) + 1}</h2>
                    <h2 className={styles.username}>username: {reveal.some((user) => user ===  admins.indexOf(admin)) ? admin.username : null}</h2>
                   <p className={styles.password}>password: {reveal.some((user) => user === admins.indexOf(admin)) ? admin.password : null}</p> 
                   <p className={styles.reveal} onClick={() => handleReveal(admins.indexOf(admin))}>{!reveal.some((user) => user ===  admins.indexOf(admin)) ? "Reveal Details" : "Hide Details"}</p>
                   <button className={styles.btn_delete} onClick={() => handleAdminDelete(admin._id)}>Delete</button>
                </div>
                )}
            </div>
    </div>
 
  )


}
export default Admins
