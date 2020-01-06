// Image Controller?
var imageController = (function() {
  var loadFile = function(file, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      }
    }
    xhr.open('GET', file, true);
    xhr.send();
  }

  // Public methods.
  return {
    getImages: function (file, callback) {
      loadFile(file, callback);
    }
  }
})();

var UIController = (function () {
  var DOMstrings = {
    container: ".container",
    thumbnail: ".main-thumbnail",
    modalId: 'modal',
    modalContentId: 'modal-content',
    modalImageId: 'modal-image'
  };

  var handleUI = function(type) {
    if (type === 'open') {
      document.documentElement.style.setProperty('--blur', 10 + 'px');
    } else {
      document.documentElement.style.setProperty('--blur', 0 + 'px');
    }
  };

  // Public methods.
  return {
    getDOMstrings: function() {
      return DOMstrings;
    },
    getImageData: function(el) {
      return {
        src: el.dataset.src,
        caption: el.alt,
        alt: el.alt,
      }
    },
    setModalImage: function(imgObj) {
      // Get raw image source and add img element to modal.
      let lightboxImage, modalContent;
      lightboxImage = document.createElement('img');
      lightboxImage.id = DOMstrings.modalImageId;
      lightboxImage.src = imgObj.src;
      lightboxImage.alt = imgObj.alt;

      modalContent = document.getElementById(DOMstrings.modalContentId);
      modalContent.appendChild(lightboxImage);
    },
    showModal: function() {
      handleUI('open');
      document.getElementById(DOMstrings.modalId).classList.add('modal-enter');
      setTimeout(() => {
        document.getElementById(DOMstrings.modalId).classList.add('modal-enter-active');
      }, 150);
    },
    closeModal: function() {
      var modalImage;

      handleUI('close');

      document.getElementById(DOMstrings.modalId).classList.remove('modal-enter', 'modal-enter-active');

      modalImage = document.getElementById(DOMstrings.modalImageId);
      if (!modalImage) {
        return;
      }

      modalImage.parentNode.removeChild(modalImage);
    }
  }
})();

// Global App Controller
var controller = (function(imageCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.body.addEventListener('click', function (e) {
      // If we're clicking on a thumbnail open the modal.
      if (e.target.matches(DOM.thumbnail)) {
        ctrlOpenModal(e.target.closest(DOM.thumbnail));
      } else {
        ctrlCloseModal();
      }
    });

    document.body.addEventListener('keydown', function (e) {
      // If it's the escape key close the modal.
      // If if not the enter or space key return.
      if (e.keyCode === 27) {
        ctrlCloseModal();
        return;
      } else if (e.keyCode !== 13 && e.keyCode !== 32 || document.getElementById(DOM.modalImageId)) {
        return;
      } else if (e.target.matches(DOM.thumbnail)) {
        ctrlOpenModal(e.target.closest(DOM.thumbnail));
      }
    });
  };

  var ctrlOpenModal = function(el) {
    // Get image info from clicked thumbnail and
    // populate modal with image data.
    UICtrl.setModalImage(UICtrl.getImageData(el));

    // Show the modal
    UICtrl.showModal();
  }

  var ctrlCloseModal = function() {
    UICtrl.closeModal();
  }

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(imageController, UIController);

controller.init();
