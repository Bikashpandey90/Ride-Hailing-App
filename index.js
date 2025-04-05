const http = require('http');
const app = require('./src/config/express.conifg');


const httpServer = http.createServer(app)


const port = process.env.PORT || 9006;
httpServer.listen(port, '192.168.1.76', (err) => {
    if (!err) {
        console.log(`Server is running on port ${port}`)
        console.log("Press Ctrl + C to disconnect")

    }
})

