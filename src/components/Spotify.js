// src/Spotify.js
const clientId = '05400deab97c4bfda82a964bbd45682a';
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin + "/";
const scope = 'playlist-modify-public playlist-modify-private';

const AUTH_URL = new URL('https://accounts.spotify.com/authorize');
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

// ---- helpers ----
const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, v => chars[v % chars.length]).join('');
};
const sha256 = async (plain) => {
  const enc = new TextEncoder();
  const data = enc.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
};
const base64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

// ---- PKCE core (minimal) ----
async function loginWithPKCE() {
  const codeVerifier = generateRandomString(96);
  localStorage.setItem('code_verifier', codeVerifier);

  const codeChallenge = base64url(await sha256(codeVerifier));

  AUTH_URL.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }).toString();

  window.location.href = AUTH_URL.toString();
}

async function exchangeCodeForToken(code) {
  const codeVerifier = localStorage.getItem('code_verifier');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error?.message || 'Token exchange failed');
  }

  const now = Math.floor(Date.now() / 1000);
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('expires_at', String(now + (data.expires_in || 3600) - 60)); // 60s buffer

  // Remove ?code=... so reloads don’t re-exchange
  window.history.replaceState({}, document.title, redirectUri);
  return data.access_token;
}


let inFlightTokenPromise = null;

async function getAccessToken() {
  const token = localStorage.getItem('access_token');
  const expiresAt = Number(localStorage.getItem('expires_at') || 0);
  const now = Math.floor(Date.now() / 1000);

  // token present & fresh
  if (token && now < expiresAt) return token;

  if (inFlightTokenPromise) return inFlightTokenPromise;

  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    inFlightTokenPromise = (async () => {
      try { return await exchangeCodeForToken(code); }
      finally { inFlightTokenPromise = null; }
    })();
    return await inFlightTokenPromise; // string
  }

  // No valid token and no code → kick off login and return null (we'll redirect)
  inFlightTokenPromise = (async () => {
    try { await loginWithPKCE(); return null; } // redirects
    finally { inFlightTokenPromise = null; }
  })();
  return inFlightTokenPromise; // null
}


// ---- Course-style helpers ----
async function search(term) {
  const token = await getAccessToken();
  const q = encodeURIComponent(term.trim());
  const url = `https://api.spotify.com/v1/search?type=track&q=${q}`;

  const json = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const items = json?.tracks?.items || [];
  return items.map(t => ({
    id: t.id,
    name: t.name,
    artist: t.artists?.[0]?.name || '',
    album: t.album?.name || '',
    uri: t.uri,
  }));
}

async function savePlaylist(name, uris) {
  if (!name || !uris?.length) return;
  const token = await getAccessToken();

  // 1) who am I
  const me = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  // 2) create playlist
  const playlist = await fetch(`https://api.spotify.com/v1/users/${me.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, public: true, description: 'Created with Jammming' })
  }).then(r => r.json());

  // 3) add tracks
  await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uris })
  });
  return {
    playlistId: playlist.id,
    playlistUrl: playlist?.external_urls?.spotify
      || `https://open.spotify.com/playlist/${playlist.id}`
  };
}


const Spotify = { getAccessToken, search, savePlaylist };
export default Spotify;

