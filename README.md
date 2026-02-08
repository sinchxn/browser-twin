# Browser Twin

A Chrome extension that shows a floating digital twin at the bottom of the page. The twin’s mood depends on how many tabs you have open and which tab you’re on.

## States

- **Happy**: 3 or fewer tabs and you’re on tab index 0–2.
- **Mildly stressed**: 4–6 tabs.
- **Stressed**: 7+ tabs.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Replace the avatar

The extension uses three images in `assets/`:

- `avatar-happy.svg`
- `avatar-mildly-stressed.svg`
- `avatar-stressed.svg`

Replace these with your own (same names), or add PNGs and update the filenames in `content.js` (`STATE_FILE_NAMES` and the extension in `getAvatarSrc`).
