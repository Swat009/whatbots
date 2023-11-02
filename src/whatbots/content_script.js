//Chat Modal Code

let gpt_messages = []

function attachIcon() {
  var icon = document.createElement('div');
  icon.style.position = 'fixed';
  icon.style.right = '10px';
  icon.style.top = '50%';
  icon.style.transform = 'translateY(-50%)';
  icon.style.width = '32px';
  icon.style.height = '32px';
  icon.style.zIndex = '9999';
  icon.style.backgroundImage = `url(${chrome.runtime.getURL('./src/icons/48.png')})`;
  icon.style.backgroundRepeat = 'no-repeat';
  icon.style.backgroundPosition = 'center';
  icon.style.backgroundSize = 'contain';
  icon.style.cursor = 'pointer';
  icon.setAttribute('id', 'whatnot-icon');
  // Add event listeners for hover effect
  icon.addEventListener('mouseenter', showTooltip);
  icon.addEventListener('mouseleave', hideTooltip);
  // Create the close icon
  var closeIcon = document.createElement('div');
  closeIcon.style.position = 'absolute';
  closeIcon.style.top = '-10px';
  closeIcon.style.right = '-10px';
  closeIcon.style.width = '15px';
  closeIcon.style.height = '15px';
  closeIcon.style.backgroundImage = `url(${chrome.runtime.getURL('./src/icons/close.png')})`;
  closeIcon.style.backgroundRepeat = 'no-repeat';
  closeIcon.style.backgroundPosition = 'center';
  closeIcon.style.backgroundSize = 'contain';
  closeIcon.style.cursor = 'pointer';
  closeIcon.style.opacity = '0'; 
  // Add event listeners to show/hide the close icon on hover
  icon.addEventListener('mouseenter', showCloseIcon);
  icon.addEventListener('mouseleave', hideCloseIcon);
  // Add event listener to close the extension
  closeIcon.addEventListener('click', hideExtension);
  icon.appendChild(closeIcon);
  icon.addEventListener('click', openChatScreenModal);
  document.body.appendChild(icon);


  
}

function handleOpenSettings(){
  chrome.runtime.sendMessage({ getSettings: true })
}

// Example questions data (you can customize this list as per your needs)
var exampleQuestions = [
  "How to send Apache logs to New Relic?",
  "How to optimize performance of React app",
  "How tall is Mount Everest?",
  "Translate 'hello' to Spanish.",
  // Add more example questions here...
];

function handleExampleQuestionClick(question){

  var questionElement = document.getElementById('question-input');
  questionElement.value = question;

  handleQuestionSubmission()
}



