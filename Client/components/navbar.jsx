import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import styles from '../styles/navbar.module.css'
import {AiOutlineInstagram} from 'react-icons/ai';
import {FiFacebook} from 'react-icons/fi';
import {HiChevronDoubleDown} from 'react-icons/hi';
import {BsBasket} from 'react-icons/bs';
import Link from 'next/link';
import { useSelector } from 'react-redux';





const Navbar = () => {
  const cart = useSelector((state) => state.cart)
  
  const [click, setClick] = useState(true);
  const[mobileScreen, setMobileScreen] = useState(true);
  const [quantity, setQuantity] = useState(0)
  
useEffect(() => {
  if(localStorage.getItem("Orders") === null){
    localStorage.setItem("Orders", "[]");
   }
  const localQuantity = JSON.parse(localStorage.getItem("Orders"))
  setQuantity(localQuantity.length)
}, [cart]);


const sizeDetector = (e) => {
 if(window.innerWidth > 768){
  setMobileScreen(false)
 } else {
  setMobileScreen(true)
 }
}

useEffect(() => {
  window.addEventListener('resize', sizeDetector)
}, [])


const [showNav, setShowNav] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

const controlNavbar = () => {
  if (typeof window !== 'undefined') { 
    if (window.scrollY > lastScrollY) { 
      setShowNav(false); 
    } else {
      setShowNav(true); 
    }

    setLastScrollY(window.scrollY); 
  }
};

useEffect(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', controlNavbar);

    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }
}, [lastScrollY]);
  


  return (<>
     <div className={styles.navbar} style={{top: showNav ? '0' : '-110%'}}>
       
        <div className={styles.container}>
            <div className={styles.chevron_container}>
              <HiChevronDoubleDown className={styles.chevron} onClick={() => setClick(!click)} style={{transform: click ?"rotate(0)":"rotate(180deg)"}}/>
            </div>
          <div className={styles.pagelinks} style={{display: click && mobileScreen ?"none":"flex"}}>
            <Link href={'/'}>
              <div className={styles.pagelink} onClick={() => setClick(!click)}>Order</div>
            </Link>
            <Link href={'/admin'}>
              <div className={styles.pagelink} onClick={() => setClick(!click)}>Admin</div>
            </Link>
          </div>
            <Link href={'/'}>
              <div className={styles.logo_container}>
                <div className={styles.logo} ><Image  className={styles.img} src={'/img/burger-box-logo.webp'} alt='logo' layout='fill'/></div>
              </div>
            </Link>
          <div className={styles.contact} style={{display: click && mobileScreen ?"none":"flex"}}>
            <div className={styles.socials}>
              <Link href={'https://www.facebook.com/BurgerBoxSeaford'}>
                <div className={styles.social} onClick={() => setClick(!click)}> <FiFacebook className={styles.facebook}/> </div>
              </Link>
              <Link href={'https://www.instagram.com/burgerboxseaford/'} >
                <div className={styles.social} onClick={() => setClick(!click)}> <AiOutlineInstagram className={styles.insta}/> </div>
              </Link>
            </div>
            <div className={styles.texts}>
              <div className={styles.text}>Contact Us</div>
              <div className={styles.text}>01323 899221</div>
            </div>
          </div>
       
        </div>
       </div>
       <Link href={'/cart'}>
         <div className={styles.basket} style={{top: !showNav ? "3%" : null}}>
          <p className={styles.quantity}>{quantity}</p>
          <BsBasket className={styles.basket_icon}/>
              </div>
       </Link>
     </>
  )
}

export default Navbar