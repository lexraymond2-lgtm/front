import html2canvas from 'html2canvas';

/**
 * Takes a screenshot of a DOM element and downloads it as a PNG file
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - The filename for the downloaded image
 * @param {Object} options - Additional options for html2canvas
 * @returns {Promise<void>}
 */
export const takeScreenshot = async (element, filename, options = {}) => {
  if (!element) {
    throw new Error('Element is required for screenshot');
  }

  try {
    // Show loading message
    const originalText = document.title;
    document.title = 'Taking screenshot...';

    const defaultOptions = {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight
    };

    const canvas = await html2canvas(element, { ...defaultOptions, ...options });

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `screenshot-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            resolve();
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    });

  } catch (err) {
    console.error('Error taking screenshot:', err);
    throw err;
  } finally {
    // Restore original title
    document.title = originalText;
  }
};

/**
 * Shows a confirmation dialog for sharing options
 * @param {string} message - The message to show
 * @returns {Object} - Object with shouldTakeScreenshot and shouldCopyLink boolean values
 */
export const showShareOptions = (message = 'How would you like to share this post?') => {
  const userChoice = window.confirm(
    `${message}\n\n` +
    'Click OK for Screenshot\n' +
    'Click Cancel for Link only'
  );
  
  return {
    shouldTakeScreenshot: userChoice,
    shouldCopyLink: !userChoice
  };
};

/**
 * Copies text to clipboard with fallback for older browsers
 * @param {string} text - The text to copy
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};


