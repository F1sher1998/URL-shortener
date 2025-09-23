import { Router } from 'express';
import { db } from '../db/index.js'
import { usersTable } from '../models/user.model.js';
import {randomBytes, createHmac} from 'crypto'
import {signupPostRequestBodySchema} from "../validations/request.validation.js";
import express from 'express';
import {eq} from "drizzle-orm";

const router = express.Router();

router.post('/register', async (req, res) => {
  const validationResult = await signupPostRequestBodySchema
    .safeParseAsync(req.body);

  if(validationResult.error) {
    return res.status(400).json({ error: validationResult.error.errors });
  }

  const { name, email, password } = validationResult.data;

  const [existingUser] = await db
    .select(usersTable)
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if(existingUser) return res
    .status(409)
    .json({ error: 'Email already in use' });

  const salt = randomBytes(16).toString('hex');
  const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      salt,
      password: hashedPassword
    }).returning({ id: usersTable.id });

  return res.status(201).json({data: {id: user.id}});
})

export default router;
