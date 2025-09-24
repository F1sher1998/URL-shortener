import express from 'express';
import {nanoid} from 'nanoid';
import {shortenPostRequestBodySchema} from '../validations/request.validation.js';
import { checkForUserId } from '../middleware/auth.middleware.js';
import { shorteningUrls } from '../services/url.service.js';

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

export default router;