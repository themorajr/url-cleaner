const statusTextEl = document.getElementById('statusText');
const toggleSwitch = document.getElementById('toggleSwitch');
const cleanedCountEl = document.getElementById('cleanedCount');
const pauseSelect = document.getElementById('pauseSelect');
const pauseButton = document.getElementById('pauseBtn');
const resumeButton = document.getElementById('resumeBtn');
const pauseInfoEl = document.getElementById('pauseInfo');
const toggleSiteButton = document.getElementById('toggleSiteBtn');
const currentDomainEl = document.getElementById('currentDomain');
const excludedListEl = document.getElementById('excludedList');
const resetButton = document.getElementById('resetBtn');
const refreshButton = document.getElementById('refreshBtn');

let currentStatus = {
  isEnabled: true,
  cleanedCount: 0,
  excludedDomains: [],
  pauseUntil: null,
  isPaused: false
};

let currentDomain = null;

function applyStatusUpdate(status) {
  if (!status) {
    return;
  }

  const pauseUntil = typeof status.pauseUntil === 'number' ? status.pauseUntil : null;
  currentStatus = {
    ...currentStatus,
    ...status,
    pauseUntil,
    excludedDomains: Array.isArray(status.excludedDomains)
      ? status.excludedDomains
      : currentStatus.excludedDomains,
    isPaused: Boolean(pauseUntil && Date.now() < pauseUntil)
  };

  updateUI();
}

function updateUI() {
  if (toggleSwitch) {
    toggleSwitch.checked = currentStatus.isEnabled;
  }

  if (cleanedCountEl) {
    cleanedCountEl.textContent = currentStatus.cleanedCount;
  }

  const domainExcluded = Boolean(
    currentDomain && currentStatus.excludedDomains.includes(currentDomain)
  );

  if (statusTextEl) {
    let text = '✅ Enabled';
    let color = '#4CAF50';

    if (!currentStatus.isEnabled) {
      text = '⏸️ Disabled';
      color = '#F44336';
    } else if (currentStatus.isPaused) {
      text = '⏳ Paused';
      color = '#FF9800';
    } else if (domainExcluded) {
      text = '🚫 Excluded on this site';
      color = '#FF7043';
    }

    statusTextEl.textContent = text;
    statusTextEl.style.color = color;
  }

  if (pauseSelect) {
    pauseSelect.disabled = !currentStatus.isEnabled;
  }
  if (pauseButton) {
    pauseButton.disabled = !currentStatus.isEnabled;
  }
  if (resumeButton) {
    resumeButton.disabled = !currentStatus.isPaused;
  }

  if (pauseInfoEl) {
    pauseInfoEl.textContent = formatPauseInfo();
  }

  if (currentDomainEl) {
    currentDomainEl.textContent = currentDomain || 'Unavailable';
  }

  if (toggleSiteButton) {
    toggleSiteButton.disabled = !currentDomain || !currentStatus.isEnabled;
    toggleSiteButton.textContent = domainExcluded ? '✅ Include' : '🚫 Exclude';
  }

  renderExcludedDomains();
}

function renderExcludedDomains() {
  if (!excludedListEl) {
    return;
  }

  excludedListEl.innerHTML = '';

  if (!currentStatus.excludedDomains.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty';
    emptyItem.textContent = 'No sites excluded yet.';
    excludedListEl.appendChild(emptyItem);
    return;
  }

  currentStatus.excludedDomains
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .forEach((domain) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = domain;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-button';
      removeBtn.textContent = '✖ Remove';
      removeBtn.addEventListener('click', () => {
        updateDomainExclusion(domain, false);
      });
      item.appendChild(label);
      item.appendChild(removeBtn);
      excludedListEl.appendChild(item);
    });
}

function formatPauseInfo() {
  if (!currentStatus.isPaused || !currentStatus.pauseUntil) {
    return 'Not paused';
  }

  const remainingMs = currentStatus.pauseUntil - Date.now();
  if (remainingMs <= 0) {
    return 'Not paused';
  }

  const endTime = new Date(currentStatus.pauseUntil);
  const timeString = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `Paused until ${timeString} (${humanizeDuration(remainingMs)} left)`;
}

function humanizeDuration(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  if (totalMinutes <= 1) {
    return '<1m';
  }

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 && days === 0) {
    parts.push(`${minutes}m`);
  }

  return parts.join(' ');
}

function refreshCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error('Error querying active tab:', chrome.runtime.lastError);
      currentDomain = null;
      updateUI();
      return;
    }
    const [tab] = tabs;
    currentDomain = tab ? extractHostname(tab.url) : null;
    updateUI();
  });
}

function extractHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

function updateDomainExclusion(domain, exclude) {
  chrome.runtime.sendMessage(
    {
      action: 'updateExcludedDomain',
      domain,
      exclude
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error updating exclusions:', chrome.runtime.lastError);
        return;
      }
      if (response?.success) {
        currentStatus.excludedDomains = Array.isArray(response.excludedDomains)
          ? response.excludedDomains
          : currentStatus.excludedDomains;
        currentStatus.isPaused = Boolean(
          currentStatus.pauseUntil && Date.now() < currentStatus.pauseUntil
        );
        updateUI();
      }
    }
  );
}

function loadStatus() {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }
    applyStatusUpdate(response);
    refreshCurrentTab();
  });
}

loadStatus();
refreshCurrentTab();

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'statusUpdated') {
    applyStatusUpdate(request.status);
    refreshCurrentTab();
  } else if (request.action === 'countUpdated') {
    currentStatus.cleanedCount = request.count;
    updateUI();
  }
});

if (toggleSwitch) {
  toggleSwitch.addEventListener('change', (event) => {
    const enabled = event.target.checked;
    chrome.runtime.sendMessage(
      {
        action: 'toggle',
        enabled
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Toggle error:', chrome.runtime.lastError);
          event.target.checked = !enabled;
          return;
        }
        if (response?.success) {
          currentStatus.isEnabled = enabled;
          currentStatus.pauseUntil = null;
          currentStatus.isPaused = false;
          updateUI();
        }
      }
    );
  });
}

if (pauseButton) {
  pauseButton.addEventListener('click', () => {
    if (!pauseSelect) {
      return;
    }
    const minutes = Number(pauseSelect.value);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'pause',
        minutes
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Pause error:', chrome.runtime.lastError);
          return;
        }
        if (response?.success) {
          currentStatus.pauseUntil = response.pauseUntil;
          currentStatus.isPaused = true;
          updateUI();
        }
      }
    );
  });
}

if (resumeButton) {
  resumeButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resume' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Resume error:', chrome.runtime.lastError);
        return;
      }
      if (response?.success) {
        currentStatus.pauseUntil = null;
        currentStatus.isPaused = false;
        updateUI();
      }
    });
  });
}

if (toggleSiteButton) {
  toggleSiteButton.addEventListener('click', () => {
    if (!currentDomain) {
      return;
    }
    const isExcluded = currentStatus.excludedDomains.includes(currentDomain);
    updateDomainExclusion(currentDomain, !isExcluded);
  });
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetCount' }, (response) => {
      if (response?.success) {
        currentStatus.cleanedCount = 0;
        updateUI();
      }
    });
  });
}

refreshButton?.addEventListener('click', () => {
  loadStatus();
});
