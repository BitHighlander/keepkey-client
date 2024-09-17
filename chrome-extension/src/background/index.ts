import 'webextension-polyfill';
import packageJson from '../../package.json'; // Adjust the path as needed
import { onStartKeepkey } from './keepkey';
import { handleWalletRequest } from './methods';
import { listenForApproval } from './approvals';
import { JsonRpcProvider } from 'ethers';
import { Chain } from '@coinmasters/types';
import { exampleSidebarStorage } from '@extension/storage'; // Re-import the storage
import { EIP155_CHAINS } from './chains';

const TAG = ' | background/index.js | ';
console.log('Background script loaded');
console.log('Version:', packageJson.version);

const KEEPKEY_STATES = {
  0: 'unknown',
  1: 'disconnected',
  2: 'connected',
  3: 'busy', // multi-user-action signing cannot be interrupted
  4: 'errored',
};
let KEEPKEY_STATE = 0;

function updateIcon() {
  let iconPath = './icon-128.png';
  if (KEEPKEY_STATE === 2) iconPath = './icon-128-online.png';

  chrome.action.setIcon({ path: iconPath }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error setting icon:', chrome.runtime.lastError);
    }
  });
}
updateIcon();
console.log('Background loaded');

const provider = new JsonRpcProvider(EIP155_CHAINS['eip155:1'].rpc);

// KeepKey Initialization
let ADDRESS = '';
let APP:any = null;

const onStart = async function () {
  const tag = TAG + ' | onStart | ';
  try {
    console.log(tag, 'Starting...');
    // Connect to KeepKey
    const app = await onStartKeepkey();
    console.log(tag, 'app: ', app);
    const address = await app.swapKit.getAddress(Chain.Ethereum);
    console.log(tag, 'address: ', address);
    if (address) {
      KEEPKEY_STATE = 2;
      updateIcon();
    }
    console.log(tag, 'address: ', address);

    // Set addresses
    ADDRESS = address;
    console.log(tag, '**** keepkey: ', app);
    APP = app;
    console.log(tag, 'APP: ', APP);

    // Start listening for approval events
    listenForApproval(APP, ADDRESS);

    // Sync with KeepKey
    await APP.getPubkeys();
    await APP.getBalances();

    //

  } catch (e) {
    KEEPKEY_STATE = 4; // errored
    updateIcon();
    console.error(tag, 'Error:', e);
  }
};

onStart();

chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  const tag = TAG + ' | chrome.runtime.onMessage | ';
  console.log(tag, 'Received message:', message);

  if (message.type === 'WALLET_REQUEST') {
    console.log(tag, 'Handling WALLET_REQUEST:', message);

    // Extract requestInfo from the message
    const { requestInfo } = message;

    // Now, extract method, params, and chain from requestInfo
    const { method, params, chain } = requestInfo;

    console.log(tag, 'id:', requestInfo.id);
    console.log(tag, 'chain:', chain);
    console.log(tag, 'method:', method);
    console.log(tag, 'params:', params);

    if (method) {
      handleWalletRequest(requestInfo, chain, method, params, provider, APP, ADDRESS)
        .then(result => {
          sendResponse({ result });
        })
        .catch(error => {
          sendResponse({ error: error.message });
        });
    } else {
      console.log(tag, 'Invalid WALLET_REQUEST: Missing method');
      sendResponse({ error: 'Invalid request: missing method' });
    }

    return true; // Indicates that the response will be sent asynchronously
  }

  if (message.type === 'GET_KEEPKEY_STATE') {
    sendResponse({ state: KEEPKEY_STATE });
    return true;
  }

  if (message.type === 'ON_START') {
    onStart();
    setTimeout(() => {
      sendResponse({ state: KEEPKEY_STATE });
    }, 15000); // 15 seconds delay
    return true;
  }

  if (message.type === 'GET_APP') {
    sendResponse({ app: APP });
    return true
  }

  if (message.type === 'GET_APP_ASSET_CONTEXT') {
    return APP.assetContext
  }

  if (message.type === 'GET_APP_PATHS') {
    return APP.paths
  }

  if (message.type === 'GET_APP_PUBKEYS') {
    return APP.pubkeys
  }

  if (message.type === 'GET_ASSETS') {
    if (APP) {
      sendResponse({ assets: APP.assets });
      return true; // Async response
    } else {
      sendResponse({ error: 'APP not initialized' });
    }
  }

  return false;
});

  if (message.type === 'GET_APP_BALANCES') {
    if (APP) {
      sendResponse({ balances: APP.balances });
      return true; // Async response
    } else {
      sendResponse({ error: 'APP not initialized' });
    }
  }

  return false;
});

// Example usage of exampleSidebarStorage to get the user's preference
exampleSidebarStorage
  .get()
  .then(openSidebar => {
    console.log('openSidebar:', openSidebar);
    // Update the click handler for the extension icon
    chrome.action.onClicked.addListener((tab: any) => {
      // Check the user's preference for opening the side panel or popup
      if (openSidebar === true) {
        // If true, open the side panel
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          chrome.sidePanel.open({ tabId: tab.id }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error opening side panel:', chrome.runtime.lastError);
            }
          });
        });
      } else {
        // Otherwise, fallback to popup
        chrome.action.setPopup({ popup: 'popup/index.html' });
        chrome.action.openPopup();
      }
    });
  })
  .catch(error => {
    console.error('Error fetching sidebar storage:', error);
  });
