# 🧹 Clean URL - Remove UTM & Tracking Parameters

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-orange?logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1-green.svg)](manifest.json)

> Clean, privacy-friendly links for every click.

📚 **Documentation**
- 🇬🇧 [English (base language)](README.md)
- 📖 [README index](README_TRANSLATIONS.md)
- 🇹🇭 [ภาษาไทย (Thai)](README.th.md)

---

## 🌐 Overview
Clean URL is a lightweight Chrome extension that automatically strips tracking parameters (UTM tags, social media IDs, email campaign codes, and more) from the pages you visit. Keep your browsing private, share tidy URLs, and reduce the noise when saving bookmarks.

**Before**
```
https://example.com/product?utm_source=facebook&utm_medium=social&fbclid=IwAR123...
```
**After**
```
https://example.com/product
```

## ✨ Key Features
- 🚀 **Automatic Cleaning** – Remove tracking parameters the instant a page loads.
- 🔒 **Privacy Protection** – Stops 40+ known marketing and analytics tags.
- 📊 **Built-in Counter** – Track how many URLs have been cleaned.
- 🎯 **Multi-Platform Coverage** – Works across Facebook, Google, Twitter/X, TikTok, Instagram, LinkedIn, and more.
- ⚡ **Lightweight** – Minimal performance impact with no external dependencies.
- 🎨 **Simple UI** – Toggle the extension on/off directly from the popup.

## 🛡️ Covered Parameters
- **UTM Campaigns** – `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`.
- **Social Platforms** – Facebook (`fbclid`, `fb_action_ids`, `fb_action_types`, `fb_ref`, `fb_source`), Google (`gclid`, `gclsrc`, `dclid`, `gbraid`, `wbraid`), Twitter/X (`twclid`, `tw_source`, `tw_campaign`), TikTok (`ttclid`, `tt_medium`, `tt_content`), Instagram (`igshid`, `igsh`), LinkedIn (`li_fat_id`, `lipi`).
- **Marketing & Analytics** – Microsoft/Bing (`msclkid`, `mc_cid`, `mc_eid`), email marketing (`mkt_tok`, `_hsenc`, `_hsmi`, `vero_id`), affiliate & referral (`ref`, `referrer`, `source`, `campaign`), analytics (`_ga`, `_gl`, `_ke`, `yclid`).
- ✅ [Full allowlist/denylist in `background.js`](background.js)

## 📦 Installation
**From Chrome Web Store (coming soon)**
1. Visit the Chrome Web Store page.
2. Click **Add to Chrome**.
3. Confirm the installation dialog.
4. Start browsing – the extension works immediately.

**Manual installation (recommended via Releases)**
1. Download the latest release ZIP from the [GitHub Releases page](/releases).
2. Extract the archive to a convenient location on your computer.
3. Open Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the extracted folder.

## 🧪 Usage Tips
- The popup shows how many URLs were cleaned during your browsing session.
- Toggle the switch in the popup to temporarily pause cleaning.
- Right-click the extension icon to access Chrome’s extension settings for permissions and site access.

## ❓ FAQ
**Does this break referral programs?**
Tracking parameters are removed before the page loads, so some referral programs that depend on them may not record the referral. Toggle the extension off if you need to keep a specific parameter.

**Can I add my own parameters?**
Not yet. Future versions will include a custom rule editor.

## 🤝 Contributing
Pull requests and issue reports are welcome. Please open a discussion describing the enhancement or bug before submitting a PR.

## 📄 License
Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
