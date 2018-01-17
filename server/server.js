const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMsg} = require('./utils/message')
const {generateLocationMsg} = require('./utils/message')
const publicPath = path.join(__dirname,"../public")
var app = express()
var server = http.createServer(app)
var io = socketIO(server)

io.on('connection',(socket)=>{
    console.log('Connection established')

    socket.emit('newMsg',generateMsg('Admin','Welcome to the chat app'))
    socket.broadcast.emit('newMsg',generateMsg('Admin','New user joined'))

    socket.on('createMsg',(newMsg)=>{
        io.emit('newMsg',generateMsg(newMsg.from,newMsg.text))
    })

    socket.on('createLocationMsg',(coords)=>{
        io.emit('newLocationMsg',generateLocationMsg('User',coords.latitude,coords.longitude))
    })
})

app.use(express.static(publicPath))

const port = process.env.PORT || 5000
server.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})