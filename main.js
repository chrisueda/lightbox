// Helper function to get json data.
function XHR(file, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  }
  xhr.open('GET', file, true);
  xhr.send();
}

// Add additional images to the page.
function addImages(response) {
  // Add content to page.
  let data = JSON.parse(response);
  data.dogs.forEach((e)=>{
    let div = document.createElement('div');
    div.className = "thumbnail-container";
    let img = document.createElement('img');
    img.src = e.imageThumbnail;
    img.alt = e.source;
    img.width = 240;
    img.dataset.src = e.imageRaw;
    img.alt = e.alt || '';
    img.dataset.breed = e.breed || '';
    img.dataset.name = e.name || '';
    img.className = 'main-thumbnail';
    img.addEventListener("click", openModal);
    div.appendChild(img)
    document.getElementsByTagName('main')[0].appendChild(div);
  })
}

function openModal(e) {
  // Store the image we clicked on so we can return to it when the modal is closed.
  lastClicked = e.target;

  // If there's a modal image already present don't do anything.
  const modalImage = document.getElementById("modal-image");
  if (modalImage) {
    return;
  }

  // Track key presses.
  if (e.type == 'keydown') {
    // the it's not the enter key or the space key pressed.
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }
  }

  // Blur other images in background.
  document.documentElement.style.setProperty('--blur', 10 + 'px');

  // Get raw image source and add img element to modal.
  let lightboxImage = document.createElement('img');
  lightboxImage.id = "modal-image";
  let src = this.getAttribute('data-src');
  lightboxImage.src = src;
  lightboxImage.alt = this.getAttribute('alt');

  let modalContent = document.getElementById('modal-content');
  modalContent.appendChild(lightboxImage);

  // Show the modal
  document.getElementById('modal').classList.add('modal-enter');
  setTimeout(() => {
    document.getElementById('modal').classList.add('modal-enter-active');
  }, 150);

  // Shift focus to close button.
  document.getElementsByClassName('close')[0].focus();
}

// Close the Modal
function closeModal(e) {
  document.documentElement.style.setProperty('--blur', 0 + 'px');

  document.getElementById('modal').classList.remove('modal-enter', 'modal-enter-active');

  const modalImage = document.getElementById("modal-image");
  if (!modalImage) {
    return;
  }

  modalImage.parentNode.removeChild(modalImage);

  lastClicked.focus();
}

function intersectionCallback(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      XHR('data/dogs.json', addImages);
    }
  });
}

window.onload = function () {
  let lastClicked;
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: [1]
  };

  const footerObserver = new IntersectionObserver(intersectionCallback, observerOptions);
  const target = document.querySelector('#global-footer');
  footerObserver.observe(target);

  // Add handlers for click and keydown events.
  const modal = document.getElementById('modal');
  modal.addEventListener('click', closeModal);

  const close = document.getElementsByClassName('close');
  close[0].addEventListener('keydown', closeModal);

  const thumbnails = document.querySelectorAll('.main-thumbnail');

  thumbnails.forEach(function (thumbnail) {
    thumbnail.addEventListener("click", openModal);
    thumbnail.addEventListener("keydown", openModal);
  });

  // If the esc key is pressed, close the modal.
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 27) {
      closeModal();
    }
  });
}
