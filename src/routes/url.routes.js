import express from 'express';
import {nanoid} from 'nanoid';
import {shortenPostRequestBodySchema} from '../validations/request.validation.js';
import { checkForUserId } from '../middleware/auth.middleware.js';
import {getOriginalWebsite, shorteningUrls} from '../services/url.service.js';
import {urlsTable} from "../models/url.model.js";
import {eq} from "drizzle-orm";
import {db} from "../db/index.js";

const router = express.Router();


router.post('/shorten', checkForUserId, async (req, res) => {

  const validationResult = await shortenPostRequestBodySchema
    .safeParseAsync(req.body);

  if(validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { url, code } = validationResult.data;

  const shortCode = code ?? nanoid(6);

  const user = await shorteningUrls(shortCode, url, req, res);
})



router.get('/:shortCode', async (req, res) => {
  const code = req.params.shortCode;

  const result = await getOriginalWebsite(code);

  if(!result) return res.status(404).json({ error: 'URL not found' });

  return res.redirect(result.targetURL);
})
export default router;