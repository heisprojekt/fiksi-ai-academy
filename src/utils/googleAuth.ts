export interface GoogleJwtPayload {
  iss: string;
  nbf?: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * Decodes the Google OAuth credential JWT token safely in browser
 */
export function parseGoogleJwt(token: string): GoogleJwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error decoding Google JWT token:', err);
    return null;
  }
}

export const DEFAULT_GOOGLE_CLIENT_ID = '1047310856147-9ovt6h51ijdq9ipcguo10gei3ij66cck.apps.googleusercontent.com';

/**
 * Gets configured Google Client ID from environment variables, localStorage, or default fallback
 */
export function getGoogleClientId(): string {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const customId = typeof window !== 'undefined' ? localStorage.getItem('fiksi_custom_google_client_id') : null;
  return envId || customId || DEFAULT_GOOGLE_CLIENT_ID;
}

/**
 * Checks if a valid Google Client ID is configured
 */
export function isGoogleClientConfigured(): boolean {
  const id = getGoogleClientId();
  return Boolean(id && !id.includes('samplegoogleclientid') && id.includes('.apps.googleusercontent.com'));
}
