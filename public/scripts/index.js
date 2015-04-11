var socket = io()

var carouselWrapper = document.getElementsByClassName('carousel-wrapper')[0]
var carouselItems = carouselWrapper.getElementsByClassName('carousel-item')
var overlay = document.getElementsByClassName('overlay-contentscale')[0]
var loader = overlay.getElementsByClassName('preloader')[0]
var preview = overlay.getElementsByClassName('carousel-item')[0]
var container = document.getElementsByClassName('container')[0]
var index = 0
var delay = 6000
var intervalCarousel
var moveTo = 0

socket.on('photobooth', function(pic) {
  var refItem
  var element = document.createElement('div')
  preview.innerHTML = '<img src="photobooth/' + pic + '.jpg" />'
  preview.classList.remove("hide")
  var picHTML = '<div class="carousel-item"><img src="photobooth/' + pic + '.jpg" /></div>'
  element.className = "carousel-item"
  element.innerHTML = '<img src="photobooth/' + pic + '.jpg" />'
  overlay.insertBefore(preview, loader)
  loader.classList.add("hide")
  setTimeout(function() {
    overlay.classList.remove("open")
    container.classList.remove("overlay-open")
  }, 6000)
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
    carouselWrapper.innerHTML = picHTML
  }
});

socket.on('start', function(start) {
  console.log("socket start")
  loader.classList.remove("hide")
  preview.classList.add("hide")
  container.classList.add("overlay-open")
  overlay.classList.add("open")
})

function goToLeft(index) {
  console.log("goto ", index)
  var translateX = -index * 100 + "%"
  var transform = "translateX(" + translateX +")"
  carouselWrapper.style.transform = transform
  carouselWrapper.style.WebkitTransform = transform
}

function slide() {
  console.log("move carousel", carouselItems.length, index)
  var length = carouselItems.length -1
  moveTo++
  if(moveTo > length) {
      moveTo = 0
  }
  goToLeft(moveTo)
}