var chatModal = null;
function openChatScreenModal() {
  // Code to open the chat screen modal
    // Create the chat modal element
  if (chatModal) {
    chatModal.style.display = 'block'; // Show existing chat modal
    return;
  }
  chatModal = document.createElement('div');
  chatModal.setAttribute('id', 'chat-modal');
  // Create heading container
  var headingContainer = document.createElement("div");
  headingContainer.className = "heading-container";

  //profile icon
  // Create the profile image icon
  var settingsIcon = document.createElement("img");
  settingsIcon.src = chrome.runtime.getURL('src/icons/settings.png');
  settingsIcon.alt = "Profile Image";
  settingsIcon.style.width = '25px';
  settingsIcon.style.height = '25px';
  settingsIcon.style.marginRight = '5px';
  settingsIcon.style.backgroundSize = 'cover';
  settingsIcon.style.cursor = 'pointer';
  settingsIcon.setAttribute('id', 'chat-settings');
  settingsIcon.addEventListener('click', handleOpenSettings);


  var closeButton = document.createElement('button');
  closeButton.setAttribute('id', 'close-button');
  closeButton.textContent = '×'; // Add the close icon/text
  
  // Event listener to handle close button click
  closeButton.addEventListener('click', closeChatScreenModal);
  
  //headingContainer.appendChild(closeButton);

  // Create brand logo container
  var logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  // Create brand logo image
  var logoImage = document.createElement("img");
  logoImage.src = chrome.runtime.getURL('./src/icons/chat-logo-icon.png');
  logoImage.alt = "WhatBots Logo";
  logoImage.setAttribute('id', 'logo-image');
  // Create brand logo text
  // var logoText = document.createElement("span");
  // logoText.className = "logo-text";
  // logoText.innerHTML = "WhatBots";
   // Append logo container to heading container
  headingContainer.appendChild(logoContainer);
  // Append logo image and text to logo container
  logoContainer.appendChild(logoImage);
  //headingContainer.appendChild(profileImageIcon);

  // Create div to hold profile image and close button
  var settingsCloseDiv = document.createElement('div');
  settingsCloseDiv.style.display = 'flex';
  settingsCloseDiv.style.alignItems = 'center';
  settingsCloseDiv.appendChild(settingsIcon);
  settingsCloseDiv.appendChild(closeButton);
  headingContainer.appendChild(settingsCloseDiv);
  //logoContainer.appendChild(logoText);
  chatModal.appendChild(headingContainer);
  // Create the close button
 
 
  //create image area and image
// Create the static image element
  var staticImage = document.createElement('img');
  staticImage.src = chrome.runtime.getURL('./src/icons/template.png'); // Set the path to your static image
  staticImage.alt = 'Static Image';
  staticImage.setAttribute('class', 'static-image'); // Set the class for styling
  
  // Create the container div for the static image
  var staticImageContainer = document.createElement('div');
  staticImageContainer.setAttribute('class', 'static-image-container');
  staticImageContainer.appendChild(staticImage);

  // Create the message area
  var messageArea = document.createElement('div');
  messageArea.setAttribute('id', 'message-area');

   // Create a parent div for the example questions
  var exampleQuestionsContainer = document.createElement('div');
  exampleQuestionsContainer.setAttribute('id', 'example-questions-container');
  // Create a heading for the example questions list
  var exampleQuestionsHeading = document.createElement('h3');
  exampleQuestionsHeading.textContent = 'Example Questions You May Ask';
  exampleQuestionsContainer.appendChild(exampleQuestionsHeading);

  var exampleQuestionsList = document.createElement('ul');
  exampleQuestionsList.setAttribute('id', 'example-questions-list');
  
  // Populate the example questions list
  exampleQuestions.forEach((question) => {
    var listItem = document.createElement('li');
    // Create a circular div for each list item
    var circularDiv = document.createElement('div');
    circularDiv.setAttribute('class', 'circular-div');
    circularDiv.textContent = question; // You can add any content/icon you want inside the circular div
    circularDiv.addEventListener
    
    listItem.appendChild(circularDiv);
    listItem.addEventListener("click", function () {
      handleExampleQuestionClick(question);
    });
    // listItem.textContent = question;
    exampleQuestionsList.appendChild(listItem);
  });

  exampleQuestionsContainer.appendChild(exampleQuestionsList);
  messageArea.appendChild(exampleQuestionsContainer);

  // messageArea.insertBefore(exampleQuestionsList, messageArea.firstChild);
  // Show/hide the example questions container based on the presence of chat messages
  function toggleExampleQuestionsContainer() {
    exampleQuestionsContainer.style.display = messageArea.children.length === 1 ? 'block' : 'none';
  }

  // Call the toggleExampleQuestionsContainer() initially and whenever messages are added/removed
  toggleExampleQuestionsContainer();
  // Observe changes in the message area using a MutationObserver
  var messageAreaObserver = new MutationObserver(toggleExampleQuestionsContainer);
  messageAreaObserver.observe(messageArea, { childList: true });


  var questionContainer = document.createElement('div');
  questionContainer.style.display = 'flex'; // Use flexbox to display elements in the same line
  questionContainer.style.alignItems = 'center'; 
  questionContainer.setAttribute('id', 'question-input-submit-container');

  // Create the question input
  var questionInput = document.createElement('textarea');
  questionInput.setAttribute('type', 'text');
  questionInput.setAttribute('id', 'question-input');
  questionInput.setAttribute('placeholder', 'Ask a question...e.g Explain AI to a kid ');
  // Add event listener for the Enter key press on the question input field
  questionInput.addEventListener('keypress', handleKeyPress);
  

  // Create the submit button as an icon
  var submitButtonIcon = document.createElement('i');
  submitButtonIcon.setAttribute('class', 'submit-icon');
  submitButtonIcon.addEventListener('click', handleQuestionSubmission);
  submitButtonIcon.style.width = '15px';
  submitButtonIcon.style.height = '14px';
  submitButtonIcon.style.backgroundImage = `url(${chrome.runtime.getURL('./src/icons/submit.png')})`
  submitButtonIcon.style.backgroundSize = 'cover';
  submitButtonIcon.style.cursor = 'pointer';
  // submitButtonIcon.textContent = '▶'; // Replace with your desired arrow icon code or use an icon library


  questionContainer.appendChild(questionInput);
  questionContainer.appendChild(submitButtonIcon);

  // Append the elements to the chat modal
  chatModal.appendChild(staticImageContainer);
  chatModal.appendChild(messageArea);
  // chatModal.appendChild(questionInput);
  // chatModal.appendChild(submitButton);
  chatModal.appendChild(questionContainer);

  // chatModal.appendChild(closeButton);
  // Append the chat modal to the page
  document.body.appendChild(chatModal);
  // Event listener to handle user question submission
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'openChatModal') {
    // Call the function to open the chat screen modal
    openChatScreenModal();
  }
});

function closeChatScreenModal() {
  if (chatModal) {
  chatModal.style.display = 'none';
  // var closeButton = document.getElementById('close-button');
  // closeButton.removeEventListener('click', closeChatScreenModal);
  }
}

