import { db } from '../db/index.js'
import { usersTable } from '../models/user.model.js';
import {eq} from "drizzle-orm";
import {hashedPasswordWithSalt} from "../utils/hash.js";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return existingUser;
}


export async function createUser(name, email, salt, password) {
  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      salt,
      password
    }).returning({ id: usersTable.id });

  return user;
}


