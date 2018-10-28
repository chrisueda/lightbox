// Helper function to get json data.
function XHR(file, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  }
  xhr.open('GET', file, true);
  xhr.send();
}


function processRequest(response) {
  var data = JSON.parse(response);
  var dogData = data["dogs"];

  var modal = document.getElementById('modal-content');

  // for (var key in dogData) {
  //   var lightboxImage = document.createElement('img');
  //   lightboxImage.src = dogData[key].image;
  //   lightboxImage.alt = dogData[key].source
  //   lightboxImage.width = 240;
  //   div.appendChild(lightboxImage)
  // }
  // document.getElementsByTagName('body')[0].appendChild(div);
  prepareThumbnails();
}

// Prepare thumbnails.
function prepareThumbnails() {
  var modal = document.getElementById('modal');
  modal.addEventListener('click', closeModal);

  const thumbnails = document.querySelectorAll('.main-thumbnail');

  thumbnails.forEach(thumbnail =>
    thumbnail.addEventListener("click", openModal)
  )

}

function openModal() {
  // Get raw image source and add img element to modal.
  var src = this.getAttribute('data-src');
  var lightboxImage = document.createElement('img');
  lightboxImage.id = "modal-image";
  lightboxImage.src = src;
  var modalContent = document.getElementById('modal-content');

  // Set the height of the modal based on window.
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var imageHeight =  windowHeight - (windowHeight/5);
  lightboxImage.height = imageHeight;

  var modal = document.getElementById('modal');
  // modal.style.paddingTop = 100+'px';
  // console.log(imageHeight);
  // console.log((windowHeight - imageHeight) / 2);


  modalContent.appendChild(lightboxImage);
  // modalContent.replaceChild(lightboxImage, 'img');

  document.getElementById('modal').style.display = "flex";
  var modalImage = document.getElementById('modal-image');
  // console.log(modalImage.width);
}

// Close the Modal
function closeModal() {
  var element = document.getElementById("modal-image");
  element.parentNode.removeChild(element);

  document.getElementById('modal').style.display = "none";
}


window.onload = function(){
  XHR('data/dogs.json', processRequest);
}
