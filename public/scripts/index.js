var socket = io();

var carouselWrapper = document.getElementsByClassName('carousel-wrapper')[0]
var carouselItems = carouselWrapper.getElementsByClassName('carousel-item')
var index = 0;
var delay = 2000;

socket.on('photobooth', function(pic){
  var refItem
  var element = document.createElement('div')
  element.className = "carousel-item"
  element.innerHTML = '<img src="photobooth/' + pic + '.jpg" />'
  if(carouselItems === 0) {
    refItem = carouselItems[index]
    refItem = refItem.nextSibling
    carouselWrapper.insertBefore(element, refItem)
  } else {
    carouselWrapper.innerHTML = '<div class="carousel-item"><img src="photobooth/' + pic + '.jpg" /></div>'
  }
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
