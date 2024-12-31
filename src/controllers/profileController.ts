import { NextFunction, Request, Response } from "express";
import { economy_obj, getXconomy, authToPlayerProfiles } from "../services/profile";

export interface AuthenticatedRequest extends Request {
  user?: user_obj
}
export interface user_obj {
  sub?: string
}

export async function getWallet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const uuid: string = req.user.sub;
    const wallet: economy_obj[] = await getXconomy(uuid);
    res.status(200).json(wallet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error getting wallet' });
  }
}

export async function getProfiles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const uuid: string = req.user.sub;
    const profile = await authToPlayerProfiles(uuid);
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error loading profiles' });
  }
}