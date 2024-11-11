let isConnecting = false;

document.getElementById("connectButton").addEventListener("click", async () => {
  changeButtonContent();
  const progressValueElement = document.getElementById("progressValue");
  const leftBar = document.getElementById("left-bar");
  const rightBar = document.getElementById("right-bar");

  // Get the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (isConnecting) {
    // Stop the connection process by sending a stop message
    chrome.tabs.sendMessage(tab.id, { action: "stop" });
    isConnecting = false;
    return;
  }
  else{
    isConnecting = true;
    chrome.tabs.sendMessage(tab.id, { action: "start" });  
  }

  // Listen for progress updates from the content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateProgress") {
      updateProgress(message.invitationsSent, message.targetInvitations);
    }
  });

  function updateProgress(invitationsSent, targetInvitations) {
    const angle = (invitationsSent/targetInvitations)*360;
    progressValueElement.textContent = `${invitationsSent}`;

    if (angle <= 180) {
      rightBar.style.transform = `rotate(${(angle)}deg)`;
      leftBar.style.transform = "rotate(0deg)";
    } else {
      rightBar.style.transform = "rotate(180deg)";
      leftBar.style.transform = `rotate(${angle-180}deg)`;
    }
  }
});

function changeButtonContent() {
  const connectBtn = document.getElementById("connectButton");
  if (connectBtn.textContent === "Start Connecting") {
    connectBtn.textContent = "Stop Connecting";
    connectBtn.style.backgroundColor = "red";
  } else {
    connectBtn.style.backgroundColor = "#198754";
    connectBtn.textContent = "Start Connecting";
  }
}