function displayTextContent(content, replyMessage) {
 
  console.log(replyMessage);
  var spanContent = document.createElement('span');
  spanContent.textContent = content;
  replyMessage.appendChild(spanContent);

}

function displayCodeBlock(content, replyMessage) {
  var codeBlock = document.createElement('code');
  codeBlock.textContent = content;
  var preElement = document.createElement('pre');
  preElement.appendChild(codeBlock);
  replyMessage.appendChild(preElement);
}


function getStreamReplyFromAPI(question,source, accessToken) {
  gpt_messages.push({"role": "user", "content": question})
  fetch('open_ai_backend_link', {
    method: 'POST',
    body: JSON.stringify({  messages: gpt_messages, bot:'gpt-3'}),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+accessToken
    },
  })
  .then(response => {
    if (response.ok) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let displaySource = null;
      let codeBlock = '';
      let completeChunk = '';
      let isCodeBlock = false;
      if(source=='google'){
      
        resultBox = showKnowledge(question,'');
      }
      if(source=='git'){
      
        resultBox = showResultBox('Code Explanation','');
      }
      else if(source=='chat'){
        messageArea = document.getElementById('message-area');
        var replyMessage = document.createElement('div');
        replyMessage.classList.add('message');
        replyMessage.classList.add('bot');
        replyMessage.textContent = 'Bot: '
        messageArea.appendChild(replyMessage);
        messageArea.scrollTop = messageArea.scrollHeight;
      }
      chrome.runtime.sendMessage({ decreaseCredit: true, source:source });
      // Read chunks of the streaming response
      function readChunk() {
        reader.read().then(({ done, value }) => {
          if (done) {
            // Streaming completed
            gpt_messages.push({"role": "assistant", "content": completeChunk})
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          completeChunk += chunk
  
          // Update the result content
          if(isCodeBlock){
            codeBlock += chunk;
            const closingQuotesIndex = codeBlock.indexOf('```');
            if (closingQuotesIndex >= 0) {
              // Append the remaining part until the closing triple quotes
              codeBlock = codeBlock.substring(0, closingQuotesIndex);
              displaySource = replyMessage
              if(source=="google" || source=="git"){
                displaySource = resultBox;
              }
              displayCodeBlock(codeBlock, displaySource);
             // displayCodeBlock(codeBlock, replyMessage);

              // Append the remaining part after the closing triple quotes
              const remainingPart = codeBlock.substring(closingQuotesIndex + 3);
              if (remainingPart.trim().length > 0) {
                displaySource = replyMessage
                if(source=="google" || source=="git"){
                  displaySource = resultBox;
                }
                displayTextContent(remainingPart, displaySource);
              }
                  // Reset the code block variables
              codeBlock = '';
              isCodeBlock = false;
            }
          
          }else{
            if (chunk.includes('```') || chunk.includes('``') ) {
              const parts = chunk.split('```');
              let i = 0;
              // Process the parts, alternating between code and text
              for (const part of parts) {
                if (i % 2 === 0) {
                  // Text content
                  displaySource = replyMessage
                  if(source=="google" || source=="git"){
                    displaySource = resultBox;
                  }
                  displayTextContent(part, displaySource);
                } else {
                  // Code block
                  codeBlock += part;
                  isCodeBlock = true;
                }
                i++;
              }
            }
            else{
             
              displaySource = replyMessage
              if(source=="google" || source=="git"){
                displaySource = resultBox;
              }
              displayTextContent(chunk, displaySource);
              
            }
          }
          readChunk();
        });
      }
      // Start reading the streaming response
      readChunk();
    } else {
      if(source=="google"){
        resultBox = showKnowledge(question,'Error '+response.status+' '+response.statusText);
  
      }
      else if(source=="git"){
        resultBox = showResultBox('Code Explanation','Error '+response.status+' '+response.statusText);
      }
      else{
        messageArea = document.getElementById('message-area');
        var replyMessage = document.createElement('div');
        replyMessage.classList.add('message');
        messageArea.appendChild(replyMessage);
        displayTextContent('Bot: Error '+response.status+' '+response.statusText, replyMessage);
  
      }
    }
  })
  .catch(error => {
    if(source=="google"){
      resultBox = showKnowledge(question,error);

    }
    else{
      messageArea = document.getElementById('message-area');
      var replyMessage = document.createElement('div');
      replyMessage.classList.add('message');
      messageArea.appendChild(replyMessage);
      displayTextContent('Bot: '+error, replyMessage);

    }
  });
}

