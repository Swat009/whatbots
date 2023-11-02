import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
  setPersistence,
  indexedDBLocalPersistence
} from 'firebase/auth';
import { getDatabase, ref, set,get,serverTimestamp } from 'firebase/database';
// importing firebase.json file
import firebase from '../../firebase.json';




// config after registering firebase App 

const apiKey = firebase.apiKey;
const authDomain = firebase.authDomain;
const projectId = firebase.projectId;
const storageBucket = firebase.storageBucket;
const messagingSenderId = firebase.messagingSenderId;
const appId = firebase.appId;
const measurementId = firebase.measurementId;
const databaseURL = firebase.databaseURL;

const config = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  databaseURL
};

// This creates firebaseApp instance
// version: SDK 9
const firebaseApp = initializeApp(config)

// Auth instance for the current firebaseApp
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
setPersistence(auth,  indexedDBLocalPersistence)

let userData = null;
let authUser = null;

onAuthStateChanged(auth, user => {
  if (user != null) {
      console.log('logged in!');
      console.log("current");
      console.log(user);
      authUser=user;
      chrome.runtime.sendMessage({ message: "loginSuccess" });

  } else {
    
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.token) {
    // Use the token for authentication with Firebase
    const token = request.token;
    // Authenticate with Firebase using the token
    // ...
    console.log('Token received from the popup script:', token);
    const credential = GoogleAuthProvider.credential(null, token);
    signInWithCredential(auth, credential).then((result) => {
      console.log("Success!!!")
      console.log(result)
      chrome.runtime.sendMessage({ message: "loginSuccess" });
    }).catch((error) => {
      // You can handle errors here
      console.log(error)
    });
  }
  else if (request.getUserData) {
    // Retrieve user data
    // Send the user data back to the content script
    console.log('######AuthUser#####');
    console.log(authUser);
    if(!authUser){
      sendResponse(null);
    }
    else{
      // mixpanel.identify(authUser.uid)
      const userRef = ref(database, `users/${authUser.uid}`);
        get(userRef).then(snapshot => {
            if (!snapshot.exists()) {
                // User does not exist, create entry in the database
                // const timestamp = new Date();
                set(userRef, { name: authUser.displayName, email: authUser.email, credits:10,queries_done:0, auto_google_search:true, auto_github_explain:true, google_queries:0, chat_queries:0,git_code_explain:0, created:serverTimestamp(),updated:serverTimestamp()});
                sendResponse({ name: authUser.displayName, email: authUser.email, credits:10,queries_done:0, auto_google_search:true, auto_github_explain:true ,google_queries:0,git_code_explain:0, chat_queries:0,created:serverTimestamp(),updated:serverTimestamp()});
            }
            else{
              // mixpanel.track('Login', {
              //   'type': 'Referral'
              // })
              console.log('######Snapshot value#####');
              console.log(snapshot.val());
              userData = snapshot.val();
              sendResponse(userData);
            }
        }).catch(error => {
            console.log('Error checking user in the database:', error);
            sendResponse(null);
        });
    } 
    return true;
  }
  else if (request.getCreditData) {

    console.log('###### Credit AuthUser#####');
    console.log(authUser);
    console.log('###### Credit Real AuthUser#####');
    console.log(auth.currentUser);
    const authPromise = new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe(); // Unsubscribe to the listener
        resolve(user);
      });
    });

    authPromise.then((user) => {
      if (user != null) {
        const uid = auth.currentUser.uid;
        const userRef = ref(database, `users/${uid}`);
          get(userRef).then(snapshot => {
              if(snapshot.exists()) {
                userData = {
                  accessToken: auth.currentUser.accessToken, // Add the ID token to the user data
                  ...snapshot.val(),
                };
                // userData = snapshot.val();
                sendResponse(userData);
              }
          }).catch(error => {
              console.log('Error checking user in the database:', error);
          });
      }
      else{
        chrome.windows.create({
          url: chrome.runtime.getURL('popup.html'),
          type: 'popup',
          width: 500,
          height: 500
        });
        sendResponse(auth.currentUser);
      }
    });
    return true;
  } 
  else if (request.decreaseCredit) {
    const userRef = ref(database, `users/${authUser.uid}`);
    const source = request.source;
    get(userRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          let updatedCredits = userData.credits - 1;
          const updatedQueriesDone = userData.queries_done + 1;
          let updatedChatQueries = userData.chat_queries;
          let updatedGoogleQueries = userData.google_queries;
          let updatedGitCodeExplain = userData.git_code_explain;
          if(source=="chat"){
            updatedChatQueries = updatedChatQueries + 1;
          }
          else if(source=="google"){
            updatedGoogleQueries = updatedGoogleQueries + 1;
          }
          else if(source=="git"){
            updatedCredits = updatedCredits - 4;
            updatedGitCodeExplain = updatedGitCodeExplain + 1;
          }
          // const timestamp = new Date();
          // Update the user's credit in the database
          set(userRef, { ...userData, credits: updatedCredits,queries_done: updatedQueriesDone, chat_queries: updatedChatQueries, git_code_explain: updatedGitCodeExplain, google_queries:updatedGoogleQueries, updated:serverTimestamp()})
            .then(() => {
              console.log('User credit updated successfully.');
              // mixpanel.track('CreditCut', {
              //   'updatedCredits': updatedCredits,
              //   'queries':queries_done
              // })
            })
            .catch(error => {
              console.log('Error updating user credit:', error);
            });
        }
      })
      .catch(error => {
        console.log('Error retrieving user data:', error);
      });
      return true;
  }
  else if (request.logOutUser) {
    auth.signOut();
    sendResponse('success');
  }
  else if(request.googleSearchEnabled !== undefined){
    var googleSearchEnabled = request.googleSearchEnabled;
    const userRef = ref(database, `users/${authUser.uid}`);
    get(userRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          // const timestamp = new Date();
          // Update the user's credit in the database
          set(userRef, { ...userData, auto_google_search:googleSearchEnabled})
            .then(() => {
              console.log('User credit updated successfully.');
              
              // mixpanel.track('CreditCut', {
              //   'updatedCredits': updatedCredits,
              //   'queries':queries_done
              // })
            })
            .catch(error => {
              console.log('Error updating user credit:', error);
            });
        }
      })
      .catch(error => {
        console.log('Error retrieving user data:', error);
      });
      return true;
  }
  else if(request.githubEnabled !== undefined){
    var githubEnabled = request.githubEnabled;
    const userRef = ref(database, `users/${authUser.uid}`);
    get(userRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          // const timestamp = new Date();
          // Update the user's credit in the database
          set(userRef, { ...userData, auto_github_explain: githubEnabled})
            .then(() => {
              console.log('User github update successfully.');
              
              // mixpanel.track('CreditCut', {
              //   'updatedCredits': updatedCredits,
              //   'queries':queries_done
              // })
            })
            .catch(error => {
              console.log('Error updating user github:', error);
            });
        }
      })
      .catch(error => {
        console.log('Error retrieving user data:', error);
      });
      return true;
  }
  else if (request.getSettings) {

    chrome.windows.create({
      url: chrome.runtime.getURL('main.html'),
      type: 'popup',
      width: 320,
      height: 450
    });

  }
 
});

chrome.action.onClicked.addListener(function(tab) {
  // Send a message to the content script to open the chat modal
  chrome.tabs.sendMessage(tab.id, { action: 'openChatModal' });
});

// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
//   chrome.tabs.sendMessage(tab.id, { action: 'handleUrlChange' });

//   // Handle URL change event

// })


// // adds a listener to tab change
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log('###########Inside the listener#######');
//   console.log(changeInfo);

//   // check for a URL in the changeInfo parameter (url is only added when it is changed)
//   if (changeInfo.url) {
      
//       // calls the inject function
//       chrome.tabs.sendMessage(tab.id, { action: 'handleUrlChange' });
//       console.log('###########Inside the listener Triggered#######');
//       console.log(changeInfo);

//   }
// });


chrome.runtime.onInstalled.addListener(function() {
  // Open the login popup when the extension is installed
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
    width: 500,
    height: 500
  });
});
