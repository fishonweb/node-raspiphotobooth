var carousel = document.getElementById('Carousel')

socket.on('chat message', function(pic){
  carousel.innerHTML = carousel.innerHTML + "<br/>" + pic
});
