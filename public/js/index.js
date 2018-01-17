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
socket.on('newLocationMsg',function(message){
$('#messages').append(`<li>${message.from}: <a href='${message.url}' target='_blank'>My current location</a></li>`)
})

$('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMsg',{
        from: 'User',
        text: $('[name=message]').val()
    })
})

$('#send-location').on('click',function(){
   if(!navigator.geolocation){
       return alert("Your browser does not support Geolocation")
   } 
   navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMsg',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    })
   },function(){
    alert("Unable to fetch location.");
   })
})


