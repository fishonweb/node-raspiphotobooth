var socket = io()

var carouselWrapper = document.getElementsByClassName('carousel-wrapper')[0]
var carouselItems = carouselWrapper.getElementsByClassName('carousel-item')
var index = 0
var delay = 2000
var intervalCarousel

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
    slide()
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
  console.log("move carousel")
  var moveTo = index
  if(index === carouselItems.length) {
    console.log("back to start")
    moveTo = 0
  }
  intervalCarousel = setInterval(goToLeft(moveTo), delay)
}
