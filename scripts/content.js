let isConnecting = false;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "start") {
    isConnecting = true;
    clickConnectButton();
  } else if (message.action === "stop") {
    isConnecting = false;
  }
});

async function clickConnectButton() {
  const resultDiv = document.querySelector('.search-results-container');
  if (!resultDiv) return;

  const personList = Array.from(resultDiv.querySelectorAll('li'));
  let buttonsList = [];

  personList.forEach((p) => {
    const connectButton = p.querySelector('button[aria-label^="Invite"], button[aria-label^="Connect"]');
    if (connectButton) buttonsList.push(connectButton);
  });
  
  let invitationsSent = 0;
  const targetInvitations = buttonsList.length;

  for (let button of buttonsList) {
    if (!isConnecting) break; // Exit if connecting has been stopped

    button.click();

    const interval = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sendButton = document.querySelector('button[aria-label="Send without a note"]');
    if (sendButton) {
      sendButton.click();
      invitationsSent++;

      // Send progress update back to popup.js
      chrome.runtime.sendMessage({ 
        action: "updateProgress", 
        invitationsSent: invitationsSent, 
        targetInvitations: targetInvitations 
      });
    }

    // Wait 5-10 seconds before the next click
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  isConnecting = false;
}
