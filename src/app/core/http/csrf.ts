/**
 * Spring's CookieCsrfTokenRepository (withHttpOnlyFalse) sets a readable
 * XSRF-TOKEN cookie; mutating requests must echo it back as this header.
 */
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';

export function readCsrfToken(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function withCsrfHeader(): { withCredentials: true; headers?: Record<string, string> } {
  const token = readCsrfToken();
  return {
    withCredentials: true,
    ...(token ? { headers: { [CSRF_HEADER_NAME]: token } } : {}),
  };
}
