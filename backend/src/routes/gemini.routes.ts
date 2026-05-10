import { Router, Request, Response } from 'express';
import {
  geminiRequestTotal,
  geminiRequestDuration,
  geminiTokensUsed,
} from '../config/metrics';

const router = Router();

/**
 * POST /api/gemini/track
 * Called by the frontend after each Gemini API call to record usage metrics.
 * Body: { operation: string, durationMs: number, status: 'success'|'error', estimatedTokens?: number }
 */
router.post('/track', (req: Request, res: Response) => {
  const { operation = 'unknown', durationMs = 0, status = 'success', estimatedTokens = 0 } = req.body;

  geminiRequestTotal.inc({ operation, status });
  geminiRequestDuration.observe({ operation }, durationMs / 1000);

  if (estimatedTokens > 0) {
    geminiTokensUsed.inc({ operation }, estimatedTokens);
  }

  res.json({ ok: true });
});

export default router;
