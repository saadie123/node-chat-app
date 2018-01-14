var socket = io()

socket.on('connect', function () {
    document.querySelector('h1').textContent = "Connection established";
    
    socket.emit('createMsg',{
        from: 'Saadie',
        text: 'Mein theek aap sunao?',
        createdAt: Date.now()
    })
})

socket.on('newMsg',function(message){
    console.log('new msg',message)
})

socket.on('disconnect', function () {
    document.querySelector('h1').textContent = "Connection Lost"
})

