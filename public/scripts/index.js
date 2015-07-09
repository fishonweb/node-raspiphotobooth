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
  console.log("photobooth")
  var timer = document.querySelector(".timer")
  timer.classList.add("timer--done")
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
    socket.emit('picAgain', true)
  }, delay)
  if(carouselItems.length != 0) {
    while (carouselWrapper.firstChild) {
      carouselWrapper.removeChild(carouselWrapper.firstChild);
    }
    carouselWrapper.innerHTML = picHTML
  } else {
    carouselWrapper.innerHTML = picHTML
  }
});

socket.on("random", function(randompics) {
  console.log("random")
  for (var i = 0; i < randompics.length; i++) {
    if(carouselItems.length != 0) {
      var element = document.createElement('div')
      element.className = "carousel-item"
      element.innerHTML = '<img src="photobooth/' + randompics[i] + '.jpg" />'

      var length = carouselItems.length
      refItem = carouselItems[index]
      carouselWrapper.insertBefore(element, refItem)
      index++
      //goToLeft(index)
      clearInterval(intervalCarousel)
      intervalCarousel = setInterval(slide, delay)
    }
  }
})

socket.on('start', function(start) {
  // console.log("socket start")
  loader.classList.remove("hide")
  preview.classList.add("hide")
  container.classList.add("overlay-open")
  overlay.classList.add("open")
})

socket.on('timer', function(timer) {
  var el = document.querySelector(".timer")
  el.classList.remove("timer--done")
  radialTimer(document, timer);
})

function goToLeft(index) {
  // console.log("goto ", index)
  var translateX = -index * 100 + "%"
  var transform = "translateX(" + translateX +")"
  carouselWrapper.style.transform = transform
  carouselWrapper.style.WebkitTransform = transform
}

function slide() {
  // console.log("move carousel", carouselItems.length, index)
  var length = carouselItems.length -1
  moveTo++
  if(moveTo > length) {
      moveTo = 0
  }
  goToLeft(moveTo)
}

// radialtimer
// rAF - https://raw.githubusercontent.com/darius/requestAnimationFrame/master/requestAnimationFrame.min.js
if (!Date.now) Date.now = function() {
  return (new Date).getTime()
};
(function() {
  var n = ["webkit", "moz"];
  for (var e = 0; e < n.length && !window.requestAnimationFrame; ++e) {
    var i = n[e];
    window.requestAnimationFrame = window[i + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[i + "CancelAnimationFrame"] || window[i + "CancelRequestAnimationFrame"]
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var a = 0;
    window.requestAnimationFrame = function(n) {
      var e = Date.now();
      var i = Math.max(a + 16, e);
      return setTimeout(function() {
        n(a = i)
      }, i - e)
    };
    window.cancelAnimationFrame = clearTimeout
  }
})();
// It's the final countdown!
function radialTimer (element, timeout) {
    'use strict';
    var totalTime = timeout / 1000, //timeout is in ms and I need s now
        currentTime = totalTime,
        percentTime = null,
        timerId = null,
        timerText = element.querySelector('.text'),
        timerCircle = element.querySelector('.circle');

    timerId = function() {
        if (currentTime === -1) { return; }
        timerText.textContent = currentTime;
        percentTime = Math.round((currentTime/totalTime) * 100);
        timerCircle.style.strokeDashoffset = percentTime - 100;

        setTimeout(function() {
          	timerText.textContent = currentTime;
            currentTime -= 1;
            requestAnimationFrame(timerId);
        }, 1000);
    };
    timerId();
};
