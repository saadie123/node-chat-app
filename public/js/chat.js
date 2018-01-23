var socket = io()

function scrollToBottom(){
    // Selectors
    var messages = $('#messages')
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()
    
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search)
    socket.emit("join",params)
})
socket.on('disconnect', function () {
    console.log("Disconnected from server")
})
socket.on("err",function(error){
    alert(error.message)
    window.location.href = '/'
})

socket.on("updateUserList", function(users){
    var ol = $('<ol></ol>')
    users.forEach(function(user){
        ol.append("<li>"+user+"</li>")
    })
    $('#users').html(ol)
})

socket.on('newMsg',function(message){
    var formattedTime = moment(message.createdAt).format("h:mm a")
    var template= $('#message-template').html()
    var html=Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })
    $('#messages').append(html)
    scrollToBottom()
})
socket.on('newLocationMsg',function(message){
    var formattedTime = moment(message.createdAt).format("h:mm a")   
    var template= $('#location-message-template').html()
    var html=Mustache.render(template,{
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    })
    $('#messages').append(html)
    scrollToBottom()
})

$('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMsg',{
        from: 'User',
        text: $('[name=message]').val()
    })
    $('[name=message]').val("")
})

$('#send-location').on('click',function(){
   if(!navigator.geolocation){
       return alert("Your browser does not support Geolocation")
   }
   $('#send-location').attr('disabled','disabled').text('Sending Location...')

   navigator.geolocation.getCurrentPosition(function(position){
   $('#send-location').removeAttr('disabled').text('Send Location')       
    socket.emit('createLocationMsg',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    })
   },function(){
   $('#send-location').removeAttr('disabled').text('Send Location')
    alert("Unable to fetch location.");
   })
})


