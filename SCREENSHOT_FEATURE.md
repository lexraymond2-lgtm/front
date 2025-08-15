# Screenshot Feature Documentation

## Overview
The share button now includes screenshot functionality that allows users to capture and download images of posts. This feature is available in both the Home page and Single Page post views.

## Features

### Screenshot Capability
- **High Quality**: Screenshots are captured at 2x scale for better quality
- **Automatic Download**: Screenshots are automatically downloaded as PNG files
- **Custom Filenames**: Files are named with post ID and timestamp (e.g., `post-123-1703123456789.png`)
- **Loading Indicator**: Browser title changes to "Taking screenshot..." during capture

### Share Options
When users click the share button, they are presented with two options:
1. **Screenshot**: Captures the post as an image and downloads it
2. **Link**: Copies the post URL to clipboard (with fallback for older browsers)

## Implementation

### Components Updated
- `SinglePage.jsx` - Share button in detailed post view
- `Home.jsx` - Share button in post list view

### Utility Functions
- `takeScreenshot()` - Captures DOM element and downloads as PNG
- `showShareOptions()` - Shows user choice dialog
- `copyToClipboard()` - Copies text with browser fallback

### Dependencies
- `html2canvas` - For DOM to canvas conversion
- `react-icons/fa` - For camera icon in share button

## Usage

### For Users
1. Click the share button (with camera icon) on any post
2. Choose between screenshot or link sharing
3. If screenshot is selected, the image will be automatically downloaded
4. If link is selected, the post URL will be copied to clipboard

### For Developers
The screenshot functionality is implemented as reusable utility functions in `src/utils/screenshot.js`:

```javascript
import { takeScreenshot, showShareOptions, copyToClipboard } from '../utils/screenshot';

// Take screenshot of an element
await takeScreenshot(element, filename);

// Show share options dialog
const { shouldTakeScreenshot, shouldCopyLink } = showShareOptions();

// Copy text to clipboard
await copyToClipboard(text);
```

## Technical Details

### Screenshot Configuration
- **Background**: White (#ffffff)
- **Scale**: 2x for high quality
- **Format**: PNG
- **CORS**: Enabled for cross-origin images
- **Taint**: Allowed for external content

### Browser Compatibility
- Modern browsers with `html2canvas` support
- Fallback clipboard methods for older browsers
- Native sharing API support when available

### File Naming Convention
Screenshots are saved with the format: `post-{postId}-{timestamp}.png`

## Future Enhancements
- Add screenshot preview before download
- Support for different image formats (JPEG, WebP)
- Custom screenshot areas
- Social media sharing integration
- Screenshot gallery/history


