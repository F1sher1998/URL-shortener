import { db } from '../db/index.js'
import {urlsTable} from '../models/model.exporter.js'
import {eq} from "drizzle-orm";

export async function shorteningUrls(shortCode, url, req, res) {
  const [result] = await db.insert(urlsTable).values({
    shortCode: shortCode,
    targetURL: url,
    userId: req.user.id,
  }).returning({
    id: urlsTable.id,
    shortCode: urlsTable.shortCode,
    targetURL: urlsTable.targetURL,
  })
  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL
  });
}


export async function getOriginalWebsite(code) {
  const [result] = await db
    .select({targetURL: urlsTable.targetURL})
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  return result;
}