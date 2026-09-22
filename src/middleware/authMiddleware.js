const { verifyAccessToken } = require('../utils/jwt');

// Slide 12 ("Protected Request"): extract "Authorization: Bearer <token>",
// verify it, and attach the trusted user info to the request.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

    try {
    const payload = verifyAccessToken(token);
    console.log('6. Token decoded, this is who is asking:', payload);
    req.user = { id: payload.sub, role: payload.role };
    next();
    
  } catch (err) {
    // Covers expired, modified, and malformed tokens (slide 32's test cases).
    return res.status(401).json({ error: 'Invalid or expired access token.' });
  }
}

// Slide 21 (Role-Based Authorization): authentication alone never grants
// permission - the backend must separately check the role.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to do that.' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
