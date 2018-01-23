const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {Users} = require('./utils/users')
const {isRealString} = require('./utils/validation')
const {generateMsg} = require('./utils/message')
const {generateLocationMsg} = require('./utils/message')
const publicPath = path.join(__dirname,"../public")
var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

app.use(express.static(publicPath))

io.on('connection',(socket)=>{
    console.log('Connection established')
    socket.on("join",(params)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
           return socket.emit("err",{message:"Name and Room name are required"})
        }

        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room)

        io.to(params.room).emit("updateUserList",users.getUserList(params.room))

        socket.emit('newMsg',generateMsg('Admin','Welcome to the chat app'))
        socket.broadcast.to(params.room).emit('newMsg',generateMsg('Admin',`${params.name} has joined`))
    })


    socket.on('createMsg',(newMsg)=>{
        io.emit('newMsg',generateMsg(newMsg.from,newMsg.text))
    })

    socket.on('createLocationMsg',(coords)=>{
        io.emit('newLocationMsg',generateLocationMsg('User',coords.latitude,coords.longitude))
    })

    socket.on("disconnect",()=>{
        var user = users.removeUser(socket.id)
        if(user){
            io.to(user.room).emit("updateUserList",users.getUserList(user.room))
            io.to(user.room).emit("newMsg", generateMsg("Admin",`${user.name} has left`))
        }
    })
})


const port = process.env.PORT || 5000
server.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})