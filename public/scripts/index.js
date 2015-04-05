var socket = io();

var carousel = document.getElementById('carousel')

socket.on('photobooth', function(pic){
  carousel.innerHTML = carousel.innerHTML + '<br/>' + '<img src="photobooth/' + pic + '.jpg" />'
});
