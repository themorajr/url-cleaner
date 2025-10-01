// List of tracking parameters to remove
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

// Extension state persisted in storage
let settings = {
  isEnabled: true,
  cleanedCount: 0
};

// Load settings on startup
chrome.storage.sync.get(['isEnabled', 'cleanedCount'], (result) => {
  settings.isEnabled = result.isEnabled !== false;
  settings.cleanedCount = result.cleanedCount || 0;
  updateBadge();
  console.log('Clean URL: Loaded settings', settings);
});

// URL cleaning helper
function cleanURL(url) {
  try {
    const urlObj = new URL(url);
    const originalParams = Array.from(urlObj.searchParams.keys());
    let hasTracking = false;

    // Remove parameters that match the denylist
    TRACKING_PARAMS.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        hasTracking = true;
      }
    });

    if (hasTracking) {
      // Build the cleaned URL
      let cleanedURL = urlObj.origin + urlObj.pathname;

      // Re-append remaining query parameters (if any)
      const remainingParams = urlObj.searchParams.toString();
      if (remainingParams) {
        cleanedURL += '?' + remainingParams;
      }

      // Preserve the hash fragment (if present)
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

// Update badge text and color
function updateBadge() {
  if (!settings.isEnabled) {
    chrome.action.setBadgeText({ text: '⏸' });
    chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
    return;
  }

  if (settings.cleanedCount > 0) {
    chrome.action.setBadgeText({ text: settings.cleanedCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Increment the cleaned counter and persist it
function incrementCount() {
  settings.cleanedCount++;
  chrome.storage.sync.set({ cleanedCount: settings.cleanedCount });
  updateBadge();

  // Notify the popup to refresh (if it is open)
  chrome.runtime.sendMessage({
    action: 'countUpdated',
    count: settings.cleanedCount
  }).catch(() => {
    // Popup is not open - nothing to do
  });
}

// Observe tab updates to trigger URL cleaning
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Skip if the extension is disabled
  if (!settings.isEnabled) {
    console.log('Clean URL: Disabled');
    return;
  }

  // Only process when the tab has a URL and it is changing
  if (changeInfo.url && tab.url) {
    const cleanedURL = cleanURL(changeInfo.url);

    if (cleanedURL && cleanedURL !== changeInfo.url) {
      console.log('Clean URL: Redirecting tab', tabId);
      chrome.tabs.update(tabId, { url: cleanedURL });
      incrementCount();
    }
  }
});

// Catch new navigations for additional safety
chrome.webNavigation.onCommitted.addListener((details) => {
  // Only handle the main frame while enabled
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

// Listen for commands from the popup UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Clean URL: Received message', request);

  if (request.action === 'toggle') {
    settings.isEnabled = request.enabled;
    chrome.storage.sync.set({ isEnabled: settings.isEnabled });
    updateBadge();
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

  return true; // Keep the channel open for async responses
});

// Sync settings updates from other extension contexts
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.isEnabled) {
      settings.isEnabled = changes.isEnabled.newValue;
      console.log('Clean URL: Settings synced - isEnabled:', settings.isEnabled);
      updateBadge();
    }
    if (changes.cleanedCount) {
      settings.cleanedCount = changes.cleanedCount.newValue;
      updateBadge();
    }
  }
});

console.log('Clean URL: Background script loaded');
