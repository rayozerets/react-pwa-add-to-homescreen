import { TPlatform, INavigator } from '../interfaces';

const testPlatform = {
  iPhone: /iphone/i,
  android: /android/i,
  safari: /Safari/i,
};

export function getPlatform(): TPlatform | null {
  const userAgent = window.navigator.userAgent;
  const navigator = window.navigator as INavigator;

  const isPwaIOS = !!navigator?.standalone;
  const isPwaChrome = window.matchMedia('(display-mode: standalone)').matches;

  const isChromium = 'onbeforeinstallprompt' in window;
  const isAndroid = testPlatform.android.test(userAgent);

  const isSafari = testPlatform.safari.test(userAgent);
  const isIPhone = testPlatform.iPhone.test(userAgent);

  if (isPwaIOS || isPwaChrome) {
    return 'standalone';
  } else if (isIPhone && isSafari) {
    return 'safari-iphone';
  } else if (isChromium && isAndroid) {
    return 'chromium-android';
  }

  return null;
}
