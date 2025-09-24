import express from 'express';

export async function checkIfUserExists(existingUser, req, res) {
  if(existingUser) return res
    .status(409)
    .json({ error: 'Email already in use' });
}