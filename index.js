const http = require('http');
const app = require('./src/config/express.conifg');

const { Server } = require("socket.io")



const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Or your frontend origin like "http://localhost:5173"
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {

    io.emit('connected', { id: socket.id })

    socket.on('newMessage', (data) => {
        console.log(data)
        socket.broadcast.emit('messageReceived', data)
    })

    socket.on('rideStatus', (data) => {
        socket.broadcast.emit('rideStatusUpdated', data)
    })

    socket.on('newRides', (data) => {
        socket.broadcast.emit('newRidesReceived', data)
    })

})


const port = process.env.PORT || 9006;
httpServer.listen(port, (err) => {
    if (!err) {
        console.log(`Server is running on port ${port}`)
        console.log("Press Ctrl + C to disconnect")

    }
})

