# 🧹 Clean URL - Remove UTM & Tracking Parameters

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-orange?logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1-green.svg)](manifest.json)

> ส่วนขยาย Chrome ที่ลบ UTM parameters และ tracking parameters จาก URL อัตโนมัติ เพื่อความเป็นส่วนตัวและ URL ที่สะอาดกว่า

[English](#english) | [ไทย](#thai)

---

## <a name="english"></a>🌐 English

### 📖 Overview

Clean URL automatically removes tracking parameters from URLs, making them cleaner and protecting your privacy. Say goodbye to long, messy URLs filled with UTM tags and tracking codes!

**Before:**

`https://example.com/product?utm_source=facebook&utm_medium=social&fbclid=IwAR123...`

**After:**

`https://example.com/product`


### ✨ Features

- 🚀 **Automatic Cleaning** - Works instantly when you open any URL
- 🔒 **Privacy Protection** - Removes 40+ tracking parameters
- 📊 **Clean Counter** - Shows how many URLs you've cleaned
- 🎯 **Multi-Platform Support** - Facebook, Google, Twitter, TikTok, Instagram, LinkedIn, and more
- ⚡ **Lightweight** - Minimal resource usage
- 🎨 **Simple UI** - Easy toggle on/off
- 🌍 **Universal** - Works on all websites

### 🛡️ Supported Tracking Parameters

#### UTM Parameters
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`

#### Social Media Platforms
- **Facebook**: `fbclid`, `fb_action_ids`, `fb_action_types`, `fb_ref`, `fb_source`
- **Google**: `gclid`, `gclsrc`, `dclid`, `gbraid`, `wbraid`
- **Twitter/X**: `twclid`, `tw_source`, `tw_campaign`
- **TikTok**: `ttclid`, `tt_medium`, `tt_content`
- **Instagram**: `igshid`, `igsh`
- **LinkedIn**: `li_fat_id`, `lipi`

#### Marketing & Analytics
- **Microsoft/Bing**: `msclkid`, `mc_cid`, `mc_eid`
- **Email Marketing**: `mkt_tok`, `_hsenc`, `_hsmi`, `vero_id`
- **Affiliate**: `ref`, `referrer`, `source`, `campaign`
- **Analytics**: `_ga`, `_gl`, `_ke`, `yclid`

[See full list in source code](background.js)

### 📦 Installation

#### From Chrome Web Store (Recommended)
1. Visit [Chrome Web Store](#) (link coming soon)
2. Click "Add to Chrome"
3. Confirm installation
4. Done! 🎉

#### Manual Installation (Developer Mode)
1. Download or clone this repository
```git clone https://github.com/yourusername/clean-url-extension.git```
2. Open Chrome and navigate to chrome://extensions/
3. Enable Developer mode (toggle in top-right corner)
4. Click Load unpacked
5. Select the extension folder
   
The extension is now installed! ✅


