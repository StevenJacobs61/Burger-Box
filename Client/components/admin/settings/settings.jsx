import React from 'react'
import styles from "../../../styles/admin/settings/settings.module.css"
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import SubmitBtn from '../../buttons/submitBtn'
import Printer from './printer'
import Show from '../../show'

const Settings = ({settingsList, adminsList}) => {

    // Initial settings from MDB
    const settings = settingsList[0];

    const [accounts, setAccounts] = useState(adminsList);
    const [offline, setOffline] = useState(settings.offline);
    const [bannerOn, setBannerOn] = useState(settings.bannerOn)
    const [banner, setBanner] = useState(settings.banner);
    const [upBanner, setUpBanner] = useState(settings.banner);
    const [noticeOn, setNoticeOn] = useState(settings.noticeOn);
    const [notice, setNotice] = useState(settings.notice);
    const [upNotice, setUpNotice] = useState(settings.notice);
    const [delivery, setDelivery] = useState(settings.del);
    const [delTime, setDelTime] = useState(settings.delTime);
    const [upDelTime, setUpDelTime] = useState(settings.delTime);
    const [colTime, setColTime] = useState(settings.colTime);
    const [upColTime, setUpColTime] = useState(settings.colTime);
    
    // Show sections on click`
    
    const [showTimes, setShowTimes] = useState(false);
    const [showOffline, setShowOffline] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showNotice, setShowNotice] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);
    const [showPrinter, setShowPrinter] = useState(false);
    
    
    // *** Times ***
   
    const handleSubmit = async () => {
        
        const newColTime = !colTime || colTime < 1 ? settings.colTime : colTime;
        const newDelTime = !delTime || delTime < 1 ? settings.delTime : delTime;

        const update = {
            colTime: parseInt(newColTime),
            delTime: parseInt(newDelTime)
         };
         const filter = {}
        try{
        const res = await axios.patch("/api/settings", {filter, update})
        setUpColTime(parseInt(newColTime))
        setUpDelTime(parseInt(newDelTime))
        } catch(err){
            console.log(err);
        }
    }

    // *** Offline ***
        
    const handleOffline = async () => {
        const update = {
            offline:!offline
        };
        const filter = {};
        try{
        const res = await axios.patch("/api/settings", {filter, update});
        setOffline(!offline)
        } catch (err){
            console.log(err);
            
        }
    }

    // *** Banner ***
    
    // Update banner text
    const handleBannerUpdate = async () => {

        const newBanner = !banner || banner == "" ? settings.banner : banner;

        const update = {
            banner: newBanner
        };
        const filter = {};
        try{
        const res = await axios.patch("/api/settings", {filter, update});
        setUpBanner(newBanner)
        settings.banner = upBanner
        }catch(err) {
            console.log(err);
        }
    }
    // Turn banner on/off

    const handleBanner = async () => {
        const update = {
            bannerOn: !bannerOn
        };
        const filter = {};
        try{
            const res = await axios.patch("/api/settings", {filter, update});
            setBannerOn(!bannerOn)
            }catch(err) {
                console.log(err);
            }
    }

    // *** Notice ***
    
    // Update notice text
    const handleNoticeUpdate = async () => {

        const newNotice = !notice|| notice == "" ? settings.notice : notice;

        const update = {
            notice: newNotice
        };
        const filter = {};
        try{
        const res = await axios.patch("/api/settings", {filter, update});
        setUpNotice(newNotice)
        settings.notice = upNotice
        }catch(err) {
            console.log(err);
        }
    }
    // Turn notice on/off

    const handleNotice = async () => {
        const update = {
            noticeOn: !noticeOn
        };
        const filter = {};
        try{
            const res = await axios.patch("/api/settings", {filter, update});
            setNoticeOn(!noticeOn)
            }catch(err) {
                console.log(err);
            }
    }

    // *** Delivery ***

    const handleDelivery = async () => {
        const update = {
            del:!delivery
        };
        const filter = {};
        try{
        const res = await axios.patch("/api/settings", {filter, update});
        setDelivery(!delivery)
        } catch (err){
            console.log(err);
        }
    }

    
    //*** Accounts ***

    // Authenticate user details

    const [match, setMatch] = useState(false)

    const[username, setUsername] = useState()
    const[password, setPassword] = useState()

    // Delete account

    const handleAccountDelete = async (id) => {
        if (accounts.length < 2){
            return alert("Admin must have at least one user")
        }else{
            try {
            const res = await axios.delete(
                "http://localhost:3000/api/admin/" + id)
                setAccounts(accounts.filter((ac)=> ac._id !== id))
            } catch (err) {
            console.log(err);
            };
            };
        }

    // Add account

    const handleAddAccount = async () => {
        const data = {
            username: username,
            password: password,
           }; 
       try{
         const res = await axios.post("http://localhost:3000/api/admin", data, {
             headers:{
                 'Content-Type': 'application/json'
             }
         })
         console.log(res.data);
         setAccounts((prev) => ([...prev, res.data]))
     } catch(err) {
         console.log(err),
         alert('username already in use')
           }
       }
    
    // Set Admins Match

    useEffect(()=> {
        const usernameMatch = false
        const passwordMatch = false
        accounts?.map((ad) => {
            if(ad.username === username){
                usernameMatch = true
            }
            if(ad.password === password){
                passwordMatch = true
            }
            if(passwordMatch && usernameMatch){
                setMatch(true)
            }
        })
    },
    [username, password, accounts])

    //*** STYLES Margin variable for headers 
    
    const margin = "2rem 0 1.5rem" 
    
    const underline = "2px solid var(--bg-color--blue)"


  return (
    <div className={styles.container}>

        {/* Times */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShowTimes(!showTimes)}
            style={{margin: !showTimes ? margin : null, borderBottom: !showTimes ? underline : null}}
            >Times</h1>
            {showTimes ? 
            <Show setShow={setShowTimes}>
            <div className={styles.wrapper}>
            <h2 className={styles.box_hdr}>Times</h2>
            <div className={styles.time_wrapper}>
                <h2 className={styles.time_text}>Collection Time:</h2>
                <p className={styles.time}>{upColTime} mins</p>
                <h3 className={styles.update_text}>Update Time</h3>
                <input type="number" className={styles.time_input} onChange={(e) => setColTime(e.target.value)}/>
            </div> 
            <div className={styles.time_wrapper} id={styles.del}>
                <h2 className={styles.time_text}>Delivery Time:</h2>
                <p className={styles.time}>{upDelTime} mins</p>
                <h3 className={styles.update_text}>Update Time</h3>
                <input type="number" className={styles.time_input} onChange={(e) => setDelTime(e.target.value)}/>
            </div>
                <SubmitBtn innerTxt={"Submit"} btnFunction={handleSubmit}/>
            </div>
            </Show>

            : null}
        </div>

        {/* Offline */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShowOffline(!showOffline)}
            style={{margin: !showOffline ? margin : null, borderBottom: !showOffline ? underline : null}}
            >Offline</h1>
            {showOffline ?
            <Show setShow={setShowOffline}>
            <div className={styles.wrapper}>
                <h2 className={styles.box_hdr}>Offline</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: !offline ? "var(--text--light-green)" : ""}} >{offline ? "Offline" : "live"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_offline} 
            onClick={()=> handleOffline()}
            style={{color: !offline ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{offline ? "+ " : "- "}Live</button>
            </div>
            </Show>
            : null}
        </div>

        {/* Banner */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShowBanner(!showBanner)}
            style={{margin: !showBanner ? margin : null, borderBottom: !showBanner ? underline : null}}
            >Banner</h1>
             {showBanner ?
            <Show setShow={setShowBanner}>
            <div className={styles.wrapper}> 
            <h2 className={styles.box_hdr}>Banner</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: bannerOn ? "var(--text--light-green)" : ""}} >{bannerOn ? "Banner On" : "Banner Off"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_status} 
            onClick={()=> handleBanner()}
            style={{color: bannerOn ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{bannerOn ? "OFF" : "On"}</button>  
             <h2 className={styles.time_text}>Current Banner:</h2>
             <p className={styles.current_text}>&quot;{upBanner}&quot;</p>
             <h3 className={styles.update_text}>Update Banner</h3>
            <textarea type="text" className={styles.banner_input} onChange={(e) => setBanner(e.target.value)}/>
            <SubmitBtn innerTxt={"Submit"} btnFunction={handleBannerUpdate}/>
            </div>
            </Show>
            : null}
        </div>

        {/* Notice */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=> {setShowNotice(!showNotice)}}
            style={{margin: !showNotice ? margin : null, borderBottom: !showNotice ? underline : null}}
            >notice</h1>
        {showNotice ?  
        <Show setShow={setShowNotice} >
         <div className={styles.wrapper}> 
         <h2 className={styles.box_hdr}>Times</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: noticeOn ? "var(--text--light-green)" : ""}} >{noticeOn ? "Notice On" : "Notice Off"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_status} 
            onClick={()=> handleNotice()}
            style={{color: delivery ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{noticeOn ? "OFF" : "On"}</button>
            <h2 className={styles.time_text}>Current Notice:</h2>
             <p className={styles.current_text}>&quot;{upNotice}&quot;</p>
             <h3 className={styles.update_text}>Update Notice</h3>
            <textarea type="text" className={styles.banner_input} onChange={(e) => setNotice(e.target.value)}/>
            <SubmitBtn innerTxt={"Submit"} btnFunction={handleNoticeUpdate}/>
            </div> 
            </Show>
            :null}
        </div>

        {/* Delivery */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShowDelivery(!showDelivery)}
            style={{margin: !showDelivery ? margin : null, borderBottom: !showDelivery ? underline : null}}
            >Delivery</h1>
            {showDelivery ? 
            <Show setShow={setShowDelivery}>
            <div className={styles.wrapper}>
            <h2 className={styles.box_hdr}>Delivery</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: delivery ? "var(--text--light-green)" : ""}} >{delivery ? "Delivery On" : "Delivery Off"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_offline} 
            onClick={()=> handleDelivery()}
            style={{color: delivery ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{delivery ? "OFF" : "On"}</button>
            </div>
            </Show>
             :null}
        </div>
        {/* Printer */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShowPrinter(!showPrinter)}
            style={{margin: !showDelivery ? margin : null, borderBottom: !showDelivery ? underline : null}}
            >Printer</h1>
          {showPrinter ? 
          <Show setShow={setShowPrinter}>
            <h2 className={styles.box_hdr}>Printer</h2>
              <Printer/>
          </Show>
          : null
          }
            
        </div>

        {/* Accounts */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShowAccounts(!showAccounts)}
            style={{margin: !showAccounts ? margin : null, borderBottom: !showAccounts ? underline : null}}
            >Accounts</h1>
            {showAccounts ? <div className={styles.wrapper}>
            <h2 className={styles.time_text}>{!match ? "Enter Details:" : "Current Accounts:"}</h2>
                {/*Displayed if username and password is not authenticated*/}
                {!match ? 
                 <div className={styles.item} style={{margin: !match && window.innerWidth < 769 ? "1rem" : null}}>
                    <div className={styles.account_details_container}>
                     <p className={styles.account_title}>UserName:</p>
                     <input type="text" placeholder="username" className={styles.account_input} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className={styles.account_details_container}>
                     <p className={styles.account_title}>Password:</p>
                     <input type="text" placeholder="password" className={styles.account_input} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                 </div>

                //  Displayed if authenticated
                : <>
                {accounts.map((account) => <div  key={account._id}className={styles.account_container}>
                    <h3 className={styles.account_hdr}>Account {accounts.indexOf(account)+1}</h3>
                    <div className={styles.account_details_container}> 
                        <p className={styles.account_title}>UserName:</p>
                        <p className={styles.account_info}>{account.username}</p>
                    </div>
                    <div className={styles.account_details_container}>
                        <p className={styles.account_title}>Password:</p>
                        <p className={styles.account_info}>{account.password}</p>
                    </div>
                    <p className={styles.reveal}>reveal</p>
                    <button className={styles.btn_del} onClick={()=> handleAccountDelete(account._id)}>Delete</button>
                </div>)}
                <div className={styles.add_account_container}>
                    <h3 className={styles.account_hdr}>Add Account</h3>
                    <div className={styles.account_details_container}> 
                        <p className={styles.account_title}>UserName:</p>
                        <input type="text" placeholder="username" className={styles.account_input} onChange={(e)=> setUsername(e.target.value)}/>
                    </div>
                    <div className={styles.account_details_container}>
                        <p className={styles.account_title}>Password:</p>
                        <input type="text" placeholder="password" className={styles.account_input} onChange={(e)=> setPassword(e.target.value)}/>
                    </div>
                    <div className={styles.btn_container}>
                        <SubmitBtn  innerTxt={"Submit"} btnFunction={handleAddAccount}/>
                    </div>
                </div> </>}
            </div> :null}
        </div>
    </div>
  )
}

export default Settings