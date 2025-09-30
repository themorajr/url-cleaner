// รายการ parameters ที่ต้องการลบ
const TRACKING_PARAMS = [
  // UTM Parameters
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
  
  // Facebook
  'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_ref', 'fb_source',
  
  // Google
  'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
  
  // Twitter/X
  'twclid', 'tw_source', 'tw_campaign',
  
  // TikTok
  'ttclid', 'tt_medium', 'tt_content',
  
  // LinkedIn
  'li_fat_id', 'lipi',
  
  // Microsoft/Bing
  'msclkid', 'mc_cid', 'mc_eid',
  
  // Instagram
  'igshid', 'igsh',
  
  // Email Marketing
  'mkt_tok', '_hsenc', '_hsmi', 'vero_id',
  
  // Affiliate & Marketing
  'ref', 'referrer', 'source', 'campaign',
  
  // Analytics
  '_ga', '_gl', '_ke', 'yclid',
  
  // Others
  'spm', 'scm', 'share_from', 'sender_device',
  'socialshare', 'share_source', 'fromModule'
];

// State
let settings = {
  isEnabled: true,
  cleanedCount: 0
};

// โหลดการตั้งค่าตอนเริ่มต้น
chrome.storage.sync.get(['isEnabled', 'cleanedCount'], (result) => {
  settings.isEnabled = result.isEnabled !== false;
  settings.cleanedCount = result.cleanedCount || 0;
  updateBadge();
  console.log('Clean URL: Loaded settings', settings);
});

// ฟังก์ชันทำความสะอาด URL
function cleanURL(url) {
  try {
    const urlObj = new URL(url);
    const originalParams = Array.from(urlObj.searchParams.keys());
    let hasTracking = false;

    // ลบ parameters ที่อยู่ในรายการ
    TRACKING_PARAMS.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        hasTracking = true;
      }
    });

    if (hasTracking) {
      // สร้าง URL ใหม่
      let cleanedURL = urlObj.origin + urlObj.pathname;
      
      // เพิ่ม query parameters ที่เหลือ (ถ้ามี)
      const remainingParams = urlObj.searchParams.toString();
      if (remainingParams) {
        cleanedURL += '?' + remainingParams;
      }
      
      // เพิ่ม hash (ถ้ามี)
      if (urlObj.hash) {
        cleanedURL += urlObj.hash;
      }
      
      console.log('Clean URL: Cleaned', {
        original: url,
        cleaned: cleanedURL,
        removed: originalParams.filter(p => TRACKING_PARAMS.includes(p))
      });
      
      return cleanedURL;
    }

    return null;
  } catch (e) {
    console.error('Clean URL: Error parsing URL', e);
    return null;
  }
}

// อัพเดท badge
function updateBadge() {
  if (settings.cleanedCount > 0) {
    chrome.action.setBadgeText({ text: settings.cleanedCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// เพิ่มจำนวนการ clean
function incrementCount() {
  settings.cleanedCount++;
  chrome.storage.sync.set({ cleanedCount: settings.cleanedCount });
  updateBadge();
  
  // แจ้ง popup ให้อัพเดท (ถ้าเปิดอยู่)
  chrome.runtime.sendMessage({ 
    action: 'countUpdated', 
    count: settings.cleanedCount 
  }).catch(() => {
    // Popup ไม่ได้เปิดอยู่ - ไม่ต้องทำอะไร
  });
}

// ดักจับการเปลี่ยน URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // ตรวจสอบว่าเปิดใช้งานหรือไม่
  if (!settings.isEnabled) {
    console.log('Clean URL: Disabled');
    return;
  }

  // ตรวจสอบว่ามี URL และกำลัง loading
  if (changeInfo.url && tab.url) {
    const cleanedURL = cleanURL(changeInfo.url);
    
    if (cleanedURL && cleanedURL !== changeInfo.url) {
      console.log('Clean URL: Redirecting tab', tabId);
      chrome.tabs.update(tabId, { url: cleanedURL });
      incrementCount();
    }
  }
});

// ดักจับการนำทางใหม่
chrome.webNavigation.onCommitted.addListener((details) => {
  // เฉพาะ main frame และเปิดใช้งาน
  if (!settings.isEnabled || details.frameId !== 0) {
    return;
  }

  const cleanedURL = cleanURL(details.url);
  
  if (cleanedURL && cleanedURL !== details.url) {
    console.log('Clean URL: Redirecting navigation', details.tabId);
    chrome.tabs.update(details.tabId, { url: cleanedURL });
    incrementCount();
  }
});

// รับคำสั่งจาก popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Clean URL: Received message', request);
  
  if (request.action === 'toggle') {
    settings.isEnabled = request.enabled;
    chrome.storage.sync.set({ isEnabled: settings.isEnabled });
    console.log('Clean URL: Toggled', settings.isEnabled);
    sendResponse({ success: true, isEnabled: settings.isEnabled });
    
  } else if (request.action === 'getStatus') {
    sendResponse({ 
      isEnabled: settings.isEnabled, 
      cleanedCount: settings.cleanedCount 
    });
    
  } else if (request.action === 'resetCount') {
    settings.cleanedCount = 0;
    chrome.storage.sync.set({ cleanedCount: 0 });
    updateBadge();
    console.log('Clean URL: Reset count');
    sendResponse({ success: true });
  }
  
  return true; // เก็บ channel เปิดไว้สำหรับ async response
});

// ฟังการเปลี่ยนแปลง storage จาก tab อื่น
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.isEnabled) {
      settings.isEnabled = changes.isEnabled.newValue;
      console.log('Clean URL: Settings synced - isEnabled:', settings.isEnabled);
    }
    if (changes.cleanedCount) {
      settings.cleanedCount = changes.cleanedCount.newValue;
      updateBadge();
    }
  }
});

console.log('Clean URL: Background script loaded');