var title = document.getElementById('title');
var picNumber = document.getElementById('picNumber');
var time = document.getElementById('time');
var submitBtn = document.getElementById('submit');
var collapseBtn = document.querySelectorAll('.button-collapse');

//enable sideNav
 $(".button-collapse").sideNav()

function getParam (appParam) {
    if (appParam != null) {
        title.value = appParam.title;
        picNumber.value = appParam.picNumber;
        time.value = appParam.time;
    } else {
        title.value = null;
        picNumber.value = null;
        time.value = null;
    }
}

function get(url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url + '?title=' + title.value + '&picNumber=' + picNumber.value + '&time=' + time.value);

        req.onload = function() {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req.response);
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
            }
        };

        // Handle network errors
        req.onerror = function() {
            reject(Error("Network Error"));
        };

        // Make the request
        req.send();
    });
}

function submitParams(evt) {
    // evt.preventDefault();
    get('/api/params')
        .then(function(response) {
            Materialize.toast('Parameters saved !', 4000, 'green lighten-2');
            var params = JSON.parse(response);
            getParam(params);
        })
        .catch(function(error) {
            Materialize.toast('An error occured !', 4000, 'red lighten-2');
        })
}