function handleQuestionSubmission() {
  var question = document.getElementById('question-input').value;
  var questionInput = document.getElementById('question-input');
   // Clear the input field
  questionInput.value = '';
  // Code to send user question to the GPT API and receive the reply
  var messageArea = document.getElementById('message-area');

    var messageContainer = document.createElement('div'); // Create a container for the message
    messageContainer.classList.add('message-container');
   var message = document.createElement('div');
   message.classList.add('message'); // Apply CSS class
   message.classList.add('user');
   message.textContent = 'You: ' + question;
   messageContainer.appendChild(message);
   messageArea.appendChild(messageContainer);
   messageArea.scrollTop = messageArea.scrollHeight;
   chrome.runtime.sendMessage({ getCreditData: true }, function(response) {
    // Handle the received user data response here
    console.log('Received credit user data:', response);
    if(response){
      credits = response.credits;
      accessToken = response.accessToken;
      if(credits>0){
        getStreamReplyFromAPI(question,"chat", accessToken)
      }
      else{
        // Display a picture in the chat area if no credits are left
        var replyMessage = document.createElement('div');
        replyMessage.classList.add('message'); // Apply CSS class
        replyMessage.textContent = 'Bot: ' + "You do not have credits left :( It's been fun offering WhatBots for free but to cover the costs of inference we need to add a small usage based credit. This way we can keep building it.";
        var creditElement = document.createElement('a');
        creditElement.href = 'payment_link';
        creditElement.style.backgroundColor = '#5E72D6';
        creditElement.style.color = 'white';
        creditElement.style.padding = '5px 10px 5px 10px';
        creditElement.style.borderRadius = '5px';
        creditElement.innerHTML = 'Get Credits';
        creditElement.target = '_blank';
        // Append the image to the message area
        var messageArea = document.getElementById('message-area');
        // messageArea.removeChild(typingIndicator);
        messageArea.appendChild(replyMessage);
        messageArea.appendChild(creditElement);
        // Scroll the message area to the bottom to show the image
        messageArea.scrollTop = messageArea.scrollHeight;
        console.log('#######Log out######')
      }
    }
    else{
       // Display a picture in the chat area if no credits are left
       var replyMessage = document.createElement('div');
       replyMessage.classList.add('message'); // Apply CSS class
       replyMessage.textContent = 'Bot: ' + "You are not logged in. Please login in the popup so that I can assist :)";
       var messageArea = document.getElementById('message-area');
       messageArea.appendChild(replyMessage);
       messageArea.scrollTop = messageArea.scrollHeight;
    }
  });   
}

// Function to handle key press events in the question input field
function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Prevent the default behavior of the Enter key (form submission)
    event.preventDefault();
    // Trigger the question submission
    handleQuestionSubmission();
  }
}
function handleFollowupEnterPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Prevent the default behavior of the Enter key (form submission)
    event.preventDefault();
    // Trigger the question submission
    handleAskFollowUp();
  }
}


function showCloseIcon() {
  var closeIcon = document.querySelector('#whatnot-icon > div');
  if (closeIcon) {
    closeIcon.style.opacity = '1'; // Show the close icon
  }
}

function hideCloseIcon() {
  var closeIcon = document.querySelector('#whatnot-icon > div');
  if (closeIcon) {
    closeIcon.style.opacity = '0'; // Hide the close icon
  }
}

function hideExtension() {
  var extensionIcon = document.getElementById('whatnot-icon');
  var tooltip = document.getElementById('whatnot-icon-tooltip');
  if (extensionIcon) {
    extensionIcon.remove();
  }
  if (tooltip) {
    tooltip.remove();
  }
}

function showTooltip() {
  var tooltip = document.createElement('div');
  tooltip.style.position = 'fixed';
  tooltip.style.right = '70px';
  tooltip.style.top = '50%';
  tooltip.style.transform = 'translateY(-50%)';
  tooltip.style.backgroundColor = '#000';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '10px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.zIndex = '9999';
  tooltip.style.fontSize = '12px';
  tooltip.textContent = 'Take GPT suggestion'; // Update tooltip message
  tooltip.setAttribute('id', 'whatnot-icon-tooltip');
  document.body.appendChild(tooltip);
}

