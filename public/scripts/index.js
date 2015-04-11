var socket = io()

var carouselWrapper = document.getElementsByClassName('carousel-wrapper')[0]
var carouselItems = carouselWrapper.getElementsByClassName('carousel-item')
var index = 0
var delay = 2000
var intervalSlider

socket.on('photobooth', function(pic) {
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
  var translateX = -index * 100 + "%"
  var transform = "translateX(" + translateX +")"
  carouselWrapper.style.transform = transform
}

function slide() {
  intervalSlider = setInterval(gotoLeft(index), delay)
}

if(carouselItems.length != 0) {
  slide()
}
