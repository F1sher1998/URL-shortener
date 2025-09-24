import {validateUserToken} from '../utils/token.js';

export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if(!authHeader) return next();

  if(!authHeader.startsWith('Bearer '))
    return res.status(400).json({ error: 'Invalid Authorization header format' });

  const [_, token] = authHeader.split(' ');

  const payload = validateUserToken(token);

  req.user = payload;

  next();

}


export async function checkForUserId(req, res, next) {
  if(!req.user.id || !req.user) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  next();
}