function hideTooltip() {
  var tooltip = document.getElementById('whatnot-icon-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}
window.addEventListener('load', attachIcon);


//add autoseach 

// Function to check if the current page is a Google search results page
function isGoogleSearchResultsPage() {
  return window.location.hostname === 'www.google.com' && window.location.pathname === '/search';
}

function isGitHubPage() {
  return window.location.hostname.includes("github.com");
}

function handleAskFollowUp(){

  openChatScreenModal();
  var messageArea = document.getElementById('message-area');
  console.log('Message Area')
  console.log(messageArea)
  console.log("####GPT Messages#####")
  console.log(gpt_messages);
  if(messageArea){
    for (const messageData of gpt_messages) {
      console.log("####GPT Messages Loop#####")
      if (messageData.role === "user") {
        // This message was written by the user
        console.log("User message:", messageData.content);
        var messageContainer = document.createElement('div'); // Create a container for the message
        messageContainer.classList.add('message-container');
        var message = document.createElement('div');
        message.classList.add('message'); // Apply CSS class
        message.classList.add('user');
        message.textContent = 'You: ' + messageData.content;
        messageContainer.appendChild(message);
        messageArea.appendChild(messageContainer);
        //  messageArea.appendChild(messageContainer);
        // Append the message to the message area
        //  messageArea.appendChild(typingIndicator);
        messageArea.scrollTop = messageArea.scrollHeight;

      } else if (messageData.role === "assistant") {
        // This message was written by the assistant (bot)
        console.log("Bot message:", messageData.content);
        var replyMessage = document.createElement('div');
        replyMessage.classList.add('message');
        replyMessage.classList.add('bot');
        replyMessage.textContent = 'Bot: '+messageData.content;
        messageArea.appendChild(replyMessage);
        messageArea.scrollTop = messageArea.scrollHeight;
      } else {
        // This message is a system message or has an unknown role
        console.log("System message or unknown role:", message.content);
      }
    }

    var newquestion = document.getElementById('whatbots-search-input').value;
    var question = document.getElementById('question-input');
    question.value = newquestion;

    handleQuestionSubmission()
    
  }

}

function showKnowledge(query, result, image = null,showCreditsLink=false,creditLink='https://forms.gle/NpzY4eULveFMm3CE8'){
  var resultBox = document.createElement('div');
  resultBox.classList.add('search-quick-result-box');
  var headingContainer = document.createElement("div");
  headingContainer.className = "search-heading-container";

  //profile icon
  // Create the profile image icon
  var settingsIcon = document.createElement("img");
  settingsIcon.src = chrome.runtime.getURL('src/icons/settings.png');
  settingsIcon.alt = "Settings";
  settingsIcon.style.width = '23px';
  settingsIcon.style.height = '23px';
  settingsIcon.style.marginRight = '5px';
  settingsIcon.style.backgroundSize = 'cover';
  settingsIcon.style.cursor = 'pointer';
  settingsIcon.setAttribute('id', 'search-settings');
  settingsIcon.addEventListener('click', handleOpenSettings);

  var closeButton = document.createElement('button');
  closeButton.setAttribute('id', 'search-close-button');
  closeButton.textContent = '×'; // Add the close icon/text
  
  // Event listener to handle close button click
  closeButton.addEventListener('click', function() {
    resultBox.remove();
  });

  // Create brand logo container
  var logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  // Create brand logo image
  var logoImage = document.createElement("img");
  logoImage.src = chrome.runtime.getURL('./src/icons/chat-logo-icon.png');
  logoImage.alt = "WhatBots Logo";
  logoImage.setAttribute('id', 'search-logo-image');
  
  headingContainer.appendChild(logoContainer);
  // Append logo image and text to logo container
  logoContainer.appendChild(logoImage);
  //headingContainer.appendChild(profileImageIcon);

  // Create div to hold profile image and close button
  var settingsCloseDiv = document.createElement('div');
  settingsCloseDiv.style.display = 'flex';
  settingsCloseDiv.style.alignItems = 'center';
  settingsCloseDiv.appendChild(settingsIcon);
  settingsCloseDiv.appendChild(closeButton);
  headingContainer.appendChild(settingsCloseDiv);
  resultBox.appendChild(headingContainer); 


  var queryHeading = document.createElement('h4');
  queryHeading.style.fontWeight = 'bold';
  queryHeading.textContent = query;
  queryHeading.classList.add('search-result-heading-container');


  var queryBody = document.createElement('div');
  queryBody.classList.add('search-result-content-container');
  // queryHeading.style.fontWeight = 'bold';
  
  // Create the result content element
  var resultContent = document.createElement('p');
  resultContent.classList.add('result-content');
  resultContent.textContent = result;
 
  resultBox.appendChild(queryHeading);
  // queryBody.appendChild(resultContent);
  // Check if an image URL is provided
  if (image) {
    // Create the image element
    var imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.style.height = '150px';
    imageElement.style.maxWidth = '100%';
    // Append the image element to the result box
    resultBox.appendChild(imageElement);
  }
  queryBody.appendChild(resultContent)
  resultBox.appendChild(queryBody);
  // Append the result box and the cross button to the document body
  // resultBox.textContent = result;
  if (showCreditsLink) {
    // Create the image element
    var creditElement = document.createElement('a');
    creditElement.href = creditLink;
    creditElement.style.backgroundColor = '#5E72D6';
    creditElement.style.color = 'white';
    creditElement.style.padding = '5px 10px 5px 10px';
    creditElement.style.borderRadius = '5px';
    creditElement.innerHTML = 'Get Credits';
    creditElement.target = '_blank';

    // Append the image element to the result box
    resultBox.appendChild(creditElement);
  }

  if(isGitHubPage()){

  }
  else{
    const googleSearchResultRightDiv = document.querySelector('#rhs');
    googleSearchResultRightDiv.prepend(resultBox);
  }

  // resultBox.appendChild(closeButton);
 
  
  if(!showCreditsLink && !image){
    var questionContainer = document.createElement('div');
    questionContainer.style.display = 'flex'; // Use flexbox to display elements in the same line
    questionContainer.style.alignItems = 'center'; 
    questionContainer.setAttribute('id', 'search-input-submit-container');
  
    // Create the question input
    var questionInput = document.createElement('input');
    questionInput.setAttribute('type', 'text');
    questionInput.setAttribute('id', 'whatbots-search-input');
    questionInput.setAttribute('placeholder', 'Ask follow-up question ');
    // Add event listener for the Enter key press on the question input field
    questionInput.addEventListener('keypress', handleFollowupEnterPress);
    
  
    // Create the submit button as an icon
    var submitButtonIcon = document.createElement('i');
    submitButtonIcon.setAttribute('class', 'search-submit-icon ');
    //submitButtonIcon.addEventListener('click', handleQuestionSubmission);
    submitButtonIcon.style.width = '15px';
    submitButtonIcon.style.height = '14px';
    submitButtonIcon.style.backgroundImage = `url(${chrome.runtime.getURL('./src/icons/submit.png')})`
    submitButtonIcon.style.backgroundSize = 'cover';
    submitButtonIcon.style.cursor = 'pointer';
    submitButtonIcon.addEventListener('click', handleAskFollowUp);

  
    questionContainer.appendChild(questionInput);
    questionContainer.appendChild(submitButtonIcon);
    resultBox.appendChild(questionContainer);

  }
 
  // document.body.appendChild(resultBox);
  return queryBody;

}

function showResultBox(query, result, image = null,showCreditsLink=false,creditLink='https://forms.gle/NpzY4eULveFMm3CE8') {
  var existingResultBox = document.querySelector('#result-box');
  if (existingResultBox) {
    // Remove the existing result box
    existingResultBox.remove();
  }
  // Create the result box element
  var resultBox = document.createElement('div');
  // resultBox.style.position = 'fixed';
  // resultBox.style.right = '5px'; // Adjust the positioning based on your desired placement
  // resultBox.style.top = 'calc(50% - 250px)'; // Adjust the positioning based on your desired placement
  resultBox.style.width = '100%';
  resultBox.style.height = '150px'; // Set a fixed height
  resultBox.style.padding = '10px';
  resultBox.style.backgroundColor = '#fff';
  resultBox.style.borderBottom = '1px solid gray';
  resultBox.style.borderRadius = '4px';
  resultBox.style.position = 'relative';
  resultBox.style.marginBottom = '10px';
  resultBox.style.overflow='auto';
  resultBox.style.backgroundColor = 'black';
  resultBox.setAttribute('id', 'result-box');

  var headingContainer = document.createElement("div");
  headingContainer.className = "github-result-heading-container";


  //profile icon
  // Create the profile image icon
  var settingsIcon = document.createElement("img");
  settingsIcon.src = chrome.runtime.getURL('src/icons/settings.png');
  settingsIcon.alt = "Settings";
  settingsIcon.style.width = '23px';
  settingsIcon.style.height = '23px';
  settingsIcon.style.marginRight = '5px';
  settingsIcon.style.backgroundSize = 'cover';
  settingsIcon.style.cursor = 'pointer';
  settingsIcon.setAttribute('id', 'git-settings');
  settingsIcon.addEventListener('click', handleOpenSettings);

  var closeButton = document.createElement('button');
  closeButton.setAttribute('id', 'github-close-button');
  closeButton.textContent = '×'; // Add the close icon/text
  
  // Event listener to handle close button click
  closeButton.addEventListener('click', function() {
    resultBox.remove();
  });

  // Create brand logo container
  var logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  // Create brand logo image
  var logoImage = document.createElement("img");
  logoImage.src = chrome.runtime.getURL('./src/icons/chat-logo-icon.png');
  logoImage.alt = "WhatBots Logo";
  logoImage.setAttribute('id', 'git-logo-image');
  
  headingContainer.appendChild(logoContainer);
  // Append logo image and text to logo container
  logoContainer.appendChild(logoImage);
  //headingContainer.appendChild(profileImageIcon);

  const currentURL = window.location.href;
  const urlSegments = currentURL ? currentURL.split('/') : [];
  if (urlSegments.length > 0) {
    // Get the last segment by accessing the last element of the array
    const lastSegment = urlSegments[urlSegments.length - 1];
    titleDiv = document.createElement("div");
    titleDiv.textContent = lastSegment;
    headingContainer.appendChild(titleDiv);
  }


  // Create div to hold profile image and close button
  var settingsCloseDiv = document.createElement('div');
  settingsCloseDiv.style.display = 'flex';
  settingsCloseDiv.style.alignItems = 'center';
  settingsCloseDiv.appendChild(settingsIcon);
  settingsCloseDiv.appendChild(closeButton);


  headingContainer.appendChild(settingsCloseDiv);
  resultBox.appendChild(headingContainer); 
  
  // resultBox.style.zIndex = '9999';
  // resultBox.style.overflow = 'auto'; 
  // Create the query heading element
  var queryHeading = document.createElement('h4');
  queryHeading.style.fontWeight = 'bold';
  queryHeading.style.color = 'white';
 
  queryHeading.textContent = query;
  
  // Create the result content element
  var resultContent = document.createElement('p');
  resultContent.classList.add('github-result-content');
  resultContent.textContent = result;
  // Create the cross button element
  var closeButton = document.createElement('div');
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';
  closeButton.style.width = '20px';
  closeButton.style.height = '20px';
  // closeButton.style.backgroundColor = '#ccc';
  // closeButton.style.borderRadius = '50%';
  closeButton.style.cursor = 'pointer';
  closeButton.innerHTML = 'X';
  // Add event listener for closing the result box
  closeButton.addEventListener('click', function() {
    resultBox.remove();
  });
  resultBox.appendChild(queryHeading);
  // Check if an image URL is provided
  if (image) {
    // Create the image element
    var imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.style.height = '150px';
    imageElement.style.maxWidth = '100%';

    // Append the image element to the result box
    resultBox.appendChild(imageElement);
  }
  
  resultBox.appendChild(resultContent);
  // Append the result box and the cross button to the document body
  // resultBox.textContent = result;
  if (showCreditsLink) {
    // Create the image element
    var creditElement = document.createElement('a');
    creditElement.href = creditLink;
    creditElement.style.backgroundColor = '#5E72D6';
    creditElement.style.color = 'white';
    creditElement.style.padding = '5px 10px 5px 10px';
    creditElement.style.borderRadius = '5px';
    creditElement.innerHTML = 'Get Credits';
    creditElement.target = '_blank';

    // Append the image element to the result box
    resultBox.appendChild(creditElement);
  }
  resultBox.appendChild(closeButton);
  const codeArea = document.querySelector('#read-only-cursor-text-area');
  const parent = codeArea.parentNode;

  // Append the new div before the codeArea
  parent.insertBefore(resultBox, codeArea);
  // codeArea.parentNode.appendChild(resultBox);
  // document.body.appendChild();
  return resultContent;
}

function showExplainCodeButton(){

  const explainCodeContainer = document.createElement('div');
  explainCodeContainer.setAttribute('id', 'explain-code-container');
  explainCodeContainer.style.position = 'fixed';
  explainCodeContainer.style.top = '10px';
  explainCodeContainer.style.right = '10px';
  explainCodeContainer.style.zIndex = '9999';
  explainCodeContainer.style.backgroundColor = '#fff';
  explainCodeContainer.style.borderRadius= '5px';
  explainCodeContainer.style.padding = '5px';
  explainCodeContainer.style.borderColor = 'gray';
  explainCodeContainer.style.border = 'gray';
  explainCodeContainer.style.display = 'flex';
  explainCodeContainer.style.alignItems = 'center';


  // Create the "Explain Code" button element
  const explainCodeButton = document.createElement('button');
  explainCodeButton.textContent = 'Explain Code';

  explainCodeButton.setAttribute('id', 'explain-code-button');
  explainCodeButton.style.backgroundColor = '#fff';
  explainCodeButton.style.color = 'black';
  explainCodeButton.style.borderRadius = '5px';
  explainCodeButton.style.borderColor = 'purple';
  explainCodeButton.style.fontWeight = 'bold';

  // Add a click event listener to the button
  explainCodeButton.addEventListener('click', () => {
    const codeArea = document.querySelector('#read-only-cursor-text-area');
    // console.log('#######Code tag #######')
    // console.log(textInsideElement);
    if (codeArea) {
      const sourceCode = codeArea.value;
      const maxTokens = 2000;
      console.log('Source code:', sourceCode);
      var truncatedSourceCode = 'Explain this source code \n' + sourceCode.substring(0, maxTokens);
      // Now you have the source code and can perform any operations on it
      processSearchQuery(truncatedSourceCode);
      //showResultBox('Code Auto Documentaion',truncatedSourceCode);
    }
    else{
      alert('Please open any code file so that I can explain it');
    }
  
  });

  // Create the cross icon element
  const crossIcon = document.createElement('span');
  crossIcon.textContent = '✖';
  crossIcon.style.fontSize = '18px';
  crossIcon.style.marginLeft = '5px';
  crossIcon.style.cursor = 'pointer';

  // Add a click event listener to the cross icon to hide the button and the logo
  crossIcon.addEventListener('click', () => {
    explainCodeContainer.style.display = 'none';
  });

  const whatBotsLogo = document.createElement('img');
  whatBotsLogo.src = chrome.runtime.getURL('./src/icons/48.png');
  whatBotsLogo.alt = 'WhatBots Logo';
  whatBotsLogo.style.width = '15px';
  whatBotsLogo.style.height = '15px';
  whatBotsLogo.style.marginRight = '5px';
 
  // Append the elements to the container div
  explainCodeContainer.appendChild(whatBotsLogo);
  explainCodeContainer.appendChild(explainCodeButton);
  explainCodeContainer.appendChild(crossIcon);

  // Insert the container before the WhatBots icon
  const whatBotsIcon = document.querySelector('#whatnot-icon');
  whatBotsIcon.parentNode.insertBefore(explainCodeContainer, whatBotsIcon);
  
}


// Function to process the search query and fetch results
function processSearchQuery(searchQuery) {
 
  chrome.runtime.sendMessage({ getCreditData: true }, function(response) {
    // Handle the received user data response here
    console.log('Received credit user data:', response);
    if(response){
     
      credits = response.credits;
      accessToken = response.accessToken;
      if(isGitHubPage()){
        auto_github_explain_enabled = response.auto_github_explain;
        if(credits>0 && auto_github_explain_enabled){
          getStreamReplyFromAPI(searchQuery,"git", accessToken)
        }
        else if(credits<=0 && auto_github_explain_enabled){
          showResultBox('You do not have credits left :(',"It's been fun offering WhatBots for free but to cover the costs of inference we need to add a small usage based credit. This way we can keep building it. ",null,showCreditsLink=true , creditLink='https://whatbots.co/payment?email='+response.email);
        }
      }
      else{
        auto_google_search_enabled = response.auto_google_search;
        if(credits>0 && auto_google_search_enabled){
          getStreamReplyFromAPI(searchQuery,"google", accessToken)
        }
        else if(credits<=0 && auto_google_search_enabled){
          // Display a picture in the chat area if no credits are left
          showKnowledge('You do not have credits left :(',"It's been fun offering WhatBots for free but to cover the costs of inference we need to add a small usage based credit. This way we can keep building it. ",null,showCreditsLink=true , creditLink='https://whatbots.co/payment?email='+response.email);
        }
      }
    }
    else {
      
    }
  });   
}

function getSearchQueryFromURL(url) {
  const match = url.match(/[?&]q=([^&]+)/);
  const query = match ? decodeURIComponent(match[1]) : null;
  return query ? query.replace(/\+/g, ' ') : null;
}

// Function to add event listeners after the DOM is fully loaded
function initializeExtension() {
  if (isGoogleSearchResultsPage()) {
    console.log('####Inside Search Result Page####');

    const googleSearchResultRightDiv = document.querySelector('#rhs');
    if (googleSearchResultRightDiv) {
      const currentURL = window.location.href;
      console.log("########Search URL####");
      console.log(currentURL);
      const searchQuery = getSearchQueryFromURL(currentURL);
      console.log("########Search Query####");
      console.log(searchQuery);
      if (searchQuery) {
        processSearchQuery(searchQuery);
      }
    }
    else{
     
      const rhsDiv = document.createElement('div');
      rhsDiv.setAttribute('id', 'rhs');
      rhsDiv.style.marginLeft = 'var(--rhs-margin)';
      rhsDiv.style.flex = '0 auto';
      rhsDiv.style.width = 'var(--rhs-width)';
      rhsDiv.style.position = 'relative';
      rhsDiv.style.paddingBottom = '15px';
      rhsDiv.style.transition = 'opacity 0.3s';

      // Append the "rhs" div to the "GyAeWb" div
      const googleSearchResultDiv = document.querySelector('.GyAeWb');
      if (googleSearchResultDiv) {
        googleSearchResultDiv.appendChild(rhsDiv);
      }
       // After appending #rhs, check if the search query exists and process it
       const currentURL = window.location.href;
       console.log("########Search URL####");
       console.log(currentURL);
       const searchQuery = getSearchQueryFromURL(currentURL);
       console.log("########Search Query####");
       console.log(searchQuery);
       if (searchQuery) {
         processSearchQuery(searchQuery);
       }
    }
  
  }
  else if(isGitHubPage()){
    showExplainCodeButton();

    const codeArea = document.querySelector('#read-only-cursor-text-area');
    // console.log('#######Code tag #######')
    // console.log(textInsideElement);
    if (codeArea) {
      const sourceCode = codeArea.value;
      const maxTokens = 2000;
      console.log('Source code:', sourceCode);
      var truncatedSourceCode = 'Explain this source code \n' + sourceCode.substring(0, maxTokens);
      // Now you have the source code and can perform any operations on it
      processSearchQuery(truncatedSourceCode);
      //showResultBox('Code Auto Documentaion',truncatedSourceCode);
    }
  }
}
window.addEventListener('load', initializeExtension);

