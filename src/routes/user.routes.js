import {hashedPasswordWithSalt} from "../utils/hash.js";
import {createUser, getUserByEmail} from '../services/user.service.js';
import {checkIfUserExists} from "../middleware/user.middleware.js";
import jwt from "jsonwebtoken";

import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema
} from "../validations/request.validation.js";

import express from 'express';
import {createUserToken} from "../utils/token.js";
//***********************************************************************
//***********************************************************************




const router = express.Router();



// User Registration route
router.post('/register', async (req, res) => {
  // Validate request body
  const validationResult = await signupPostRequestBodySchema
    .safeParseAsync(req.body);

  // If validation fails, return 400 Bad Request
  if(validationResult.error) {
    return res.status(400).json({ error: validationResult.error.errors });
  }

  // Destructure validated user data
  const { name, email, password } = validationResult.data;

  // Check if a user already exists
  const existingUser = await getUserByEmail(email);

  // If a user exists, return 409 Conflict
  await checkIfUserExists(existingUser, req, res);

  // Hash the password
  const { salt, password: hashedPassword } = hashedPasswordWithSalt(password)

  // Create a new user
  const user = await createUser(name, email, salt, hashedPassword);

  // Return the new user's ID
  return res.status(201).json({data: {id: user.id}});
})




// User Login route
router.post('/login', async (req, res) => {
  const validationResult = await loginPostRequestBodySchema
    .safeParseAsync(req.body);

  // If validation fails, return 400 Bad Request
  if(validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  // Destructure validated user data
  const { email, password } = validationResult.data;

  // Check if a user exists
  const user = await getUserByEmail(email);

  // If a user does not exist, return 404 Not Found
  if(!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Compare the password
  const {password: hashedPassword} = hashedPasswordWithSalt(password, user.salt);

  // If the password does not match, return 401 Unauthorized
  if(user.password !== hashedPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Generate JWT token
  const token = await createUserToken({ id: user.id  })

  // Return the token
  return res.status(200).json({ token });
})

export default router;
