export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    getCookie('token') ||
    getCookie('auth_token') ||
    getCookie('jwt') ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token')
  );
};