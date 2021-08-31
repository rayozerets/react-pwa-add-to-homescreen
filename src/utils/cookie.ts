import { TCookieVal } from '../interfaces';

export function setCookie(name: string, days: number, val: TCookieVal = 'notified') {
  const currentDate = new Date();
  const expires = new Date(currentDate.setDate(currentDate.getDate() + days));
  document.cookie = `${name}=${val}; expires=${expires.toUTCString()};`;
}

export function getCookieValue(name: string) {
  const b = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}
