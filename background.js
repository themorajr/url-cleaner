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
  cleanedCount: 0,
  excludedDomains: [],
  pauseUntil: null
};

let activeTabId = null;
let activeTabDomain = null;

// Load settings on startup
chrome.storage.sync.get(['isEnabled', 'cleanedCount', 'excludedDomains', 'pauseUntil'], (result) => {
  settings.isEnabled = result.isEnabled !== false;
  settings.cleanedCount = result.cleanedCount || 0;
  settings.excludedDomains = Array.isArray(result.excludedDomains) ? result.excludedDomains : [];
  settings.pauseUntil = typeof result.pauseUntil === 'number' ? result.pauseUntil : null;
  ensurePauseFreshness();
  determineActiveTab();
  updateBadge();
  console.log('Clean URL: Loaded settings', settings);
});

function determineActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.warn('Clean URL: Unable to query active tab', chrome.runtime.lastError);
      return;
    }
    const [tab] = tabs;
    if (tab) {
      activeTabId = tab.id;
      activeTabDomain = extractHostname(tab.url);
    } else {
      activeTabId = null;
      activeTabDomain = null;
    }
    updateBadge();
  });
}

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

  if (isTemporarilyPaused()) {
    chrome.action.setBadgeText({ text: '⏳' });
    chrome.action.setBadgeBackgroundColor({ color: '#9E9E9E' });
    return;
  }

  if (activeTabDomain && settings.excludedDomains.includes(activeTabDomain)) {
    chrome.action.setBadgeText({ text: '🚫' });
    chrome.action.setBadgeBackgroundColor({ color: '#9E9E9E' });
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
  notifyStatusChanged();
}

function notifyStatusChanged() {
  updateBadge();
  const status = getStatusPayload();
  chrome.runtime.sendMessage({
    action: 'statusUpdated',
    status
  }).catch(() => {
    // No listeners available
  });
}

function getStatusPayload() {
  return {
    isEnabled: settings.isEnabled,
    cleanedCount: settings.cleanedCount,
    excludedDomains: settings.excludedDomains,
    pauseUntil: settings.pauseUntil,
    isPaused: isTemporarilyPaused()
  };
}

function extractHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

function ensurePauseFreshness() {
  if (settings.pauseUntil && Date.now() >= settings.pauseUntil) {
    settings.pauseUntil = null;
    chrome.storage.sync.set({ pauseUntil: null });
  }
}

function isTemporarilyPaused() {
  ensurePauseFreshness();
  return Boolean(settings.pauseUntil && Date.now() < settings.pauseUntil);
}

function isDomainExcluded(url) {
  const hostname = extractHostname(url);
  return hostname ? settings.excludedDomains.includes(hostname) : false;
}

// Observe tab updates to trigger URL cleaning
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Skip if the extension is disabled
  if (!settings.isEnabled) {
    console.log('Clean URL: Disabled');
    return;
  }

  if (tabId === activeTabId && changeInfo.url) {
    activeTabDomain = extractHostname(changeInfo.url);
    updateBadge();
  }

  if (isTemporarilyPaused()) {
    console.log('Clean URL: Temporarily paused');
    updateBadge();
    return;
  }

  // Only process when the tab has a URL and it is changing
  if (changeInfo.url && tab.url) {
    if (isDomainExcluded(changeInfo.url)) {
      console.log('Clean URL: Domain excluded', extractHostname(changeInfo.url));
      return;
    }
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

  if (details.tabId === activeTabId) {
    activeTabDomain = extractHostname(details.url);
    updateBadge();
  }

  if (isTemporarilyPaused()) {
    console.log('Clean URL: Temporarily paused');
    return;
  }

  if (isDomainExcluded(details.url)) {
    console.log('Clean URL: Domain excluded', extractHostname(details.url));
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
    settings.pauseUntil = null;
    chrome.storage.sync.set({ isEnabled: settings.isEnabled, pauseUntil: null });
    notifyStatusChanged();
    console.log('Clean URL: Toggled', settings.isEnabled);
    sendResponse({ success: true, isEnabled: settings.isEnabled });

  } else if (request.action === 'getStatus') {
    sendResponse(getStatusPayload());

  } else if (request.action === 'resetCount') {
    settings.cleanedCount = 0;
    chrome.storage.sync.set({ cleanedCount: 0 });
    notifyStatusChanged();
    console.log('Clean URL: Reset count');
    sendResponse({ success: true });
  } else if (request.action === 'pause') {
    const durationMinutes = Number(request.minutes);
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      sendResponse({ success: false, error: 'Invalid duration' });
      return true;
    }
    settings.pauseUntil = Date.now() + durationMinutes * 60 * 1000;
    chrome.storage.sync.set({ pauseUntil: settings.pauseUntil });
    notifyStatusChanged();
    console.log('Clean URL: Paused until', new Date(settings.pauseUntil).toISOString());
    sendResponse({ success: true, pauseUntil: settings.pauseUntil });
  } else if (request.action === 'resume') {
    settings.pauseUntil = null;
    chrome.storage.sync.set({ pauseUntil: null });
    notifyStatusChanged();
    console.log('Clean URL: Pause cleared');
    sendResponse({ success: true });
  } else if (request.action === 'updateExcludedDomain') {
    const domain = request.domain;
    if (!domain) {
      sendResponse({ success: false, error: 'Invalid domain' });
      return true;
    }
    const shouldExclude = Boolean(request.exclude);
    const existingIndex = settings.excludedDomains.indexOf(domain);
    let changed = false;
    if (shouldExclude && existingIndex === -1) {
      settings.excludedDomains.push(domain);
      changed = true;
    } else if (!shouldExclude && existingIndex !== -1) {
      settings.excludedDomains.splice(existingIndex, 1);
      changed = true;
    }
    if (changed) {
      chrome.storage.sync.set({ excludedDomains: settings.excludedDomains });
      notifyStatusChanged();
      console.log('Clean URL: Updated exclusions', settings.excludedDomains);
    }
    sendResponse({ success: true, excludedDomains: settings.excludedDomains.slice() });
  }

  return true; // Keep the channel open for async responses
});

// Sync settings updates from other extension contexts
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    let shouldNotify = false;
    if (changes.isEnabled) {
      settings.isEnabled = changes.isEnabled.newValue;
      console.log('Clean URL: Settings synced - isEnabled:', settings.isEnabled);
      updateBadge();
      shouldNotify = true;
    }
    if (changes.cleanedCount) {
      settings.cleanedCount = changes.cleanedCount.newValue;
      updateBadge();
      shouldNotify = true;
    }
    if (changes.excludedDomains) {
      settings.excludedDomains = Array.isArray(changes.excludedDomains.newValue)
        ? changes.excludedDomains.newValue
        : [];
      updateBadge();
      shouldNotify = true;
    }
    if (changes.pauseUntil) {
      settings.pauseUntil = typeof changes.pauseUntil.newValue === 'number'
        ? changes.pauseUntil.newValue
        : null;
      updateBadge();
      shouldNotify = true;
    }
    if (shouldNotify) {
      notifyStatusChanged();
    }
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  activeTabId = tabId;
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.warn('Clean URL: Unable to get activated tab', chrome.runtime.lastError);
      activeTabDomain = null;
    } else {
      activeTabDomain = extractHostname(tab.url);
    }
    updateBadge();
  });
});

console.log('Clean URL: Background script loaded');
