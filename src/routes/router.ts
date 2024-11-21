import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';
import { decodeJWT } from '../middleware/verifyJWT';
import { getProfiles, getWallet } from '../controllers/profileController';
import { getMCUsername } from '../controllers/proxyController';


export const router = express.Router();

router.get('/leaderboard/:skill', getLeaderboard);
router.get('/profile/wallet', decodeJWT, getWallet);
router.get('/profile/all', decodeJWT, getProfiles);
router.get('/mojang/:uuid', getMCUsername);