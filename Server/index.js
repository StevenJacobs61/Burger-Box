
// Websocket
const io = require("socket.io")(7500,{
    cors:{
        origin: "http://localhost:3000"
    }
});

const socketOn = io.on("connection", (socket) => {
    
    // Take order from client, send it to notify Admin
    
    socket.on("newOrder", (order) => {
      console.log("order ceieved");
        io.emit("getNewOrder", order);
    });
    // Take response data, "Accept or Decline" from Admin to user

    socket.on("respond", (data) => {
      io.emit("getResponse", {data});
    });

    //Notify Admin that user has paid 
    socket.on("payment", (order) => {
      io.emit("paid", order);
    });
});






// Stripe

// const express = require('express');
// const app = express();
// require("dotenv").config();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

// app.use(cors());


// app.listen(process.env.PORT || 4000, () => {
// });

// Payment

// app.post("/refund", cors(), async(req, res) => {

//   let {id, amount} = req.body;
//   let list = [];
//   let order = {};

  // get list of checkout sessions
  // try {
  //   const checkouts = await stripe.checkout.sessions.list();
  //   list = checkouts.data;
  // } catch (error) {
  //   console.log(error);
  // };
  // filter list for required session to refund
  // const orderList = list.filter((item) => item.client_reference_id === id)
  
  // respose if not found
  // if (orderList.length <= 0) {
  //   return
  // } else {
  //   // Set order
  //   order = orderList[0]
  // }
  // order Payment of intent to use for refund
  // const pi = order.payment_intent;

  // submit refund with pi
// try{
//   if(amount === 0){
//   const refund = await stripe.refunds.create({
//     payment_intent: pi
//   })
// }else {
//   const refund = await stripe.refunds.create({
//     payment_intent: pi,
//     amount: amount
//   });
// }
//   res.json({
//     message: "Refund successful",
//     success: true,
//   })
// }catch(err){
//  console.log(err);
//  res.json({
//   message: "Refund unsuccessful",
//   success: false
//  });
// };
// });
