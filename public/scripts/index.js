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
  if(carouselItems.length != 0) {
    refItem = carouselItems[index]
    refItem = refItem.nextSibling
    carouselWrapper.insertBefore(element, refItem)
    index++
    goToLeft(index)
  } else {
    carouselWrapper.innerHTML = '<div class="carousel-item"><img src="photobooth/' + pic + '.jpg" /></div>'
  }
});

function goToLeft(index) {
    setTimeout(function() {
    var translateX = -index * 100 + "%"
    var style = {
      transform: "translateX(" + translateX +")",
      transition: "transform 1s ease-in-out"
    }
    carouselWrapper.style.transform = style.transform
    carouselWrapper.style.transition = style.transition
    }, delay)
}
