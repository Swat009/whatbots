
document.querySelector('#sign_out').addEventListener('click', () => {
  chrome.runtime.sendMessage({ logOutUser: true }, function(response) {
    // Handle the received user data response here
    window.location.href = './popup.html';
  });
});

window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})


var toggleSwitch = document.getElementById('toggleSwitch');

// Add an event listener for the toggle switch change event
toggleSwitch.addEventListener('change', function(event) {
  // Get the current state of the toggle switch
  var googleSearchEnabled = event.target.checked;
  console.log('#####Handle Toggle########');
  console.log(googleSearchEnabled);

  // Send a message to the background script to enable/disable the Google search
  chrome.runtime.sendMessage({ googleSearchEnabled: googleSearchEnabled }, function(response) {
    // Handle the response from the background script if needed
    // console.log('Google search enabled:', response.googleSearchEnabled);
  });
});

var gitToggleSwitch = document.getElementById('gitToggleSwitch');
gitToggleSwitch.addEventListener('change', function(event) {
  // Get the current state of the toggle switch
  var githubEnabled = event.target.checked;
  console.log('#####Handle git Toggle########');
  console.log(githubEnabled);

  // Send a message to the background script to enable/disable the Google search
  chrome.runtime.sendMessage({ githubEnabled: githubEnabled }, function(response) {
    // Handle the response from the background script if needed
    // console.log('Google search enabled:', response.googleSearchEnabled);
  });
});

function displayUserData(userData) {
  document.getElementById("username").textContent = userData.username;
  // Set profile image source
  // const profileImage = document.querySelector(".profile img");
  // profileImage.src = userData.profileImageUrl;
  var imgURL = chrome.runtime.getURL("src/icons/profile.svg");
  document.getElementById("profileimage").src = imgURL;
  document.getElementById("username").textContent = 'Hi, '+userData.name;
  // Set credit left
  document.getElementById("credit").textContent = userData.credits;
  // Set total queries
  document.getElementById("githubexplain").textContent = userData.git_code_explain;
  document.getElementById("queried").textContent = userData.queries_done;
  document.getElementById("googlequeried").textContent = userData.google_queries;
  document.getElementById("githubexplain").textContent = userData.git_code_explain;
  document.getElementById("chatqueried").textContent = userData.chat_queries;
  document.getElementById("credit-form-link").href = 'https://getwhatnot.co/payment?email='+userData.email;
  var googleSearchEnabled = userData.auto_google_search;
  toggleSwitch.checked = googleSearchEnabled;
  var autoGithubExplainEnabled = userData.auto_github_explain;
  gitToggleSwitch.checked = autoGithubExplainEnabled;

}

chrome.runtime.sendMessage({ getUserData: true }, function(response) {
  // Handle the received user data response here
  console.log('Received user data:', response);
  if(response){
    displayUserData(response);
  }
  else{
   // window.location.href = './popup.html';
  }
  // Process the user data as needed
});







