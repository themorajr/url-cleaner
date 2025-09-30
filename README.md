# 🧹 Clean URL - Remove UTM & Tracking Parameters

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-orange?logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1-green.svg)](manifest.json)

> Clean, privacy-friendly links for every click — ลบพารามิเตอร์ติดตามออกจากลิงก์เพื่อความเป็นส่วนตัวที่ดียิ่งขึ้น

[English](#english) | [ไทย](#thai)

---

## <a name="english"></a>🌐 English

### 📖 Overview
Clean URL is a lightweight Chrome extension that automatically strips tracking parameters (UTM tags, social media IDs, email campaign codes, and more) from the pages you visit. Keep your browsing private, share tidy URLs, and reduce the noise when saving bookmarks.

**Before**
```
https://example.com/product?utm_source=facebook&utm_medium=social&fbclid=IwAR123...
```
**After**
```
https://example.com/product
```

### ✨ Key Features
- 🚀 **Automatic Cleaning** – Remove tracking parameters the instant a page loads.
- 🔒 **Privacy Protection** – Stops 40+ known marketing and analytics tags.
- 📊 **Built-in Counter** – Track how many URLs have been cleaned.
- 🎯 **Multi-Platform Coverage** – Works across Facebook, Google, Twitter/X, TikTok, Instagram, LinkedIn, and more.
- ⚡ **Lightweight** – Minimal performance impact with no external dependencies.
- 🎨 **Simple UI** – Toggle the extension on/off directly from the popup.

### 🛡️ Covered Parameters
- **UTM Campaigns** – `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`.
- **Social Platforms** – Facebook (`fbclid`, `fb_action_ids`, `fb_action_types`, `fb_ref`, `fb_source`), Google (`gclid`, `gclsrc`, `dclid`, `gbraid`, `wbraid`), Twitter/X (`twclid`, `tw_source`, `tw_campaign`), TikTok (`ttclid`, `tt_medium`, `tt_content`), Instagram (`igshid`, `igsh`), LinkedIn (`li_fat_id`, `lipi`).
- **Marketing & Analytics** – Microsoft/Bing (`msclkid`, `mc_cid`, `mc_eid`), email marketing (`mkt_tok`, `_hsenc`, `_hsmi`, `vero_id`), affiliate & referral (`ref`, `referrer`, `source`, `campaign`), analytics (`_ga`, `_gl`, `_ke`, `yclid`).
- ✅ [Full allowlist/denylist in `background.js`](background.js)

### 📦 Installation
**From Chrome Web Store (recommended)**
1. Visit the Chrome Web Store page (coming soon).
2. Click **Add to Chrome**.
3. Confirm the installation dialog.
4. Start browsing – the extension works immediately.

**Manual installation (Developer Mode)**
1. Clone or download this repository.
   ```bash
   git clone https://github.com/yourusername/clean-url-extension.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the cloned folder.

### 🧪 Usage Tips
- The popup shows how many URLs were cleaned during your browsing session.
- Toggle the switch in the popup to temporarily pause cleaning.
- Right-click the extension icon to access Chrome’s extension settings for permissions and site access.

### ❓ FAQ
**Does this break referral programs?**  
Tracking parameters are removed before the page loads, so some referral programs that depend on them may not record the referral. Toggle the extension off if you need to keep a specific parameter.

**Can I add my own parameters?**  
Not yet. Future versions will include a custom rule editor.

### 🤝 Contributing
Pull requests and issue reports are welcome. Please open a discussion describing the enhancement or bug before submitting a PR.

### 📄 License
Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

## <a name="thai"></a>🇹🇭 ภาษาไทย

### 📖 ภาพรวม
Clean URL เป็นส่วนขยาย Chrome ที่ช่วยลบพารามิเตอร์ติดตาม (เช่น UTM, โค้ดโซเชียลมีเดีย, โค้ดแคมเปญอีเมล) ออกจากลิงก์โดยอัตโนมัติ ทำให้คุณเรียกดูเว็บไซต์ได้อย่างเป็นส่วนตัว แชร์ลิงก์ที่สั้นและอ่านง่าย และเก็บบุ๊กมาร์กให้สะอาดขึ้น

**ก่อน**
```
https://example.com/product?utm_source=facebook&utm_medium=social&fbclid=IwAR123...
```
**หลัง**
```
https://example.com/product
```

### ✨ คุณสมบัติเด่น
- 🚀 **ทำงานอัตโนมัติ** – ลบพารามิเตอร์ทันทีที่หน้าเว็บถูกเปิด
- 🔒 **ปกป้องความเป็นส่วนตัว** – กำจัดโค้ดติดตามที่รู้จักกว่า 40 รายการ
- 📊 **มีตัวนับในตัว** – แสดงจำนวนลิงก์ที่ถูกทำความสะอาด
- 🎯 **รองรับหลายแพลตฟอร์ม** – ใช้ได้กับ Facebook, Google, Twitter/X, TikTok, Instagram, LinkedIn และอื่น ๆ
- ⚡ **ทำงานรวดเร็ว** – ไม่กินทรัพยากร ไม่พึ่งพาบริการภายนอก
- 🎨 **หน้าตาใช้งานง่าย** – เปิด/ปิดส่วนขยายได้จากหน้าต่างป๊อปอัป

### 🛡️ พารามิเตอร์ที่รองรับ
- **UTM Campaigns** – `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`
- **โซเชียลแพลตฟอร์ม** – Facebook (`fbclid`, `fb_action_ids`, `fb_action_types`, `fb_ref`, `fb_source`), Google (`gclid`, `gclsrc`, `dclid`, `gbraid`, `wbraid`), Twitter/X (`twclid`, `tw_source`, `tw_campaign`), TikTok (`ttclid`, `tt_medium`, `tt_content`), Instagram (`igshid`, `igsh`), LinkedIn (`li_fat_id`, `lipi`)
- **การตลาดและวิเคราะห์** – Microsoft/Bing (`msclkid`, `mc_cid`, `mc_eid`), อีเมลมาร์เก็ตติ้ง (`mkt_tok`, `_hsenc`, `_hsmi`, `vero_id`), ลิงก์พันธมิตรและอ้างอิง (`ref`, `referrer`, `source`, `campaign`), เครื่องมือวิเคราะห์ (`_ga`, `_gl`, `_ke`, `yclid`)
- ✅ [ดูรายการเต็มใน `background.js`](background.js)

### 📦 การติดตั้ง
**ผ่าน Chrome Web Store (แนะนำ)**
1. ไปที่หน้าส่วนขยายใน Chrome Web Store (ลิงก์กำลังจะมาเร็ว ๆ นี้)
2. คลิก **Add to Chrome**
3. ยืนยันการติดตั้ง
4. เริ่มใช้งานได้ทันที

**ติดตั้งด้วยตนเอง (Developer Mode)**
1. ดาวน์โหลดหรือโคลนโปรเจกต์นี้
   ```bash
   git clone https://github.com/yourusername/clean-url-extension.git
   ```
2. เปิด Chrome แล้วไปที่ `chrome://extensions/`
3. เปิด **Developer mode** (สวิตช์มุมบนขวา)
4. คลิก **Load unpacked** แล้วเลือกโฟลเดอร์โปรเจกต์

### 🧪 เคล็ดลับการใช้งาน
- หน้าต่างป๊อปอัปจะแสดงจำนวนลิงก์ที่ถูกทำความสะอาดในระหว่างที่คุณท่องเว็บ
- ใช้สวิตช์ในป๊อปอัปเพื่อหยุดการทำงานชั่วคราวเมื่อจำเป็น
- คลิกขวาที่ไอคอนส่วนขยายเพื่อเข้าไปยังการตั้งค่าและสิทธิ์การเข้าถึงของ Chrome

### ❓ คำถามที่พบบ่อย
**จะกระทบกับโปรแกรมแนะนำเพื่อนหรือไม่?**  
ระบบจะลบพารามิเตอร์ก่อนที่หน้าเว็บจะโหลด จึงอาจทำให้บางโปรแกรมแนะนำเพื่อนไม่บันทึกข้อมูล หากต้องการเก็บพารามิเตอร์บางตัวไว้ ให้ปิดส่วนขยายชั่วคราว

**สามารถเพิ่มพารามิเตอร์เองได้ไหม?**  
ยังไม่ได้ในเวอร์ชันนี้ แต่มีแผนพัฒนาฟีเจอร์เพิ่มกฎเองในอนาคต

### 🤝 การมีส่วนร่วม
ยินดีรับคำแนะนำและ Pull Request หากพบปัญหาหรืออยากเพิ่มฟีเจอร์ กรุณาเปิดประเด็นพูดคุยก่อนส่ง PR

### 📄 ลิขสิทธิ์
เผยแพร่ภายใต้สัญญาอนุญาต MIT อ่านเพิ่มเติมได้ที่ [`LICENSE`](LICENSE)
