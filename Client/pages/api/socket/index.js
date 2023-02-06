import socketio from "socket.io"

const io = socketio(7500)

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