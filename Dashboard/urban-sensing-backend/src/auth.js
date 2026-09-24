// Simple shared-secret auth — each bus device is provisioned with this key.
// Swap for per-device JWT/mTLS later; the middleware shape stays the same.

const API_KEY = 'bus-fleet-secret-key-2026'; // move to an env var in production

export function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing x-api-key header' });
  }
  next();
}