
export function setCookie(name: string, days: number) {
  const currentDate = new Date();
  const expires = new Date(currentDate.setDate(currentDate.getDate() + days))
  document.cookie = `${name}=notified; expires=${expires.toUTCString()};`;
}

export function getCookieValue(name: string) {
  const b = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}
