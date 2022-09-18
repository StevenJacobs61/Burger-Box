const io = require("socket.io")(7500,{
    cors:{
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket) => {
    
    
    
    socket.on("newOrder", (order) => {
        io.emit("getNewOrder", order)
    });

    socket.on("respond", (data) => {
      io.emit("getResponse", {data})
    });
    socket.on("payment", (order) => {
      io.emit("paid", order)
    });

});