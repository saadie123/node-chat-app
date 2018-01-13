const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname,"../public")
var app = express()
var server = http.createServer(app)
var io = socketIO(server)

io.on('connection',(socket)=>{
    console.log('Connection established')
})

app.use(express.static(publicPath))

const port = process.env.PORT || 5000
server.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})