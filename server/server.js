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

    socket.emit('newMsg',{
        from: 'Admin',
        text: 'Welcome to the chat app'
    })
    socket.broadcast.emit('newMsg',{
        from: 'Admin',
        text: 'New user joined'
    })
    socket.on('createMsg',(newMsg)=>{
        // console.log('createMsg',newMsg)
        io.emit('newMsg',{
            from:newMsg.from,
            text: newMsg.text,
            createdAt: new Date().getTime()
        })
        // socket.broadcast.emit('newMsg',{
        //         from:newMsg.from,
        //         text: newMsg.text,
        //         createdAt: new Date().getTime()
        //     })
    })
})

app.use(express.static(publicPath))

const port = process.env.PORT || 5000
server.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})