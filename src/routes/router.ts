import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';

export const router = express.Router();

router.get('/leaderboard', getLeaderboard);