var socket = io()

var carouselWrapper = document.getElementsByClassName('carousel-wrapper')[0]
var carouselItems = carouselWrapper.getElementsByClassName('carousel-item')
var index = 0
var delay = 6000
var intervalCarousel
var moveTo

socket.on('photobooth', function(pic) {
  var refItem
  var element = document.createElement('div')
  element.className = "carousel-item"
  element.innerHTML = '<img src="photobooth/' + pic + '.jpg" />'
  if(carouselItems.length != 0) {
    var length = carouselItems.length
    refItem = carouselItems[index]
    refItem = refItem.nextSibling
    carouselWrapper.insertBefore(element, refItem)
    index++
    goToLeft(index)
    intervalCarousel = setInterval(slide, delay)
  } else {
    carouselWrapper.innerHTML = '<div class="carousel-item"><img src="photobooth/' + pic + '.jpg" /></div>'
  }
});

function goToLeft(index) {
  console.log("goto ", index)
  var translateX = -index * 100 + "%"
  var transform = "translateX(" + translateX +")"
  carouselWrapper.style.transform = transform
}

function slide() {
  console.log("move carousel", carouselItems.length, index)
  var length = carouselItems.length - 1
  moveTo++
  if(moveTo > length) {
      moveTo = 0
  }
  goToLeft(moveTo)
}
