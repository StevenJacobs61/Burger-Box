import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
 if(!res.socket.server.io){
    const io = new Server(res.socket.server)
    res.socket.server.io = io
 }
 res.socket.server.io.on('connection', socket => {
      socket.on('input-change', msg => {
        socket.broadcast.emit('update-input', msg)
      })
      
      // Take order from client, send it to notify Admin
       
      socket.on("newOrder", (order) => {
        console.log("order recieved");
        res.socket.server.io.emit("getNewOrder", order);
       });
       // Take response data, "Accept or Decline" from Admin to user
    
       socket.on("respond", (data) => {
        console.log("order recieved");
        res.socket.server.io.emit("getResponse", {data});
       });
    
       //Notify Admin that user has paid 
       socket.on("payment", (order) => {
        res.socket.server.io.emit("paid", order);
       });

    })
    res.json(200)
  }




export default SocketHandler
