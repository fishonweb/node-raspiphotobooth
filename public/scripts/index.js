var socket = io()

var carouselWrapper = document.getElementsByClassName('carousel-wrapper')[0]
var carouselItems = carouselWrapper.getElementsByClassName('carousel-item')
var overlay = document.getElementsByClassName('overlay-contentscale')[0]
var index = 0
var delay = 6000
var intervalCarousel
var moveTo = 0

socket.on('photobooth', function(pic) {
  overlay.classList.remove('open')
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
    //goToLeft(index)
    clearInterval(intervalCarousel)
    intervalCarousel = setInterval(slide, delay)
  } else {
    carouselWrapper.innerHTML = '<div class="carousel-item"><img src="photobooth/' + pic + '.jpg" /></div>'
  }
});

socket.on('start', function(start) {
  console.log("socket start")
  overlay.classList.add('open')
})

function goToLeft(index) {
  console.log("goto ", index)
  var translateX = -index * 100 + "%"
  var transform = "translateX(" + translateX +")"
  carouselWrapper.style.transform = transform
}

function slide() {
  console.log("move carousel", carouselItems.length, index)
  var length = carouselItems.length
  moveTo++
  if(moveTo > length) {
      moveTo = 0
  }
  goToLeft(moveTo)
}
