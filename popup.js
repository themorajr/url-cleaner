let currentStatus = {
  isEnabled: true,
  cleanedCount: 0
};

// Update popup UI elements to reflect the latest state
function updateUI() {
  document.getElementById('toggleSwitch').checked = currentStatus.isEnabled;
  document.getElementById('cleanedCount').textContent = currentStatus.cleanedCount;
  document.getElementById('statusText').textContent =
    currentStatus.isEnabled ? '✅ Enabled' : '⏸️ Disabled';
  document.getElementById('statusText').style.color =
    currentStatus.isEnabled ? '#4CAF50' : '#999';
}

// Fetch the current status when the popup opens
function loadStatus() {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }
    if (response) {
      currentStatus = response;
      updateUI();
      console.log('Status loaded:', currentStatus);
    }
  });
}

// Initialize the popup
loadStatus();

// Listen for updates from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'countUpdated') {
    currentStatus.cleanedCount = request.count;
    updateUI();
  }
});

// Handle toggle switch interaction
const toggleSwitch = document.getElementById('toggleSwitch');
if (toggleSwitch) {
  toggleSwitch.addEventListener('change', (e) => {
    const enabled = e.target.checked;

    chrome.runtime.sendMessage({
      action: 'toggle',
      enabled: enabled
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Toggle error:', chrome.runtime.lastError);
        // Revert the switch to its previous state on error
        e.target.checked = !enabled;
        return;
      }
      if (response && response.success) {
        currentStatus.isEnabled = enabled;
        updateUI();
        console.log('Toggled:', enabled);
      }
    });
  });
}

// Reset button to clear the cleaned URL counter
const resetButton = document.getElementById('resetBtn');
if (resetButton) {
  resetButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetCount' }, (response) => {
      if (response && response.success) {
        currentStatus.cleanedCount = 0;
        updateUI();
        console.log('Count reset');
      }
    });
  });
}

// Optional refresh button to fetch the latest status manually
const refreshButton = document.getElementById('refreshBtn');
refreshButton?.addEventListener('click', () => {
  loadStatus();
});

