import jwt from 'jsonwebtoken';
import {userTokenSchema} from '../validations/token.validation.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUserToken(payload){
  const validationResult = await userTokenSchema.safeParseAsync(payload);

  if(validationResult.error) {
    throw new Error('Invalid token payload');
  }
  const payloadValidated = validationResult.data;

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '10m'});
  return token;
}


export function validateUserToken(token) {
  try{
    const payload = jwt.verify(token, JWT_SECRET);
  } catch(err){
    throw new Error('Invalid or expired token');
  }
  return payload
}