var socket = io()

socket.on('connect', function () {
    document.querySelector('h1').textContent = "Welcome to the chat app";
})
socket.on('disconnect', function () {
    document.querySelector('h1').textContent = "Disconnected from server"
})

socket.on('newMsg',function(message){
    console.log('new msg',message)
    $('#messages').append('<li>'+message.from+": "+message.text+"</li>")
})

$('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMsg',{
        from: 'User',
        text: $('[name=message]').val()
    })
})


