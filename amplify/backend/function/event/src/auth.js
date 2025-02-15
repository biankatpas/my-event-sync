const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const region = process.env.AWS_REGION;
const userPoolId = process.env.COGNITO_USER_POOL_ID;

const jwksUri = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

const client = jwksClient({
  jwksUri,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

/**
 * Checks the request authentication.
 * - If the HTTP method is GET, it allows the request without authentication.
 * - For POST, PUT, and DELETE, it requires an Authorization header with a valid JWT.
 *
 * @param {Object} event - The Lambda event object.
 * @returns {Promise<Object>} - Returns an object indicating whether the request is authenticated, and the user data if applicable.
 * @throws {Error} - Throws an error if the Authorization header is missing or if the token is invalid.
 */
async function checkAuth(event) {
  if (event.httpMethod === 'GET') {
    return { isAuthenticated: false, message: 'GET method - authentication not required' };
  }

  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    throw new Error('Invalid Authorization header format. Expected: Bearer <token>');
  }
  const token = tokenParts[1];

  try {
    const decoded = await validateToken(token);
    return { isAuthenticated: true, user: decoded };
  } catch (err) {
    throw new Error('Invalid token: ' + err.message);
  }
}

module.exports = { checkAuth };
