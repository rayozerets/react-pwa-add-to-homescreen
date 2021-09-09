import { TPlatform, INavigator } from '../interfaces';

const testPlatform = {
  iPhone: /iphone/i,
  android: /android/i,
  chrome: /Chrome/i,
  criOS: /CriOS/i,
  safari: /Safari/i,
};

export function getPlatform(): TPlatform | null {
  const navigator = window.navigator as INavigator;
  const userAgent = navigator.userAgent;

  const isPwaIOS = !!navigator?.standalone;
  const isPwaChrome = window.matchMedia('(display-mode: standalone)').matches;

  const isChromium = 'onbeforeinstallprompt' in window;
  const isAndroid = testPlatform.android.test(userAgent);

  const isChrome = testPlatform.chrome.test(userAgent);
  const isSafari = testPlatform.safari.test(userAgent);
  const isCriOS = testPlatform.criOS.test(userAgent);
  const isIPhone = testPlatform.iPhone.test(userAgent);

  if (isPwaIOS || isPwaChrome) {
    return 'standalone';
  } else if (isIPhone && isSafari && !isCriOS) {
    return 'safari-iphone';
  } else if (isChrome && isChromium && isAndroid) {
    return 'chrome-android';
  } else if (isChromium && isAndroid) {
    return 'chromium-android';
  }

  return null;
}
