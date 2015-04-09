var socket = io();

var carouselWrapper = document.getElementsByClassName('carousel-wrapper')[0]
var carouselItems = carouselWrapper.getElementsByClassName('carousel-item')
var index = 0;
var delay = 2000;

socket.on('photobooth', function(pic){
  var refItem = carouselItems[carouselItems.length]
  var element = document.createElement('div')
  element.className = "carousel-item"
  element.innerHTML = '<img src="photobooth/' + pic + '.jpg" />'
  carouselWrapper.insertBefore(element, refItem.nextSibling)
  index++
});



function goToLeft(index) {
  if (index > 1) {
    setTimeout(function() {
    var translateX = -index * 100 + "%"
    var style = {
      transform: "translateX(" + translateX +")",
      transition: "transform .3s ease-in-out"
    }
    carouselWrapper.style = style
    }, delay)
  }
}
