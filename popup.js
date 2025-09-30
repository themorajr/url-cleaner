let currentStatus = {
  isEnabled: true,
  cleanedCount: 0
};

// ฟังก์ชันอัพเดท UI
function updateUI() {
  document.getElementById('toggleSwitch').checked = currentStatus.isEnabled;
  document.getElementById('cleanedCount').textContent = currentStatus.cleanedCount;
  document.getElementById('statusText').textContent = 
    currentStatus.isEnabled ? '✅ เปิดใช้งาน' : '⏸️ ปิดใช้งาน';
  document.getElementById('statusText').style.color = 
    currentStatus.isEnabled ? '#4CAF50' : '#999';
}

// โหลดสถานะเมื่อเปิด popup
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

// เริ่มต้น
loadStatus();

// รับ updates จาก background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'countUpdated') {
    currentStatus.cleanedCount = request.count;
    updateUI();
  }
});

// Toggle switch
document.getElementById('toggleSwitch').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  
  chrome.runtime.sendMessage({ 
    action: 'toggle', 
    enabled: enabled 
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Toggle error:', chrome.runtime.lastError);
      // Revert switch
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

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'resetCount' }, (response) => {
    if (response && response.success) {
      currentStatus.cleanedCount = 0;
      updateUI();
      console.log('Count reset');
    }
  });
});

// Refresh button (optional)
document.getElementById('refreshBtn')?.addEventListener('click', () => {
  loadStatus();
});