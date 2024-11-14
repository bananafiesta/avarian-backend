import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';
import { decodeJWT } from '../middleware/verifyJWT';
import { getWallet } from '../controllers/profileController';


export const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/profile/wallet', decodeJWT, getWallet);