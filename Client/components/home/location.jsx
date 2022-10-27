import { Router, useRouter } from 'next/router'
import React from 'react'
import styles from "../../styles/home/location.module.css"
import Link from 'next/link'
import {GiHamburger} from 'react-icons/gi';

const Location = () => {
    const router = useRouter();
  return (
      <div className={styles.container}>
                <Link href={"https://www.google.com/maps/place/Burger+Box+Seaford/@50.7724636,0.0999348,15z/data=!4m2!3m1!1s0x0:0xa9799b824a01829c?sa=X&ved=2ahUKEwjr6YOFw-L6AhUHRBoKHRBqAT0Q_BJ6BAhqEAU"}>
            <a target="_blank">
                 <h1 className={styles.hdr}>
           Find our store here
            </h1>
            <div className={styles.icon_container}>
                <GiHamburger className={styles.icon}/>
            </div>
            </a>
    </Link>
        </div>
  )
}

export default Location