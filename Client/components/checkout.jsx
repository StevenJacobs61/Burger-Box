import React, { useState, useEffect } from 'react'
import styles from '../styles/checkout.module.css'
import { addQuantity} from "../redux/cartSlice";
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'


const Checkout = () => {

  const router = useRouter();

// Delivery details set by useEffect on input change

const [name,setName] = useState();  
const [street,setStreet] = useState();
const [postcodeOne, setPostcodeOne] = useState('');  
const [postcodeTwo, setPostcodeTwo] = useState('');
const [postcode, setPostcode] = useState();
const [number,setNumber] = useState();
const [email, setEmail] = useState();
const [instructions, setInstructions] = useState();

// Connect to websocket
const [socket, setSocket] = useState()

useEffect(() => {
  setSocket(io("ws://localhost:7500"))
}, [])

// Track delivery or Collection
const [showDeliver, setShowDeliver] = useState(true);

// manage redux cart state to show total
const dispatch = useDispatch()
const cart = useSelector((state) => state.cart)

// update delivery details from inputs
useEffect(() => {
  if (postcodeOne == '25' || postcodeOne == '10' || postcodeOne == '9'){
    setPostcode('BN' + postcodeOne + postcodeTwo)
  } else {
    setPostcode()
  }
}, [postcodeOne])

useEffect(() => {
  if (postcodeOne == '25' || postcodeOne == '10' || postcodeOne == '9'){
    setPostcode('BN' + postcodeOne + postcodeTwo)
  }else {
    setPostcode()
  }
}, [postcodeTwo])

// prepare data for order submission
const handleOrder = ()=>{

// get local order data
  if(localStorage.getItem("Orders") === null){
        localStorage.setItem("Orders", "[]");
       }
      const localData = JSON.parse(localStorage.getItem("Orders"))

      // pass arguements in the json style of the orders schema
 createOrder({details:{
  address: {
    street:street,
    postcode:postcode,
    instructions:instructions
  },
  name:name,
  number:number,
  email:email,
},
orders:localData,
total: cart.total,
delivery:showDeliver,
status: 1,
});
};

// create order to send to mongoose and admin user
const createOrder = async (data) => {
  // Check minium order amount is met £10
  if(data.total < 10){
    alert ('Order total must be over £10')
  } 
  // Check if postcode is within delivery area 
  else if (postcode === undefined && showDeliver){
    alert('We do not deliver to this postcode')
  } else{
  try {
    // Post order to mongoose
      const res = await axios.post("http://localhost:3000/api/orders", data);
      if (res.status === 201) {
        // Alert admins of new order
        socket?.emit("newOrder", res.data);
        // Change quantity for redux state (basket icon)
        dispatch(addQuantity());
        // redirect to order page
        router.push(`/order/${res.data._id}`);
      }
    } catch (err) {
      console.log(err);
      alert ('All fields must be completed correctly');

    }} 
}

return (
    <div className={styles.container}>
        <h1 className={styles.hdr}>Checkout</h1>
        <h3 className={styles.discount}>Discount: 10%</h3>
        <h3 className={styles.total}>£{cart.total < 0 ? 0 : cart.total}</h3>
       <div className={styles.deliver_container}>
         <button className={styles.btn_deliver} 
      
         onClick={() => setShowDeliver(true)} style={{ background: showDeliver ? '#101010' : '#fff', color: showDeliver ? '#fff' : '#101010' }}>
          Deliver
          </button>
         <p className={styles.or}>OR</p>
         <button className={styles.btn_collection} 
         style={{ background: !showDeliver ? '#101010' : '#fff', color: !showDeliver ? '#fff' : '#101010' }}
         onClick={() => setShowDeliver(false)}>Collect</button>
       </div>  
     <div className={styles.details_container}>
        <p className={styles.text}>* all fields except Delivery Instructions are required</p>
          <label htmlFor="" className={styles.details_label}>Full Name:</label>
          <input type="text" id='name' name='name' placeholder='Name ...' className={styles.details_input}
          onChange={(e) => setName(e.target.value)}/>
          {showDeliver && <><label htmlFor="" className={styles.details_label}>Street:</label>
          <input type="text" placeholder='Street ...' id='street' name='street' className={styles.details_input}
          onChange={(e) => setStreet(e.target.value)}/> 
          <label htmlFor="" className={styles.details_label}>Postcode: <p className={styles.postcode_req}>* Must be BN25, BN9 or BN10</p></label>
          <div className={styles.postcode_container}>
            <p className={styles.postcode_text}>BN</p>
            <input type="text" placeholder='9, 10 or 25' id='postcode' name='postcode' className={styles.details_input_postcode}
            onChange={(e) => (setPostcodeOne(e.target.value))}/>
            <input type="text" placeholder='...' id='postcode' name='postcode' className={styles.details_input_postcode}
            onChange={(e) => (setPostcodeTwo(e.target.value))}/>
          </div>
          <label htmlFor="" className={styles.details_label}>Delivery Instrutions:</label>
          <textarea type="text" placeholder='Delivery Instructions...' 
          className={styles.instructions} onChange={(e)=>setInstructions(e.target.value)}/>
          </>}
          <label htmlFor="" className={styles.details_label}>Phone Number:</label>
          <input type="number" placeholder='Phone Number ...' id='number' name='number' className={styles.details_input}
          onChange={(e) => setNumber(e.target.value)}/>
          <label htmlFor="" className={styles.details_label}>Email:</label>
          <input type="email" placeholder='Email ...' id='email' name='email' className={styles.details_input}
          onChange={(e) => setEmail(e.target.value)}/>
        </div>       
        <button className={styles.btn_pay} onClick={handleOrder} >Place Order</button>
        </div>
  )
}

export default Checkout