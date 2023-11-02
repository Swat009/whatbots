document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the close button element
    var closeButton = document.getElementById('close-button');
  
    // Add click event listener to the close button
    closeButton.addEventListener('click', function() {
      // Close the popup window
      chrome.windows.getCurrent(function(window) {
        chrome.windows.remove(window.id);
      });
    });
  });
  