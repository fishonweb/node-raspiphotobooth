var socket = io();

var carousel = document.getElementById('carousel')

socket.on('chat message', function(pic){
  carousel.innerHTML = carousel.innerHTML + "<br/>" + pic
});
