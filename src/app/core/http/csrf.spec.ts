import { readCsrfToken, withCsrfHeader } from './csrf';

describe('csrf', () => {
  afterEach(() => {
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('readCsrfToken() returns null when no cookie is set', () => {
    expect(readCsrfToken()).toBeNull();
  });

  it('readCsrfToken() reads and decodes the XSRF-TOKEN cookie', () => {
    document.cookie = 'XSRF-TOKEN=abc%2Fdef';
    expect(readCsrfToken()).toBe('abc/def');
  });

  it('withCsrfHeader() includes withCredentials and the header when a token exists', () => {
    document.cookie = 'XSRF-TOKEN=test-token';
    expect(withCsrfHeader()).toEqual({
      withCredentials: true,
      headers: { 'X-XSRF-TOKEN': 'test-token' },
    });
  });

  it('withCsrfHeader() omits the header when no token exists', () => {
    expect(withCsrfHeader()).toEqual({ withCredentials: true });
  });
});
